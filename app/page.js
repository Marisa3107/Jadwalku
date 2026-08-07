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
      {/* ===== BUBBLE ANIMASI (BANYAK & JELAS!) ===== */}
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
          const size = 50 + Math.random() * 180;
          const left = Math.random() * 100;
          const delay = Math.random() * 12;
          const duration = 18 + Math.random() * 25;
          const colors = [
            'rgba(78, 205, 196, 0.25)',
            'rgba(69, 183, 209, 0.2)',
            'rgba(255, 107, 107, 0.2)',
            'rgba(255, 234, 167, 0.25)',
            'rgba(187, 143, 206, 0.2)',
            'rgba(150, 206, 180, 0.2)',
          ];
          return (
            <div key={i} style={{
              position: 'absolute',
              bottom: '-150px',
              left: left + '%',
              width: size + 'px',
              height: size + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors[i % colors.length]} 0%, rgba(255,255,255,0) 80%)`,
              animation: `bubbleUp ${duration}s ease-in-out infinite`,
              animationDelay: delay + 's',
              opacity: 0.5 + Math.random() * 0.5,
              transform: `scale(${0.8 + Math.random() * 0.6})`,
            }}></div>
          );
        })}
        <style>{`
          @keyframes bubbleUp {
            0% { 
              transform: translateY(0) scale(0.6) rotate(0deg); 
              opacity: 0.7; 
            }
            50% { 
              opacity: 0.4; 
              transform: translateY(-55vh) scale(1) rotate(10deg); 
            }
            100% { 
              transform: translateY(-110vh) scale(1.3) rotate(-5deg); 
              opacity: 0; 
            }
          }
        `}</style>
      </div>

      {/* ===== CARD UTAMA ===== */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '32px',
        padding: '28px 24px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.5)',
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
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: 0,
            color: '#1a1a2e',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #4ECDC4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {greeting} 👋
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
              padding: '5px 18px',
              background: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '0.3px',
              boxShadow: '0 4px 16px rgba(78,205,196,0.3)'
            }}>
              📖 {jadwal?.pekan?.toUpperCase() || 'PEKAN'}
            </span>
            <span style={{
              padding: '5px 18px',
              background: 'rgba(0,0,0,0.06)',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#1a1a2e'
            }}>
              📅 {hari}
            </span>
          </div>
        </div>

        {/* ===== GRID INFO ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '16px',
            padding: '14px 12px',
            border: '1px solid rgba(255,255,255,0.8)',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '24px' }}>📚</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>
              {totalMapel}
            </div>
            <div style={{ fontSize: '11px', color: '#6c6c8a', fontWeight: '500' }}>Mata Pelajaran</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '16px',
            padding: '14px 12px',
            border: '1px solid rgba(255,255,255,0.8)',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '24px' }}>{isLibur ? '🎉' : '📖'}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>
              {isLibur ? 'Libur' : 'Sekolah'}
            </div>
            <div style={{ fontSize: '11px', color: '#6c6c8a', fontWeight: '500' }}>Status Hari</div>
          </div>
        </div>

        {/* ===== DAFTAR PELAJARAN ===== */}
        {isLibur ? (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <span style={{ fontSize: '60px' }}>🎉</span>
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
                  padding: '13px 16px',
                  marginBottom: '8px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '14px',
                  borderLeft: `5px solid ${color}`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: color,
                    borderRadius: '12px',
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
                    fontSize: '20px',
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
            color: 'rgba(0,0,0,0.25)',
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
            color: 'rgba(0,0,0,0.25)',
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
            color: 'rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ✨ v2.1
          </span>
        </div>
      </div>
    </div>
  );
}