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
        minute: '2-digit'
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
        width: '100vw',
        background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e, #0f3460)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
        margin: 0,
        padding: 0
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: '4px solid #4ECDC4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>⏳ Menyiapkan jadwal...</p>
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes bubbleFloat {
          0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0.2; }
          50% { opacity: 0.1; transform: translateY(-55vh) scale(1.1) rotate(10deg); }
          100% { transform: translateY(-110vh) scale(1.3) rotate(-5deg); opacity: 0; }
        }
        .card {
          animation: fadeSlideUp 0.7s ease-out forwards;
        }
        .item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .item:hover {
          transform: translateX(5px) scale(1.01);
          background: rgba(255,255,255,0.08) !important;
        }
        .badge-pekan {
          animation: pulse 2s ease-in-out infinite;
        }
        .greeting-glow {
          color: #ffffff;
          text-shadow: 
            0 0 20px rgba(78, 205, 196, 0.5),
            0 0 40px rgba(78, 205, 196, 0.2),
            0 0 80px rgba(69, 183, 209, 0.1);
          font-weight: 700;
          letter-spacing: -0.3px;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f3460 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
          {[...Array(80)].map((_, i) => {
            const size = 1 + Math.random() * 3;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = 2 + Math.random() * 6;
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
                opacity: 0.2 + Math.random() * 0.8,
                boxShadow: '0 0 10px rgba(255,255,255,0.2)',
              }}></div>
            );
          })}
        </div>

        {/* ===== BUBBLE ===== */}
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
          {[...Array(15)].map((_, i) => {
            const size = 60 + Math.random() * 150;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 15 + Math.random() * 25;
            return (
              <div key={i} style={{
                position: 'absolute',
                bottom: '-120px',
                left: left + '%',
                width: size + 'px',
                height: size + 'px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, rgba(78, 205, 196, 0.08) 0%, rgba(69, 183, 209, 0.04) 60%, transparent 80%)`,
                animation: `bubbleFloat ${duration}s ease-in-out infinite`,
                animationDelay: delay + 's',
                opacity: 0.3,
                border: '1px solid rgba(78, 205, 196, 0.03)',
              }}></div>
            );
          })}
        </div>

        {/* ===== CARD ===== */}
        <div className="card" style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px',
          padding: '28px 24px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* ===== HEADER ===== */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.04)'
          }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '700',
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.3px'
            }}>
              <span className="greeting-glow">{greeting}</span> {greetingEmoji}
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '4px',
              fontWeight: '400',
              letterSpacing: '0.2px'
            }}>
              {currentTime}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '12px',
              flexWrap: 'wrap'
            }}>
              <span className="badge-pekan" style={{
                padding: '4px 14px',
                background: 'rgba(78, 205, 196, 0.15)',
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#4ECDC4',
                letterSpacing: '0.3px',
                border: '1px solid rgba(78, 205, 196, 0.1)'
              }}>
                📖 {jadwal?.pekan?.toUpperCase() || 'PEKAN'}
              </span>
              <span className="badge-pekan" style={{
                padding: '4px 14px',
                background: 'rgba(69, 183, 209, 0.15)',
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#45B7D1',
                letterSpacing: '0.3px',
                border: '1px solid rgba(69, 183, 209, 0.1)'
              }}>
                📅 {hari}
              </span>
            </div>
          </div>

          {/* ===== GRID INFO (ANIMASI DIHAPUS!) ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '14px',
              padding: '10px 8px',
              border: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>📚</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}>
                {totalMapel}
              </div>
              <div style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: '500',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}>
                Mata Pelajaran
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '14px',
              padding: '10px 8px',
              border: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>{isLibur ? '🎉' : '📖'}</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}>
                {isLibur ? 'Libur' : 'Sekolah'}
              </div>
              <div style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: '500',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}>
                Status Hari
              </div>
            </div>
          </div>

          {/* ===== DAFTAR PELAJARAN ===== */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 2px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              📋 Daftar Pelajaran
            </span>
            <span style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.15)',
              fontWeight: '400'
            }}>
              {totalMapel} mapel
            </span>
          </div>

          {isLibur ? (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <span style={{ fontSize: '48px' }}>🎉</span>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                margin: '8px 0 4px',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.2px'
              }}>
                Libur!
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.2)',
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
                  <div
                    key={index}
                    className="item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      marginBottom: '6px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${color}`,
                      border: `1px solid rgba(255,255,255,0.03)`,
                    }}
                  >
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
                      fontWeight: '700',
                      marginRight: '12px',
                      flexShrink: 0,
                      boxShadow: `0 2px 12px ${color}20`,
                    }}>
                      {jam}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#FFFFFF',
                      flex: 1,
                      textShadow: '0 1px 8px rgba(0,0,0,0.1)',
                      letterSpacing: '-0.1px'
                    }}>
                      {mapel}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      opacity: 0.15,
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
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '400',
              letterSpacing: '0.3px'
            }}>
              ⏰ 05:20
            </span>
            <span style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)'
            }}></span>
            <span style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '400',
              letterSpacing: '0.3px'
            }}>
              🤖 Telegram
            </span>
            <span style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)'
            }}></span>
            <span style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '400',
              letterSpacing: '0.3px'
            }}>
              ✨ v2.8
            </span>
          </div>
        </div>
      </div>
    </>
  );
}