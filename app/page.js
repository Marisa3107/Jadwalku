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
        background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#fff' }}>⏳ Menyiapkan jadwal...</p>
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
      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 40%, #45B7D1 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ===== BUBBLE ANIMASI (30 BUBBLE, JELAS!) ===== */}
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
        {[...Array(30)].map((_, i) => {
          const size = 30 + Math.random() * 150;
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = 12 + Math.random() * 18;
          const bubbleColors = [
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,0.5)',
            'rgba(255,255,255,0.7)',
            'rgba(255,255,255,0.4)',
          ];
          return (
            <div key={i} style={{
              position: 'absolute',
              bottom: '-80px',
              left: left + '%',
              width: size + 'px',
              height: size + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, ${bubbleColors[i % bubbleColors.length]} 50%, rgba(255,255,255,0) 80%)`,
              animation: `bubbleFloat ${duration}s ease-in-out infinite`,
              animationDelay: delay + 's',
              opacity: 0.6 + Math.random() * 0.4,
              boxShadow: 'inset -5px -5px 20px rgba(0,0,0,0.1), inset 5px 5px 20px rgba(255,255,255,0.3)',
            }}></div>
          );
        })}
        <style>{`
          @keyframes bubbleFloat {
            0% { 
              transform: translateY(0) scale(0.5) rotate(0deg); 
              opacity: 0.8; 
            }
            50% { 
              opacity: 0.5; 
              transform: translateY(-55vh) scale(1.1) rotate(15deg); 
            }
            100% { 
              transform: translateY(-110vh) scale(1.4) rotate(-10deg); 
              opacity: 0; 
            }
          }
        `}</style>
      </div>

      {/* ===== CARD UTAMA (GLASSMORPHISM) ===== */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '32px',
        padding: '32px 28px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.25)',
        animation: 'fadeUp 0.8s ease-out'
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* ===== HEADER ===== */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: 0,
            color: '#FFFFFF',
            textShadow: '0 2px 20px rgba(0,0,0,0.15)',
            letterSpacing: '-0.5px'
          }}>
            {greeting} 👋
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '4px',
            fontWeight: '400'
          }}>
            {currentTime}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '14px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              padding: '6px 20px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '0.3px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              📖 {jadwal?.pekan?.toUpperCase() || 'PEKAN'}
            </span>
            <span style={{
              padding: '6px 20px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '0.3px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              📅 {hari}
            </span>
          </div>
        </div>

        {/* ===== GRID INFO ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '18px',
            padding: '16px 12px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px' }}>📚</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#FFFFFF' }}>
              {totalMapel}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
              Mata Pelajaran
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '18px',
            padding: '16px 12px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px' }}>{isLibur ? '🎉' : '📖'}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#FFFFFF' }}>
              {isLibur ? 'Libur' : 'Sekolah'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
              Status Hari
            </div>
          </div>
        </div>

        {/* ===== JUDUL DAFTAR PELAJARAN ===== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          padding: '0 4px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            📋 Daftar Pelajaran
          </span>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)'
          }}>
            {totalMapel} mapel
          </span>
        </div>

        {/* ===== DAFTAR PELAJARAN ===== */}
        {isLibur ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ fontSize: '64px' }}>🎉</span>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '22px',
              margin: '12px 0 6px',
              fontWeight: '600'
            }}>
              Libur!
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.4)',
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
                  padding: '14px 16px',
                  marginBottom: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '16px',
                  borderLeft: `5px solid ${color}`,
                  transition: 'all 0.3s ease',
                  border: `1px solid rgba(255,255,255,0.05)`
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    background: color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '700',
                    marginRight: '14px',
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${color}50`
                  }}>
                    {jam}
                  </div>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    flex: 1,
                    textShadow: '0 1px 8px rgba(0,0,0,0.1)'
                  }}>
                    {mapel}
                  </span>
                  <span style={{
                    fontSize: '22px',
                    opacity: 0.3
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
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '18px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
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
            background: 'rgba(255,255,255,0.15)'
          }}></span>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
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
            background: 'rgba(255,255,255,0.15)'
          }}></span>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ✨ v2.2
          </span>
        </div>
      </div>
    </div>
  );
}