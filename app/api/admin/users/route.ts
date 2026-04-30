import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    return Response.json({ users });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === 'Unauthorized' || err.message === 'Forbidden')) {
      return Response.json({ error: err.message }, { status: 403 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
    const { id, password } = await request.json();

    if (!id || !password || password.length < 6) {
      return Response.json({ error: 'id and password (min 6 chars) required' }, { status: 400 });
    }

    await connectDB();
    const hashed = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(id, { password: hashed });

    return Response.json({ message: 'Password updated' });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === 'Unauthorized' || err.message === 'Forbidden')) {
      return Response.json({ error: err.message }, { status: 403 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    await connectDB();
    await User.findByIdAndDelete(id);
    return Response.json({ message: 'User deleted' });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === 'Unauthorized' || err.message === 'Forbidden')) {
      return Response.json({ error: err.message }, { status: 403 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
