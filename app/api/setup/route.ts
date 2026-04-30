/**
 * One-time bootstrap endpoint. Creates the admin user + seeds all places.
 * Protected by SETUP_KEY env var. Disable by removing SETUP_KEY after first run.
 */
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import Place from '@/models/Place';
import User from '@/models/User';
import { SEED_PLACES, SEED_ADMIN } from '@/lib/data';

const SETUP_KEY = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  const key = request.headers.get('x-setup-key');
  if (key !== SETUP_KEY) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();

  const url = new URL(request.url);
  const sync = url.searchParams.get('sync') === '1';

  // Seed / sync places
  let placesInserted = 0;
  if (sync) {
    // Upsert each seed place by name; always update tags, insert full doc if new
    for (const p of SEED_PLACES) {
      const { tags, activities, ...rest } = p;
      const result = await Place.updateOne(
        { name: p.name },
        { $set: { tags, activities }, $setOnInsert: rest },
        { upsert: true }
      );
      if (result.upsertedCount > 0) placesInserted++;
    }
  } else {
    const existingPlaces = await Place.countDocuments();
    if (existingPlaces === 0) {
      await Place.insertMany(SEED_PLACES);
      placesInserted = SEED_PLACES.length;
    }
  }

  // Seed admin
  let adminCreated = false;
  let existingAdmin = await User.findOne({ email: SEED_ADMIN.email });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(SEED_ADMIN.password, 12);
    existingAdmin = await User.create({ ...SEED_ADMIN, password: hashed, isVerified: true });
    adminCreated = true;
  } else if (!existingAdmin.isVerified) {
    existingAdmin.isVerified = true;
    await existingAdmin.save();
  }

  const token = signToken({
    userId: existingAdmin._id.toString(),
    email: existingAdmin.email,
    role: existingAdmin.role,
  });

  return Response.json({
    message: 'Setup complete',
    placesInserted,
    adminCreated,
    token,
    admin: { email: SEED_ADMIN.email, password: SEED_ADMIN.password },
  });
}
