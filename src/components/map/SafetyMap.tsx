import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Crosshair } from 'lucide-react';
import { Destination, DestinationType } from '../../types';

interface SafetyMapProps {
  userCoords: { lat: number; lng: number };
  destinations?: Destination[];
  selectedDestination?: Destination | null;
  onSelectDestination?: (dest: Destination) => void;
  isNavigating?: boolean;
  className?: string;
}

// Helper to create custom SVG Leaflet Icons
function createCustomIcon(type: 'user' | DestinationType, isSelected: boolean = false): L.DivIcon {
  if (type === 'user') {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-30 animate-ping"></span>
          <span class="relative flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md">
            <span class="w-2 h-2 rounded-full bg-white"></span>
          </span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }

  let bgColor = 'bg-slate-700';
  let badgeSvg = '';
  let label = 'Destination';

  switch (type) {
    case 'police':
      bgColor = 'bg-blue-900 border-blue-400';
      badgeSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;
      label = 'Police';
      break;
    case 'hospital':
      bgColor = 'bg-emerald-600 border-emerald-300';
      badgeSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v12m6-6H6"></path></svg>`;
      label = 'Hospital';
      break;
    case 'security':
      bgColor = 'bg-amber-600 border-amber-300';
      badgeSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`;
      label = 'Security';
      break;
    case 'institution':
      bgColor = 'bg-indigo-600 border-indigo-300';
      badgeSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`;
      label = 'Public Desk';
      break;
    case 'public_establishment':
      bgColor = 'bg-teal-600 border-teal-300';
      badgeSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`;
      label = '24/7 Retail';
      break;
  }

  const ringScale = isSelected ? 'scale-110 ring-4 ring-rose-500 ring-offset-2 ring-offset-white shadow-xl' : 'shadow-md hover:scale-105';

  return L.divIcon({
    className: 'custom-destination-marker',
    html: `
      <div class="transition-transform duration-200 cursor-pointer flex flex-col items-center">
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-2 border-white text-white ${ringScale}">
          ${badgeSvg}
        </div>
        <div class="mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight bg-slate-900/90 text-white backdrop-blur shadow whitespace-nowrap">
          ${label}
        </div>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 22],
    popupAnchor: [0, -22],
  });
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  userCoords,
  destinations = [],
  selectedDestination,
  onSelectDestination,
  isNavigating = false,
  className = 'w-full h-full min-h-[350px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userCoords.lat, userCoords.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: true,
    });

    // Clean, readable OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Zoom controls on top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Group for destination markers
    destMarkersGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
        icon: createCustomIcon('user'),
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(
          `<div class="p-1 font-sans">
            <p class="text-xs font-bold text-slate-900">Your Current Position</p>
            <p class="text-[11px] text-slate-500">Live GPS tracking active</p>
          </div>`
        );
    }
  }, [userCoords.lat, userCoords.lng]);

  // Update Destination markers
  useEffect(() => {
    if (!mapInstanceRef.current || !destMarkersGroupRef.current) return;
    const group = destMarkersGroupRef.current;
    group.clearLayers();

    destMarkersGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    destinations.forEach((dest) => {
      const isSelected = selectedDestination?.id === dest.id;
      const marker = L.marker([dest.latitude, dest.longitude], {
        icon: createCustomIcon(dest.type, isSelected),
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on('click', () => {
        if (onSelectDestination) {
          onSelectDestination(dest);
        }
      });

      const popupHtml = `
        <div class="p-1.5 font-sans min-w-[180px]">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600">${dest.typeLabel}</span>
            <span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">Score ${dest.safetyScore}/100</span>
          </div>
          <p class="text-xs font-bold text-slate-900 leading-tight mb-1">${dest.name}</p>
          <p class="text-[11px] text-slate-600 mb-1">${dest.distanceKm} km away (~${dest.etaMinutes} min walk)</p>
          <p class="text-[10px] text-slate-500 italic">${dest.isOpen24_7 ? 'Open 24/7 Staffed' : dest.openingHours}</p>
        </div>
      `;

      marker.bindPopup(popupHtml);
      destMarkersGroupRef.current?.addLayer(marker);
    });
  }, [destinations, selectedDestination, onSelectDestination]);

  // Update Polyline route when destination is selected
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (selectedDestination) {
      const userPoint: [number, number] = [userCoords.lat, userCoords.lng];
      const destPoint: [number, number] = [selectedDestination.latitude, selectedDestination.longitude];

      // Simulated safe sidewalk corridor route points
      const midLat = (userCoords.lat + selectedDestination.latitude) / 2;
      const midLng = (userCoords.lng + selectedDestination.longitude) / 2 + 0.0005;

      const routePoints: [number, number][] = [userPoint, [midLat, midLng], destPoint];

      const polyline = L.polyline(routePoints, {
        color: isNavigating ? '#e11d48' : '#3b82f6',
        weight: 5,
        opacity: 0.85,
        dashArray: isNavigating ? undefined : '8, 8',
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit bounds nicely to enclose both points with generous padding
      const bounds = L.latLngBounds([userPoint, destPoint]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [selectedDestination, userCoords.lat, userCoords.lng, isNavigating]);

  // Recenter map on user function
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 16, { duration: 1 });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" />

      {/* Recenter & Map Overlay Control */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter on current location"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-white hover:text-blue-600 transition active:scale-95"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Mini Legend Overlay */}
      <div className="absolute top-4 left-4 z-[400] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-medium text-slate-700 shadow-sm">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> You
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-900"></span> Police
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Hospital
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Security
        </span>
      </div>
    </div>
  );
};
