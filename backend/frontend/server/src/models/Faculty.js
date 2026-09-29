import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true, trim: true },
    facultyId: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    profilePhotoUrl: String,

    // These flags are OFF by default when a faculty member self-registers.
    // Only Admin can flip them on (Phase 3). A faculty member can be both
    // a mentor AND a coordinator at the same time.
    isMentor: { type: Boolean, default: false },
    isCoordinator: { type: Boolean, default: false },

    // At most 3 faculty can hold coordinatorSlot 1/2/3 at once - the Admin
    // controller enforces this uniqueness when assigning the flag, not the
    // schema (Mongoose doesn't do cross-document constraints natively).
    coordinatorSlot: { type: Number, enum: [1, 2, 3, null], default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Faculty', facultySchema);
