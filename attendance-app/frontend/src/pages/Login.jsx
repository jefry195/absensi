import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@lumina.ai');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('admin');

  const handleLogin = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess({
        id: role === 'admin' ? 'USR-8026' : 'USR-4102',
        name: role === 'admin' ? 'Alex Vance' : 'Sophia Chen',
        email,
        role,
        divisi: role === 'admin' ? 'Executive' : 'Design'
      });
    }

    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      text: `Selamat datang, ${role === 'admin' ? 'Alex Vance (Admin)' : 'Sophia Chen (Karyawan)'}`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-3">
            <i data-lucide="scan-face" className="w-8 h-8 text-black"></i>
          </div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Lumina FaceTrack AI
          </h2>
          <p className="text-xs text-gray-400 mt-1">Sistem Absensi Face Recognition & GPS Geofence</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setRole('admin'); setEmail('admin@lumina.ai'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${role === 'admin' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400'}`}
          >
            Login Admin
          </button>
          <button
            type="button"
            onClick={() => { setRole('karyawan'); setEmail('karyawan@company.com'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${role === 'karyawan' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400'}`}
          >
            Login Karyawan
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Email Karyawan / Admin</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition mt-2 text-xs uppercase tracking-wider"
          >
            Masuk Ke Dashboard
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center font-mono text-[11px] text-gray-500">
          Google Sheets Database • Apps Script REST API Active
        </div>
      </div>
    </div>
  );
}
