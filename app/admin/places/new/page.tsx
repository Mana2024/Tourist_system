import PlaceForm from '@/components/admin/PlaceForm';
import Link from 'next/link';

export default function NewPlacePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/places" className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 mb-4">
          ← Back to places
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Place</h1>
        <p className="text-gray-500 mt-1">Add a new tourist destination to Meghalaya</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <PlaceForm mode="create" />
      </div>
    </div>
  );
}
