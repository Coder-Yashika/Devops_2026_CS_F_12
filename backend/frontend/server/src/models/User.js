import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// This is the "auth identity" for everyone in the system - students, faculty,
// and admin all have one of these. The role-specific details (enrollment
// number, department, mentor/coordinator flags, etc.) live in separate
// Student / Faculty documents that reference this one by userId.
//
// Why split it this way instead of one giant User schema with optional
// fields for every role? Two reasons:
//   1. It keeps each schema meaningful - a Student document only ever has
//      student fields, no dangling faculty-only fields set to null.
//   2. Faculty-specific queries (e.g. "all mentors in CSE department") stay
//      fast and simple against the Faculty collection alone.
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: String,
    otpExpiresAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Instance method: compare a plaintext password against the stored hash.
// Kept on the model so controllers never touch bcrypt directly - if we ever
// change the hashing strategy, this is the only place that needs to change.
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Never send the password hash or OTP fields back in API responses, even by
// accident. This runs automatically whenever a User doc is JSON-serialized.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.otpCode;
    delete ret.otpExpiresAt;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
