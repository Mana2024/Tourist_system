export interface Hotel {
  name: string;
  stars: number;
  priceRange: string;
  address: string;
  tags: string[];
  phone?: string;
  checkIn: string;
  checkOut: string;
}

export const HOTELS_BY_ZONE: Record<string, Hotel[]> = {
  'shillong-city': [
    {
      name: 'Hotel Polo Towers',
      stars: 4,
      priceRange: '₹4,000 – ₹8,000/night',
      address: 'Oakland Rd, Shillong 793001',
      tags: ['pool', 'restaurant', 'spa', 'conference'],
      phone: '+91 364 222 1111',
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
    },
    {
      name: 'Ri Kynmaw Resort',
      stars: 4,
      priceRange: '₹3,500 – ₹7,000/night',
      address: 'Upper Shillong, East Khasi Hills',
      tags: ['valley view', 'restaurant', 'fireplace'],
      phone: '+91 364 250 0000',
      checkIn: '1:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Hotel Centre Point',
      stars: 3,
      priceRange: '₹2,000 – ₹4,500/night',
      address: 'GS Rd, Shillong 793001',
      tags: ['city center', 'restaurant', 'WiFi'],
      phone: '+91 364 222 6000',
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Pinewood Hotel',
      stars: 3,
      priceRange: '₹2,500 – ₹5,000/night',
      address: 'European Ward, Shillong 793001',
      tags: ['heritage', 'colonial', 'garden'],
      phone: '+91 364 222 3116',
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
    },
    {
      name: 'Hotel Broadway',
      stars: 2,
      priceRange: '₹1,200 – ₹2,500/night',
      address: 'GS Rd, Shillong 793001',
      tags: ['budget', 'city center', 'WiFi'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
  ],

  'shillong-outskirts': [
    {
      name: 'Orchid Lake Resort',
      stars: 4,
      priceRange: '₹5,000 – ₹10,000/night',
      address: 'Umiam Lake, Ri Bhoi District',
      tags: ['lake view', 'water sports', 'restaurant', 'nature'],
      phone: '+91 364 255 0100',
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
    },
    {
      name: 'Ri Kynjai Resort',
      stars: 5,
      priceRange: '₹8,000 – ₹18,000/night',
      address: 'Umiam Lake, Meghalaya',
      tags: ['luxury', 'lake view', 'spa', 'restaurant', 'pool'],
      phone: '+91 364 255 0000',
      checkIn: '3:00 PM',
      checkOut: '12:00 PM',
    },
    {
      name: 'Hotel Tripura Castle',
      stars: 3,
      priceRange: '₹2,000 – ₹4,000/night',
      address: 'Shillong Outskirts, East Khasi Hills',
      tags: ['heritage', 'garden', 'quiet'],
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Laitlum Eco Homestay',
      stars: 2,
      priceRange: '₹800 – ₹1,800/night',
      address: 'Near Laitlum Canyons, East Khasi Hills',
      tags: ['homestay', 'eco', 'budget', 'valley view'],
      checkIn: '1:00 PM',
      checkOut: '10:00 AM',
    },
  ],

  'cherrapunji': [
    {
      name: 'Cherrapunjee Holiday Resort',
      stars: 3,
      priceRange: '₹3,000 – ₹6,000/night',
      address: 'Laitkynsew Village, Cherrapunji 793108',
      tags: ['valley view', 'restaurant', 'trekking packages'],
      phone: '+91 364 274 1200',
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Polo Orchid Resort',
      stars: 3,
      priceRange: '₹2,500 – ₹5,500/night',
      address: 'Cherrapunji, East Khasi Hills',
      tags: ['mountain view', 'restaurant', 'guided treks'],
      checkIn: '1:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Sohra Heritage Homestay',
      stars: 2,
      priceRange: '₹1,000 – ₹2,000/night',
      address: 'Sohra (Cherrapunji), East Khasi Hills',
      tags: ['homestay', 'local food', 'budget'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Coniferous Resort',
      stars: 3,
      priceRange: '₹2,800 – ₹5,000/night',
      address: 'Cherrapunji Road, East Khasi Hills',
      tags: ['pine forest', 'restaurant', 'waterfall views'],
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
    },
  ],

  'dawki-mawlynnong': [
    {
      name: 'Shnongpdeng Riverside Camp',
      stars: 2,
      priceRange: '₹1,500 – ₹3,000/night',
      address: 'Shnongpdeng, South West Khasi Hills',
      tags: ['riverside', 'camping', 'adventure', 'transparent river'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Mawlynnong Eco Village Stay',
      stars: 2,
      priceRange: '₹800 – ₹1,500/night',
      address: 'Mawlynnong Village, South West Khasi Hills',
      tags: ['eco homestay', "Asia's cleanest village", 'local food'],
      checkIn: '1:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Dawki River Camp',
      stars: 2,
      priceRange: '₹1,200 – ₹2,500/night',
      address: 'Dawki, East Khasi Hills',
      tags: ['riverside camp', 'boating', 'border town'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Hotel Golden Peacock Dawki',
      stars: 3,
      priceRange: '₹2,000 – ₹4,000/night',
      address: 'Dawki, Meghalaya',
      tags: ['river view', 'restaurant', 'comfortable'],
      checkIn: '1:00 PM',
      checkOut: '11:00 AM',
    },
  ],

  'jaintia-hills': [
    {
      name: 'Jowai Tourist Lodge',
      stars: 2,
      priceRange: '₹800 – ₹1,500/night',
      address: 'Jowai, West Jaintia Hills',
      tags: ['budget', 'central', 'government lodge'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Krangsuri Eco Resort',
      stars: 2,
      priceRange: '₹1,200 – ₹2,500/night',
      address: 'Near Krangsuri Falls, West Jaintia Hills',
      tags: ['eco', 'waterfall nearby', 'jungle stay'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Hotel Landmark Jowai',
      stars: 3,
      priceRange: '₹1,800 – ₹3,500/night',
      address: 'Main Rd, Jowai, West Jaintia Hills',
      tags: ['restaurant', 'WiFi', 'comfortable'],
      checkIn: '1:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Nongkhnum Riverside Hut',
      stars: 1,
      priceRange: '₹500 – ₹1,000/night',
      address: 'Nongkhnum Island, West Jaintia Hills',
      tags: ['budget', 'riverbank', 'eco hut', 'island'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
  ],

  'garo-hills': [
    {
      name: 'Hotel Dynasty Tura',
      stars: 3,
      priceRange: '₹2,000 – ₹4,500/night',
      address: 'Tura, West Garo Hills',
      tags: ['restaurant', 'city center', 'comfortable'],
      phone: '+91 3651 222 200',
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
    },
    {
      name: 'Balpakram Eco Lodge',
      stars: 2,
      priceRange: '₹1,500 – ₹3,000/night',
      address: 'Near Balpakram National Park, South Garo Hills',
      tags: ['wildlife', 'eco lodge', 'safari base'],
      checkIn: '1:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Hotel Simsang Retreat',
      stars: 2,
      priceRange: '₹1,000 – ₹2,000/night',
      address: 'Baghmara, South Garo Hills',
      tags: ['river view', 'budget', 'Siju Cave base'],
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
    },
    {
      name: 'Nokrek Nature Camp',
      stars: 2,
      priceRange: '₹1,200 – ₹2,500/night',
      address: 'Near Nokrek Biosphere Reserve, West Garo Hills',
      tags: ['nature camp', 'UNESCO biosphere', 'trekking base'],
      checkIn: '1:00 PM',
      checkOut: '10:00 AM',
    },
  ],
};

export function getHotelsForZone(zoneId: string): Hotel[] {
  return HOTELS_BY_ZONE[zoneId] ?? [];
}
