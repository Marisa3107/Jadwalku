'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [greetingEmoji, setGreetingEmoji] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [countDisplay, setCountDisplay] = useState(0);
  const [hariOffset, setHariOffset] = useState(0);
  const countedRef = useRef(false);

  // ===== STATE UNTUK JAM BERLANGSUNG =====
  const [pelajaranSekarang, setPelajaranSekarang] = useState(null);
  const [pelajaranBerikutnya, setPelajaranBerikutnya] = useState(null);
  const [menitTersisa, setMenitTersisa] = useState(0);
  const [indexSekarang, setIndexSekarang] = useState(-1);

  const fetchJadwal = (offset) => {
    setLoading(true);
    setCountDisplay(0);
    countedRef.current = false;
    fetch(`/api/cron?offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setJadwal(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ===== CEK JAM PELAJARAN SEDANG BERLANGSUNG =====
  const cekPelajaranSekarang = (jadwalData) => {
    if (!jadwalData || !jadwalData.jadwal || jadwalData.jadwal.length === 0) {
      setPelajaranSekarang(null);
      setPelajaranBerikutnya(null);
      setIndexSekarang(-1);
      return;
    }

    const now = new Date();
    const jamSekarang = now.getHours() + now.getMinutes() / 60;

    let index = -1;
    let found = false;

    // Cari pelajaran yang sedang berlangsung
    for (let i = 0; i < jadwalData.jadwal.length; i++) {
      const item = jadwalData.jadwal[i];
      const mapel = typeof item === 'string' ? item : item.mapel;
      
      // Skip ISTIRAHAT & PAGCER
      if (mapel.toUpperCase() === 'ISTIRAHAT' || mapel.toUpperCase() === 'PAGCER') continue;
      
      // ===== HITUNG JAM SESUAI JADWAL ASLI (40 MENIT PER SESI) =====
      let jamMulai = 7 + (i * 0.6667);
      let durasi = 0.6667;
      
      const jamSelesai = jamMulai + durasi;
      
      if (jamSekarang >= jamMulai && jamSekarang < jamSelesai) {
        index = i;
        found = true;
        setPelajaranSekarang({
          mapel: mapel,
          jamMulai: jamMulai,
          jamSelesai: jamSelesai,
          index: i,
          selesaiDalam: Math.round((jamSelesai - jamSekarang) * 60)
        });
        setIndexSekarang(i);
        break;
      }
    }

    if (!found) {
      // Cari pelajaran berikutnya
      let nextIndex = -1;
      for (let i = 0; i < jadwalData.jadwal.length; i++) {
        const item = jadwalData.jadwal[i];
        const mapel = typeof item === 'string' ? item : item.mapel;
        if (mapel.toUpperCase() === 'ISTIRAHAT' || mapel.toUpperCase() === 'PAGCER') continue;
        let jamMulai = 7 + (i * 0.6667);
        if (jamSekarang < jamMulai) {
          nextIndex = i;
          break;
        }
      }

      if (nextIndex !== -1) {
        const item = jadwalData.jadwal[nextIndex];
        const mapel = typeof item === 'string' ? item : item.mapel;
        let jamMulai = 7 + (nextIndex * 0.6667);
        setPelajaranBerikutnya({
          mapel: mapel,
          jamMulai: jamMulai,
          index: nextIndex,
          mulaiDalam: Math.round((jamMulai - jamSekarang) * 60)
        });
      } else {
        setPelajaranBerikutnya(null);
      }
      setPelajaranSekarang(null);
      setIndexSekarang(-1);
    } else {
      // Cari pelajaran berikutnya setelah yang sekarang
      let nextIndex = -1;
      for (let i = index + 1; i < jadwalData.jadwal.length; i++) {
        const item = jadwalData.jadwal[i];
        const mapel = typeof item === 'string' ? item : item.mapel;
        if (mapel.toUpperCase() === 'ISTIRAHAT' || mapel.toUpperCase() === 'PAGCER') continue;
        nextIndex = i;
        break;
      }
      if (nextIndex !== -1) {
        const item = jadwalData.jadwal[nextIndex];
        const mapel = typeof item === 'string' ? item : item.mapel;
        let jamMulai = 7 + (nextIndex * 0.6667);
        setPelajaranBerikutnya({
          mapel: mapel,
          jamMulai: jamMulai,
          index: nextIndex,
          mulaiDalam: Math.round((jamMulai - (now.getHours() + now.getMinutes() / 60)) * 60)
        });
      } else {
        setPelajaranBerikutnya(null);
      }
    }
  };

  // ===== UPDATE MENIT TERSISA TIAP DETIK =====
  useEffect(() => {
    if (!pelajaranSekarang) return;
    const interval = setInterval(() => {
      const now = new Date();
      const jamSekarang = now.getHours() + now.getMinutes() / 60;
      const sisa = Math.round((pelajaranSekarang.jamSelesai - jamSekarang) * 60);
      setMenitTersisa(Math.max(0, sisa));
    }, 1000);
    return () => clearInterval(interval);
  }, [pelajaranSekarang]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
    };

    const hour = new Date().getHours();
    let greetText = '';
    let emoji = '';

    if (hour < 5) {
      greetText = 'Selamat Malam';
      emoji = '🌙';
    } else if (hour < 12) {
      greetText = 'Selamat Pagi';
      emoji = '☀️';
    } else if (hour < 15) {
      greetText = 'Selamat Siang';
      emoji = '☀️';
    } else if (hour < 19) {
      greetText = 'Selamat Sore';
      emoji = '🌅';
    } else {
      greetText = 'Selamat Malam';
      emoji = '🌙';
    }

    setGreeting(greetText);
    setGreetingEmoji(emoji);

    updateTime();
    const interval = setInterval(updateTime, 60000);

    fetchJadwal(0);

    return () => clearInterval(interval);
  }, []);

  // ===== PANGGIL cekPelajaranSekarang SETIAP JADWAL BERUBAH =====
  useEffect(() => {
    if (jadwal) {
      cekPelajaranSekarang(jadwal);
    }
  }, [jadwal]);

  // ===== AUTO REFRESH JAM 5 PAGI =====
  useEffect(() => {
    const checkRefresh = () => {
      const now = new Date();
      const jam = now.getHours();
      const menit = now.getMinutes();
      if (jam === 5 && menit <= 5) {
        console.log('🔄 Auto refresh jam 5 pagi!');
        window.location.reload();
      }
    };
    const refreshInterval = setInterval(checkRefresh, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const totalMapel = jadwal?.jadwal?.filter(
    (item) => {
      const mapel = typeof item === 'string' ? item : item.mapel;
      return mapel.toUpperCase() !== 'ISTIRAHAT' && mapel.toUpperCase() !== 'PAGCER';
    }
  ).length || 0;

  useEffect(() => {
    if (loading || countedRef.current) return;
    countedRef.current = true;

    if (totalMapel === 0) {
      setCountDisplay(0);
      return;
    }

    const duration = 600;
    const steps = Math.min(totalMapel, 12);
    const stepTime = Math.max(duration / steps, 30);
    let current = 0;

    const tick = setInterval(() => {
      current += 1;
      setCountDisplay(Math.min(current, totalMapel));
      if (current >= totalMapel) clearInterval(tick);
    }, stepTime);

    return () => clearInterval(tick);
  }, [loading, totalMapel, jadwal]);

  const colors = [
    '#C9A227', '#B8863B', '#9C8A4E', '#A8762F', '#8E9B6E',
    '#B08D57', '#6E8B7A', '#BF7E3F', '#7A8FA6', '#AD9642',
  ];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="journal-shell">
          <div className="journal-page loading-page">
            <div className="loader-seal">
              <span className="loader-ring" />
              <span className="loader-ring loader-ring-2" />
            </div>
            <p>Menyusun jadwal...</p>
          </div>
        </div>
      </>
    );
  }

  const isLibur = !jadwal?.jadwal || jadwal.jadwal.length === 0;
  const hari = jadwal?.hari?.charAt(0).toUpperCase() + jadwal?.hari?.slice(1) || '';
  const hariDisplay = jadwal?.hariDisplay || hari;

  const formatPekan = (pekan) => {
    if (!pekan) return 'PEKAN';
    const number = pekan.replace('pekan', '');
    return `PEKAN ${number.toUpperCase()}`;
  };

  const formatJam = (jam) => {
    const hours = Math.floor(jam);
    const minutes = Math.round((jam - hours) * 60);
    return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}`;
  };

  // ===== FUNGSI HITUNG JAM UNTUK DAFTAR PELAJARAN =====
  const getJamPelajaran = (index, mapel, hari) => {
  const isBreak = mapel.toUpperCase() === 'ISTIRAHAT';
  const isPagcer = mapel.toUpperCase() === 'PAGCER';
  const isJumat = hari?.toLowerCase() === 'jumat';
  
  let jamMulai = 7 + (index * 0.6667);
  let durasi = 0.6667; // 40 menit

  if (isBreak) {
    if (isJumat) {
      // Jumat: ISTIRAHAT 50 menit (index 6)
      durasi = 0.8333; // 50 menit
    } else {
      // Senin-Kamis: ISTIRAHAT 1 (index 4) = 15 menit, ISTIRAHAT 2 (index 8) = 40 menit
      if (index === 4) {
        durasi = 0.25; // 15 menit
      } else {
        durasi = 0.6667; // 40 menit
      }
    }
  }
  if (isPagcer) {
    jamMulai = 7 + (index * 0.6667);
    durasi = 0.6667;
  }
  
  const jamSelesai = jamMulai + durasi;
  return { jamMulai, jamSelesai, durasi };
};

  return (
    <>
      <style>{styles}</style>

      <div className="journal-shell">
        <div className="grain-overlay" />
        {[...Array(9)].map((_, i) => (
          <span
            key={`mote-${i}`}
            className="brass-mote"
            style={{
              left: `${(i * 24 + 5) % 100}%`,
              top: `${(i * 19 + 8) % 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          />
        ))}

        <div className="journal-page">
          <span className="rivet rivet-tl" />
          <span className="rivet rivet-tr" />
          <span className="rivet rivet-bl" />
          <span className="rivet rivet-br" />
          <div className="elastic-band" aria-hidden="true" />

          <div className="page-content">
            <div className="top-row reveal" style={{ '--delay': '0.05s' }}>
              <div className="seal-badge">
                <span className="seal-dot" />
                AKTIF
              </div>
              <div className="tag-chip">v2.9</div>
            </div>

            <div className="header-block reveal" style={{ '--delay': '0.14s' }}>
              <h1 className="greeting-title">
                {greeting} <span className="greet-emoji">{greetingEmoji}</span>
              </h1>
              <p className="time-text">{currentTime}</p>

              <div className="badge-row">
                <span className="mil-tag reveal" style={{ '--delay': '0.22s' }}>
                  📖 {formatPekan(jadwal?.pekan)}
                </span>
                <span className="mil-tag mil-tag-alt reveal" style={{ '--delay': '0.28s' }}>
                  📅 {hariDisplay}
                </span>
              </div>
            </div>

            {/* ===== LIVE INDICATOR ===== */}
            {!isLibur && (
              <div className="live-block reveal" style={{ '--delay': '0.32s' }}>
                {pelajaranSekarang ? (
                  <div className="live-indicator">
                    <span className="live-dot"></span>
                    <div className="live-content">
                      <div className="live-title">
                        🕐 Sekarang Jam ke-{pelajaranSekarang.index + 1}
                      </div>
                      <div className="live-mapel">
                        <strong>{pelajaranSekarang.mapel}</strong>
                      </div>
                      <div className="live-time">
                        {formatJam(pelajaranSekarang.jamMulai)} - {formatJam(pelajaranSekarang.jamSelesai)}
                      </div>
                      <div className="live-countdown">
                        ⏳ Selesai dalam <span className="countdown-number">{menitTersisa}</span> menit
                      </div>
                    </div>
                  </div>
                ) : pelajaranBerikutnya ? (
                  <div className="live-indicator next">
                    <span className="live-dot next-dot"></span>
                    <div className="live-content">
                      <div className="live-title">
                        ⏰ Selanjutnya: Jam ke-{pelajaranBerikutnya.index + 1}
                      </div>
                      <div className="live-mapel">
                        <strong>{pelajaranBerikutnya.mapel}</strong>
                      </div>
                      <div className="live-time">
                        Mulai {formatJam(pelajaranBerikutnya.jamMulai)}
                      </div>
                      {pelajaranBerikutnya.mulaiDalam > 0 && (
                        <div className="live-countdown">
                          ⏳ Mulai dalam <span className="countdown-number">{pelajaranBerikutnya.mulaiDalam}</span> menit
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="live-indicator done">
                    <span className="live-dot done-dot"></span>
                    <div className="live-content">
                      <div className="live-title">🎉 Hari ini selesai!</div>
                      <div className="live-mapel">Semua pelajaran sudah selesai</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="stats-row reveal" style={{ '--delay': '0.34s' }}>
              <div className="stat-block">
                <div className="stat-value">{countDisplay}</div>
                <div className="stat-label">Mata Pelajaran</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{isLibur ? 'Libur' : 'Sekolah'}</div>
                <div className="stat-label">Status Hari</div>
              </div>
            </div>

            <div className="hairline reveal" style={{ '--delay': '0.4s' }} />

            <div className="nav-row reveal" style={{ '--delay': '0.42s' }}>
              <button 
                className={`nav-btn ${hariOffset === 0 ? 'active' : ''}`} 
                onClick={() => { setHariOffset(0); fetchJadwal(0); }}
              >
                📅 Hari Ini
              </button>
              <button 
                className={`nav-btn ${hariOffset === 1 ? 'active' : ''}`} 
                onClick={() => { setHariOffset(1); fetchJadwal(1); }}
              >
                📅 Besok
              </button>
              <button 
                className={`nav-btn ${hariOffset === 2 ? 'active' : ''}`} 
                onClick={() => { setHariOffset(2); fetchJadwal(2); }}
              >
                📅 Lusa
              </button>
              <Link href="/tugas" className="nav-btn tugas-btn">
                📋 Tugas
              </Link>
            </div>

            <div className="section-head reveal" style={{ '--delay': '0.44s' }}>
              <div>
                <p className="section-kicker">Daftar Pelajaran</p>
                <h2 className="section-title">
                  {hariOffset === 0 ? 'Hari Ini' : hariOffset === 1 ? 'Besok' : 'Lusa'}
                </h2>
              </div>
              <span className="count-badge">{totalMapel}</span>
            </div>

            {isLibur ? (
              <div className="empty-block reveal" style={{ '--delay': '0.5s' }}>
                <div className="empty-icon">🎉</div>
                <h3>
                  {hariOffset === 0 ? 'Hari Ini Libur!' : hariOffset === 1 ? 'Besok Libur!' : 'Lusa Libur!'}
                </h3>
                <p>Tidak ada jadwal. Manfaatkan waktumu sebaik mungkin.</p>
              </div>
            ) : (
              <div className="entry-list">
                {jadwal?.jadwal?.map((item, index) => {
                  const isString = typeof item === 'string';
                  const mapel = isString ? item : item.mapel;
                  const isBreak = mapel.toUpperCase() === 'ISTIRAHAT';
                  const isPagcer = mapel.toUpperCase() === 'PAGCER';
                  const isActive = index === indexSekarang && pelajaranSekarang !== null;
                  
                  // ===== HITUNG JAM PAKE FUNGSI getJamPelajaran =====
                  const { jamMulai, jamSelesai, durasi } = getJamPelajaran(index, mapel);
                  const jamDisplay = `${formatJam(jamMulai)} - ${formatJam(jamSelesai)}`;
                  
                  const jamFromData = !isString && item.jam ? item.jam : null;
                  
                  const color = colors[index % colors.length];
                  const icon = ['📐', '🔬', '📖', '✏️', '🧮', '🎨', '🏃', '💻', '📝', '🌍'][index % 10];
                  
                  return (
                    <div
                      key={index}
                      className={`entry-item ${isBreak ? 'break-item' : ''} ${isActive ? 'active-item' : ''}`}
                      style={{
                        '--accent': isBreak ? '#C9A227' : color,
                        '--delay': `${0.46 + index * 0.055}s`,
                      }}
                    >
                      <div className="entry-left">
                        <div className="hour-badge" style={{
                          background: isBreak ? 'linear-gradient(155deg, #C9A227, #8B6914)' : 
                          isActive ? 'linear-gradient(155deg, #4ECDC4, #1A8A7A)' : undefined
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="mapel-name" style={{
                            color: isBreak ? '#E7C567' : isActive ? '#4ECDC4' : undefined
                          }}>
                            {isActive && '▶ '}{mapel}
                          </div>
                          <div className="mapel-sub">
                            {isBreak ? `☕ Istirahat (${jamDisplay})` : (jamFromData || jamDisplay)}
                            {isActive && <span className="active-badge"> ● Sedang</span>}
                          </div>
                        </div>
                      </div>
                      <div className="icon-slot">
                        {isBreak ? '☕' : isActive ? '🔴' : icon}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="footer-note reveal" style={{ '--delay': '0.7s' }}>
              <span>⏰ 05:30</span>
              <span className="dot">—</span>
              <span>🤖 Telegram</span>
              <span className="dot">—</span>
              <span>Vol. 01</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

  :root {
    --bg-deep: #14110E;
    --leather: #221C16;
    --leather-2: #2A2219;
    --stitch: rgba(201, 162, 39, 0.32);
    --brass: #C9A227;
    --brass-bright: #E7C567;
    --ink: #F3ECDA;
    --ink-soft: #A99E86;
    --ink-mute: #8B8069;
    --wine: #7A3B3B;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background:
      radial-gradient(ellipse at 20% -10%, #2C241A 0%, transparent 55%),
      linear-gradient(160deg, #0F0D0B 0%, #17130F 50%, #0F0D0B 100%);
    color: var(--ink);
    overflow-x: hidden;
    font-family: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif;
  }

  .journal-shell {
    position: relative;
    min-height: 100vh;
    padding: 28px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .grain-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1px);
    background-size: 3px 3px;
    opacity: 0.6;
    pointer-events: none;
  }

  .brass-mote {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--brass-bright);
    opacity: 0;
    box-shadow: 0 0 6px rgba(231, 197, 103, 0.6);
    animation: driftMote ease-in-out infinite;
    pointer-events: none;
  }

  .journal-page,
  .loading-page {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background:
      linear-gradient(165deg, var(--leather-2), var(--leather) 60%);
    border-radius: 14px;
    border: 1px solid rgba(201, 162, 39, 0.16);
    box-shadow:
      0 30px 70px rgba(0, 0, 0, 0.55),
      inset 0 1px 0 rgba(255,255,255,0.04);
    animation: settleJournal 0.6s cubic-bezier(.22,.9,.35,1);
    perspective: 900px;
  }

  .journal-page::before {
    content: '';
    position: absolute;
    inset: 9px;
    border-radius: 8px;
    border: 1px dashed var(--stitch);
    pointer-events: none;
  }

  .loading-page {
    padding: 50px 24px 40px;
    text-align: center;
  }

  .rivet {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, var(--brass-bright), var(--brass) 55%, #7A611A 100%);
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
    animation: rivetGleam 3.6s ease-in-out infinite;
  }

  .rivet-tl { top: 16px; left: 16px; animation-delay: 0s; }
  .rivet-tr { top: 16px; right: 16px; animation-delay: 0.5s; }
  .rivet-bl { bottom: 16px; left: 16px; animation-delay: 1s; }
  .rivet-br { bottom: 16px; right: 16px; animation-delay: 1.5s; }

  .elastic-band {
    position: absolute;
    top: -8px;
    right: 38px;
    width: 22px;
    height: 64px;
    background: linear-gradient(180deg, #5C1F1F, #7A3B3B 45%, #5C1F1F);
    box-shadow: 0 3px 10px rgba(0,0,0,0.4);
    border-radius: 3px;
    transform-origin: top center;
    animation: bandSettle 0.9s cubic-bezier(.34,1.56,.64,1) both;
    animation-delay: 0.15s;
  }

  .elastic-band::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 30px;
    width: 12px;
    height: 12px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, var(--brass-bright), var(--brass) 60%, #7A611A);
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .page-content {
    padding: 30px 26px 24px;
  }

  .reveal {
    opacity: 0;
    animation: fadeSlideUp 0.55s ease-out both;
    animation-delay: var(--delay, 0s);
  }

  .loader-seal {
    width: 52px;
    height: 52px;
    margin: 0 auto 16px;
    position: relative;
  }

  .loader-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid rgba(201, 162, 39, 0.2);
    border-top-color: var(--brass-bright);
    animation: spin 0.9s linear infinite;
  }

  .loader-ring-2 {
    inset: 9px;
    border-width: 2px;
    border-top-color: transparent;
    border-right-color: var(--brass-bright);
    animation: spin 1.3s linear infinite reverse;
    opacity: 0.6;
  }

  .loading-page p {
    margin: 0;
    color: var(--ink-soft);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.04em;
    animation: pulseText 1.6s ease-in-out infinite;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .seal-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 13px;
    border: 1px solid rgba(201, 162, 39, 0.4);
    border-radius: 999px;
    color: var(--brass-bright);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.09em;
    background: rgba(201, 162, 39, 0.07);
  }

  .seal-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--brass-bright);
    box-shadow: 0 0 8px rgba(231, 197, 103, 0.7);
    animation: breathe 2s ease-in-out infinite;
  }

  .tag-chip {
    padding: 6px 11px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    color: var(--ink-mute);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
  }

  .header-block {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(201, 162, 39, 0.14);
  }

  .greeting-title {
    margin: 0;
    font-family: 'Fraunces', serif;
    font-weight: 800;
    font-optical-sizing: auto;
    font-size: clamp(30px, 8vw, 38px);
    line-height: 1.04;
    letter-spacing: -0.02em;
    color: var(--ink);
  }

  .greet-emoji {
    font-size: 26px;
    display: inline-block;
    animation: emojiSway 2.4s ease-in-out infinite;
    transform-origin: 70% 70%;
  }

  .time-text {
    margin: 10px 0 0;
    color: var(--ink-soft);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }

  .badge-row {
    margin-top: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .mil-tag {
    display: inline-flex;
    align-items: center;
    padding: 9px 13px;
    border-radius: 6px;
    border: 1px solid rgba(201, 162, 39, 0.28);
    background: linear-gradient(135deg, rgba(201, 162, 39, 0.12), rgba(201, 162, 39, 0.03));
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .mil-tag:hover {
    transform: translateY(-2px);
    border-color: rgba(201, 162, 39, 0.55);
  }

  .mil-tag-alt {
    border-color: rgba(122, 59, 59, 0.4);
    background: linear-gradient(135deg, rgba(122, 59, 59, 0.18), rgba(122, 59, 59, 0.04));
  }

  .mil-tag-alt:hover {
    border-color: rgba(122, 59, 59, 0.6);
  }

  /* ===== LIVE INDICATOR ===== */
  .live-block {
    margin-bottom: 20px;
    padding: 16px 18px;
    border-radius: 12px;
    background: rgba(78, 205, 196, 0.08);
    border: 1px solid rgba(78, 205, 196, 0.15);
    transition: all 0.3s ease;
  }

  .live-indicator {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .live-indicator.next {
    background: rgba(69, 183, 209, 0.06);
    border-color: rgba(69, 183, 209, 0.12);
  }

  .live-indicator.done {
    background: rgba(255, 234, 167, 0.06);
    border-color: rgba(255, 234, 167, 0.12);
  }

  .live-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #4ECDC4;
    flex-shrink: 0;
    margin-top: 4px;
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  .live-dot.next-dot {
    background: #45B7D1;
    animation: none;
  }

  .live-dot.done-dot {
    background: #FFEAA7;
    animation: none;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .live-content {
    flex: 1;
  }

  .live-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-soft);
    margin-bottom: 2px;
  }

  .live-mapel {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    font-family: 'Fraunces', serif;
  }

  .live-time {
    font-size: 13px;
    color: var(--ink-mute);
    margin-top: 2px;
  }

  .live-countdown {
    font-size: 12px;
    color: var(--ink-soft);
    margin-top: 4px;
  }

  .countdown-number {
    color: #4ECDC4;
    font-weight: 700;
    font-size: 15px;
    font-family: 'JetBrains Mono', monospace;
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-block {
    padding: 16px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
    transition: transform 0.25s ease, border-color 0.25s ease;
  }

  .stat-block:hover {
    transform: translateY(-3px);
    border-color: rgba(201, 162, 39, 0.3);
  }

  .stat-value {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 25px;
    line-height: 1.1;
    color: var(--brass-bright);
    font-variant-numeric: tabular-nums;
  }

  .stat-label {
    margin-top: 5px;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink-mute);
  }

  .hairline {
    height: 1px;
    margin: 2px 0 20px;
    background: linear-gradient(90deg, rgba(201,162,39,0.35), rgba(201,162,39,0.03));
    transform: scaleX(0);
    transform-origin: left;
    animation: growLine 0.7s ease-out both;
    animation-delay: var(--delay, 0s);
  }

  .nav-row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid rgba(201, 162, 39, 0.2);
    background: transparent;
    color: var(--ink-soft);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Space Grotesk', sans-serif;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .nav-btn:hover {
    background: rgba(201, 162, 39, 0.1);
    border-color: var(--brass);
  }

  .nav-btn.active {
    background: var(--brass);
    color: #17130F;
    border-color: var(--brass);
    font-weight: 600;
  }

  .tugas-btn {
    background: rgba(201, 162, 39, 0.12) !important;
    border-color: var(--brass) !important;
    color: var(--brass-bright) !important;
  }

  .tugas-btn:hover {
    background: rgba(201, 162, 39, 0.25) !important;
    transform: translateY(-2px);
  }

  .section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .section-kicker {
    margin: 0 0 3px;
    font-size: 10.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-mute);
    font-family: 'JetBrains Mono', monospace;
  }

  .section-title {
    margin: 0;
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 21px;
    color: var(--ink);
  }

  .count-badge {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid rgba(201, 162, 39, 0.4);
    display: grid;
    place-items: center;
    color: var(--brass-bright);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) both;
    animation-delay: 0.5s;
  }

  .entry-list {
    display: grid;
  }

  .entry-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.055);
    opacity: 0;
    animation: slideInEntry 0.45s ease-out both;
    animation-delay: var(--delay, 0s);
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .entry-item:last-child {
    border-bottom: none;
  }

  .entry-item:hover {
    background: rgba(255,255,255,0.028);
    transform: translateX(3px);
  }

  .entry-item:hover .icon-slot {
    transform: rotate(-8deg) scale(1.08);
    border-color: var(--accent);
  }

  .entry-item.active-item {
    background: rgba(78, 205, 196, 0.08);
    border-radius: 8px;
    padding-left: 8px;
    padding-right: 8px;
    border: 1px solid rgba(78, 205, 196, 0.2);
  }

  .entry-left {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
  }

  .hour-badge {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 13px;
    color: #17130F;
    background: linear-gradient(155deg, var(--accent), color-mix(in srgb, var(--accent) 65%, black));
    box-shadow: 0 4px 10px rgba(0,0,0,0.35);
    position: relative;
    overflow: hidden;
  }

  .hour-badge::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.45) 45%, transparent 70%);
    background-size: 220% 220%;
    background-position: -120% -120%;
    animation: sheen 4.5s ease-in-out infinite;
  }

  .mapel-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -0.01em;
    word-break: break-word;
  }

  .mapel-sub {
    margin-top: 3px;
    font-size: 11.5px;
    color: var(--ink-mute);
    font-family: 'JetBrains Mono', monospace;
  }

  .active-badge {
    color: #4ECDC4;
    font-weight: 600;
    font-size: 11px;
    margin-left: 6px;
  }

  .icon-slot {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    font-size: 15px;
    border-radius: 8px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.06);
    transition: transform 0.25s ease, border-color 0.25s ease;
  }

  .empty-block {
    padding: 32px 16px;
    text-align: center;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
    display: inline-block;
    animation: bounceIcon 1.8s ease-in-out infinite;
  }

  .empty-block h3 {
    margin: 0 0 8px;
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 21px;
    color: var(--ink);
  }

  .empty-block p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 13.5px;
    line-height: 1.6;
  }

  .footer-note {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 9px;
    color: var(--ink-mute);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
  }

  .dot {
    opacity: 0.5;
  }

  @keyframes settleJournal {
    from { opacity: 0; transform: translateY(18px) rotateX(4deg) scale(0.98); }
    to { opacity: 1; transform: translateY(0) rotateX(0) scale(1); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInEntry {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes growLine {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.5); }
    70% { transform: scale(1.12); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.35); opacity: 0.7; }
  }

  @keyframes emojiSway {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }

  @keyframes rivetGleam {
    0%, 100% { box-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    50% { box-shadow: 0 1px 2px rgba(0,0,0,0.5), 0 0 8px rgba(231,197,103,0.7); }
  }

  @keyframes bandSettle {
    0% { transform: rotate(-14deg) translateY(-6px); }
    60% { transform: rotate(5deg) translateY(0); }
    100% { transform: rotate(3deg) translateY(0); }
  }

  @keyframes sheen {
    0% { background-position: -120% -120%; }
    45%, 100% { background-position: 120% 120%; }
  }

  @keyframes driftMote {
    0% { transform: translate3d(0,0,0); opacity: 0; }
    15% { opacity: 0.8; }
    50% { transform: translate3d(3px, -22px, 0); opacity: 0.5; }
    85% { opacity: 0.3; }
    100% { transform: translate3d(-2px, -40px, 0); opacity: 0; }
  }

  @keyframes bounceIcon {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes pulseText {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }

  @media (max-width: 420px) {
    .page-content {
      padding: 26px 20px 20px;
    }

    .elastic-band {
      right: 30px;
    }

    .nav-btn {
      font-size: 11px;
      padding: 5px 10px;
    }

    .live-mapel {
      font-size: 16px;
    }

    .live-title {
      font-size: 12px;
    }
  }
`;