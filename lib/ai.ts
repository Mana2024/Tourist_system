export interface UserPreferences {
  budget: 'low' | 'medium' | 'high';
  interests: string[];
  travelDuration: number;
}

export interface PlaceData {
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

// ── Travel zones ──────────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  name: string;
  district: string;
  description: string;
  travelNote: string;          // distance/time from Shillong
  distanceKm: number;          // rough km from Shillong city
  icon: string;
  headerColor: string;         // Tailwind gradient classes
  minDays: number;             // minimum days recommended here
  maxPlacesPerDay: number;
}

export const ZONES: Zone[] = [
  {
    id: 'shillong-city',
    name: 'Shillong City',
    district: 'East Khasi Hills',
    description: 'The Scotland of the East — lakes, museums, markets & colonial charm',
    travelNote: 'Base city · No travel needed',
    distanceKm: 0,
    icon: '🏙️',
    headerColor: 'from-blue-600 to-blue-500',
    minDays: 1,
    maxPlacesPerDay: 3,
  },
  {
    id: 'shillong-outskirts',
    name: 'Shillong Outskirts',
    district: 'East Khasi Hills / Ri Bhoi',
    description: 'Canyons, sacred forests, hot springs & waterfalls on the city fringe',
    travelNote: '20–45 km from Shillong · 45–90 min drive',
    distanceKm: 35,
    icon: '🌲',
    headerColor: 'from-emerald-600 to-emerald-500',
    minDays: 1,
    maxPlacesPerDay: 3,
  },
  {
    id: 'cherrapunji',
    name: 'Cherrapunji (Sohra)',
    district: 'East Khasi Hills',
    description: "World's wettest place — colossal waterfalls, limestone caves & living root bridges",
    travelNote: '55 km south of Shillong · ~1.5 hr drive',
    distanceKm: 55,
    icon: '💧',
    headerColor: 'from-cyan-600 to-cyan-500',
    minDays: 1,
    maxPlacesPerDay: 3,
  },
  {
    id: 'dawki-mawlynnong',
    name: 'Dawki & Mawlynnong',
    district: 'East / South West Khasi Hills',
    description: "Crystal-clear Umngot River, Asia's cleanest village & living root bridges",
    travelNote: '80–100 km from Shillong · ~2.5 hr drive',
    distanceKm: 90,
    icon: '🏞️',
    headerColor: 'from-teal-600 to-teal-500',
    minDays: 1,
    maxPlacesPerDay: 3,
  },
  {
    id: 'jaintia-hills',
    name: 'Jaintia Hills',
    district: 'West / East Jaintia Hills',
    description: 'Hidden waterfalls, sacred river islands & serene lakes of East Meghalaya',
    travelNote: '65–120 km from Shillong · ~2 hr drive',
    distanceKm: 90,
    icon: '🏔️',
    headerColor: 'from-purple-600 to-purple-500',
    minDays: 1,
    maxPlacesPerDay: 3,
  },
  {
    id: 'garo-hills',
    name: 'Garo Hills',
    district: 'West / South Garo Hills',
    description: 'National parks, river caves & Garo tribal culture in West Meghalaya',
    travelNote: '~350 km from Shillong · 8 hr drive or fly to Tura',
    distanceKm: 350,
    icon: '🦁',
    headerColor: 'from-orange-600 to-orange-500',
    minDays: 2,
    maxPlacesPerDay: 2,
  },
];

// Map each place name to a zone id — uses substring matching, no DB change needed
const ZONE_KEYWORDS: { zone: string; keywords: string[] }[] = [
  {
    zone: 'shillong-city',
    keywords: ["ward's lake", 'wards lake', 'don bosco', 'lady hydari', 'smit', 'cathedral', 'all saints',
      'davids', 'shillong view', 'golf course', 'eco park', 'lum sohpetbneng'],
  },
  {
    zone: 'shillong-outskirts',
    keywords: ['shillong peak', 'elephant falls', 'umiam', 'mawphlang', 'laitlum', 'mawkdok',
      'jakrem', 'weisawdong', 'mawlyngbna', 'borpani', 'langkawet', 'bophill', 'lumsohpet', 'pelga', 'riangdo'],
  },
  {
    zone: 'cherrapunji',
    keywords: ['nohkalikai', 'double decker', 'seven sisters', 'mawsmai', 'arwah', 'garden of caves',
      'dainthlen', 'wahkaba', 'mawmluh', 'phephe', 'weinia', 'liatprah', 'kremdam', 'mawphanlur', 'kynrem', 'mawsynram'],
  },
  {
    zone: 'dawki-mawlynnong',
    keywords: ['mawlynnong', 'dawki', 'shnongpdeng', 'riwai', 'kongthong', 'umngot', 'laitmawsiang', 'ranikor'],
  },
  {
    zone: 'jaintia-hills',
    keywords: ['krangsuri', 'nongkhnum', 'thadlaskein', 'thadla', 'nartiang', 'umlawan'],
  },
  {
    zone: 'garo-hills',
    keywords: ['balpakram', 'nokrek', 'siju', 'tura', 'williamnagar', 'baghmara'],
  },
];

function getZoneId(placeName: string): string {
  const lower = placeName.toLowerCase();
  for (const { zone, keywords } of ZONE_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return zone;
  }
  return 'shillong-outskirts'; // sensible default
}

export function getZone(placeName: string): Zone {
  const id = getZoneId(placeName);
  return ZONES.find(z => z.id === id) ?? ZONES[1];
}

// ── Scoring ───────────────────────────────────────────────────────────────────

const BUDGET_ORDER = ['low', 'medium', 'high'];

function budgetScore(placeBudget: string, userBudget: string): number {
  const diff = Math.abs(BUDGET_ORDER.indexOf(placeBudget) - BUDGET_ORDER.indexOf(userBudget));
  if (diff === 0) return 5;
  if (diff === 1) return 2;
  return 0;
}

function interestScore(placeTags: string[], userInterests: string[]): number {
  return placeTags.filter(t => userInterests.includes(t)).length * 4;
}

export function scorePlace(place: PlaceData, prefs: UserPreferences): number {
  return budgetScore(place.budget, prefs.budget) + interestScore(place.tags, prefs.interests);
}

export function recommendPlaces(places: PlaceData[], prefs: UserPreferences): PlaceData[] {
  return places
    .map(p => ({ place: p, score: scorePlace(p, prefs) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ place }) => place);
}

// ── Itinerary ─────────────────────────────────────────────────────────────────

export interface ItinerarySlot {
  label: string;   // "Morning", "Afternoon", "Evening"
  time: string;    // "9:00 AM – 12:00 PM"
  place: PlaceData;
}

export interface ItineraryDay {
  day: number;
  zone: Zone;
  isFirstDayInZone: boolean;
  isLastDayInZone: boolean;
  slots: ItinerarySlot[];
  travelAlert?: string;  // shown when zone changes from previous day
}

const SLOT_LABELS = [
  { label: 'Morning',   time: '8:00 AM – 12:00 PM' },
  { label: 'Afternoon', time: '1:00 PM – 4:30 PM'  },
  { label: 'Evening',   time: '5:00 PM – 7:00 PM'  },
];

// Ordered from closest to furthest — determines progression across days
const ZONE_ORDER = [
  'shillong-city',
  'shillong-outskirts',
  'cherrapunji',
  'dawki-mawlynnong',
  'jaintia-hills',
  'garo-hills',
];

export function generateItinerary(
  places: PlaceData[],
  prefs: UserPreferences,
): ItineraryDay[] {
  const recommended = recommendPlaces(places, prefs);
  if (recommended.length === 0) return [];

  // Deduplicate by _id — defensive guard against any DB duplicates
  const seenIds = new Set<string>();
  const unique = recommended.filter(p => {
    if (seenIds.has(p._id)) return false;
    seenIds.add(p._id);
    return true;
  });

  // Group by zone in score order — each place appears in exactly one zone bucket
  const byZone = new Map<string, PlaceData[]>();
  for (const p of unique) {
    const zid = getZoneId(p.name);
    if (!byZone.has(zid)) byZone.set(zid, []);
    byZone.get(zid)!.push(p);
  }

  // Zone sequence ordered by distance from Shillong
  const zoneSequence = ZONE_ORDER
    .filter(zid => byZone.has(zid))
    .map(zid => ({ zone: ZONES.find(z => z.id === zid)!, places: byZone.get(zid)! }));

  const itinerary: ItineraryDay[] = [];
  let dayNum = 1;
  let remainingDays = prefs.travelDuration;

  for (const { zone, places: zonePlaces } of zoneSequence) {
    if (remainingDays <= 0) break;

    // How many days this zone needs at full capacity
    const neededDays = Math.ceil(zonePlaces.length / zone.maxPlacesPerDay);
    const allocatedDays = Math.min(Math.max(neededDays, zone.minDays), remainingDays);

    // Cap per-day count to maxPlacesPerDay even when allocatedDays is compressed
    const rawPerDay = Math.ceil(zonePlaces.length / allocatedDays);
    const placesPerDay = Math.min(rawPerDay, zone.maxPlacesPerDay);

    for (let d = 0; d < allocatedDays && remainingDays > 0; d++) {
      const dayPlaces = zonePlaces.slice(d * placesPerDay, (d + 1) * placesPerDay);
      if (dayPlaces.length === 0) break; // zone exhausted — no empty days

      const slots: ItinerarySlot[] = dayPlaces.map((place, idx) => ({
        label: SLOT_LABELS[idx % SLOT_LABELS.length].label,
        time:  SLOT_LABELS[idx % SLOT_LABELS.length].time,
        place,
      }));

      const isFirst = d === 0;
      const prevDay = itinerary[itinerary.length - 1];
      const travelAlert =
        isFirst && prevDay && prevDay.zone.id !== zone.id
          ? `Travel day: ${prevDay.zone.name} → ${zone.name} (${zone.travelNote})`
          : undefined;

      itinerary.push({
        day: dayNum,
        zone,
        isFirstDayInZone: isFirst,
        isLastDayInZone: d === allocatedDays - 1 || (d + 1) * placesPerDay >= zonePlaces.length,
        slots,
        travelAlert,
      });

      dayNum++;
      remainingDays--;
    }
  }

  return itinerary;
}
