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


// =============================
// FACULTY MODEL
// =============================

const facultySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    facultyId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "faculty" },
  },
  {
    timestamps: true,
  }
);

const Faculty = mongoose.model("Faculty", facultySchema);


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

    console.log("Student registration request received");

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


    // Check existing email

    const existingEmail = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {

      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });

    }


    // Check enrollment

    const existingEnrollment = await Student.findOne({
      enrollmentNumber,
    });

    if (existingEnrollment) {

      return res.status(400).json({
        success: false,
        message: "This enrollment number is already registered.",
      });

    }


    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // Create student

    const student = await Student.create({

      fullName,

      enrollmentNumber,

      email: email.toLowerCase(),

      personalEmail,

      mobileNumber,

      department,

      course,

      year,

      semester,

      password: hashedPassword,

      role: "student",

    });


    console.log(
      "Student created:",
      student.email
    );


    return res.status(201).json({

      success: true,

      message:
        "Student registration successful.",

      user: {

        id: student._id,

        fullName: student.fullName,

        email: student.email,

        role: student.role,

      },

    });

  }

  catch (error) {

    console.error(
      "Registration Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Registration failed.",

    });

  }

});


// =============================
// FACULTY REGISTRATION
// =============================

app.post("/api/v1/auth/register/faculty", async (req, res) => {

  try {

    console.log("Faculty registration request received");

    const {
      fullName,
      facultyId,
      email,
      department,
      designation,
      mobileNumber,
      password,
    } = req.body;


    // Validation

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


    // Check existing email

    const existingEmail = await Faculty.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {

      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });

    }


    // Check faculty ID

    const existingFacultyId = await Faculty.findOne({
      facultyId,
    });

    if (existingFacultyId) {

      return res.status(400).json({
        success: false,
        message: "This faculty ID is already registered.",
      });

    }


    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // Create faculty

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


    console.log(
      "Faculty created:",
      faculty.email
    );


    return res.status(201).json({

      success: true,

      message:
        "Faculty registration successful.",

      user: {

        id: faculty._id,

        fullName: faculty.fullName,

        email: faculty.email,

        role: faculty.role,

      },

    });

  }

  catch (error) {

    console.error(
      "Faculty Registration Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Registration failed.",

    });

  }

});


// =============================
// LOGIN (Student + Faculty)
// =============================

app.post("/api/v1/auth/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // Validation

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required.",

      });

    }


    // Find account: check Student first, then Faculty

    let account = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!account) {

      account = await Faculty.findOne({
        email: email.toLowerCase(),
      });

    }


    if (!account) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password.",

      });

    }


    // Check password

    const passwordMatch =
      await bcrypt.compare(
        password,
        account.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password.",

      });

    }


    // Generate JWT

    const token = jwt.sign(

      {
        id: account._id,
        role: account.role,
        email: account.email,
      },

      process.env.JWT_SECRET || "ods_secret",

      {
        expiresIn: "1d",
      }

    );


    // Response

    return res.status(200).json({

      success: true,

      message: "Login successful.",

      accessToken: token,

      user: {

        id: account._id,

        fullName: account.fullName,

        email: account.email,

        role: account.role,

      },

    });

  }

  catch (error) {

    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Login failed.",

    });

  }

});


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