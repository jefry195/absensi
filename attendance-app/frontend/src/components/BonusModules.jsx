import React, { useState } from 'react';

export default function BonusModules() {
  const [activeTab, setActiveTab] = useState('branches');
  const [selectedBranch, setSelectedBranch] = useState('hq');

  const branches = [
    { id: 'hq', name: 'HQ Corporate Jakarta', lat: -6.2088, lng: 106.8456, radius: 100, staffCount: 142 },
    { id: 'bandung', name: 'Cabang Bandung Tech Hub', lat: -6.9175, lng: 107.6191, radius: 150, staffCount: 45 },
    { id: 'surabaya', name: 'Cabang Surabaya Operations', lat: -7.2575, lng: 112.7521, radius: 200, staffCount: 38 }
  ];

  const handleApplyLeave = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Permohonan Izin / Cuti Terkirim!',
      text: 'Dokumen surat izin berhasil diunggah dan diteruskan ke HRD & Supervisor.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i data-lucide="sparkles" className="w-5 h-5 text-cyan-400"></i>
            Bonus Fitur Enterprise (Multi-Cabang, Shift, Cuti, QR Pass)
          </h3>
          <p className="text-xs text-gray-400">Fitur tambahan untuk operasional multi-cabang & manajemen jadwal shift</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'branches' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-gray-300'}`}
          >
            Multi-Cabang
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'shifts' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-gray-300'}`}
          >
            Jadwal Shift
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'leave' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-gray-300'}`}
          >
            Izin & Cuti
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'qr' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-gray-300'}`}
          >
            QR Pass
          </button>
        </div>
      </div>

      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map(b => (
            <div key={b.id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">{b.id.toUpperCase()} BRANCH</span>
              <h4 className="font-bold text-sm">{b.name}</h4>
              <div className="text-xs text-gray-400 space-y-1 font-mono">
                <div>Lat/Lng: {b.lat}, {b.lng}</div>
                <div>Radius Aktif: <span className="text-emerald-400 font-bold">{b.radius}m</span></div>
                <div>Total Staf: {b.staffCount} Karyawan</div>
              </div>
              <button onClick={() => setSelectedBranch(b.id)} className="mt-2 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold">
                Set Sebagai Lokasi Utama
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl">
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded">SHIFT PAGI</span>
            <h4 className="font-bold text-base mt-2">08:00 WIB - 17:00 WIB</h4>
            <p className="text-xs text-gray-400 mt-1">Berlaku untuk Tim Engineering & Product Design</p>
            <div className="mt-4 text-xs font-mono text-emerald-400">Toleransi Keterlambatan: 15 Menit</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl">
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded">SHIFT MALAM</span>
            <h4 className="font-bold text-base mt-2">20:00 WIB - 05:00 WIB</h4>
            <p className="text-xs text-gray-400 mt-1">Berlaku untuk Tim Monitoring DevOps & Security Gate</p>
            <div className="mt-4 text-xs font-mono text-emerald-400">Toleransi Keterlambatan: 15 Menit</div>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <form onSubmit={handleApplyLeave} className="flex flex-col gap-4 max-w-lg">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Jenis Pengajuan</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
              <option>Izin Sakit (Surat Dokter)</option>
              <option>Cuti Tahunan</option>
              <option>Dinas Luar Kota / Field Project</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Upload Dokumen Pendukung (PDF / JPG)</label>
            <input type="file" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-300" />
          </div>
          <button type="submit" className="py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs">
            Kirim Permohonan Izin
          </button>
        </form>
      )}

      {activeTab === 'qr' && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-4 bg-white rounded-2xl border-4 border-cyan-400 shadow-xl">
            {/* SVG QR Code Mockup */}
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <rect x="0" y="0" width="30" height="30" fill="#000"/>
              <rect x="5" y="5" width="20" height="20" fill="#fff"/>
              <rect x="10" y="10" width="10" height="10" fill="#000"/>
              <rect x="70" y="0" width="30" height="30" fill="#000"/>
              <rect x="75" y="5" width="20" height="20" fill="#fff"/>
              <rect x="80" y="10" width="10" height="10" fill="#000"/>
              <rect x="0" y="70" width="30" height="30" fill="#000"/>
              <rect x="5" y="75" width="20" height="20" fill="#fff"/>
              <rect x="10" y="80" width="10" height="10" fill="#000"/>
              <rect x="35" y="35" width="30" height="30" fill="#000"/>
            </svg>
          </div>
          <div className="text-center font-mono">
            <span className="text-sm font-bold text-cyan-400 block">ALEX VANCE (EMP-8026)</span>
            <span className="text-xs text-gray-400">Scan QR untuk Membuka Portal Kiosk Gate Presensi</span>
          </div>
        </div>
      )}
    </div>
  );
}
