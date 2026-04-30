import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Place from '@/models/Place';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const budget   = searchParams.get('budget');
    const tag      = searchParams.get('tag');
    const activity = searchParams.get('activity');

    const filter: Record<string, unknown> = {};
    if (district) filter.district  = district;
    if (budget)   filter.budget    = budget;
    if (tag)      filter.tags      = tag;
    if (activity) filter.activities = activity;

    const places = await Place.find(filter).sort({ createdAt: -1 });
    return Response.json({ places });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();
    await connectDB();

    const place = await Place.create(body);
    return Response.json({ place }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === 'Unauthorized' || err.message === 'Forbidden')) {
      return Response.json({ error: err.message }, { status: 403 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
