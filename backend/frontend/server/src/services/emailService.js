import nodemailer from 'nodemailer';

// A single reusable transporter, built once from env vars.
// In dev, you can point EMAIL_HOST/PORT at a free service like Mailtrap
// so you can see the emails without actually sending them anywhere real.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for port 465, false for 587/25
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function sendOtpEmail(to, otp) {
  await sendEmail({
    to,
    subject: 'Verify your College ODS System account',
    html: `
      <p>Your verification code is:</p>
      <h2 style="letter-spacing:4px">${otp}</h2>
      <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    `,
  });
}
