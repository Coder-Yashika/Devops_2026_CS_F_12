import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one student profile per user account
    },
    fullName: { type: String, required: true, trim: true },
    enrollmentNumber: { type: String, required: true, unique: true, trim: true },
    personalEmail: { type: String, trim: true, lowercase: true },
    mobileNumber: { type: String, required: true },
    department: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    profilePhotoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
