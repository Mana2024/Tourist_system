import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Place from '@/models/Place';
import User from '@/models/User';
import { SEED_PLACES, SEED_ADMIN } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();

    const existingPlaces = await Place.countDocuments();
    if (existingPlaces === 0) {
      await Place.insertMany(SEED_PLACES);
    }

    const existingAdmin = await User.findOne({ email: SEED_ADMIN.email });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(SEED_ADMIN.password, 12);
      await User.create({ ...SEED_ADMIN, password: hashed });
    }

    const count = await Place.countDocuments();
    return Response.json({ message: `Seeded successfully — ${count} places in database` });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Seed failed' }, { status: 500 });
  }
}
