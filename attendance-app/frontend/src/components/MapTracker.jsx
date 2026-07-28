import React, { useEffect, useRef } from 'react';

export default function MapTracker({ officeLat = -6.2088, officeLng = 106.8456, radius = 100, userLat = -6.2085, userLng = 106.8460, distance = 35 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([officeLat, officeLng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Office Geofence Circle
    L.circle([officeLat, officeLng], {
      color: '#00f2fe',
      fillColor: '#00f2fe',
      fillOpacity: 0.15,
      radius: radius
    }).addTo(map).bindPopup(`<b>Kantor Pusat HQ</b><br>Radius Absensi: ${radius} meter`);

    // User GPS Location Marker
    const isWithin = distance <= radius;
    const userMarkerIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="width:28px; height:28px; background:${isWithin ? '#10b981' : '#ef4444'}; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 15px ${isWithin ? '#10b981' : '#ef4444'}; flex; items-center; justify-content:center;">
        </div>
      `,
      iconSize: [28, 28]
    });

    L.marker([userLat, userLng], { icon: userMarkerIcon })
      .addTo(map)
      .bindPopup(`<b>Lokasi Saya</b><br>Jarak dari Kantor: <b>${distance}m</b><br>Status: <span style="color:${isWithin ? '#10b981' : '#ef4444'}; font-weight:bold;">${isWithin ? 'Di Dalam Area' : 'Di Luar Area'}</span>`);

  }, [officeLat, officeLng, radius, userLat, userLng, distance]);

  const isWithinRadius = distance <= radius;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i data-lucide="map-pin" className="w-5 h-5 text-cyan-400"></i>
            Dashboard Peta GPS & Radius Absensi
          </h3>
          <p className="text-xs text-gray-400">OpenStreetMap & Leaflet.js • Formula Haversine</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isWithinRadius ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
          {isWithinRadius ? '✅ Dalam Area Kantor' : '❌ Di Luar Area Absensi'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
          <span className="text-gray-400 block mb-1">JARAK KANTOR</span>
          <span className="text-sm font-bold text-cyan-400">{distance} Meter</span>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
          <span className="text-gray-400 block mb-1">BATAS RADIUS</span>
          <span className="text-sm font-bold text-emerald-400">{radius} Meter</span>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
          <span className="text-gray-400 block mb-1">AKURASI GPS</span>
          <span className="text-sm font-bold text-purple-400">12.4m (&lt;30m OK)</span>
        </div>
      </div>

      <div className="h-72 rounded-xl overflow-hidden border border-slate-700 relative">
        <div ref={mapRef} className="w-full h-full"></div>
      </div>

      {!isWithinRadius && (
        <div className="bg-rose-950/60 border border-rose-800/60 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-3">
          <i data-lucide="alert-triangle" className="w-5 h-5 flex-shrink-0 text-rose-400"></i>
          <div>
            <strong className="block font-bold text-rose-200">Anda berada di luar area absensi.</strong>
            <span>Jarak Anda saat ini ({distance}m) melebihi radius maksimal kantor ({radius}m). Tombol absensi otomatis dinonaktifkan.</span>
          </div>
        </div>
      )}
    </div>
  );
}
