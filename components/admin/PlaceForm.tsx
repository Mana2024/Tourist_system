'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { DISTRICTS, INTERESTS } from '@/lib/data';

interface PlaceFormData {
  name: string;
  district: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  budget: 'low' | 'medium' | 'high';
  temperature: { min: number; max: number };
  bestTime: string;
  highlights: string;
  activities: string;
  entryFee: string;
  visitDuration: number;
}

interface PlaceFormProps {
  initialData?: Partial<Omit<PlaceFormData, 'highlights' | 'activities'> & {
    _id: string;
    highlights: string | string[];
    activities: string | string[];
  }>;
  mode: 'create' | 'edit';
}


export default function PlaceForm({ initialData, mode }: PlaceFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<PlaceFormData>({
    name: initialData?.name ?? '',
    district: initialData?.district ?? DISTRICTS[0],
    description: initialData?.description ?? '',
    image: initialData?.image ?? '/images/nohkalikai.jpg',
    coordinates: initialData?.coordinates ?? { lat: 25.467, lng: 91.362 },
    tags: initialData?.tags ?? [],
    budget: initialData?.budget ?? 'low',
    temperature: initialData?.temperature ?? { min: 15, max: 25 },
    bestTime: initialData?.bestTime ?? '',
    highlights: Array.isArray(initialData?.highlights)
      ? (initialData.highlights as string[]).join('\n')
      : (initialData?.highlights ?? ''),
    activities: Array.isArray(initialData?.activities)
      ? (initialData.activities as string[]).join('\n')
      : (initialData?.activities ?? ''),
    entryFee: initialData?.entryFee ?? 'Free',
    visitDuration: initialData?.visitDuration ?? 2,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/admin/images')
      .then(r => r.json())
      .then(d => setImages(d.images ?? []));
  }, []);

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.tags.length === 0) { setError('Select at least one interest tag.'); return; }
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      highlights: form.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      activities: form.activities.split('\n').map(s => s.trim()).filter(Boolean),
    };

    const url = mode === 'create' ? '/api/places' : `/api/places/${initialData?._id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/places');
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed to save');
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <Input label="Place Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">District</label>
          <select
            value={form.district}
            onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          required
        />
      </div>

      {/* Image selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Image</label>
        <select
          value={form.image}
          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {images.map(filename => (
            <option key={filename} value={`/images/${filename}`}>{filename.replace(/\.[^.]+$/, '')}</option>
          ))}
        </select>
        {form.image && (
          <div className="mt-2 relative h-28 w-48 rounded-xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image} alt="preview" className="object-cover h-full w-full" />
          </div>
        )}
      </div>

      {/* Coordinates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="0.0001"
          value={form.coordinates.lat}
          onChange={e => setForm(f => ({ ...f, coordinates: { ...f.coordinates, lat: Number(e.target.value) } }))}
          required
        />
        <Input
          label="Longitude"
          type="number"
          step="0.0001"
          value={form.coordinates.lng}
          onChange={e => setForm(f => ({ ...f, coordinates: { ...f.coordinates, lng: Number(e.target.value) } }))}
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Interest Tags</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
            <button key={i} type="button" onClick={() => toggleTag(i)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${form.tags.includes(i) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Budget Level</label>
        <div className="grid grid-cols-3 gap-3">
          {(['low', 'medium', 'high'] as const).map(b => (
            <button key={b} type="button" onClick={() => setForm(f => ({ ...f, budget: b }))}
              className={`py-2 rounded-lg text-sm font-medium border capitalize transition-colors ${form.budget === b ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600'}`}>
              {b === 'low' ? '💚 Low' : b === 'medium' ? '💛 Medium' : '❤️ High'}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Min Temperature (°C)" type="number"
          value={form.temperature.min}
          onChange={e => setForm(f => ({ ...f, temperature: { ...f.temperature, min: Number(e.target.value) } }))}
          required />
        <Input label="Max Temperature (°C)" type="number"
          value={form.temperature.max}
          onChange={e => setForm(f => ({ ...f, temperature: { ...f.temperature, max: Number(e.target.value) } }))}
          required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Best Time to Visit" placeholder="e.g. October – May"
          value={form.bestTime}
          onChange={e => setForm(f => ({ ...f, bestTime: e.target.value }))}
          required />
        <Input label="Entry Fee" placeholder="e.g. ₹20 or Free"
          value={form.entryFee}
          onChange={e => setForm(f => ({ ...f, entryFee: e.target.value }))} />
      </div>

      <Input label="Visit Duration (hours)" type="number" min={1}
        value={form.visitDuration}
        onChange={e => setForm(f => ({ ...f, visitDuration: Number(e.target.value) }))} />

      {/* Highlights */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Highlights (one per line)</label>
        <textarea
          rows={4}
          value={form.highlights}
          onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          placeholder="Panoramic viewpoint&#10;Trekking trails&#10;Sunrise photography"
        />
      </div>

      {/* Activities */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Activities (one per line)</label>
        <textarea
          rows={4}
          value={form.activities}
          onChange={e => setForm(f => ({ ...f, activities: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          placeholder="Trekking&#10;Photography&#10;Bird watching&#10;Swimming"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="lg" loading={saving}>
          {mode === 'create' ? 'Create Place' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
