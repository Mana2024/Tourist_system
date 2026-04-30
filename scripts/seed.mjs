/**
 * One-shot seed script — run with:
 *   node scripts/seed.mjs
 *
 * Requires MONGODB_URI in .env.local (or set it in the environment).
 */

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load .env.local manually
const envPath = resolve(__dirname, '../.env.local');
const envLines = readFileSync(envPath, 'utf8').split('\n');
for (const line of envLines) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

// ---- Inline schemas (avoid TS transpile step) ----
const PlaceSchema = new mongoose.Schema({
  name: String, district: String, description: String, image: String,
  coordinates: { lat: Number, lng: Number },
  tags: [String], budget: String,
  temperature: { min: Number, max: Number },
  bestTime: String, highlights: [String], entryFee: String, visitDuration: Number,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String,
  preferences: { budget: String, interests: [String], travelDuration: Number },
}, { timestamps: true });

const Place = mongoose.models.Place || mongoose.model('Place', PlaceSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ---- Data (inline copy of lib/data.ts) ----
const { SEED_PLACES, SEED_ADMIN } = await import('../lib/data.ts').catch(async () => {
  // Fallback: read the TS file as text and eval the exports via a simple parse
  throw new Error('Run `npx tsx scripts/seed.mts` instead, or use the /api/admin/seed endpoint after logging in as admin.');
});

await mongoose.connect(MONGODB_URI, { bufferCommands: false });
console.log('Connected to MongoDB');

const existingPlaces = await Place.countDocuments();
if (existingPlaces === 0) {
  await Place.insertMany(SEED_PLACES);
  console.log(`Inserted ${SEED_PLACES.length} places`);
} else {
  console.log(`Skipping places — ${existingPlaces} already exist`);
}

const existingAdmin = await User.findOne({ email: SEED_ADMIN.email });
if (!existingAdmin) {
  const hashed = await bcrypt.hash(SEED_ADMIN.password, 12);
  await User.create({ ...SEED_ADMIN, password: hashed });
  console.log('Admin user created:', SEED_ADMIN.email);
} else {
  console.log('Admin already exists');
}

await mongoose.disconnect();
console.log('Done.');
