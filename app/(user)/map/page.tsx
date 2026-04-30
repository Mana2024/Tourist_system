'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Badge from '@/components/ui/Badge';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

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

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Place | null>(null);

  useEffect(() => {
    fetch('/api/places')
      .then(r => r.json())
      .then(d => setPlaces(d.places ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full">
      {/* Sidebar list */}
      <div className="w-72 border-r border-gray-100 bg-white flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h1 className="font-bold text-gray-900 text-lg">📍 Map View</h1>
          <p className="text-xs text-gray-400 mt-1">{places.length} places across Meghalaya</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            places.map(place => (
              <button
                key={place._id}
                onClick={() => setSelected(place)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selected?._id === place._id ? 'bg-emerald-50 border-l-2 border-l-emerald-500' : ''
                }`}
              >
                <p className="font-medium text-sm text-gray-900 truncate">{place.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{place.district}</p>
                <div className="flex gap-1 mt-1">
                  {place.tags.slice(0, 2).map(t => (
                    <Badge key={t} label={t} className="text-[10px] px-1.5 py-0.5" />
                  ))}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 flex flex-col">
        {selected && (
          <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{selected.name}</p>
              <p className="text-xs text-gray-400">{selected.district} · 🌡️ {selected.temperature.min}–{selected.temperature.max}°C · {selected.bestTime}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>
        )}

        <div className="flex-1 p-4">
          {loading ? (
            <div className="h-full bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <MapView
              places={places}
              center={selected ? [selected.coordinates.lat, selected.coordinates.lng] : [25.467, 91.362]}
              zoom={selected ? 12 : 8}
              height="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
}
