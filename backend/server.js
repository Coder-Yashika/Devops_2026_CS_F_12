const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// =============================
// DATABASE CONNECTION
// =============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });


// =============================
// STUDENT MODEL
// =============================

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    personalEmail: {
      type: String,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

const facultySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    facultyId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "faculty",
    },
  },
  {
    timestamps: true,
  }
);

const Faculty = mongoose.model("Faculty", facultySchema);

app.post("/api/v1/auth/register/faculty", async (req, res) => {
  try {
    const {
      fullName,
      facultyId,
      email,
      department,
      designation,
      mobileNumber,
      password,
    } = req.body;

    if (
      !fullName ||
      !facultyId ||
      !email ||
      !department ||
      !designation ||
      !mobileNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existingEmail = await Faculty.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This faculty email is already registered.",
      });
    }

    const existingFacultyId = await Faculty.findOne({
      facultyId,
    });

    if (existingFacultyId) {
      return res.status(400).json({
        success: false,
        message: "This Faculty ID is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
      fullName,
      facultyId,
      email: email.toLowerCase(),
      department,
      designation,
      mobileNumber,
      password: hashedPassword,
      role: "faculty",
    });

    return res.status(201).json({
      success: true,
      message: "Faculty registration successful.",
      user: {
        id: faculty._id,
        fullName: faculty.fullName,
        email: faculty.email,
        role: faculty.role,
      },
    });

  } catch (error) {
    console.error("Faculty Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Faculty registration failed.",
    });
  }
});

// =============================
// ODS APPLICATION MODEL
// =============================

const odsApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    eventName: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    organizer: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    eventLink: {
      type: String,
    },

    mentor: {
      type: String,
      required: true,
    },

    registrationProof: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "MENTOR_PENDING",
        "MENTOR_APPROVED",
        "COORDINATOR_PENDING",
        "APPROVED",
        "REJECTED",
        "PROOF_PENDING",
        "PROOF_SUBMITTED",
        "COMPLETED",
      ],
      default: "MENTOR_PENDING",
    },

    mentorStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    coordinatorStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const ODSApplication = mongoose.model(
  "ODSApplication",
  odsApplicationSchema
);
// =============================
// AUTHENTICATION MIDDLEWARE
// =============================

const authenticateStudent = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ods_secret"
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// =============================
// TEST ROUTE
// =============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "College ODS Backend is running!",
  });
});


// =============================
// STUDENT REGISTRATION
// =============================
app.post("/api/v1/auth/register/student", async (req, res) => {
  try {
    const {
      fullName,
      enrollmentNumber,
      email,
      personalEmail,
      mobileNumber,
      department,
      course,
      year,
      semester,
      password,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !enrollmentNumber ||
      !email ||
      !mobileNumber ||
      !department ||
      !course ||
      !year ||
      !semester ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing student
    const existingStudent = await Student.findOne({
      $or: [
        { email: normalizedEmail },
        { enrollmentNumber: enrollmentNumber.trim() },
      ],
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email or enrollment number already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await Student.create({
      fullName: fullName.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      email: normalizedEmail,
      personalEmail: personalEmail?.trim(),
      mobileNumber: mobileNumber.trim(),
      department: department.trim(),
      course: course.trim(),
      year: Number(year),
      semester: Number(semester),
      password: hashedPassword,
      role: "student",
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
      },
    });
  } catch (error) {
    console.error("Student registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during student registration.",
    });
  }
});
// =============================
// LOGIN - STUDENT + FACULTY
// =============================

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // =============================
    // CHECK STUDENT
    // =============================

    let user = await Student.findOne({
      email: normalizedEmail,
    });

    let role = "student";

    // =============================
    // IF NOT STUDENT, CHECK FACULTY
    // =============================

    if (!user) {
      user = await Faculty.findOne({
        email: normalizedEmail,
      });

      role = "faculty";
    }

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // =============================
    // CHECK PASSWORD
    // =============================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // =============================
    // CREATE JWT
    // =============================

    const token = jwt.sign(
      {
        id: user._id,
        role: role,
        email: user.email,
      },
      process.env.JWT_SECRET || "ods_secret",
      {
        expiresIn: "1d",
      }
    );

    // =============================
    // USER RESPONSE
    // =============================

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      accessToken: token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: role,

        ...(role === "student" && {
          enrollmentNumber: user.enrollmentNumber,
          department: user.department,
          course: user.course,
          year: user.year,
          semester: user.semester,
        }),

        ...(role === "faculty" && {
          facultyId: user.facultyId,
          department: user.department,
          designation: user.designation,
        }),
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});



 
// =============================
// FACULTY AUTHENTICATION
// =============================

const authenticateFaculty = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ods_secret"
    );

    if (decoded.role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Faculty access required.",
      });
    }

    const faculty = await Faculty.findById(decoded.id);

    if (!faculty) {
      return res.status(401).json({
        success: false,
        message: "Faculty account not found.",
      });
    }

    req.user = decoded;
    req.faculty = faculty;

    next();

  } catch (error) {
    console.error("Faculty authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};


  

// =============================
// CREATE ODS APPLICATION
// =============================

app.post(
  "/api/v1/ods",
  authenticateStudent,
  async (req, res) => {
    try {
      const {
        eventName,
        eventType,
        organizer,
        description,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        purpose,
        eventLink,
        mentor,
      } = req.body;

      // Validation

      if (
        !eventName ||
        !eventType ||
        !organizer ||
        !description ||
        !location ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime ||
        !purpose ||
        !mentor
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }

      // Create application

      const application = await ODSApplication.create({
        student: req.user.id,

        eventName,
        eventType,
        organizer,
        description,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        purpose,
        eventLink,
        mentor,

        status: "MENTOR_PENDING",
        mentorStatus: "PENDING",
        coordinatorStatus: "PENDING",
      });

      console.log(
        "ODS Application Created:",
        application._id
      );

      return res.status(201).json({
        success: true,
        message: "ODS application submitted successfully.",
        application,
      });

    } catch (error) {
      console.error(
        "ODS Application Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to submit ODS application.",
      });
    }
  }
);
// =============================
// GET MY ODS APPLICATIONS
// =============================

app.get(
  "/api/v1/ods/my-applications",
  authenticateStudent,
  async (req, res) => {
    try {
      const applications = await ODSApplication.find({
        student: req.user.id,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        applications,
      });

    } catch (error) {
      console.error(
        "Fetch Applications Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications.",
      });
    }
  }
);
// =============================
// FACULTY DASHBOARD
// =============================

app.get(
  "/api/v1/faculty/dashboard",
  authenticateFaculty,
  async (req, res) => {
    try {
      const facultyId = req.faculty.facultyId;

      const applications = await ODSApplication.find({
        mentor: facultyId,
      })
        .populate(
          "student",
          "fullName enrollmentNumber email department course"
        )
        .sort({ createdAt: -1 });

      const pending = applications.filter(
        (app) => app.mentorStatus === "PENDING"
      );

      const approved = applications.filter(
        (app) => app.mentorStatus === "APPROVED"
      );

      const rejected = applications.filter(
        (app) => app.mentorStatus === "REJECTED"
      );

      const proofPending = applications.filter(
        (app) => app.status === "PROOF_PENDING"
      );

      return res.status(200).json({
        success: true,

        stats: {
          pending: pending.length,
          approved: approved.length,
          rejected: rejected.length,
          proofPending: proofPending.length,
        },

        applications,
      });

    } catch (error) {
      console.error(
        "Faculty dashboard error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load faculty dashboard.",
      });
    }
  }
);
// =============================
// FACULTY APPROVE / REJECT ODS
// =============================

app.put(
  "/api/v1/faculty/ods/:id/decision",
  authenticateFaculty,
  async (req, res) => {
    try {
      const { decision } = req.body;

      if (!["APPROVED", "REJECTED"].includes(decision)) {
        return res.status(400).json({
          success: false,
          message: "Invalid decision.",
        });
      }

      const application = await ODSApplication.findById(
        req.params.id
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "ODS application not found.",
        });
      }

      // Make sure this application belongs to this faculty

      if (
        application.mentor !==
        req.faculty.facultyId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not the assigned mentor for this application.",
        });
      }

      if (decision === "APPROVED") {
        application.mentorStatus = "APPROVED";

        application.status =
          "COORDINATOR_PENDING";
      }

      if (decision === "REJECTED") {
        application.mentorStatus = "REJECTED";

        application.status = "REJECTED";
      }

      await application.save();

      return res.status(200).json({
        success: true,
        message:
          decision === "APPROVED"
            ? "ODS application approved."
            : "ODS application rejected.",
        application,
      });

    } catch (error) {
      console.error(
        "ODS decision error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update application.",
      });
    }
  }
);

// =============================
// SERVER
// =============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
