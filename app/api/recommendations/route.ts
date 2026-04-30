import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Place from '@/models/Place';
import User from '@/models/User';
import { recommendPlaces } from '@/lib/ai';

export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    await connectDB();

    const user = await User.findById(payload.userId).select('preferences');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const places = await Place.find({});
    const prefs = user.preferences;

    const recommended = recommendPlaces(
      places.map(p => p.toObject()),
      {
        budget: prefs.budget,
        interests: prefs.interests,
        travelDuration: prefs.travelDuration,
      }
    );

    return Response.json({ places: recommended });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
