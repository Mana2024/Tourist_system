import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { sendOTPEmail } from '@/lib/email';
import User from '@/models/User';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, preferences } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      // Allow re-registration if the previous attempt was never verified
      if (existing.isVerified) {
        return Response.json({ error: 'Email already registered' }, { status: 409 });
      }
      // Update the unverified record with fresh data and a new OTP
      const hashed = await bcrypt.hash(password, 12);
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      const hashedOtp = await bcrypt.hash(otp, 8);

      await User.updateOne(
        { email },
        { name, password: hashed, otp: hashedOtp, otpExpiry, preferences: preferences ?? existing.preferences }
      );

      await sendOTPEmail(email, name, otp);
      return Response.json({ message: 'OTP sent', email });
    }

    const hashed = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOtp = await bcrypt.hash(otp, 8);

    await User.create({
      name,
      email,
      password: hashed,
      role: 'user',
      isVerified: false,
      otp: hashedOtp,
      otpExpiry,
      preferences: preferences ?? { budget: 'medium', interests: ['nature'], travelDuration: 3 },
    });

    await sendOTPEmail(email, name, otp);
    return Response.json({ message: 'OTP sent', email });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
