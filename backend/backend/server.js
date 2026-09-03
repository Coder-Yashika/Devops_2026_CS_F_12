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
// LOGIN
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


    // Find student

    const student = await Student.findOne({

      email: email.toLowerCase(),

    });


    if (!student) {

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
        student.password
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
        id: student._id,
        role: student.role,
        email: student.email,
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

        id: student._id,

        fullName: student.fullName,

        email: student.email,

        role: student.role,

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