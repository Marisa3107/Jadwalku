'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [greetingEmoji, setGreetingEmoji] = useState('');
  const [currentTime, setCurrentTime] = useState('');

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

    fetch('/api/cron')
      .then((res) => res.json())
      .then((data) => {
        setJadwal(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => clearInterval(interval);
  }, []);

  const colors = [
    '#8B5CF6', '#06B6D4', '#3B82F6', '#10B981', '#F59E0B',
    '#EC4899', '#14B8A6', '#F97316', '#A855F7', '#22C55E',
  ];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="ui-shell">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="loading-wrap">
            <div className="loader-ring"></div>
            <p>Menyiapkan jadwal...</p>
          </div>
        </div>
      </>
    );
  }

  const isLibur = !jadwal?.jadwal || jadwal.jadwal.length === 0;
  const totalMapel = jadwal?.jadwal?.length || 0;
  const hari = jadwal?.hari?.charAt(0).toUpperCase() + jadwal?.hari?.slice(1) || '';

  const formatPekan = (pekan) => {
    if (!pekan) return 'PEKAN';
    const number = pekan.replace('pekan', '');
    return `PEKAN ${number.toUpperCase()}`;
  };

  return (
    <>
      <style>{styles}</style>

      <div className="ui-shell">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="orb orb-three" />
        <div className="grid-overlay" />
        <div className="stars-layer">
          {[...Array(18)].map((_, index) => (
            <span
              key={`star-big-${index}`}
              className="star star-big"
              style={{
                left: `${(index * 17 + 9) % 100}%`,
                top: `${(index * 11 + 7) % 100}%`,
                animationDelay: `${index * 0.6}s`,
                animationDuration: `${5 + (index % 4)}s`,
              }}
            />
          ))}
          {[...Array(28)].map((_, index) => (
            <span
              key={`star-small-${index}`}
              className="star star-small"
              style={{
                left: `${(index * 9 + 13) % 100}%`,
                top: `${(index * 13 + 3) % 100}%`,
                animationDelay: `${index * 0.35}s`,
                animationDuration: `${6 + (index % 5)}s`,
              }}
            />
          ))}
        </div>

        <div className="modern-card">
          <div className="top-row">
            <div className="status-pill">
              <span className="status-dot" />
              Jadwal aktif
            </div>
            <div className="mini-chip">v2.9</div>
          </div>

          <div className="header-block">
            <h1 className="greeting-title">
              {greeting} <span>{greetingEmoji}</span>
            </h1>
            <p className="time-text">{currentTime}</p>

            <div className="badge-row">
              <span className="info-badge primary-badge">📖 {formatPekan(jadwal?.pekan)}</span>
              <span className="info-badge secondary-badge">📅 {hari}</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📚</div>
              <div>
                <div className="stat-value">{totalMapel}</div>
                <div className="stat-label">Mata Pelajaran</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">{isLibur ? '🎉' : '🏫'}</div>
              <div>
                <div className="stat-value">{isLibur ? 'Libur' : 'Sekolah'}</div>
                <div className="stat-label">Status Hari</div>
              </div>
            </div>
          </div>

          <div className="section-head">
            <div>
              <p className="section-kicker">Daftar pelajaran</p>
              <h2 className="section-title">Jadwal hari ini</h2>
            </div>
            <span className="count-chip">{totalMapel} mapel</span>
          </div>

          {isLibur ? (
            <div className="empty-card">
              <div className="empty-emoji">🎉</div>
              <h3>Libur!</h3>
              <p>Tidak ada jadwal hari ini. Istirahat dulu!</p>
            </div>
          ) : (
            <div className="lesson-list">
              {jadwal?.jadwal?.map((mapel, index) => {
                const jam = 7 + index;
                const color = colors[index % colors.length];
                return (
                  <div
                    key={index}
                    className="lesson-item"
                    style={{
                      '--accent': color,
                      '--accent-soft': `${color}22`,
                    }}
                  >
                    <div className="lesson-left">
                      <div className="lesson-hour">{jam}</div>
                      <div>
                        <div className="lesson-name">{mapel}</div>
                        <div className="lesson-subtitle">Sesi {index + 1}</div>
                      </div>
                    </div>

                    <div className="lesson-right">
                      {['📐', '🔬', '📖', '✏️', '🧮', '🎨', '🏃', '💻', '📝', '🌍'][index % 10]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="footer-row">
            <span>⏰ 05:30</span>
            <span className="divider-dot" />
            <span>🤖 Telegram</span>
            <span className="divider-dot" />
            <span>✨ Modern UI</span>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background:
      radial-gradient(circle at top, rgba(59, 130, 246, 0.14), transparent 30%),
      linear-gradient(160deg, #020617 0%, #0f172a 45%, #111827 100%);
    color: #f8fafc;
    overflow-x: hidden;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .ui-shell {
    position: relative;
    min-height: 100vh;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at center, black 25%, transparent 85%);
    opacity: 0.25;
    pointer-events: none;
  }

  .stars-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .star {
    position: absolute;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
    animation-name: twinkleFloat;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  .star::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,0.45), transparent 70%);
    opacity: 0.65;
  }

  .star-big {
    width: 3px;
    height: 3px;
  }

  .star-small {
    width: 2px;
    height: 2px;
    opacity: 0.75;
  }

  .orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(90px);
    pointer-events: none;
    opacity: 0.55;
  }

  .orb-one {
    width: 220px;
    height: 220px;
    background: rgba(139, 92, 246, 0.28);
    top: 4%;
    left: -60px;
  }

  .orb-two {
    width: 260px;
    height: 260px;
    background: rgba(6, 182, 212, 0.22);
    bottom: 4%;
    right: -90px;
  }

  .orb-three {
    width: 180px;
    height: 180px;
    background: rgba(236, 72, 153, 0.15);
    top: 24%;
    right: 16%;
  }

  .modern-card,
  .loading-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 430px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.62));
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 24px 80px rgba(2, 6, 23, 0.55),
      inset 0 1px 0 rgba(255,255,255,0.06);
  }

  .modern-card {
    padding: 22px;
    animation: fadeUp 0.65s ease-out;
  }

  .loading-wrap {
    padding: 34px 24px;
    text-align: center;
  }

  .loader-ring {
    width: 58px;
    height: 58px;
    border: 4px solid rgba(255,255,255,0.08);
    border-top: 4px solid #38bdf8;
    border-radius: 50%;
    margin: 0 auto 18px;
    animation: spin 1s linear infinite;
  }

  .loading-wrap p {
    margin: 0;
    color: rgba(255,255,255,0.7);
    font-size: 14px;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .status-pill,
  .mini-chip,
  .info-badge,
  .count-chip {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #cbd5e1;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
    animation: pulse 1.8s infinite;
  }

  .mini-chip {
    padding: 9px 12px;
    border-radius: 14px;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
  }

  .header-block {
    padding-bottom: 18px;
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .greeting-title {
    margin: 0;
    font-size: clamp(28px, 7vw, 36px);
    line-height: 1.06;
    letter-spacing: -0.05em;
    color: #ffffff;
    text-shadow: 0 8px 30px rgba(59, 130, 246, 0.18);
    animation: softGlow 4.5s ease-in-out infinite;
  }

  .time-text {
    margin: 8px 0 0;
    color: rgba(226, 232, 240, 0.65);
    font-size: 13px;
    line-height: 1.5;
  }

  .badge-row {
    margin-top: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .info-badge {
    display: inline-flex;
    align-items: center;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #e2e8f0;
  }

  .primary-badge {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(59, 130, 246, 0.12));
  }

  .secondary-badge {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(16, 185, 129, 0.12));
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 22px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
    transition: transform 0.25s ease, border-color 0.25s ease;
  }

  .stat-box:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.14);
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    font-size: 20px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(56, 189, 248, 0.16));
  }

  .stat-value {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  .stat-label {
    margin-top: 4px;
    font-size: 12px;
    color: #94a3b8;
  }

  .section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .section-kicker {
    margin: 0 0 4px;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .section-title {
    margin: 0;
    font-size: 19px;
    letter-spacing: -0.03em;
    color: #ffffff;
  }

  .count-chip {
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #cbd5e1;
    white-space: nowrap;
  }

  .lesson-list {
    display: grid;
    gap: 10px;
  }

  .lesson-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px;
    border-radius: 22px;
    background:
      linear-gradient(90deg, var(--accent-soft), transparent 34%),
      rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
  }

  .lesson-item:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    box-shadow: 0 18px 32px rgba(15, 23, 42, 0.22);
  }

  .lesson-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .lesson-hour {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, var(--accent), rgba(255,255,255,0.18));
    color: #ffffff;
    font-weight: 800;
    flex-shrink: 0;
    box-shadow: 0 12px 24px rgba(0,0,0,0.2);
  }

  .lesson-name {
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
    word-break: break-word;
  }

  .lesson-subtitle {
    margin-top: 4px;
    color: #94a3b8;
    font-size: 12px;
  }

  .lesson-right {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    font-size: 18px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .empty-card {
    padding: 28px 18px;
    border-radius: 24px;
    text-align: center;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .empty-emoji {
    width: 70px;
    height: 70px;
    margin: 0 auto 14px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    font-size: 30px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(6, 182, 212, 0.18));
  }

  .empty-card h3 {
    margin: 0 0 8px;
    font-size: 20px;
    color: #ffffff;
  }

  .empty-card p {
    margin: 0;
    color: rgba(226, 232, 240, 0.68);
    font-size: 14px;
    line-height: 1.6;
  }

  .footer-row {
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    color: #64748b;
    font-size: 12px;
  }

  .divider-dot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.35);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.84;
    }
  }

  @keyframes twinkleFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(0.8);
      opacity: 0.2;
    }
    25% {
      transform: translate3d(6px, -10px, 0) scale(1);
      opacity: 0.75;
    }
    50% {
      transform: translate3d(-4px, -18px, 0) scale(1.25);
      opacity: 1;
    }
    75% {
      transform: translate3d(5px, -8px, 0) scale(0.95);
      opacity: 0.55;
    }
  }

  @keyframes softGlow {
    0%, 100% {
      text-shadow: 0 8px 30px rgba(59, 130, 246, 0.18);
    }
    50% {
      text-shadow:
        0 10px 36px rgba(56, 189, 248, 0.24),
        0 0 18px rgba(139, 92, 246, 0.16);
    }
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 520px) {
    .modern-card {
      padding: 18px;
      border-radius: 26px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .lesson-item {
      padding: 13px;
    }
  }
`;
