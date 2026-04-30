import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { distanceKmFromShillong } from '@/lib/distance';

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

interface PlaceCardProps {
  place: Place;
  href?: string;
}

export default function PlaceCard({ place, href }: PlaceCardProps) {
  const dest = href ?? `/places/${place._id}`;
  const distKm = distanceKmFromShillong(place.coordinates);

  return (
    <Link href={dest} className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={place.image}
          alt={place.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <Badge label={place.budget} />
        </div>
        {/* Distance badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
          📍 {distKm === 0 ? 'City centre' : `${distKm} km from Shillong`}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-emerald-600 font-medium mb-1">{place.district}</p>
        <h3 className="font-semibold text-gray-900 mb-2 truncate">{place.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{place.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {place.tags.slice(0, 3).map(tag => (
            <Badge key={tag} label={tag} />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span>🌡️ {place.temperature.min}–{place.temperature.max}°C</span>
          <span>🗓️ {place.bestTime.split('–')[0]}</span>
          <span>🎟️ {place.entryFee}</span>
        </div>
      </div>
    </Link>
  );
}
