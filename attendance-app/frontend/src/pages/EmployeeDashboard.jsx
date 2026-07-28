import React, { useState } from 'react';
import FaceScanScanner from '../components/FaceScanScanner';
import MapTracker from '../components/MapTracker';

export default function EmployeeDashboard({ user, onLogout }) {
  const [checkType, setCheckType] = useState('IN');
  const [personalHistory, setPersonalHistory] = useState([
    { tanggal: '2026-07-28', jam: '08:15:45 AM', type: 'IN', similarity: '99.4%', distance: '32.1m', status: 'Hadir (On Time)' },
    { tanggal: '2026-07-27', jam: '08:12:10 AM', type: 'IN', similarity: '99.2%', distance: '28.0m', status: 'Hadir (On Time)' },
    { tanggal: '2026-07-27', jam: '17:05:00 PM', type: 'OUT', similarity: '98.8%', distance: '30.5m', status: 'Selesai Work' }
  ]);

  const handleScanSuccess = (scanData) => {
    const newEntry = {
      tanggal: new Date().toISOString().slice(0, 10),
      jam: new Date().toLocaleTimeString(),
      type: scanData.checkType,
      similarity: `${(scanData.similarity * 100).toFixed(1)}%`,
      distance: '35.0m',
      status: 'Hadir (On Time)'
    };
    setPersonalHistory(prev => [newEntry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <header className="flex flex-wrap justify-between items-center bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <img src="assets/headshot_male.png" alt="Profile" className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover" />
          <div>
            <h1 className="text-xl font-bold">{user?.name || 'Sophia Chen'}</h1>
            <p className="text-xs text-gray-400 font-mono">{user?.divisi || 'UX Design'} • NIK: 317100234990</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-semibold">
            Status: Karyawan Aktif
          </span>
          <button onClick={onLogout} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold hover:bg-rose-500/30 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Check In / Check Out Selector */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setCheckType('IN')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition ${checkType === 'IN' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'text-gray-400'}`}
        >
          Check-In (Presensi Masuk)
        </button>
        <button
          onClick={() => setCheckType('OUT')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition ${checkType === 'OUT' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'text-gray-400'}`}
        >
          Check-Out (Presensi Keluar)
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FaceScanScanner onScanSuccess={handleScanSuccess} checkType={checkType} allowedRadius={100} currentDistance={32} />
        <MapTracker distance={32} radius={100} />
      </div>

      {/* Personal Attendance History */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <i data-lucide="history" className="w-5 h-5 text-cyan-400"></i>
          Riwayat Presensi Pribadi Saya
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 font-mono text-gray-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Jam</th>
                <th className="p-3">Tipe Presensi</th>
                <th className="p-3">Score Face ID</th>
                <th className="p-3">Jarak GPS</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {personalHistory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-mono">{item.tanggal}</td>
                  <td className="p-3 font-mono text-cyan-400">{item.jam}</td>
                  <td className="p-3 font-bold">{item.type}</td>
                  <td className="p-3 font-mono text-emerald-400">{item.similarity}</td>
                  <td className="p-3 font-mono text-gray-300">{item.distance}</td>
                  <td className="p-3"><span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-bold">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
