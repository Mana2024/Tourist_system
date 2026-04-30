import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    await connectDB();

    const user = await User.findById(payload.userId).select('-password');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    return Response.json({ user });
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    const body = await request.json();
    await connectDB();

    if (body.currentPassword && body.newPassword) {
      // Password change flow
      const userWithPw = await User.findById(payload.userId);
      if (!userWithPw) return Response.json({ error: 'User not found' }, { status: 404 });

      const bcrypt = await import('bcryptjs');
      const match = await bcrypt.default.compare(body.currentPassword, userWithPw.password);
      if (!match) return Response.json({ error: 'Current password is incorrect' }, { status: 400 });
      if (body.newPassword.length < 6) return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

      const hashed = await bcrypt.default.hash(body.newPassword, 12);
      await User.findByIdAndUpdate(payload.userId, { $set: { password: hashed } });
      return Response.json({ message: 'Password updated' });
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: { name: body.name, preferences: body.preferences } },
      { new: true, select: '-password' }
    );

    return Response.json({ user });
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
