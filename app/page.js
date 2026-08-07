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
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid #4ECDC4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ Menyiapkan jadwal...</p>
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
      width: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      {/* ===== BINTANG MELAYANG ===== */}
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
        {[...Array(60)].map((_, i) => {
          const size = 1.5 + Math.random() * 3;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 8;
          const duration = 3 + Math.random() * 5;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: left + '%',
              top: top + '%',
              width: size + 'px',
              height: size + 'px',
              background: '#fff',
              borderRadius: '50%',
              animation: `twinkle ${duration}s ease-in-out infinite`,
              animationDelay: delay + 's',
              opacity: 0.3 + Math.random() * 0.7,
              boxShadow: '0 0 6px rgba(255,255,255,0.3)',
            }}></div>
          );
        })}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>

      {/* ===== BUBBLE ANIMASI (GELEMBUNG) ===== */}
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
        {[...Array(20)].map((_, i) => {
          const size = 40 + Math.random() * 120;
          const left = Math.random() * 100;
          const delay = Math.random() * 12;
          const duration = 14 + Math.random() * 20;
          return (
            <div key={i} style={{
              position: 'absolute',
              bottom: '-100px',
              left: left + '%',
              width: size + 'px',
              height: size + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, rgba(78, 205, 196, 0.15) 0%, rgba(69, 183, 209, 0.05) 60%, rgba(255,255,255,0) 80%)`,
              animation: `bubbleFloat ${duration}s ease-in-out infinite`,
              animationDelay: delay + 's',
              opacity: 0.3 + Math.random() * 0.3,
              border: '1px solid rgba(78, 205, 196, 0.05)',
            }}></div>
          );
        })}
        <style>{`
          @keyframes bubbleFloat {
            0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0.4; }
            50% { opacity: 0.2; transform: translateY(-55vh) scale(1.1) rotate(10deg); }
            100% { transform: translateY(-110vh) scale(1.3) rotate(-5deg); opacity: 0; }
          }
        `}</style>
      </div>

      {/* ===== CARD UTAMA ===== */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '28px',
        padding: '24px 20px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'fadeUp 0.8s ease-out'
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* ===== HEADER ===== */}
        <div style={{
          textAlign: 'center',
          marginBottom: '18px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '600',
            margin: 0,
            color: '#FFFFFF',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            letterSpacing: '-0.3px'
          }}>
            {greeting} 👋
          </h1>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '2px',
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
              padding: '4px 14px',
              background: 'rgba(78, 205, 196, 0.2)',
              borderRadius: '50px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#4ECDC4',
              letterSpacing: '0.3px',
              border: '1px solid rgba(78, 205, 196, 0.15)'
            }}>
              📖 {jadwal?.pekan?.toUpperCase() || 'PEKAN'}
            </span>
            <span style={{
              padding: '4px 14px',
              background: 'rgba(69, 183, 209, 0.2)',
              borderRadius: '50px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#45B7D1',
              letterSpacing: '0.3px',
              border: '1px solid rgba(69, 183, 209, 0.15)'
            }}>
              📅 {hari}
            </span>
          </div>
        </div>

        {/* ===== GRID INFO (DIPERKECIL UNTUK HP) ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '18px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '12px 8px',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px' }}>📚</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#FFFFFF' }}>
              {totalMapel}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>
              Mata Pelajaran
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '12px 8px',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px' }}>{isLibur ? '🎉' : '📖'}</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#FFFFFF' }}>
              {isLibur ? 'Libur' : 'Sekolah'}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>
              Status Hari
            </div>
          </div>
        </div>

        {/* ===== JUDUL DAFTAR PELAJARAN ===== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '0 2px'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            📋 Daftar Pelajaran
          </span>
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.2)'
          }}>
            {totalMapel} mapel
          </span>
        </div>

        {/* ===== DAFTAR PELAJARAN ===== */}
        {isLibur ? (
          <div style={{
            padding: '30px 16px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.03)'
          }}>
            <span style={{ fontSize: '48px' }}>🎉</span>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              margin: '8px 0 4px',
              fontWeight: '500'
            }}>
              Libur!
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
              fontSize: '12px'
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
                  padding: '10px 12px',
                  marginBottom: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  borderLeft: `3px solid ${color}`,
                  transition: 'all 0.2s ease',
                  border: `1px solid rgba(255,255,255,0.03)`
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    background: color,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginRight: '12px',
                    flexShrink: 0,
                    boxShadow: `0 2px 12px ${color}30`
                  }}>
                    {jam}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    flex: 1,
                    textShadow: '0 1px 8px rgba(0,0,0,0.1)'
                  }}>
                    {mapel}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    opacity: 0.2
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
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ⏰ 05:20
          </span>
          <span style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)'
          }}></span>
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            🤖 Telegram
          </span>
          <span style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)'
          }}></span>
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ✨ v2.3
          </span>
        </div>
      </div>
    </div>
  );
}