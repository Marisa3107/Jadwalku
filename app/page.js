'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting berdasarkan waktu
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('🌅 Selamat Pagi!');
    else if (hour < 15) setGreeting('☀️ Selamat Siang!');
    else if (hour < 19) setGreeting('🌇 Selamat Sore!');
    else setGreeting('🌙 Selamat Malam!');

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
  }, []);

  // Fungsi untuk dapatkan warna random untuk setiap pelajaran
  const getColor = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>⏳ Memuat jadwal...</p>
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
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#e74c3c' }}>❌ Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Background gradien */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: -1
      }}></div>

      {/* Container utama */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px 0'
      }}>
        {/* Header dengan greeting */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '28px',
            margin: 0,
            color: '#2c3e50'
          }}>
            {greeting}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#7f8c8d',
            marginTop: '5px'
          }}>
            📚 Hari ini, {jadwal?.hari}
          </p>
        </div>

        {/* Card jadwal */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          {/* Info pekan */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              📖 {jadwal?.pekan}
            </span>
            <span style={{
              fontSize: '14px',
              color: '#7f8c8d'
            }}>
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Daftar pelajaran */}
          <h3 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '18px'
          }}>
            📋 Jadwal Pelajaran
          </h3>

          {jadwal?.jadwal && jadwal.jadwal.length > 0 ? (
            <div>
              {jadwal.jadwal.map((mapel, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 15px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${getColor(index)}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e8f0fe';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span style={{
                    backgroundColor: getColor(index),
                    color: 'white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    {mapel}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    color: '#bdc3c7'
                  }}>
                    {index + 1 === 1 ? '⏰' : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#fff5f5',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '50px' }}>🎉</span>
              <h3 style={{ color: '#2c3e50', margin: '10px 0' }}>Libur!</h3>
              <p style={{ color: '#7f8c8d' }}>Tidak ada jadwal hari ini. Nikmati harimu! 😊</p>
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
              margin: 0
            }}>
              ⏰ Notifikasi otomatis setiap jam 06:00 pagi
            </p>
            <p style={{
              fontSize: '11px',
              color: '#bdc3c7',
              margin: '5px 0 0'
            }}>
              🚀 Dibuat dengan Next.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}