import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return Response.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return Response.json({ error: 'Email already verified' }, { status: 400 });
    }

    if (!user.otp || !user.otpExpiry) {
      return Response.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return Response.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, user.otp);
    if (!isValid) {
      return Response.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });

    return Response.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
