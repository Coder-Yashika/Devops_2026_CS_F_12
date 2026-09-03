import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { generateOtp, isOtpValid } from '../services/otpService.js';
import { sendOtpEmail } from '../services/emailService.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

// A simple domain check so only real college emails can register as students.
// Move this to .env if the domain might change, but a hardcoded constant is
// fine to start - it's easy to find and update.
const COLLEGE_EMAIL_DOMAIN = '@yourcollege.edu.in';

function isCollegeEmail(email) {
  return email.toLowerCase().endsWith(COLLEGE_EMAIL_DOMAIN);
}

// ---------------------------------------------------------------------------
// POST /api/v1/auth/register/student
// Creates a User (role: student) + Student profile in one go, sends an OTP
// to the college email, and leaves the account unverified/unusable until
// the OTP is confirmed via /verify-otp.
// ---------------------------------------------------------------------------
export async function registerStudent(req, res) {
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

  if (!isCollegeEmail(email)) {
    return res.status(400).json({ message: 'Please register with your college email address' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { code, expiresAt } = generateOtp();

  // Create the User first (this is what OTP/login will key off of)...
  const user = await User.create({
    email,
    passwordHash,
    role: 'student',
    otpCode: code,
    otpExpiresAt: expiresAt,
  });

  // ...then the Student profile, linked back to it.
  // If this second step fails, we roll back the User so we don't leave an
  // orphaned, half-created account behind.
  try {
    await Student.create({
      userId: user._id,
      fullName,
      enrollmentNumber,
      personalEmail,
      mobileNumber,
      department,
      course,
      year,
      semester,
    });
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw err;
  }

  await sendOtpEmail(email, code);

  res.status(201).json({
    message: 'Registration successful. Check your college email for the verification code.',
    userId: user._id,
  });
}

// ---------------------------------------------------------------------------
// POST /api/v1/auth/register/faculty
// Same pattern as student registration, but with a facultyId instead of an
// enrollment number, and no OTP requirement stated in the spec beyond the
// college ID check - so we mark faculty as verified immediately. If your
// college wants OTP for faculty too, flip isEmailVerified to false here and
// send an OTP the same way registerStudent does.
// ---------------------------------------------------------------------------
export async function registerFaculty(req, res) {
  const {
    fullName,
    facultyId,
    email,
    department,
    designation,
    mobileNumber,
    password,
  } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
    role: 'faculty',
    isEmailVerified: true,
  });

  try {
    await Faculty.create({
      userId: user._id,
      fullName,
      facultyId,
      department,
      designation,
      mobileNumber,
    });
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw err;
  }

  res.status(201).json({
    message: 'Faculty registration successful. You can now log in.',
    userId: user._id,
  });
}

// ---------------------------------------------------------------------------
// POST /api/v1/auth/verify-otp
// ---------------------------------------------------------------------------
export async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Account not found' });
  if (user.isEmailVerified) return res.status(400).json({ message: 'Account already verified' });

  if (!isOtpValid(user, otp)) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  user.isEmailVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.json({ message: 'Email verified. You can now log in.' });
}

// ---------------------------------------------------------------------------
// POST /api/v1/auth/login
// ---------------------------------------------------------------------------
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    // Deliberately vague - don't reveal whether it was the email or password
    // that was wrong, that's a small info leak that helps attackers.
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'This account has been disabled. Contact admin.' });
  }

  if (!user.isEmailVerified) {
    return res.status(403).json({ message: 'Please verify your email before logging in' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // httpOnly so client-side JS can never read it - mitigates XSS token theft.
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Login successful',
    accessToken,
    user: { id: user._id, email: user.email, role: user.role },
  });
}
