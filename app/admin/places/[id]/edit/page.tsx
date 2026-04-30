'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PlaceForm from '@/components/admin/PlaceForm';

interface Place {
  _id: string;
  name: string;
  district: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  budget: 'low' | 'medium' | 'high';
  temperature: { min: number; max: number };
  bestTime: string;
  highlights: string[];
  entryFee: string;
  visitDuration: number;
}

export default function EditPlacePage() {
  const params = useParams();
  const id = params.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/places/${id}`)
      .then(r => r.json())
      .then(d => setPlace(d.place))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/places" className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 mb-4">
          ← Back to places
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Place</h1>
        <p className="text-gray-500 mt-1">{place?.name ?? 'Loading...'}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : place ? (
          <PlaceForm mode="edit" initialData={place} />
        ) : (
          <p className="text-gray-500">Place not found.</p>
        )}
      </div>
    </div>
  );
}
