'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface Place {
  _id: string;
  name: string;
  district: string;
  image: string;
  tags: string[];
  budget: string;
  temperature: { min: number; max: number };
  bestTime: string;
  entryFee: string;
}

export default function AdminPlacesPage() {
  const { token } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch('/api/places')
      .then(r => r.json())
      .then(d => setPlaces(d.places ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/places/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPlaces(prev => prev.filter(p => p._id !== id));
    setDeleting(null);
  }

  const filtered = places
    .filter(p =>
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortDir === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
    );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tourist Places</h1>
          <p className="text-gray-500 mt-1">{places.length} places in database</p>
        </div>
        <Link href="/admin/places/new" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Add New Place
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍 Search by name or district..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🏞️</p>
          <p>No places found. <Link href="/admin/places/new" className="text-emerald-600 hover:underline">Add one?</Link></p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">
                  <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-1 hover:text-gray-800 transition-colors">
                    Place {sortDir === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">District</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Tags</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Budget</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(place => (
                <tr key={place._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image src={place.image} alt={place.name} fill className="object-cover" />
                      </div>
                      <p className="font-medium text-sm text-gray-900">{place.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-500">{place.district}</p>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {place.tags.slice(0, 2).map(t => <Badge key={t} label={t} />)}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <Badge label={place.budget} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/places/${place._id}/edit`} className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors">
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deleting === place._id}
                        onClick={() => handleDelete(place._id, place.name)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
