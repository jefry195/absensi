import React, { useState, useEffect, useRef } from 'react';

export default function FaceScanScanner({ onScanSuccess, checkType = 'IN', allowedRadius = 100, currentDistance = 35 }) {
  const [livenessBlink, setLivenessBlink] = useState(false);
  const [livenessHead, setLivenessHead] = useState(false);
  const [similarity, setSimilarity] = useState(98.5);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('ALIGN FACE IN FRAME');
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const isOutsideRadius = currentDistance > allowedRadius;

  useEffect(() => {
    // Simulate active liveness checks
    const blinkInterval = setInterval(() => {
      setLivenessBlink(prev => !prev);
    }, 2500);

    const headInterval = setInterval(() => {
      setLivenessHead(prev => !prev);
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(headInterval);
    };
  }, []);

  const handleStartScan = () => {
    if (isOutsideRadius) {
      Swal.fire({
        icon: 'error',
        title: 'Di Luar Area Absensi',
        text: `Anda berada di luar area kantor. Jarak saat ini: ${currentDistance}m (Maksimal: ${allowedRadius}m)`,
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    setIsScanning(true);
    setScanStatus('ANALYZING BIOMETRIC VECTOR & LIVENESS...');

    setTimeout(() => {
      const matchScore = 98.4;
      setSimilarity(matchScore);
      setScanStatus(`✅ WAJAH DIKENALI (${matchScore}%)`);
      setIsScanning(false);
      setCapturedPhoto('assets/headshot_male.png');

      Swal.fire({
        icon: 'success',
        title: `Absensi ${checkType === 'IN' ? 'Masuk' : 'Keluar'} Berhasil!`,
        text: `Wajah cocok (${matchScore}% >= 90%). Jarak: ${currentDistance}m dari kantor.`,
        timer: 2000,
        showConfirmButton: false
      });

      if (onScanSuccess) {
        onScanSuccess({
          similarity: matchScore / 100,
          selfieUrl: 'assets/headshot_male.png',
          checkType
        });
      }
    }, 1500);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-semibold text-lg">Face Recognition & Liveness Detection</h3>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Anti-Photo • Liveness Active
        </span>
      </div>

      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-cyan-500/30 group">
        {/* Camera Viewport Background */}
        <img
          src="assets/headshot_male.png"
          alt="Camera Viewport"
          className="w-full h-full object-cover filter brightness-90 contrast-105"
        />

        {/* Laser HUD Reticle Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-64 border border-dashed border-cyan-400/50 rounded-2xl relative">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-cyan-400"></div>
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-cyan-400"></div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-cyan-400"></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-cyan-400"></div>

            {/* Laser Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f2fe] animate-[ping_3s_infinite]"></div>

            {/* Face Mesh Polygon Graphic */}
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-40">
              <polygon points="100,40 140,60 160,100 140,140 100,160 60,140 40,100 60,60" fill="rgba(0,242,254,0.05)" stroke="#00f2fe" strokeWidth="1" />
              <circle cx="75" cy="80" r="5" fill="#00f2fe" />
              <circle cx="125" cy="80" r="5" fill="#00f2fe" />
              <circle cx="100" cy="115" r="4" fill="#00f2fe" />
              <line x1="75" y1="80" x2="125" y2="80" stroke="#00f2fe" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-mono border border-slate-700/50">
          <div className="flex gap-4">
            <div>
              <span className="text-gray-400">SIMILARITY:</span>{' '}
              <span className="text-cyan-400 font-bold">{similarity}%</span>
            </div>
            <div>
              <span className="text-gray-400">BLINK:</span>{' '}
              <span className={livenessBlink ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {livenessBlink ? 'DETECTED' : 'WAITING'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">HEAD MOTION:</span>{' '}
              <span className={livenessHead ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {livenessHead ? 'OK' : 'WAITING'}
              </span>
            </div>
          </div>
          <span className="text-emerald-400 font-bold">LIVENESS PASS</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="text-center font-mono text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 py-2 rounded-lg">
          {scanStatus}
        </div>

        <button
          onClick={handleStartScan}
          disabled={isScanning || isOutsideRadius}
          className={`w-full py-3 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
            isOutsideRadius
              ? 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/20'
          }`}
        >
          <i data-lucide="scan-face" className="w-5 h-5"></i>
          {isOutsideRadius ? 'Tombol Absensi Nonaktif (Di Luar Area)' : `Ambil Presensi ${checkType === 'IN' ? 'Masuk' : 'Keluar'}`}
        </button>
      </div>
    </div>
  );
}
