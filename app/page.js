'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update waktu real-time
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

    // Set greeting berdasarkan waktu
    const hour = new Date().getHours();
    if (hour < 5) setGreeting('🌙 Selamat Malam');
    else if (hour < 12) setGreeting('🌅 Selamat Pagi');
    else if (hour < 15) setGreeting('☀️ Selamat Siang');
    else if (hour < 19) setGreeting('🌇 Selamat Sore');
    else setGreeting('🌙 Selamat Malam');

    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Ambil data jadwal
    fetch('/api/cron')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data');
        return res.json();
      })
      .then(data => {
        setJadwal(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });

    return () => clearInterval(interval);
  }, []);

  // Warna-warna aesthetic buat tiap pelajaran
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#73C6B6', '#7FB3D8', '#D2B4DE'
  ];

  // Fungsi buat dapetin emoji random buat pelajaran
  const getEmoji = (index) => {
    const emojis = ['📐', '🔬', '🧪', '📖', '✏️', '📝', '🧮', '🌍', '🎨', '🏃', '🎵', '💻'];
    return emojis[index % emojis.length];
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <p style={{ color: '#fff', fontSize: '16px' }}>⏳ Memuat jadwal...</p>
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

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <span style={{ fontSize: '50px' }}>😅</span>
          <h2 style={{ color: '#e74c3c' }}>Oops! Ada masalah</h2>
          <p style={{ color: '#7f8c8d' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#667eea',
              color: '#fff',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '50px',
              cursor: 'pointer',
              marginTop: '15px',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🔄 Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const isLibur = !jadwal?.jadwal || jadwal.jadwal.length === 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        zIndex: 0
      }}></div>

      {/* Container utama */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {/* Header dengan greeting & waktu */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          padding: '25px 30px',
          marginBottom: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            margin: 0,
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            {greeting} 👋
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#7f8c8d',
            marginTop: '5px',
            fontWeight: '500'
          }}>
            {currentTime}
          </p>
          <div style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '4px 16px',
            backgroundColor: jadwal?.pekan === 'pekan1' ? '#4ECDC4' : 
                           jadwal?.pekan === 'pekan2' ? '#45B7D1' : '#BB8FCE',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            📖 {jadwal?.pekan?.toUpperCase() || 'PEKAN'}
          </div>
        </div>

        {/* Card jadwal */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          padding: '25px 30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Hari */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '22px',
                color: '#2c3e50'
              }}>
                {jadwal?.hari?.charAt(0).toUpperCase() + jadwal?.hari?.slice(1)}
              </h2>
              <p style={{
                margin: '3px 0 0',
                fontSize: '12px',
                color: '#bdc3c7'
              }}>
                {isLibur ? '🎉 Libur!' : `${jadwal?.jadwal?.length || 0} mata pelajaran`}
              </p>
            </div>
            <span style={{
              fontSize: '40px',
              lineHeight: 1
            }}>
              {isLibur ? '🎉' : '📚'}
            </span>
          </div>

          {/* Daftar pelajaran */}
          {isLibur ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'linear-gradient(135deg, #fff5f5 0%, #fef9e7 100%)',
              borderRadius: '16px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '60px' }}>🎉</span>
              <h3 style={{ 
                color: '#2c3e50', 
                margin: '10px 0 5px',
                fontSize: '20px'
              }}>
                Libur!
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                margin: 0,
                fontSize: '14px'
              }}>
                Tidak ada jadwal hari ini. Nikmati harimu! 😊
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
                    backgroundColor: '#f8f9fa',
                    borderRadius: '14px',
                    borderLeft: `4px solid ${color}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f2ff';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <div style={{
                      backgroundColor: color,
                      color: '#fff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '14px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      boxShadow: `0 4px 12px ${color}40`
                    }}>
                      {jam}
                    </div>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#2c3e50',
                      flex: 1
                    }}>
                      {mapel}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      opacity: 0.6
                    }}>
                      {getEmoji(index)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '2px solid #f0f0f0',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '11px',
              color: '#bdc3c7',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>⏰</span> Notifikasi otomatis setiap jam 05:20 pagi
              <span style={{ marginLeft: '8px' }}>•</span>
              <span>🤖</span> Telegram
            </p>
          </div>
        </div>

        {/* Footer kecil */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '10px',
          letterSpacing: '0.5px'
        }}>
          ✨ dibuat dengan ❤️
        </div>
      </div>
    </div>
  );
}