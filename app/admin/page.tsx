'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

interface Analytics {
  totalPlaces: number;
  totalUsers: number;
  districtsCount: number;
  districts: string[];
  budgetCounts: { low: number; medium: number; high: number };
  topCategories: { tag: string; count: number }[];
}

const TAG_ICONS: Record<string, string> = {
  nature: '🌿', adventure: '🧗', waterfalls: '💧', caves: '🦇', culture: '🏛️',
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg('');
    const res = await fetch('/api/admin/seed', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    setSeedMsg(d.message ?? d.error ?? 'Done');
    setSeeding(false);
    window.location.reload();
  }

  const stats = [
    { label: 'Tourist Places', value: analytics?.totalPlaces ?? 0, icon: '🏞️', color: 'bg-blue-50 text-blue-600' },
    { label: 'Registered Users', value: analytics?.totalUsers ?? 0, icon: '👥', color: 'bg-purple-50 text-purple-600' },
    { label: 'Districts Covered', value: analytics?.districtsCount ?? 0, icon: '📍', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of Meghalaya Tourism platform</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {seeding ? 'Seeding...' : '🌱 Seed Database'}
          </button>
          <Link href="/admin/places/new" className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
            + Add Place
          </Link>
        </div>
      </div>

      {seedMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          {seedMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${s.color}`}>
              {s.icon}
            </div>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            )}
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Places by Budget</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {(['low', 'medium', 'high'] as const).map(b => {
                const count = analytics?.budgetCounts[b] ?? 0;
                const total = analytics?.totalPlaces ?? 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={b}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium text-gray-700">
                        {b === 'low' ? '💚' : b === 'medium' ? '💛' : '❤️'} {b}
                      </span>
                      <span className="text-gray-500">{count} places ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${b === 'low' ? 'bg-emerald-500' : b === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Top Categories</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {analytics?.topCategories.map(({ tag, count }) => (
                <div key={tag} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {TAG_ICONS[tag] ?? '🌍'} {tag}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{count} places</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Districts list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Districts Covered</h2>
          <div className="flex flex-wrap gap-2">
            {loading
              ? [...Array(6)].map((_, i) => <div key={i} className="h-7 w-32 bg-gray-100 rounded-full animate-pulse" />)
              : analytics?.districts.map(d => (
                <span key={d} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                  📍 {d}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
