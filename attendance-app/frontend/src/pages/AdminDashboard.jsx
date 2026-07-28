import React, { useState } from 'react';
import MapTracker from '../components/MapTracker';
import FaceScanScanner from '../components/FaceScanScanner';
import AttendanceRecords from '../components/AttendanceRecords';
import GeofenceSettings from '../components/GeofenceSettings';
import BonusModules from '../components/BonusModules';

export default function AdminDashboard({ user, onLogout }) {
  const [geofence, setGeofence] = useState({ officeLat: -6.2088, officeLng: 106.8456, radius: 100 });
  const [activeTab, setActiveTab] = useState('overview');

  const [records, setRecords] = useState([
    { id: 'ATT-001', userId: 'EMP-8026', nama: 'Alex Vance', dept: 'Engineering', checkIn: '08:24:12 AM', similarity: '99.8%', distance: '24.5', status: 'Present' },
    { id: 'ATT-002', userId: 'EMP-4102', nama: 'Sophia Chen', dept: 'Design', checkIn: '08:15:45 AM', similarity: '99.4%', distance: '32.1', status: 'Present' },
    { id: 'ATT-003', userId: 'EMP-5597', nama: 'Marcus Brody', dept: 'Logistics', checkIn: '08:30:10 AM', similarity: '98.9%', distance: '120.5', status: 'On Field' },
    { id: 'ATT-004', userId: 'EMP-7410', nama: 'Elena Rostova', dept: 'DevOps', checkIn: '08:45:00 AM', similarity: '99.1%', distance: '15.0', status: 'Remote' },
    { id: 'ATT-005', userId: 'EMP-9021', nama: 'David Kim', dept: 'Engineering', checkIn: '09:12:05 AM', similarity: '97.6%', distance: '45.0', status: 'Late' }
  ]);

  const handleUpdateGeofence = (newGeo) => {
    setGeofence(newGeo);
  };

  const handleScanSuccess = (scanData) => {
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      userId: user?.id || 'USR-8026',
      nama: user?.name || 'Alex Vance',
      dept: 'Engineering',
      checkIn: new Date().toLocaleTimeString(),
      similarity: `${(scanData.similarity * 100).toFixed(1)}%`,
      distance: '35.0',
      status: 'Present'
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <header className="flex flex-wrap justify-between items-center bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <img src="assets/logo.png" alt="Lumina Logo" className="w-10 h-10 rounded-xl shadow-md shadow-cyan-500/20" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Admin Portal • Absensi Face Recognition
            </h1>
            <p className="text-xs text-gray-400 font-mono">Google Sheets DB & Apps Script Connected</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <img src="assets/headshot_male.png" className="w-7 h-7 rounded-full border border-cyan-400" />
            <div className="text-left text-xs">
              <span className="font-semibold block">{user?.name || 'Alex Vance'}</span>
              <span className="text-[10px] text-cyan-400">Administrator</span>
            </div>
          </div>
          <button onClick={onLogout} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold hover:bg-rose-500/30 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1">TOTAL KARYAWAN</span>
          <span className="text-2xl font-extrabold font-mono">150</span>
          <span className="text-[10px] text-cyan-400 block mt-1">100% Registered</span>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/20 p-4 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1">HADIR HARI INI</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">142</span>
          <span className="text-[10px] text-emerald-400 block mt-1">94.6% Rate</span>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/20 p-4 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1">TERLAMBAT</span>
          <span className="text-2xl font-extrabold font-mono text-amber-400">8</span>
          <span className="text-[10px] text-amber-400 block mt-1">Toleransi 15m</span>
        </div>
        <div className="bg-slate-900/80 border border-rose-500/20 p-4 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1">TIDAK HADIR</span>
          <span className="text-2xl font-extrabold font-mono text-rose-400">0</span>
          <span className="text-[10px] text-rose-400 block mt-1">Semua Terdata</span>
        </div>
        <div className="bg-slate-900/80 border border-cyan-500/20 p-4 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1">RADIUS GEOFENCE</span>
          <span className="text-2xl font-extrabold font-mono text-cyan-400">{geofence.radius}m</span>
          <span className="text-[10px] text-cyan-400 block mt-1">Haversine GPS OK</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'overview' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-gray-400'}`}>
          Overview & Face Scanner
        </button>
        <button onClick={() => setActiveTab('map')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'map' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-gray-400'}`}>
          Peta GPS & Radius
        </button>
        <button onClick={() => setActiveTab('records')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'records' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-gray-400'}`}>
          Laporan Absensi & Export
        </button>
        <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'settings' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-gray-400'}`}>
          Pengaturan Radius Kantor
        </button>
        <button onClick={() => setActiveTab('bonus')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'bonus' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-gray-400'}`}>
          Bonus Enterprise
        </button>
      </div>

      {/* Active Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FaceScanScanner onScanSuccess={handleScanSuccess} allowedRadius={geofence.radius} currentDistance={35} />
          <MapTracker officeLat={geofence.officeLat} officeLng={geofence.officeLng} radius={geofence.radius} distance={35} />
        </div>
      )}

      {activeTab === 'map' && (
        <MapTracker officeLat={geofence.officeLat} officeLng={geofence.officeLng} radius={geofence.radius} distance={35} />
      )}

      {activeTab === 'records' && (
        <AttendanceRecords records={records} />
      )}

      {activeTab === 'settings' && (
        <GeofenceSettings officeLat={geofence.officeLat} officeLng={geofence.officeLng} currentRadius={geofence.radius} onUpdateRadius={handleUpdateGeofence} />
      )}

      {activeTab === 'bonus' && (
        <BonusModules />
      )}
    </div>
  );
}
