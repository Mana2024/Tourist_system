'use client';

import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { generateItinerary, ItineraryDay, PlaceData, ZONES } from '@/lib/ai';
import { INTERESTS } from '@/lib/data';

export default function PlanPage() {
  const { user, token } = useAuth();

  const [budget, setBudget]     = useState<'low'|'medium'|'high'>(user?.preferences?.budget ?? 'medium');
  const [interests, setInterests] = useState<string[]>(user?.preferences?.interests ?? ['nature']);
  const [duration, setDuration]  = useState(user?.preferences?.travelDuration ?? 3);
  const [allPlaces, setAllPlaces] = useState<PlaceData[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading]    = useState(false);
  const [saved, setSaved]        = useState(false);

  useEffect(() => {
    fetch('/api/places').then(r => r.json()).then(d => setAllPlaces(d.places ?? []));
  }, []);

  useEffect(() => {
    if (user?.preferences) {
      setBudget(user.preferences.budget);
      setInterests(user.preferences.interests);
      setDuration(user.preferences.travelDuration);
    }
  }, [user]);

  function toggleInterest(i: string) {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = generateItinerary(allPlaces, { budget, interests, travelDuration: duration });
      setItinerary(result);
      setGenerated(true);
      setLoading(false);
    }, 500);
  }

  async function savePreferences() {
    if (!token) return;
    await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: user?.name, preferences: { budget, interests, travelDuration: duration } }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // Summary: which zones will be visited
  const zonesInTrip = [...new Set(itinerary.map(d => d.zone.id))].map(id => ZONES.find(z => z.id === id)!);
  const totalPlaces = itinerary.reduce((s, d) => s + d.slots.length, 0);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">✈️ Plan My Trip</h1>
        <p className="text-gray-500 mt-1">
          Our AI groups places by district so each day stays in one area — no unnecessary back-and-forth driving.
        </p>
      </div>

      {/* ── Preferences form ─────────────────────────────────────────────── */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="grid sm:grid-cols-3 gap-6 mb-6">

          {/* Budget */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Budget</label>
            <div className="flex flex-col gap-2">
              {(['low','medium','high'] as const).map(b => (
                <button key={b} type="button" onClick={() => setBudget(b)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border text-left transition-colors ${
                    budget === b ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {b === 'low' ? '💚 Low' : b === 'medium' ? '💛 Medium' : '❤️ High'}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Interests</label>
            <div className="flex flex-col gap-2">
              {INTERESTS.map(i => (
                <button key={i} type="button" onClick={() => toggleInterest(i)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border text-left transition-colors ${
                    interests.includes(i) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {i === 'nature' ? '🌿' : i === 'adventure' ? '🧗' : i === 'waterfalls' ? '💧' : i === 'caves' ? '🦇' : i === 'culture' ? '🏛️' : i === 'wildlife' ? '🦁' : i === 'heritage' ? '🏰' : '🏞️'} {i}
                </button>
              ))}
            </div>
          </div>

          {/* Duration + summary */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Duration: <span className="text-emerald-600">{duration} day{duration > 1 ? 's' : ''}</span>
            </label>
            <input type="range" min={1} max={10} value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full accent-emerald-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1 mb-4">
              <span>1</span><span>5</span><span>10</span>
            </div>

            {/* Zone coverage hint */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Zones covered in {duration} day{duration > 1 ? 's' : ''}:</p>
            <div className="space-y-1">
              {ZONES.slice(0, Math.max(1, Math.ceil(duration / 1.5))).map(z => (
                <div key={z.id} className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{z.icon}</span>
                  <span className="font-medium">{z.name}</span>
                  <span className="text-gray-400 truncate">· {z.district}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" loading={loading}>
            🧠 Generate Itinerary
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={savePreferences}>
            💾 Save Preferences
          </Button>
          {saved && <span className="text-sm text-emerald-600 font-medium">✓ Saved!</span>}
        </div>
      </form>

      {/* ── Itinerary ────────────────────────────────────────────────────── */}
      {generated && (
        <div>
          {itinerary.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="text-5xl mb-3">🤔</p>
              <p className="font-medium">No matching places found.</p>
              <p className="text-sm mt-1">Try adding more interests or choosing a higher budget.</p>
            </div>
          ) : (
            <>
              {/* Trip overview strip */}
              <div className="bg-slate-900 rounded-2xl p-5 mb-6 text-white">
                <h2 className="font-bold text-lg mb-3">
                  {duration}-Day Meghalaya Itinerary · {totalPlaces} places
                </h2>
                <div className="flex flex-wrap gap-3">
                  {zonesInTrip.map((z, i) => (
                    <div key={z.id} className="flex items-center gap-2">
                      {i > 0 && <span className="text-slate-500 text-sm">→</span>}
                      <span className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-sm">
                        <span>{z.icon}</span>
                        <span className="font-medium">{z.name}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 text-xs mt-3">
                  Places are grouped by district so each day stays in one area.
                </p>
              </div>

              {/* Day cards */}
              <div className="space-y-5">
                {itinerary.map((day, idx) => (
                  <div key={day.day}>
                    {/* Travel alert between zones */}
                    {day.travelAlert && (
                      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
                        <span className="text-xl">🚗</span>
                        <span>{day.travelAlert}</span>
                      </div>
                    )}

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      {/* Day header */}
                      <div className={`bg-gradient-to-r ${day.zone.headerColor} px-6 py-4`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                              {day.day}
                            </span>
                            <div>
                              <p className="text-white font-bold text-base">
                                Day {day.day} — {day.zone.icon} {day.zone.name}
                                {day.isFirstDayInZone && !day.isLastDayInZone && ' (Day 1)'}
                                {!day.isFirstDayInZone && ' (continued)'}
                              </p>
                              <p className="text-white/80 text-xs mt-0.5">{day.zone.district}</p>
                            </div>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-white/90 text-xs font-medium">{day.zone.travelNote}</p>
                            <p className="text-white/60 text-xs mt-0.5">{day.slots.length} place{day.slots.length !== 1 ? 's' : ''} today</p>
                          </div>
                        </div>

                        {day.isFirstDayInZone && (
                          <p className="text-white/75 text-xs mt-2 pl-12">{day.zone.description}</p>
                        )}
                      </div>

                      {/* Slots */}
                      <div className="divide-y divide-gray-50">
                        {day.slots.map((slot, si) => (
                          <div key={slot.place._id} className="flex items-stretch">
                            {/* Time column */}
                            <div className="w-28 flex-shrink-0 flex flex-col items-center justify-center px-3 py-4 bg-gray-50 border-r border-gray-100 text-center">
                              <span className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${
                                slot.label === 'Morning' ? 'text-amber-600' :
                                slot.label === 'Afternoon' ? 'text-blue-600' : 'text-purple-600'
                              }`}>
                                {slot.label === 'Morning' ? '🌅' : slot.label === 'Afternoon' ? '☀️' : '🌇'} {slot.label}
                              </span>
                              <span className="text-[10px] text-gray-400 leading-tight">{slot.time}</span>
                            </div>

                            {/* Place detail */}
                            <div className="flex flex-1 items-center gap-4 p-4">
                              <div className="relative h-20 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                                <Image src={slot.place.image} alt={slot.place.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/places/${slot.place._id}`}
                                  className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                                >
                                  {slot.place.name}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">{slot.place.district}</p>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {slot.place.tags.slice(0, 3).map(t => <Badge key={t} label={t} />)}
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                  <span>🎟️ {slot.place.entryFee}</span>
                                  <span>⏱️ ~{slot.place.visitDuration}h</span>
                                  <span>🌡️ {slot.place.temperature.min}–{slot.place.temperature.max}°C</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Day footer — best time note */}
                      {day.slots[0] && (
                        <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                          <span>🗓️ Best time to visit this area:</span>
                          <span className="font-medium text-gray-700">{day.slots[0].place.bestTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips footer */}
              <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <p className="font-semibold text-emerald-900 mb-2">💡 Travel Tips</p>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Carry cash — ATMs are scarce outside Shillong</li>
                  <li>• Hire a local cab for Cherrapunji and Dawki routes — roads can be narrow</li>
                  <li>• Book accommodation in Shillong city as a base for the first few nights</li>
                  <li>• Best weather: October – April (dry season, clear skies)</li>
                  <li>• Waterfalls are most dramatic July – September (monsoon)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
