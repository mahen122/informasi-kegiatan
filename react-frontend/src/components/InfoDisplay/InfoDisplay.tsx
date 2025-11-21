import React, { useState, useEffect } from 'react';
import './InfoDisplay.css';

// --- 1. Definisi Tipe Data ---

interface Activity {
  no: number;
  kegiatan: string;
  tanggal: string;
  jam: string;
  tempat: string;
  jenis: 'today' | 'tomorrow';
}

interface Berita {
  id: number;
  kategori: string;
  judul: string;
  tanggal: string;
  deskripsi: string;
  // Jika ada gambar:
  // gambar: string; 
}


// --- 2. Data Berita (Ditaruh di luar komponen agar tidak dibuat ulang setiap render) ---
const dataBerita: Berita[] = [
  {
    id: 1,
    kategori: 'Sistem Pemerintahan Berbasis Elektronik',
    judul: 'Diskominfo Kota Semarang Terima Kunjungan Studi Dari UGM Terkait Pengembangan Smart City',
    tanggal: 'Semarang, 7 Oktober 2025',
    deskripsi: 'Dinas Komunikasi, Informatika, Statistik, dan Persandian (Diskominfo) Kota Semarang menerima kunjungan...',
    // gambar: 'path/to/berita1.jpg', 
  },
  {
    id: 2,
    kategori: 'Umum',
    judul: 'Diskominfo Kota Semarang Selenggarakan Forum Smart City Tahun 2025',
    tanggal: 'Semarang, 6 November 2025',
    deskripsi: 'Dinas Komunikasi, Informatika, Statistik, dan Persandian (Diskominfo) Kota Semarang menyelenggarakan...',
    // gambar: 'path/to/berita2.jpg',
  },
  {
    id: 3,
    kategori: 'Sistem Pemerintahan Berbasis Elektronik',
    judul: 'Diskominfo Terima Kunjungan Studi Referensi Terkait Replikasi Aplikasi Pemantauan Banjir',
    tanggal: 'Semarang, 5 November 2025',
    deskripsi: 'Dinas Komunikasi, Informatika, Statistik, dan Persandian (Diskominfo) menerima kunjungan studi...',
    // gambar: 'path/to/berita3.jpg', 
  },
  {
    id: 4,
    kategori: 'Infrastruktur Teknologi',
    judul: 'Peningkatan Jaringan Internet Kota Semarang Capai 90%',
    tanggal: 'Semarang, 19 November 2025',
    deskripsi: 'Diskominfo mengumumkan bahwa proyek peningkatan infrastruktur jaringan internet di seluruh wilayah kota telah mencapai kemajuan signifikan...',
    // gambar: 'path/to/berita4.jpg', 
  },
];


// --- Komponen Utama InfoDisplay ---

const InfoDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [tomorrowActivities, setTomorrowActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... (Logika fetchActivities) ...
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Panggil API Anda
      const response = await fetch('/api/activities'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodayActivities(data.today || []);
      setTomorrowActivities(data.tomorrow || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || !navigator.onLine) {
          setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.');
        } else if (error.message.includes('HTTP error! status: 404')) {
          // Jika API endpoint tidak ada/kosong, tampilkan sample data tanpa error
          setError(null);
          setTodayActivities([]);
          setTomorrowActivities([]);
        } else if (error.message.includes('HTTP error! status: 500')) {
          setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        } else {
          setError(`Terjadi kesalahan saat memuat data: ${error.message}`);
        }
      } else {
        setError('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sampleToday: Activity[] = [
    { no: 1, kegiatan: 'Rapat Koordinasi Pembangunan', tanggal: '10 Nov 2025', jam: '09:00', tempat: 'Aula Balaikota', jenis: 'today' },
    { no: 2, kegiatan: 'Sosialisasi Program Digital', tanggal: '10 Nov 2025', jam: '13:30', tempat: 'Ruang Diskominfo', jenis: 'today' },
  ];

  const sampleTomorrow: Activity[] = [
    { no: 1, kegiatan: 'Pengecekan Infrastruktur IT', tanggal: '11 Nov 2025', jam: '08:30', tempat: 'Dinas PU', jenis: 'tomorrow' },
    { no: 2, kegiatan: 'Festival Budaya Kota', tanggal: '11 Nov 2025', jam: '19:00', tempat: 'Alun-Alun', jenis: 'tomorrow' },
  ];

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchActivities();
    const fetchIntervalID = setInterval(fetchActivities, 300000); // 5 menit

    return () => {
      clearInterval(timerID);
      clearInterval(fetchIntervalID);
    };
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} WIB`;
  };

  const handleRetry = () => {
    fetchActivities();
  };

  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today');
  // ... (Akhir logika) ...


  return (
    <div className="info-display">
      <header className="header">
        <div className="logo-container">
          <img src="/Diskominfo.jpg" alt="Logo Diskominfo" className="logo-semarang" />
          <h1>INFORMASI KEGIATAN<br />PEMERINTAH KOTA SEMARANG</h1>
        </div>

        <div className="datetime">
          <div className="date">{formatDate(currentTime)}</div>
          <div className="time">{formatTime(currentTime)}</div>
        </div>
      </header>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          AGENDA HARI INI
        </button>
        <button
          className={`tab-button ${activeTab === 'tomorrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('tomorrow')}
        >
          AGENDA BESOK
        </button>
      </div>

      <main className="content">
        {isLoading ? (
          <div className="loading-message">Memuat data kegiatan...</div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-button">
                Coba Lagi
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bagian Agenda Hari Ini */}
            {activeTab === 'today' && (
              <section className="agenda-section">
                <h2>AGENDA HARI INI</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>NO</th>
                        <th>KEGIATAN</th>
                        <th>TANGGAL</th>
                        <th>JAM</th>
                        <th>TEMPAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(todayActivities.length === 0 ? sampleToday : todayActivities).map((activity) => (
                        <tr key={`today-${activity.no}`} className="activity-row"> {/* Tambahkan activity-row */}
                          <td>{activity.no}</td>
                          <td>
                            <div className="activity-title">{activity.kegiatan}</div>
                          </td>
                          <td>{activity.tanggal}</td>
                          <td>{activity.jam}</td>
                          <td><div className="activity-place">{activity.tempat}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Bagian Agenda Besok */}
            {activeTab === 'tomorrow' && (
              <section className="agenda-section">
                <h2>AGENDA BESOK</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>NO</th>
                        <th>KEGIATAN</th>
                        <th>TANGGAL</th>
                        <th>JAM</th>
                        <th>TEMPAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(tomorrowActivities.length === 0 ? sampleTomorrow : tomorrowActivities).map((activity) => (
                        <tr key={`tomorrow-${activity.no}`} className="activity-row"> {/* Tambahkan activity-row */}
                          <td>{activity.no}</td>
                          <td>
                            <div className="activity-title">{activity.kegiatan}</div>
                          </td>
                          <td>{activity.tanggal}</td>
                          <td>{activity.jam}</td>
                          <td><div className="activity-place">{activity.tempat}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        <div style={{ paddingBottom: '20px' }} /> {/* Jarak antara Agenda dan Berita */}

        {/* =================================================== */}
        {/* ✅ BAGIAN BERITA TERBARU (STRUKTUR CARD DIPERBAIKI) */}
        {/* =================================================== */}
        <section className="news-section">
          <h2 className="section-title">Berita Terbaru</h2>
          
          {/* Container untuk layout grid/flex card */}
          <div className="news-cards-container">
            {dataBerita.map((berita) => (
              
              /* Kartu Berita */
              <div className="news-card" key={berita.id}>
                
                {/* Visual Placeholder (menggunakan class yang di-style di CSS Anda) */}
                <div className="news-card-visual">
                    {/* Teks Judul untuk tampilan mobile/placeholder visual */}
                    <h3 className="news-card-title-mobile">{berita.judul}</h3> 
                </div>
                
                <div className="news-card-content">
                  
                  {/* Kategori sebagai badge */}
                  <span className="news-category">{berita.kategori}</span>
                  
                  {/* Judul utama (disembunyikan di mobile) */}
                  <h3 className="news-card-title">{berita.judul}</h3>
                  
                  <p className="news-date">{berita.tanggal}</p>
                  <p className="news-description">{berita.deskripsi}</p>
                  
                  <a href="#" className="read-more-link">Baca Selengkapnya »</a>
                </div>
              </div>
            ))}
          </div>
        </section>


        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-section footer-about">
              <img src="/Diskominfo.jpg" alt="Logo Diskominfo" className="footer-logo" />
              <p>Pusat Informasi Jadwal Kegiatan Resmi Pemerintah Kota Semarang. Dikelola oleh Diskominfo Kota Semarang.</p>
              <p>Jl. Pemuda No.148, Sekayu, Semarang Tengah, Kota Semarang</p>
            </div>
            <div className="footer-section footer-links">
              <h4>Tautan Terkait</h4>
              <ul>
                <li><a href="https://semarangkota.go.id/">Website Resmi Pemkot Semarang</a></li>
                <li><a href="https://diskominfo.semarangkota.go.id/">Website Diskominfo</a></li>
                <li><a href="#">Layanan Publik</a></li>
                <li><a href="#">Peta Situs</a></li>
              </ul>
            </div>
            <div className="footer-section footer-social">
              <h4>Media Sosial</h4>
              <div className="social-icons">
                <a href="#" aria-label="Facebook">F</a>
                <a href="#" aria-label="Instagram">I</a>
                <a href="#" aria-label="Twitter">X</a>
                <a href="#" aria-label="YouTube">Y</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Diskominfo Kota Semarang. Hak Cipta Dilindungi.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default InfoDisplay;