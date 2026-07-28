// ==========================================================================
// FaceTrack AI Attendance System - Lumina Attendance Application Logic
// Integrated with Google Sheets DB & Google Apps Script Backend
// Bahasa Indonesia Version
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Configuration for Google Integration
    const GOOGLE_CONFIG = {
        sheetId: '1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec',
        gids: {
            karyawan: '0',
            geofence: '775821409',
            absensi: '1528320542'
        }
    };

    // Application State
    const state = {
        currentScreen: 'dashboard',
        isCameraActive: false,
        cameraStream: null,
        simulatedScanning: false,
        scanFPS: 60,
        geofence: { lat: -6.2088, lng: 106.8456, radius: 100 },
        employees: [
            { id: 'EMP-8026', name: 'Alex Vance', role: 'Senior Software Architect', dept: 'Engineering', status: 'Hadir', time: '08:24:12 WIB', confidence: '99.8%', loc: 'Gedung HQ - Lt 4', lat: -6.2088, lng: 106.8456, avatar: 'assets/headshot_male.png', type: 'hq' },
            { id: 'EMP-4102', name: 'Sophia Chen', role: 'UX Lead Designer', dept: 'Design', status: 'Hadir', time: '08:15:45 WIB', confidence: '99.4%', loc: 'Gedung HQ - Lt 3', lat: -6.2092, lng: 106.8450, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', type: 'hq' },
            { id: 'EMP-5597', name: 'Marcus Brody', role: 'Spesialis Operasional Lapangan', dept: 'Logistics', status: 'Dinas Lapangan', time: '08:30:10 WIB', confidence: '98.9%', loc: 'Hub Wilayah Utara', lat: -6.1754, lng: 106.8272, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', type: 'field' },
            { id: 'EMP-7410', name: 'Elena Rostova', role: 'Cloud Infrastructure Eng', dept: 'DevOps', status: 'Remote', time: '08:45:00 WIB', confidence: '99.1%', loc: 'Remote (Geofence Valid)', lat: -6.2250, lng: 106.8000, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', type: 'remote' },
            { id: 'EMP-9021', name: 'David Kim', role: 'QA Automation Engineer', dept: 'Engineering', status: 'Terlambat', time: '09:12:05 WIB', confidence: '97.6%', loc: 'Gedung HQ - Lt 4', lat: -6.2085, lng: 106.8460, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', type: 'hq' },
            { id: 'EMP-3145', name: 'Amara Okafor', role: 'Client Relations Lead', dept: 'Sales', status: 'Dinas Lapangan', time: '08:50:33 WIB', confidence: '99.5%', loc: 'Situs Klien Barat', lat: -6.1900, lng: 106.7800, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', type: 'field' }
        ],
        records: []
    };

    state.records = state.employees.map((emp, i) => ({
        recordId: `REC-20260728-0${i + 1}`,
        empId: emp.id,
        name: emp.name,
        dept: emp.dept,
        checkIn: emp.time,
        checkOut: emp.status === 'Hadir' ? 'Pending' : '17:00:00 WIB',
        confidence: emp.confidence,
        location: emp.loc,
        status: emp.status,
        avatar: emp.avatar
    }));

    let leafletMap = null;
    let mapMarkers = [];

    const navItems = document.querySelectorAll('.nav-item');
    const screenViews = document.querySelectorAll('.screen-view');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const titlesMap = {
        'dashboard': { title: 'Dashboard Admin', sub: 'Metrik presensi biometrik real-time & sinkronisasi cloud Google Sheets' },
        'face-scan': { title: 'Scan Presensi Wajah', sub: 'Pengenalan wajah neural akurasi tinggi & API Google Apps Script' },
        'kiosk-mode': { title: 'Mode Kiosk Gate Presensi', sub: 'Antarmuka scan gate otomatis layar penuh' },
        'live-map': { title: 'Peta Lokasi Real-Time', sub: 'Geofencing GPS & telemetri lokasi tim lapangan secara langsung' },
        'records': { title: 'Riwayat Absensi Karyawan', sub: 'Pencarian, audit, filter, dan ekspor log biometrik' },
        'roster': { title: 'Roster Karyawan & Profil Biometrik', sub: 'Direktori karyawan terdaftar dan vektor jaringan saraf' },
        'design-system': { title: 'Sistem Desain Lumina', sub: 'Token mode gelap, komponen UI glassmorphic & panduan gaya' }
    };

    function switchScreen(targetScreenId) {
        state.currentScreen = targetScreenId;

        navItems.forEach(item => {
            if (item.dataset.target === targetScreenId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        screenViews.forEach(view => {
            if (view.id === `screen-${targetScreenId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        if (titlesMap[targetScreenId]) {
            pageTitle.textContent = titlesMap[targetScreenId].title;
            pageSubtitle.textContent = titlesMap[targetScreenId].sub;
        }

        if (targetScreenId === 'live-map') {
            setTimeout(initLeafletMap, 100);
        } else if (targetScreenId === 'face-scan') {
            startFaceScannerAnimation();
        } else if (targetScreenId === 'kiosk-mode') {
            initKioskClock();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            switchScreen(target);
        });
    });

    document.getElementById('btn-quick-scan')?.addEventListener('click', () => switchScreen('face-scan'));
    document.getElementById('view-all-records')?.addEventListener('click', () => switchScreen('records'));

    async function syncWithGoogleSheets() {
        try {
            console.log("Menghubungkan data live dari Google Sheets...");
            
            const geofenceUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_CONFIG.sheetId}/export?format=csv&gid=${GOOGLE_CONFIG.gids.geofence}`;
            const geoRes = await fetch(geofenceUrl);
            if (geoRes.ok) {
                const csvText = await geoRes.text();
                const lines = csvText.trim().split('\n');
                if (lines.length > 1) {
                    const [latStr, lngStr, radStr] = lines[1].split(',');
                    if (latStr && lngStr) {
                        state.geofence.lat = parseFloat(latStr) || -6.2;
                        state.geofence.lng = parseFloat(lngStr) || 106.816666;
                        state.geofence.radius = parseFloat(radStr) || 100;
                    }
                }
            }

            const karyawanUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_CONFIG.sheetId}/export?format=csv&gid=${GOOGLE_CONFIG.gids.karyawan}`;
            const karRes = await fetch(karyawanUrl);
            if (karRes.ok) {
                const csvText = await karRes.text();
                const lines = csvText.trim().split('\n');
                if (lines.length > 1) {
                    const fetchedEmps = [];
                    for (let i = 1; i < lines.length; i++) {
                        const cols = lines[i].split(',');
                        if (cols.length >= 4) {
                            fetchedEmps.push({
                                id: cols[0] || `EMP-100${i}`,
                                name: cols[1] || `Karyawan ${i}`,
                                nik: cols[2] || '',
                                email: cols[3] || '',
                                dept: cols[6] || 'Engineering',
                                role: cols[7] || 'Anggota Tim',
                                status: 'Hadir',
                                time: '08:00:00 WIB',
                                confidence: '99.5%',
                                loc: 'Kantor Pusat HQ',
                                lat: state.geofence.lat + (Math.random() - 0.5) * 0.02,
                                lng: state.geofence.lng + (Math.random() - 0.5) * 0.02,
                                avatar: i === 1 ? 'assets/headshot_male.png' : `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
                                type: 'hq'
                            });
                        }
                    }
                    if (fetchedEmps.length > 0) {
                        state.employees = fetchedEmps;
                        renderDashboardTable();
                        renderRecordsTable();
                        renderRosterGrid();
                        renderMapSidePanel();
                    }
                }
            }
        } catch (err) {
            console.warn("Menggunakan status bawaan:", err);
        }
    }

    async function submitToAppsScript(payload) {
        try {
            await fetch(GOOGLE_CONFIG.webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error("Error mengirim ke Apps Script:", e);
        }
    }

    syncWithGoogleSheets();
    initDashboardCharts();

    function initDashboardCharts() {
        const ctxTrend = document.getElementById('attendanceChart')?.getContext('2d');
        if (ctxTrend) {
            new Chart(ctxTrend, {
                type: 'line',
                data: {
                    labels: ['07:00 WIB', '08:00 WIB', '08:30 WIB', '09:00 WIB', '09:30 WIB', '10:00 WIB', '11:00 WIB'],
                    datasets: [
                        {
                            label: 'Scan Presensi Tepat Waktu',
                            data: [12, 65, 120, 138, 142, 142, 142],
                            borderColor: '#00f2fe',
                            backgroundColor: 'rgba(0, 242, 254, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Terlambat / Diperiksa',
                            data: [0, 2, 5, 7, 8, 8, 8],
                            borderColor: '#f59e0b',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#9ca3af', font: { family: 'Inter' } } }
                    },
                    scales: {
                        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
                        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
                    }
                }
            });
        }

        const ctxDept = document.getElementById('deptPieChart')?.getContext('2d');
        if (ctxDept) {
            new Chart(ctxDept, {
                type: 'doughnut',
                data: {
                    labels: ['Engineering', 'Design', 'Logistics', 'DevOps', 'Sales'],
                    datasets: [{
                        data: [45, 25, 30, 20, 30],
                        backgroundColor: ['#00f2fe', '#7928ca', '#10b981', '#3b82f6', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 } } }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    renderDashboardTable();
    renderRecordsTable();
    renderRosterGrid();

    function renderDashboardTable() {
        const tbody = document.getElementById('dash-recent-table');
        if (!tbody) return;

        tbody.innerHTML = state.employees.map(emp => `
            <tr>
                <td>
                    <div class="employee-cell">
                        <img src="${emp.avatar}" alt="${emp.name}" class="emp-avatar">
                        <div class="emp-details">
                            <span class="emp-name">${emp.name}</span>
                            <span class="emp-id">${emp.id}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="font-mono text-cyan">${emp.confidence}</span>
                </td>
                <td>
                    <div>${emp.time}</div>
                    <div class="text-muted" style="font-size:11px;">Face AI Gate #1</div>
                </td>
                <td>
                    <span class="text-muted">${emp.loc}</span>
                </td>
                <td>
                    <span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary btn-inspect" data-emp-id="${emp.id}">
                        Inspeksi
                    </button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-inspect').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const empId = e.currentTarget.dataset.empId;
                openAuditModal(empId);
            });
        });
    }

    function renderRecordsTable() {
        const tbody = document.getElementById('records-table-body');
        if (!tbody) return;

        const filterText = document.getElementById('record-search-input')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('record-status-filter')?.value || 'all';

        const filtered = state.records.filter(r => {
            const matchesText = r.name.toLowerCase().includes(filterText) || r.empId.toLowerCase().includes(filterText) || r.dept.toLowerCase().includes(filterText);
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchesText && matchesStatus;
        });

        tbody.innerHTML = filtered.map(r => `
            <tr>
                <td class="font-mono text-muted">${r.recordId}</td>
                <td>
                    <div class="employee-cell">
                        <img src="${r.avatar}" alt="${r.name}" class="emp-avatar">
                        <div class="emp-details">
                            <span class="emp-name">${r.name}</span>
                            <span class="emp-id">${r.empId}</span>
                        </div>
                    </div>
                </td>
                <td>${r.dept}</td>
                <td class="font-mono text-cyan">${r.checkIn}</td>
                <td class="font-mono text-muted">${r.checkOut}</td>
                <td><span class="badge badge-cyan">${r.confidence}</span></td>
                <td><span class="text-muted">${r.location}</span></td>
                <td><span class="badge ${getStatusBadgeClass(r.status)}">${r.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="alert('Melihat log audit untuk ${r.recordId}')">Log Audit</button>
                </td>
            </tr>
        `).join('');
    }

    document.getElementById('record-search-input')?.addEventListener('input', renderRecordsTable);
    document.getElementById('record-status-filter')?.addEventListener('change', renderRecordsTable);

    function renderRosterGrid() {
        const container = document.getElementById('roster-grid');
        if (!container) return;

        container.innerHTML = state.employees.map(emp => `
            <div class="roster-card glassmorphism">
                <img src="${emp.avatar}" alt="${emp.name}" class="roster-avatar">
                <h3 class="roster-name">${emp.name}</h3>
                <p class="roster-role">${emp.role} • ${emp.dept}</p>
                <span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span>
                <div class="roster-stats">
                    <div>
                        <span class="text-muted">ID:</span> <span class="font-mono">${emp.id}</span>
                    </div>
                    <div>
                        <span class="text-muted">Akurasi:</span> <span class="font-mono text-cyan">${emp.confidence}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Hadir':
            case 'Present': return 'badge-success';
            case 'Terlambat':
            case 'Late': return 'badge-warning';
            case 'Dinas Lapangan':
            case 'On Field': return 'badge-cyan';
            case 'Remote': return 'badge-glow';
            default: return 'badge-secondary';
        }
    }

    // Leaflet Interactive Map
    function initLeafletMap() {
        if (leafletMap) {
            leafletMap.invalidateSize();
            return;
        }

        const mapContainer = document.getElementById('leaflet-map-container');
        if (!mapContainer) return;

        leafletMap = L.map('leaflet-map-container').setView([state.geofence.lat, state.geofence.lng], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(leafletMap);

        L.circle([state.geofence.lat, state.geofence.lng], {
            color: '#00f2fe',
            fillColor: '#00f2fe',
            fillOpacity: 0.15,
            radius: state.geofence.radius || 800
        }).addTo(leafletMap).bindPopup(`<b>Batas Geofence Kantor HQ</b><br>Radius Aktif: ${state.geofence.radius || 100}m`);

        renderMapMarkers();
        renderMapSidePanel();
    }

    function renderMapMarkers() {
        if (!leafletMap) return;

        mapMarkers.forEach(m => leafletMap.removeLayer(m));
        mapMarkers = [];

        state.employees.forEach(emp => {
            const customIcon = L.divIcon({
                className: 'custom-map-pin',
                html: `
                    <div style="position:relative; width:36px; height:36px;">
                        <img src="${emp.avatar}" style="width:36px; height:36px; border-radius:50%; border:2px solid ${emp.type === 'field' ? '#00f2fe' : '#10b981'}; box-shadow:0 0 10px rgba(0,242,254,0.5);">
                        <span style="position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; background:${emp.status === 'Terlambat' ? '#f59e0b' : '#10b981'}; border:1px solid #000;"></span>
                    </div>
                `,
                iconSize: [36, 36]
            });

            const marker = L.marker([emp.lat, emp.lng], { icon: customIcon })
                .addTo(leafletMap)
                .bindPopup(`
                    <div style="color:#fff; padding:4px;">
                        <strong style="color:#00f2fe;">${emp.name} (${emp.id})</strong><br>
                        <span>${emp.role}</span><br>
                        <small>Lokasi: ${emp.loc}</small><br>
                        <small>Status: ${emp.status} pukul ${emp.time}</small>
                    </div>
                `);

            mapMarkers.push(marker);
        });
    }

    function renderMapSidePanel() {
        const list = document.getElementById('map-staff-list');
        if (!list) return;

        list.innerHTML = state.employees.map(emp => `
            <div class="map-staff-item" data-lat="${emp.lat}" data-lng="${emp.lng}">
                <img src="${emp.avatar}" class="emp-avatar">
                <div class="emp-details" style="flex:1;">
                    <span class="emp-name">${emp.name}</span>
                    <span class="emp-id">${emp.loc}</span>
                </div>
                <span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span>
            </div>
        `).join('');

        document.querySelectorAll('.map-staff-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lat = parseFloat(e.currentTarget.dataset.lat);
                const lng = parseFloat(e.currentTarget.dataset.lng);
                if (leafletMap) {
                    leafletMap.flyTo([lat, lng], 15, { duration: 1.2 });
                }
            });
        });
    }

    function startFaceScannerAnimation() {
        const canvas = document.getElementById('scanner-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();

        let frame = 0;
        function renderLoop() {
            if (state.currentScreen !== 'face-scan') return;
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            requestAnimationFrame(renderLoop);
        }
        requestAnimationFrame(renderLoop);
    }

    document.getElementById('btn-sim-scan')?.addEventListener('click', () => {
        const reticleStatus = document.getElementById('reticle-status');
        const verifyBadge = document.getElementById('verify-badge');

        if (reticleStatus) reticleStatus.textContent = 'MENGANALISIS NEURAL EMBEDDING...';
        if (verifyBadge) {
            verifyBadge.textContent = 'Memproses...';
            verifyBadge.className = 'badge badge-warning';
        }

        setTimeout(() => {
            if (reticleStatus) reticleStatus.textContent = 'WAJAH COCOK: 99.8%';
            if (verifyBadge) {
                verifyBadge.textContent = 'Terverifikasi';
                verifyBadge.className = 'badge badge-success';
            }

            const nowStr = new Date().toLocaleTimeString();

            document.getElementById('scan-result-name').textContent = 'Alex Vance';
            document.getElementById('scan-result-id').textContent = 'EMP-8026';
            document.getElementById('scan-result-time').textContent = nowStr;
            document.getElementById('scan-result-img').src = 'assets/headshot_male.png';

            submitToAppsScript({
                action: 'getAttendance',
                checkType: 'IN',
                userId: 'EMP-8026',
                nama: 'Alex Vance',
                tanggal: new Date().toISOString().slice(0,10),
                jam: nowStr,
                latitude: state.geofence.lat,
                longitude: state.geofence.lng,
                similarity: 0.998,
                status: 'Hadir'
            });

            const stream = document.getElementById('scan-activity-stream');
            if (stream) {
                const li = document.createElement('li');
                li.className = 'stream-item';
                li.innerHTML = `
                    <img src="assets/headshot_male.png" class="stream-thumb">
                    <div class="stream-info">
                        <span class="stream-name">Alex Vance</span>
                        <span class="stream-time">${nowStr} • Skor 99.8%</span>
                    </div>
                    <span class="badge badge-success">Presensi Masuk</span>
                `;
                stream.prepend(li);
            }
        }, 1200);
    });

    function initKioskClock() {
        const clockEl = document.getElementById('kiosk-clock-display');
        if (!clockEl) return;

        function updateClock() {
            if (state.currentScreen !== 'kiosk-mode') return;
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString() + ' WIB';
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    function openAuditModal(empId) {
        const modal = document.getElementById('modal-detail');
        const modalBody = document.getElementById('modal-detail-body');
        const emp = state.employees.find(e => e.id === empId) || state.employees[0];

        if (modalBody) {
            modalBody.innerHTML = `
                <div style="display:flex; gap:20px; align-items:center; margin-bottom:20px;">
                    <img src="${emp.avatar}" style="width:80px; height:80px; border-radius:50%; border:2px solid #00f2fe; object-fit:cover;">
                    <div>
                        <h2>${emp.name}</h2>
                        <p style="color:#9ca3af;">${emp.role} • ${emp.dept}</p>
                        <span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span>
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:12px; font-family:monospace; display:flex; flex-direction:column; gap:8px;">
                    <div><span style="color:#6b7280;">ID SPREADSHEET GOOGLE:</span> ${GOOGLE_CONFIG.sheetId}</div>
                    <div><span style="color:#6b7280;">HASH VEKTOR NEURAL:</span> 0x8a92f...e4b10</div>
                    <div><span style="color:#6b7280;">SKOR KEMIRIPAN BIOMETRIK:</span> <span style="color:#00f2fe;">${emp.confidence}</span></div>
                    <div><span style="color:#6b7280;">GEOLOKASI GPS:</span> ${emp.lat}, ${emp.lng} (${emp.loc})</div>
                    <div><span style="color:#6b7280;">NODE KAMERA GATE:</span> Gate 01 - Gate Utama</div>
                    <div><span style="color:#6b7280;">PROTOKOL LIVENESS:</span> Pemeriksaan Inframerah 3D Lolos</div>
                </div>
            `;
        }

        modal.classList.remove('hidden');
    }

    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
        document.getElementById('modal-detail')?.classList.add('hidden');
    });
    document.getElementById('btn-modal-close')?.addEventListener('click', () => {
        document.getElementById('modal-detail')?.classList.add('hidden');
    });

    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,ID Record,ID Karyawan,Nama,Divisi,Waktu Masuk,Waktu Keluar,Skor Kemiripan,Lokasi,Status\n";
        state.records.forEach(r => {
            csvContent += `${r.recordId},${r.empId},"${r.name}",${r.dept},${r.checkIn},${r.checkOut},${r.confidence},"${r.location}",${r.status}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan_Absensi_Lumina_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
