import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Place from '@/models/Place';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();

    const [totalPlaces, totalUsers, places] = await Promise.all([
      Place.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Place.find({}, 'name district budget tags'),
    ]);

    const districts = [...new Set(places.map(p => p.district))];

    const budgetCounts = { low: 0, medium: 0, high: 0 };
    const tagCounts: Record<string, number> = {};

    for (const place of places) {
      budgetCounts[place.budget as keyof typeof budgetCounts]++;
      for (const tag of place.tags) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }

    const topCategories = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return Response.json({
      totalPlaces,
      totalUsers,
      districtsCount: districts.length,
      districts,
      budgetCounts,
      topCategories,
    });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === 'Unauthorized' || err.message === 'Forbidden')) {
      return Response.json({ error: err.message }, { status: 403 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
