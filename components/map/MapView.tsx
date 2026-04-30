'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface Place {
  _id: string;
  name: string;
  district: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  budget: string;
  entryFee?: string;
  bestTime?: string;
}

interface MapViewProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Zone-colour mapping for marker dots
const ZONE_COLORS: Record<string, string> = {
  'shillong-city':      '#3b82f6',
  'shillong-outskirts': '#10b981',
  'cherrapunji':        '#06b6d4',
  'dawki-mawlynnong':   '#14b8a6',
  'jaintia-hills':      '#a855f7',
  'garo-hills':         '#f97316',
};

const ZONE_KEYWORDS: { zone: string; keywords: string[] }[] = [
  { zone: 'shillong-city',      keywords: ["ward's lake",'wards lake','don bosco','lady hydari','smit','cathedral','all saints'] },
  { zone: 'shillong-outskirts', keywords: ['shillong peak','elephant','umiam','mawphlang','laitlum','mawkdok','jakrem','weisawdong','mawlyngbna','pelga'] },
  { zone: 'cherrapunji',        keywords: ['nohkalikai','double decker','seven sisters','mawsmai','arwah','garden of caves','dainthlen','wahkaba','mawmluh'] },
  { zone: 'dawki-mawlynnong',   keywords: ['mawlynnong','dawki','shnongpdeng','riwai','kongthong','umngot'] },
  { zone: 'jaintia-hills',      keywords: ['krangsuri','nongkhnum','thadlaskein'] },
  { zone: 'garo-hills',         keywords: ['balpakram','nokrek','siju','tura'] },
];

function getZoneColor(name: string): string {
  const lower = name.toLowerCase();
  for (const { zone, keywords } of ZONE_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return ZONE_COLORS[zone];
  }
  return ZONE_COLORS['shillong-outskirts'];
}

function dotIcon(L: typeof import('leaflet'), color: string) {
  return L.divIcon({
    html: `<div style="
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      width:14px;height:14px;
      box-shadow:0 1px 6px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    className: '',
  });
}

export default function MapView({
  places,
  center = [25.467, 91.362],
  zoom = 8,
  height = '500px',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<LeafletMap | null>(null);

  // ── initialise map once ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    import('leaflet').then(async L => {
      if (cancelled || !containerRef.current) return;

      // Dynamically inject Leaflet CSS (avoids SSR issues with next/head)
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id   = 'leaflet-css';
        link.rel  = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Clear any stale _leaflet_id stamp (React StrictMode double-mount)
      const el = containerRef.current as HTMLDivElement & { _leaflet_id?: number };
      if (el._leaflet_id) {
        mapRef.current?.remove();
        mapRef.current = null;
        delete el._leaflet_id;
      }

      if (mapRef.current) return;

      const map = L.map(el, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add place markers
      for (const place of places) {
        const { lat, lng } = place.coordinates;
        if (!lat || !lng) continue;
        const color  = getZoneColor(place.name);
        const marker = L.marker([lat, lng], { icon: dotIcon(L, color) }).addTo(map);
        marker.bindPopup(`
          <div style="min-width:180px;font-family:sans-serif">
            <p style="font-weight:700;font-size:14px;margin:0 0 4px">${place.name}</p>
            <p style="font-size:12px;color:#6b7280;margin:0 0 6px">${place.district}</p>
            ${place.bestTime ? `<p style="font-size:11px;margin:0 0 2px">🗓️ ${place.bestTime}</p>` : ''}
            ${place.entryFee ? `<p style="font-size:11px;margin:0">🎟️ ${place.entryFee}</p>` : ''}
          </div>
        `, { maxWidth: 220 });
      }

      // User location dot
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          if (!mapRef.current) return;
          L.marker([pos.coords.latitude, pos.coords.longitude], {
            icon: dotIcon(L, '#ef4444'),
          })
            .addTo(mapRef.current)
            .bindPopup('<strong style="font-size:13px">📍 You are here</strong>');
        });
      }
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── re-centre when center/zoom props change ──────────────────────────────
  useEffect(() => {
    mapRef.current?.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  return (
    <div style={{ position: 'relative', height, width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%', borderRadius: 12, overflow: 'hidden' }} />

      {/* Zone legend */}
      <div style={{
        position: 'absolute', bottom: 28, right: 10, zIndex: 1000,
        background: 'white', borderRadius: 10, padding: '8px 12px',
        boxShadow: '0 2px 10px rgba(0,0,0,.15)', fontSize: 11,
      }}>
        {Object.entries({
          'Shillong City':      ZONE_COLORS['shillong-city'],
          'Outskirts':          ZONE_COLORS['shillong-outskirts'],
          'Cherrapunji':        ZONE_COLORS['cherrapunji'],
          'Dawki/Mawlynnong':   ZONE_COLORS['dawki-mawlynnong'],
          'Jaintia Hills':      ZONE_COLORS['jaintia-hills'],
          'Garo Hills':         ZONE_COLORS['garo-hills'],
          'You':                '#ef4444',
        }).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: '2px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,.15)', flexShrink: 0 }} />
            <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
