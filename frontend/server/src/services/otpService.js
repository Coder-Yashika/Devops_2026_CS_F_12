// Small, focused module: generate a 6-digit OTP and check it against what's
// stored on the User document. Keeping this separate from the controller
// means the "how" of OTP generation can change (e.g. longer codes, different
// expiry) without touching the registration/verification flow logic.

export function generateOtp() {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  return { code, expiresAt };
}

export function isOtpValid(user, submittedCode) {
  if (!user.otpCode || !user.otpExpiresAt) return false;
  if (user.otpCode !== submittedCode) return false;
  if (user.otpExpiresAt.getTime() < Date.now()) return false;
  return true;
}
