'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import PlaceCard from '@/components/places/PlaceCard';
import Link from 'next/link';

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
}

const INTEREST_ICONS: Record<string, string> = {
  nature: '🌿', adventure: '🧗', waterfalls: '💧', caves: '🦇', culture: '🏛️',
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [recommended, setRecommended] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/recommendations', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setRecommended(d.places ?? []))
      .finally(() => setLoading(false));
  }, [token]);

  const prefs = user?.preferences;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here are your personalised recommendations for Meghalaya</p>
      </div>

      {/* Preferences summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/profile" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Your Budget</p>
            <span className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit →</span>
          </div>
          <p className="text-xl font-semibold capitalize text-gray-900">
            {prefs?.budget === 'low' ? '💚' : prefs?.budget === 'medium' ? '💛' : '❤️'} {prefs?.budget}
          </p>
        </Link>
        <Link href="/profile" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Travel Duration</p>
            <span className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit →</span>
          </div>
          <p className="text-xl font-semibold text-gray-900">✈️ {prefs?.travelDuration} days</p>
        </Link>
        <Link href="/profile" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Your Interests</p>
            <span className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit →</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {prefs?.interests.map(i => (
              <span key={i} className="text-sm">
                {INTEREST_ICONS[i] ?? '🌍'} <span className="capitalize">{i}</span>
              </span>
            ))}
          </div>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/places', label: 'Explore All', icon: '🗺️', color: 'bg-blue-50 text-blue-700' },
          { href: '/map', label: 'Map View', icon: '📍', color: 'bg-purple-50 text-purple-700' },
          { href: '/plan', label: 'Plan Trip', icon: '✈️', color: 'bg-amber-50 text-amber-700' },
          { href: '/profile', label: 'My Profile', icon: '👤', color: 'bg-emerald-50 text-emerald-700' },
        ].map(a => (
          <Link key={a.href} href={a.href} className={`flex items-center gap-3 rounded-xl p-4 font-medium text-sm hover:opacity-90 transition-opacity ${a.color}`}>
            <span className="text-xl">{a.icon}</span> {a.label}
          </Link>
        ))}
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">🧠 AI Recommendations</h2>
            <p className="text-sm text-gray-400">Matched to your interests and budget</p>
          </div>
          <Link href="/places" className="text-sm text-emerald-600 hover:underline font-medium">View all →</Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>No recommendations yet. Update your preferences in your profile.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.slice(0, 6).map(place => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
