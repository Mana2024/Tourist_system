'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import dynamic from 'next/dynamic';
import { getZone } from '@/lib/ai';
import { getHotelsForZone, type Hotel } from '@/lib/hotels';
import { distanceKmFromShillong } from '@/lib/distance';

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
  visitDuration: number;
  highlights: string[];
  activities: string[];
  coordinates: { lat: number; lng: number };
}

const STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

function StarRating({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-sm font-medium">
      {STARS[Math.min(n, 5)]}
    </span>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="flex flex-col gap-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{hotel.name}</p>
        <StarRating n={hotel.stars} />
      </div>
      <p className="text-xs text-gray-500">{hotel.address}</p>
      <p className="text-sm font-medium text-emerald-700">{hotel.priceRange}</p>
      <div className="flex flex-wrap gap-1 mt-0.5">
        {hotel.tags.slice(0, 4).map(t => (
          <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 pt-2 border-t border-gray-50">
        <span>🕐 Check-in {hotel.checkIn}</span>
        <span>🕛 Out {hotel.checkOut}</span>
      </div>
      {hotel.phone && (
        <a
          href={`tel:${hotel.phone}`}
          className="text-xs text-emerald-600 hover:underline mt-0.5"
        >
          📞 {hotel.phone}
        </a>
      )}
    </div>
  );
}

export default function PlaceDetailPage() {
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-80 bg-gray-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 text-gray-400">
        <p className="text-5xl mb-4">😔</p>
        <p className="text-xl font-semibold">Place not found</p>
        <Link href="/places" className="mt-4 text-emerald-600 hover:underline">← Back to places</Link>
      </div>
    );
  }

  const zone = getZone(place.name);
  const hotels = getHotelsForZone(zone.id);
  const distKm = distanceKmFromShillong(place.coordinates);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/places" className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 mb-6">
        ← Back to places
      </Link>

      {/* Hero image */}
      <div className="relative h-80 rounded-2xl overflow-hidden mb-8 shadow-sm">
        <Image src={place.image} alt={place.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <p className="text-emerald-400 text-sm font-medium mb-1">{place.district}</p>
          <h1 className="text-3xl font-bold text-white">{place.name}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {place.tags.map(tag => <Badge key={tag} label={tag} />)}
            <Badge label={place.budget} />
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{place.description}</p>
          </div>

          {/* Highlights */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Highlights</h2>
            <ul className="space-y-2">
              {place.highlights.map(h => (
                <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-emerald-500 mt-0.5">✓</span> {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          {place.activities && place.activities.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Activities</h2>
              <div className="flex flex-wrap gap-2">
                {place.activities.map(a => (
                  <span key={a} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1.5 rounded-full">
                    <span className="text-emerald-500">✦</span> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
            <MapView places={[place]} center={[place.coordinates.lat, place.coordinates.lng]} zoom={12} height="300px" />
          </div>

          {/* Nearby Hotels */}
          {hotels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-gray-900">🏨 Nearby Hotels</h2>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                  {zone.icon} {zone.name} area
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {hotels.map(hotel => (
                  <HotelCard key={hotel.name} hotel={hotel} />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * Prices are indicative and may vary by season. Contact hotels directly for availability.
              </p>
            </div>
          )}
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Quick Info</h2>

            {[
              { icon: '🚗', label: 'Distance from Shillong', value: distKm === 0 ? 'City centre' : `~${distKm} km` },
              { icon: '🌡️', label: 'Temperature', value: `${place.temperature.min}–${place.temperature.max}°C` },
              { icon: '🗓️', label: 'Best Time', value: place.bestTime },
              { icon: '🎟️', label: 'Entry Fee', value: place.entryFee },
              { icon: '⏱️', label: 'Visit Duration', value: `~${place.visitDuration} hrs` },
              { icon: '📍', label: 'District', value: place.district },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Zone info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Travel Zone</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{zone.icon}</span>
              <p className="font-semibold text-gray-900">{zone.name}</p>
            </div>
            <p className="text-xs text-gray-500">{zone.travelNote}</p>
          </div>

          <Link
            href="/plan"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            ✈️ Plan a Trip Here
          </Link>
        </div>
      </div>
    </div>
  );
}
