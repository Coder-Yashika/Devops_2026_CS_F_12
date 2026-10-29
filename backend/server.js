const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// =============================
// DATABASE CONNECTION
// =============================

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/FSD-DevOps")
  .then(async () => {
    console.log("MongoDB connected successfully");
    await seedDefaultMentors();
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

// =============================
// FACULTY MODEL
// =============================

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

// =============================
// NOTIFICATION MODEL
// =============================

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    recipientRole: {
      type: String,
      enum: ["student", "faculty", "admin", "all"],
      default: "student",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "action_required"],
      default: "info",
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ODSApplication",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

// Helper to push notification
const sendNotification = async ({
  recipientEmail,
  recipientRole,
  title,
  message,
  type = "info",
  applicationId = null,
}) => {
  try {
    if (!recipientEmail) return;
    await Notification.create({
      recipientEmail: recipientEmail.toLowerCase().trim(),
      recipientRole,
      title,
      message,
      type,
      applicationId,
    });
  } catch (err) {
    console.error("Notification Creation Error:", err.message);
  }
};

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
    mentorName: {
      type: String,
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
    mentorRemarks: {
      type: String,
      default: "",
    },
    coordinatorStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // Inbuilt Event Report & Proof
    eventReport: {
      executiveSummary: { type: String, default: "" },
      keyLearnings: { type: String, default: "" },
      projectOutcome: { type: String, default: "" },
      participationRole: { type: String, default: "Individual Participant" },
      certificateUrl: { type: String, default: "" },
      photosUrl: { type: String, default: "" },
      additionalNotes: { type: String, default: "" },
      submittedAt: { type: Date },
      status: {
        type: String,
        enum: ["NOT_SUBMITTED", "SUBMITTED", "VERIFIED", "CHANGES_REQUESTED"],
        default: "NOT_SUBMITTED",
      },
      facultyRemarks: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const ODSApplication = mongoose.model("ODSApplication", odsApplicationSchema);

// =============================
// SEED DEFAULT MENTORS
// =============================

async function seedDefaultMentors() {
  try {
    const defaultMentors = [
      {
        fullName: "Dr. Manish Bhardwaj",
        facultyId: "FAC_MANISH",
        email: "manish.bhardwaj@college.edu",
        department: "Computer Science & Engineering",
        designation: "Associate Professor & Head of Mentorship",
        mobileNumber: "9876543210",
        role: "faculty",
        password: await bcrypt.hash("Password123!", 10),
      },
      {
        fullName: "Prof. Sumit Kumar",
        facultyId: "FAC_SUMIT",
        email: "sumit.kumar@college.edu",
        department: "Computer Science & Engineering",
        designation: "Assistant Professor & Innovation Lead",
        mobileNumber: "9876543211",
        role: "faculty",
        password: await bcrypt.hash("Password123!", 10),
      },
    ];

    for (const mentor of defaultMentors) {
      const exists = await Faculty.findOne({ facultyId: mentor.facultyId });
      if (!exists) {
        await Faculty.create(mentor);
        console.log(`Auto-seeded mentor: ${mentor.fullName} (${mentor.facultyId})`);
      }
    }
  } catch (err) {
    console.error("Mentor seeding error:", err.message);
  }
}

// =============================
// AUTHENTICATION MIDDLEWARES
// =============================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ods_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

const authenticateStudent = (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access required.",
      });
    }
    next();
  });
};

const authenticateFaculty = async (req, res, next) => {
  authenticateUser(req, res, async () => {
    if (req.user.role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Faculty access required.",
      });
    }

    try {
      const faculty = await Faculty.findById(req.user.id);
      if (!faculty) {
        return res.status(401).json({
          success: false,
          message: "Faculty account not found.",
        });
      }
      req.faculty = faculty;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Faculty verification error.",
      });
    }
  });
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

    const hashedPassword = await bcrypt.hash(password, 10);

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

    // Send welcome notification
    await sendNotification({
      recipientEmail: student.email,
      recipientRole: "student",
      title: "Welcome to College ODS! 🎓",
      message: `Hello ${student.fullName}, your student account has been created successfully. You can now apply for On-Duty Sanctions.`,
      type: "success",
    });

    return res.status(201).json({
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
    return res.status(500).json({
      success: false,
      message: "Server error during student registration.",
    });
  }
});

// =============================
// FACULTY REGISTRATION
// =============================

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

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await Faculty.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This faculty email is already registered.",
      });
    }

    const existingFacultyId = await Faculty.findOne({ facultyId: facultyId.trim() });
    if (existingFacultyId) {
      return res.status(400).json({
        success: false,
        message: "This Faculty ID is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
      fullName: fullName.trim(),
      facultyId: facultyId.trim(),
      email: normalizedEmail,
      department: department.trim(),
      designation: designation.trim(),
      mobileNumber: mobileNumber.trim(),
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
// LOGIN - ALL ROLES
// =============================

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check Hardcoded Admin
    if (normalizedEmail === "admin@college.edu" && password === "Admin123!") {
      const token = jwt.sign(
        {
          id: "admin_super_user",
          role: "admin",
          email: "admin@college.edu",
          fullName: "System Administrator",
        },
        process.env.JWT_SECRET || "ods_secret",
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful.",
        accessToken: token,
        user: {
          id: "admin_super_user",
          fullName: "System Administrator",
          email: "admin@college.edu",
          role: "admin",
        },
      });
    }

    // 2. Check Student
    let user = await Student.findOne({ email: normalizedEmail });
    let role = "student";

    // 3. If not student, check Faculty
    if (!user) {
      user = await Faculty.findOne({ email: normalizedEmail });
      role = "faculty";
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: role,
        email: user.email,
        facultyId: user.facultyId,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET || "ods_secret",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken: token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: role,
        mobileNumber: user.mobileNumber,
        department: user.department,
        ...(role === "student" && {
          enrollmentNumber: user.enrollmentNumber,
          course: user.course,
          year: user.year,
          semester: user.semester,
        }),
        ...(role === "faculty" && {
          facultyId: user.facultyId,
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
// GET ALL FACULTY / MENTORS
// =============================

app.get("/api/v1/faculty/mentors", async (req, res) => {
  try {
    const facultyList = await Faculty.find(
      {},
      "fullName facultyId department designation email"
    ).sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      mentors: facultyList,
    });
  } catch (error) {
    console.error("Fetch mentors error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentors.",
    });
  }
});

// =============================
// NOTIFICATION ROUTES
// =============================

app.get("/api/v1/notifications", authenticateUser, async (req, res) => {
  try {
    const email = req.user.email?.toLowerCase();
    const notifications = await Notification.find({
      $or: [
        { recipientEmail: email },
        { recipientRole: req.user.role },
        { recipientRole: "all" },
      ],
    }).sort({ createdAt: -1 }).limit(30);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
});

app.put("/api/v1/notifications/:id/read", authenticateUser, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return res.status(200).json({ success: true, message: "Marked as read." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update notification." });
  }
});

app.put("/api/v1/notifications/mark-all-read", authenticateUser, async (req, res) => {
  try {
    const email = req.user.email?.toLowerCase();
    await Notification.updateMany(
      {
        $or: [
          { recipientEmail: email },
          { recipientRole: req.user.role },
        ],
        read: false,
      },
      { read: true }
    );
    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to mark all as read." });
  }
});

// =============================
// CREATE ODS APPLICATION
// =============================

app.post("/api/v1/ods", authenticateStudent, async (req, res) => {
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

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found." });
    }

    // Lookup chosen mentor faculty
    const mentorFaculty = await Faculty.findOne({ facultyId: mentor });
    const mentorName = mentorFaculty ? mentorFaculty.fullName : mentor;

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
      mentorName,
      status: "MENTOR_PENDING",
      mentorStatus: "PENDING",
      coordinatorStatus: "PENDING",
      eventReport: {
        executiveSummary: `Student participated in "${eventName}" organized by ${organizer} located at ${location}.`,
        keyLearnings: "Practical exposure, problem solving, teamwork, and domain insights.",
        projectOutcome: "Completed scheduled event activities and received participation recognition.",
        participationRole: "Individual Participant",
        certificateUrl: "",
        photosUrl: "",
        additionalNotes: "",
        status: "NOT_SUBMITTED",
      },
    });

    // 1. Notification for Student
    await sendNotification({
      recipientEmail: student.email,
      recipientRole: "student",
      title: "ODS Application Submitted 🚀",
      message: `Your ODS application for "${eventName}" has been forwarded to mentor ${mentorName}. Please prepare your Event Report in the Proof section.`,
      type: "info",
      applicationId: application._id,
    });

    // 2. Notification for Mentor
    if (mentorFaculty) {
      await sendNotification({
        recipientEmail: mentorFaculty.email,
        recipientRole: "faculty",
        title: "New ODS Request Pending Review ⏳",
        message: `Student ${student.fullName} (${student.enrollmentNumber} - ${student.department}) submitted an ODS application for "${eventName}". Action required.`,
        type: "action_required",
        applicationId: application._id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "ODS application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("ODS Application Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit ODS application.",
    });
  }
});

// =============================
// GET MY ODS APPLICATIONS
// =============================

app.get("/api/v1/ods/my-applications", authenticateStudent, async (req, res) => {
  try {
    const applications = await ODSApplication.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications.",
    });
  }
});

// =============================
// SUBMIT / UPDATE EVENT REPORT (PROOF)
// =============================

app.post("/api/v1/ods/:id/report", authenticateStudent, async (req, res) => {
  try {
    const {
      executiveSummary,
      keyLearnings,
      projectOutcome,
      participationRole,
      certificateUrl,
      photosUrl,
      additionalNotes,
    } = req.body;

    const application = await ODSApplication.findOne({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "ODS application not found.",
      });
    }

    const student = await Student.findById(req.user.id);

    application.eventReport = {
      executiveSummary: executiveSummary || application.eventReport?.executiveSummary || "",
      keyLearnings: keyLearnings || application.eventReport?.keyLearnings || "",
      projectOutcome: projectOutcome || application.eventReport?.projectOutcome || "",
      participationRole: participationRole || application.eventReport?.participationRole || "Participant",
      certificateUrl: certificateUrl || application.eventReport?.certificateUrl || "",
      photosUrl: photosUrl || application.eventReport?.photosUrl || "",
      additionalNotes: additionalNotes || application.eventReport?.additionalNotes || "",
      submittedAt: new Date(),
      status: "SUBMITTED",
      facultyRemarks: "",
    };

    application.status = "PROOF_SUBMITTED";
    await application.save();

    // Notify Student
    await sendNotification({
      recipientEmail: student.email,
      recipientRole: "student",
      title: "Event Report & Proof Submitted ✅",
      message: `Your formatted Event Report for "${application.eventName}" has been submitted to your mentor for verification.`,
      type: "success",
      applicationId: application._id,
    });

    // Notify Mentor
    const mentorFaculty = await Faculty.findOne({ facultyId: application.mentor });
    if (mentorFaculty) {
      await sendNotification({
        recipientEmail: mentorFaculty.email,
        recipientRole: "faculty",
        title: "Proof / Report Submitted for Review 📄",
        message: `Student ${student.fullName} has submitted their official Event Report for "${application.eventName}". Please review and verify.`,
        type: "action_required",
        applicationId: application._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event report submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Submit report error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit event report.",
    });
  }
});

// Helper to match mentor across ID, name, email or alias
const isMentorMatch = (application, faculty) => {
  if (!application || !faculty) return false;
  const facultyId = (faculty.facultyId || "").trim();
  const email = (faculty.email || "").trim().toLowerCase();
  const rawName = (faculty.fullName || "").replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s*/i, "").trim().toLowerCase();

  const appMentor = (application.mentor || "").trim();
  const appMentorName = (application.mentorName || "").replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s*/i, "").trim().toLowerCase();

  // 1. Direct facultyId match
  if (appMentor && facultyId && appMentor.toLowerCase() === facultyId.toLowerCase()) return true;

  // 2. Direct name match
  if (appMentorName && rawName && (appMentorName.includes(rawName) || rawName.includes(appMentorName))) return true;

  // 3. Email match
  if (appMentor.toLowerCase() === email) return true;

  // 4. Special aliases for Manish / Sumit
  if (rawName.includes("manish") && (appMentor.includes("MANISH") || appMentorName.includes("manish"))) return true;
  if (rawName.includes("sumit") && (appMentor.includes("SUMIT") || appMentorName.includes("sumit"))) return true;

  return false;
};

// =============================
// FACULTY DASHBOARD
// =============================

app.get("/api/v1/faculty/dashboard", authenticateFaculty, async (req, res) => {
  try {
    const rawName = req.faculty.fullName.replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s*/i, "").trim();
    const nameRegex = new RegExp(rawName, "i");

    const query = {
      $or: [
        { mentor: req.faculty.facultyId },
        { mentor: req.faculty.email },
        { mentorName: nameRegex },
        ...(rawName.toLowerCase().includes("manish") ? [{ mentor: "FAC_MANISH" }, { mentorName: /manish/i }] : []),
        ...(rawName.toLowerCase().includes("sumit") ? [{ mentor: "FAC_SUMIT" }, { mentorName: /sumit/i }] : []),
      ],
    };

    const applications = await ODSApplication.find(query)
      .populate("student", "fullName enrollmentNumber email department course year semester mobileNumber")
      .sort({ createdAt: -1 });

    const pending = applications.filter((app) => app.mentorStatus === "PENDING");
    const approved = applications.filter((app) => app.mentorStatus === "APPROVED");
    const rejected = applications.filter((app) => app.mentorStatus === "REJECTED");
    const proofPending = applications.filter(
      (app) => app.status === "PROOF_PENDING" || app.status === "PROOF_SUBMITTED"
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
    console.error("Faculty dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load faculty dashboard.",
    });
  }
});

// =============================
// FACULTY APPROVE / REJECT ODS
// =============================

app.put("/api/v1/faculty/ods/:id/decision", authenticateFaculty, async (req, res) => {
  try {
    const { decision, remarks } = req.body;

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision. Must be APPROVED or REJECTED.",
      });
    }

    const application = await ODSApplication.findById(req.params.id).populate("student");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "ODS application not found.",
      });
    }

    if (!isMentorMatch(application, req.faculty) && req.faculty.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not the assigned mentor for this application.",
      });
    }

    if (decision === "APPROVED") {
      application.mentorStatus = "APPROVED";
      application.status = "PROOF_PENDING"; // Ready for event proof
      application.mentorRemarks = remarks || "Approved by Mentor";
    }

    if (decision === "REJECTED") {
      application.mentorStatus = "REJECTED";
      application.status = "REJECTED";
      application.mentorRemarks = remarks || "Rejected by Mentor";
    }

    await application.save();

    // Notify Student
    if (application.student?.email) {
      if (decision === "APPROVED") {
        await sendNotification({
          recipientEmail: application.student.email,
          recipientRole: "student",
          title: "ODS Approved by Mentor! 🎉",
          message: `Great news! Dr./Prof. ${req.faculty.fullName} approved your ODS for "${application.eventName}". Please visit the Proof section to fill your Event Report.`,
          type: "success",
          applicationId: application._id,
        });
      } else {
        await sendNotification({
          recipientEmail: application.student.email,
          recipientRole: "student",
          title: "ODS Request Status: Not Approved",
          message: `Your ODS application for "${application.eventName}" was not approved. Remarks: ${remarks || "Criteria not met."}`,
          type: "warning",
          applicationId: application._id,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: decision === "APPROVED" ? "ODS approved successfully." : "ODS rejected.",
      application,
    });
  } catch (error) {
    console.error("ODS decision error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update application.",
    });
  }
});

// =============================
// FACULTY VERIFY PROOF / REPORT
// =============================

app.put("/api/v1/faculty/ods/:id/verify-proof", authenticateFaculty, async (req, res) => {
  try {
    const { decision, facultyRemarks } = req.body; // 'VERIFIED' or 'CHANGES_REQUESTED'

    const application = await ODSApplication.findById(req.params.id).populate("student");
    if (!application) {
      return res.status(404).json({ success: false, message: "ODS application not found." });
    }

    if (!isMentorMatch(application, req.faculty) && req.faculty.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (decision === "VERIFIED") {
      application.eventReport.status = "VERIFIED";
      application.eventReport.facultyRemarks = facultyRemarks || "Verified and confirmed.";
      application.status = "COMPLETED";

      await sendNotification({
        recipientEmail: application.student?.email,
        recipientRole: "student",
        title: "Proof & Report Verified! 🏆",
        message: `Your Event Report for "${application.eventName}" has been officially VERIFIED by ${req.faculty.fullName}. ODS is COMPLETED. Attendance credit granted!`,
        type: "success",
        applicationId: application._id,
      });
    } else {
      application.eventReport.status = "CHANGES_REQUESTED";
      application.eventReport.facultyRemarks = facultyRemarks || "Please update proof details.";
      application.status = "PROOF_PENDING";

      await sendNotification({
        recipientEmail: application.student?.email,
        recipientRole: "student",
        title: "Proof Revision Required ⚠️",
        message: `Your mentor requested updates to your Event Report for "${application.eventName}": ${facultyRemarks}`,
        type: "warning",
        applicationId: application._id,
      });
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: decision === "VERIFIED" ? "Report verified successfully." : "Revision requested.",
      application,
    });
  } catch (error) {
    console.error("Proof verification error:", error);
    return res.status(500).json({ success: false, message: "Failed to process proof verification." });
  }
});

// =============================
// ADMIN DASHBOARD & APPLICATIONS
// =============================

app.get("/api/v1/admin/dashboard", authenticateUser, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalODS = await ODSApplication.countDocuments();
    const pendingODS = await ODSApplication.countDocuments({ status: "MENTOR_PENDING" });
    const approvedODS = await ODSApplication.countDocuments({ status: { $in: ["APPROVED", "PROOF_PENDING"] } });
    const completedODS = await ODSApplication.countDocuments({ status: "COMPLETED" });
    const rejectedODS = await ODSApplication.countDocuments({ status: "REJECTED" });

    const recentApplications = await ODSApplication.find()
      .populate("student", "fullName enrollmentNumber email department course")
      .sort({ createdAt: -1 })
      .limit(50);

    const students = await Student.find({}, "fullName enrollmentNumber email department course year semester").sort({ fullName: 1 });
    const faculties = await Faculty.find({}, "fullName facultyId email department designation").sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalODS,
        pendingODS,
        approvedODS,
        completedODS,
        rejectedODS,
      },
      applications: recentApplications,
      students,
      faculties,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ success: false, message: "Failed to load admin dashboard." });
  }
});

// =============================
// USER PROFILE ENDPOINTS
// =============================

app.get("/api/v1/users/profile", authenticateUser, async (req, res) => {
  try {
    let profile = null;
    let stats = {};

    if (req.user.role === "student") {
      profile = await Student.findById(req.user.id).select("-password");
      const myApps = await ODSApplication.find({ student: req.user.id });
      stats = {
        totalApplied: myApps.length,
        approved: myApps.filter((a) => a.status === "APPROVED" || a.status === "PROOF_PENDING" || a.status === "COMPLETED").length,
        completed: myApps.filter((a) => a.status === "COMPLETED").length,
        pending: myApps.filter((a) => a.status === "MENTOR_PENDING").length,
      };
    } else if (req.user.role === "faculty") {
      profile = await Faculty.findById(req.user.id).select("-password");
      if (profile) {
        const mentoredApps = await ODSApplication.find({ mentor: profile.facultyId });
        stats = {
          totalMentored: mentoredApps.length,
          approved: mentoredApps.filter((a) => a.mentorStatus === "APPROVED").length,
          pending: mentoredApps.filter((a) => a.mentorStatus === "PENDING").length,
          verifiedProofs: mentoredApps.filter((a) => a.eventReport?.status === "VERIFIED").length,
        };
      }
    } else {
      profile = {
        fullName: "System Administrator",
        email: "admin@college.edu",
        role: "admin",
        department: "Information Technology",
      };
      stats = {
        totalODS: await ODSApplication.countDocuments(),
        totalUsers: (await Student.countDocuments()) + (await Faculty.countDocuments()),
      };
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    return res.status(200).json({
      success: true,
      profile,
      stats,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
});

app.put("/api/v1/users/profile", authenticateUser, async (req, res) => {
  try {
    const { mobileNumber, personalEmail, designation, department } = req.body;

    if (req.user.role === "student") {
      const student = await Student.findById(req.user.id);
      if (!student) return res.status(404).json({ success: false, message: "User not found." });
      if (mobileNumber) student.mobileNumber = mobileNumber.trim();
      if (personalEmail) student.personalEmail = personalEmail.trim();
      await student.save();
      return res.status(200).json({ success: true, message: "Profile updated successfully.", profile: student });
    } else if (req.user.role === "faculty") {
      const faculty = await Faculty.findById(req.user.id);
      if (!faculty) return res.status(404).json({ success: false, message: "User not found." });
      if (mobileNumber) faculty.mobileNumber = mobileNumber.trim();
      if (designation) faculty.designation = designation.trim();
      if (department) faculty.department = department.trim();
      await faculty.save();
      return res.status(200).json({ success: true, message: "Profile updated successfully.", profile: faculty });
    }

    return res.status(200).json({ success: true, message: "Admin profile updated." });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile." });
  }
});

// =============================
// SERVER INITIALIZATION
// =============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
