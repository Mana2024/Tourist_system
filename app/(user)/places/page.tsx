'use client';

import { useEffect, useState } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import { DISTRICTS, INTERESTS, ACTIVITIES } from '@/lib/data';

const INTEREST_ICONS: Record<string, string> = {
  nature: '🌿', adventure: '🧗', waterfalls: '💧', caves: '🦇',
  culture: '🏛️', wildlife: '🦁', heritage: '🏰', lakes: '🏞️',
};

const ACTIVITY_ICONS: Record<string, string> = {
  'Trekking': '🥾',
  'Photography': '📷',
  'Swimming': '🏊',
  'Boating': '🚣',
  'Bird watching': '🦜',
  'Camping': '⛺',
  'Cave exploration': '🔦',
  'Kayaking': '🛶',
  'Wildlife safari': '🦁',
  'Cycling': '🚴',
  'Zip-lining': '🪂',
  'Sunrise viewing': '🌅',
  'Village walk': '🏘️',
  'Cultural tour': '🏛️',
  'Fishing': '🎣',
  'Guided tour': '🧭',
  'Spelunking': '🪨',
  'Rock climbing': '🧗',
  'Rappelling': '⛰️',
  'Nature walk': '🌿',
};

interface Place {
  _id: string;
  name: string;
  district: string;
  description: string;
  image: string;
  tags: string[];
  budget: string;
  temperature: { min: number; max: number };
  bestTime: string;
  entryFee: string;
  coordinates: { lat: number; lng: number };
  activities: string[];
}

export default function PlacesPage() {
  const [places, setPlaces]     = useState<Place[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [district, setDistrict] = useState('');
  const [budget, setBudget]     = useState('');
  const [tag, setTag]           = useState('');
  const [activity, setActivity] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (district) params.set('district', district);
    if (budget)   params.set('budget', budget);
    if (tag)      params.set('tag', tag);
    if (activity) params.set('activity', activity);

    setLoading(true);
    fetch(`/api/places?${params}`)
      .then(r => r.json())
      .then(d => setPlaces(d.places ?? []))
      .finally(() => setLoading(false));
  }, [district, budget, tag, activity]);

  const filtered = places.filter(p =>
    search === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.district.toLowerCase().includes(search.toLowerCase())
  );

  function clearFilters() {
    setDistrict(''); setBudget(''); setTag(''); setSearch(''); setActivity('');
  }

  const hasFilter = search || district || budget || tag || activity;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore Places</h1>
        <p className="text-gray-500 mt-1">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} across Meghalaya</p>
      </div>

      {/* ── Top filters ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="🔍 Search places..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any Budget</option>
            <option value="low">💚 Low</option>
            <option value="medium">💛 Medium</option>
            <option value="high">❤️ High</option>
          </select>

          <select
            value={tag}
            onChange={e => { setTag(e.target.value); setActivity(''); }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Interests</option>
            {INTERESTS.map(i => (
              <option key={i} value={i} className="capitalize">
                {INTEREST_ICONS[i]} {i}
              </option>
            ))}
          </select>
        </div>

        {hasFilter && (
          <button onClick={clearFilters} className="mt-3 text-sm text-gray-400 hover:text-red-500 transition-colors">
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* ── Activity tab strip ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Filter by Activity</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActivity('')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              activity === ''
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'
            }`}
          >
            All
          </button>
          {ACTIVITIES.map(a => (
            <button
              key={a}
              onClick={() => { setActivity(prev => prev === a ? '' : a); setTag(''); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                activity === a
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              <span>{ACTIVITY_ICONS[a] ?? '✦'}</span>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No places found</p>
          <p className="text-sm mt-1">Try different filters or search terms</p>
        </div>
      ) : (
        <>
          {activity && (
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> place{filtered.length !== 1 ? 's' : ''} with &quot;{ACTIVITY_ICONS[activity]} {activity}&quot;
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(place => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
