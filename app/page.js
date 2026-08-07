'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
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
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
    };

    const hour = new Date().getHours();
    if (hour < 5) setGreeting('🌙 Selamat Malam');
    else if (hour < 12) setGreeting('🌅 Selamat Pagi');
    else if (hour < 15) setGreeting('☀️ Selamat Siang');
    else if (hour < 19) setGreeting('🌇 Selamat Sore');
    else setGreeting('🌙 Selamat Malam');

    updateTime();
    const interval = setInterval(updateTime, 60000);

    fetch('/api/cron')
      .then(res => res.json())
      .then(data => {
        setJadwal(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => clearInterval(interval);
  }, []);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0,0,0,0.1)',
            borderTop: '4px solid #4ECDC4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#555' }}>⏳ Menyiapkan jadwal...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const isLibur = !jadwal?.jadwal || jadwal.jadwal.length === 0;
  const totalMapel = jadwal?.jadwal?.length || 0;
  const hari = jadwal?.hari?.charAt(0).toUpperCase() + jadwal?.hari?.slice(1) || '';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ===== BUBBLE ANIMASI (kayak referensi) ===== */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(12)].map((_, i) => {
          const size = 40 + Math.random() * 120;
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = 15 + Math.random() * 20;
          return (
            <div key={i} style={{
              position: 'absolute',
              bottom: '-100px',
              left: left + '%',
              width: size + 'px',
              height: size + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)`,
              animation: `bubbleUp ${duration}s ease-in infinite`,
              animationDelay: delay + 's',
              opacity: 0.3 + Math.random() * 0.4,
            }}></div>
          );
        })}
        <style>{`
          @keyframes bubbleUp {
            0% { transform: translateY(0) scale(0.8); opacity: 0.6; }
            50% { opacity: 0.4; }
            100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
          }
        `}</style>
      </div>

      {/* ===== CARD UTAMA (Glassmorphism) ===== */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '28px 24px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.4)',
        animation: 'fadeUp 0.8s ease-out'
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* ===== HEADER ===== */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
            color: '#1a1a2e',
            letterSpacing: '-0.5px'
          }}>
            📚 {greeting} 👋
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6c6c8a',
            marginTop: '4px',
            fontWeight: '400'
          }}>
            {currentTime}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              padding: '4px 16px',
              background: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '0.3px'
            }}>
              📖 {jadwal?.pekan?.toUpperCase() || 'PEKAN'}
            </span>
            <span style={{
              padding: '4px 16px',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#1a1a2e'
            }}>
              📅 {hari}
            </span>
          </div>
        </div>

        {/* ===== GRID INFO (kayak streak, target di referensi) ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '14px',
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.6)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px' }}>📚</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
              {totalMapel}
            </div>
            <div style={{ fontSize: '10px', color: '#6c6c8a' }}>Mata Pelajaran</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '14px',
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.6)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px' }}>⏰</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
              {isLibur ? 'Libur' : 'Sekolah'}
            </div>
            <div style={{ fontSize: '10px', color: '#6c6c8a' }}>Status Hari</div>
          </div>
        </div>

        {/* ===== DAFTAR PELAJARAN ===== */}
        {isLibur ? (
          <div style={{
            padding: '32px 20px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <span style={{ fontSize: '56px' }}>🎉</span>
            <h3 style={{
              color: '#1a1a2e',
              fontSize: '20px',
              margin: '12px 0 6px',
              fontWeight: '600'
            }}>
              Libur!
            </h3>
            <p style={{
              color: '#6c6c8a',
              margin: 0,
              fontSize: '14px'
            }}>
              Tidak ada jadwal hari ini. Istirahat dulu! ✨
            </p>
          </div>
        ) : (
          <div>
            {jadwal?.jadwal?.map((mapel, index) => {
              const jam = 7 + index;
              const color = colors[index % colors.length];
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '14px',
                  borderLeft: `4px solid ${color}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    background: color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginRight: '14px',
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${color}40`
                  }}>
                    {jam}
                  </div>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#1a1a2e',
                    flex: 1
                  }}>
                    {mapel}
                  </span>
                  <span style={{
                    fontSize: '18px',
                    opacity: 0.4
                  }}>
                    {['📐','🔬','📖','✏️','🧮','🎨','🏃','💻','📝','🌍'][index % 10]}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '11px',
            color: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ⏰ 05:20
          </span>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.15)'
          }}></span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🤖 Telegram
          </span>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.15)'
          }}></span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ✨ v2.0
          </span>
        </div>
      </div>
    </div>
  );
}