import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(to: string, name: string, otp: string) {
  await transporter.sendMail({
    from: `"Meghalaya Tourism" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP for Meghalaya Tourism',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;">🏔️</span>
          <h2 style="color:#064e3b;margin:8px 0 0;">Meghalaya Tourism</h2>
        </div>
        <p style="color:#374151;font-size:16px;">Hi <strong>${name}</strong>,</p>
        <p style="color:#374151;font-size:15px;">Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f0fdf4;border:2px dashed #10b981;border-radius:10px;text-align:center;padding:24px;margin:24px 0;">
          <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#065f46;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;">If you did not create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
}
