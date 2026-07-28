import React, { useState } from 'react';

export default function GeofenceSettings({ officeLat, officeLng, currentRadius, onUpdateRadius }) {
  const [lat, setLat] = useState(officeLat);
  const [lng, setLng] = useState(officeLng);
  const [radius, setRadius] = useState(currentRadius);

  const predefinedRadii = [50, 100, 150, 300, 500, 1000];

  const handleSaveSettings = () => {
    if (onUpdateRadius) {
      onUpdateRadius({ officeLat: parseFloat(lat), officeLng: parseFloat(lng), radius: parseInt(radius) });
    }

    Swal.fire({
      icon: 'success',
      title: 'Pengaturan Radius Diperbarui!',
      text: `Radius absensi kantor berhasil diubah menjadi ${radius} meter. Seluruh proses absensi karyawan langsung menggunakan radius terbaru ini tanpa perlu restart.`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i data-lucide="settings-2" className="w-5 h-5 text-cyan-400"></i>
            Pengaturan Radius & Lokasi Kantor
          </h3>
          <p className="text-xs text-gray-400">Ubah radius dan koordinat kantor secara langsung di Google Sheets</p>
        </div>
        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono">
          Sheet Settings GID 775821409
        </span>
      </div>

      {/* Preset Radius Buttons */}
      <div>
        <label className="text-xs font-bold text-gray-300 block mb-2">PILIH PRESET RADIUS (METER):</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {predefinedRadii.map(r => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition border ${
                radius === r
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800 text-gray-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {r} Meter
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Office Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={lat}
            onChange={e => setLat(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-400 outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Office Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={lng}
            onChange={e => setLng(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-400 outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Custom Radius (m)</label>
          <input
            type="number"
            value={radius}
            onChange={e => setRadius(parseInt(e.target.value) || 100)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
      >
        <i data-lucide="save" className="w-4 h-4"></i> Simpan Pengaturan Radius Ke Google Sheets
      </button>
    </div>
  );
}
