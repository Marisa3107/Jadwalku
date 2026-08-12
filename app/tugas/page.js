'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TugasPage() {
  const [tugas, setTugas] = useState([]);
  const [tugasInput, setTugasInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchTugas = () => {
    fetch('/api/tugas')
      .then((res) => res.json())
      .then((data) => setTugas(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const tambahTugas = async () => {
    if (!tugasInput.trim()) return;
    await fetch('/api/tugas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: tugasInput, deadline: deadlineInput })
    });
    setTugasInput('');
    setDeadlineInput('');
    setShowForm(false);
    fetchTugas();
  };

  const toggleSelesai = async (id, selesai) => {
    await fetch('/api/tugas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selesai: !selesai })
    });
    fetchTugas();
  };

  const hapusTugas = async (id) => {
    await fetch('/api/tugas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchTugas();
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
            <div className="nav-top">
              <Link href="/" className="nav-back">
                ← Kembali
              </Link>
              <span className="nav-title">📋 Tugas & PR</span>
              <span></span>
            </div>

            <div className="header-block">
              <h1 className="greeting-title">📋 Daftar Tugas</h1>
              <p className="time-text">Catat semua tugas dan deadline di sini</p>
            </div>

            <button className="btn-tambah-utama" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Tutup Form' : '+ Tambah Tugas Baru'}
            </button>

            {showForm && (
              <div className="tugas-form">
                <input
                  type="text"
                  className="tugas-input"
                  placeholder="Nama tugas..."
                  value={tugasInput}
                  onChange={(e) => setTugasInput(e.target.value)}
                />
                <input
                  type="date"
                  className="tugas-deadline"
                  value={deadlineInput}
                  onChange={(e) => setDeadlineInput(e.target.value)}
                />
                <button className="btn-simpan-tugas" onClick={tambahTugas}>
                  ✅ Simpan
                </button>
              </div>
            )}

            <div className="tugas-list">
              {tugas.length === 0 ? (
                <div className="empty-block">
                  <div className="empty-icon">🎉</div>
                  <h3>Belum Ada Tugas!</h3>
                  <p>Santai dulu, belum ada tugas yang tercatat.</p>
                </div>
              ) : (
                tugas.map((item) => (
                  <div key={item.id} className={`tugas-item ${item.selesai ? 'selesai' : ''}`}>
                    <div className="tugas-kiri">
                      <button
                        className="btn-centang"
                        onClick={() => toggleSelesai(item.id, item.selesai)}
                      >
                        {item.selesai ? '✅' : '⬜'}
                      </button>
                      <div>
                        <div className="tugas-text">{item.text}</div>
                        {item.deadline && (
                          <div className="tugas-deadline-text">
                            🗓️ Tenggat: {new Date(item.deadline).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="btn-hapus-tugas" onClick={() => hapusTugas(item.id)}>
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="stats-tugas">
              <span>Total: {tugas.length} tugas</span>
              <span>•</span>
              <span>Selesai: {tugas.filter(t => t.selesai).length}</span>
              <span>•</span>
              <span>Belum: {tugas.filter(t => !t.selesai).length}</span>
            </div>

            <div className="footer-note">
              <span>📋 Tugas tersimpan otomatis</span>
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

  .journal-page {
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

  .page-content {
    padding: 30px 26px 24px;
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

  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .nav-back {
    color: var(--brass-bright);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .nav-back:hover {
    transform: translateX(-3px);
    opacity: 0.8;
  }

  .nav-title {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
  }

  .header-block {
    margin-bottom: 20px;
  }

  .greeting-title {
    margin: 0;
    font-family: 'Fraunces', serif;
    font-weight: 800;
    font-size: 28px;
    color: var(--ink);
  }

  .time-text {
    margin: 6px 0 0;
    color: var(--ink-soft);
    font-size: 13px;
  }

  .btn-tambah-utama {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 2px dashed rgba(201, 162, 39, 0.3);
    background: transparent;
    color: var(--brass-bright);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Space Grotesk', sans-serif;
    margin-bottom: 16px;
  }

  .btn-tambah-utama:hover {
    border-color: var(--brass);
    background: rgba(201, 162, 39, 0.05);
  }

  .tugas-form {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    padding: 14px;
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
  }

  .tugas-input {
    flex: 1;
    min-width: 140px;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.06);
    color: var(--ink);
    font-size: 14px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .tugas-input:focus {
    outline: none;
    border-color: var(--brass);
  }

  .tugas-deadline {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.06);
    color: var(--ink);
    font-size: 14px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .tugas-deadline:focus {
    outline: none;
    border-color: var(--brass);
  }

  .btn-simpan-tugas {
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    background: var(--brass);
    color: #17130F;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Space Grotesk', sans-serif;
  }

  .btn-simpan-tugas:hover {
    transform: scale(1.03);
  }

  .tugas-list {
    display: grid;
    gap: 8px;
    margin-top: 8px;
  }

  .tugas-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border-left: 3px solid rgba(201, 162, 39, 0.3);
    transition: all 0.2s ease;
  }

  .tugas-item.selesai {
    opacity: 0.5;
    border-left-color: #4ECDC4;
  }

  .tugas-item.selesai .tugas-text {
    text-decoration: line-through;
    color: var(--ink-mute);
  }

  .tugas-kiri {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .btn-centang {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .btn-centang:hover {
    transform: scale(1.15);
  }

  .tugas-text {
    font-size: 15px;
    color: var(--ink);
    font-weight: 500;
  }

  .tugas-deadline-text {
    font-size: 11.5px;
    color: var(--ink-mute);
    margin-top: 3px;
  }

  .btn-hapus-tugas {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    opacity: 0.3;
    transition: all 0.2s ease;
    padding: 0;
  }

  .btn-hapus-tugas:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .empty-block {
    padding: 40px 16px;
    text-align: center;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    display: inline-block;
  }

  .empty-block h3 {
    margin: 0 0 8px;
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 20px;
    color: var(--ink);
  }

  .empty-block p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 14px;
  }

  .stats-tugas {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: center;
    gap: 12px;
    font-size: 13px;
    color: var(--ink-mute);
  }

  .footer-note {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: center;
    color: var(--ink-mute);
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
  }

  @keyframes settleJournal {
    from { opacity: 0; transform: translateY(18px) rotateX(4deg) scale(0.98); }
    to { opacity: 1; transform: translateY(0) rotateX(0) scale(1); }
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

  @keyframes driftMote {
    0% { transform: translate3d(0,0,0); opacity: 0; }
    15% { opacity: 0.8; }
    50% { transform: translate3d(3px, -22px, 0); opacity: 0.5; }
    85% { opacity: 0.3; }
    100% { transform: translate3d(-2px, -40px, 0); opacity: 0; }
  }

  @media (max-width: 420px) {
    .page-content {
      padding: 26px 20px 20px;
    }
    .elastic-band {
      right: 30px;
    }
    .nav-title {
      font-size: 15px;
    }
  }
`;