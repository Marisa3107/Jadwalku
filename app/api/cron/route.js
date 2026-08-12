import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getJadwal() {
  const filePath = path.join(process.cwd(), 'data', 'jadwal.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

function getPekan(targetDate) {
  const startDate = new Date(2026, 6, 13);
  const today = targetDate || new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const pekan = Math.ceil(diffDays / 7);
  if (pekan % 3 === 0) return 'pekan3';
  if (pekan % 3 === 1) return 'pekan1';
  return 'pekan2';
}

async function kirimTelegram(pesan) {
  const TOKEN = '8860261405:AAHjKOzyVXCglqHrpJm7Xb4he1mGkCqURlY';
  const CHAT_ID = '5698906519';
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: pesan,
        parse_mode: 'HTML'
      })
    });
    const result = await response.json();
    console.log('✅ Telegram response:', result);
  } catch (error) {
    console.error('❌ Gagal kirim Telegram:', error.message);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const testMode = searchParams.get('test') === 'true';
  const cronMode = searchParams.get('cron') === 'true';
  const offset = parseInt(searchParams.get('offset')) || 0;

  // ===== TEST MODE =====
  if (testMode) {
    console.log('🧪 TEST MODE: Dipanggil manual!');
    await kirimTelegram('🧪 Test cron job berhasil!');
    return NextResponse.json({ message: 'Test berhasil! Cek Telegram' });
  }

  // ===== CRON MODE =====
  if (cronMode) {
    console.log('⏰ CRON MODE: Dipanggil otomatis!');
    
    // ===== CEK JAM WIB =====
    const now = new Date();
    const jamWIB = now.getUTCHours() + 7; // UTC → WIB
    const menitWIB = now.getUTCMinutes();
    
    console.log(`🕐 Waktu WIB: ${jamWIB}:${menitWIB}`);

    // HANYA KIRIM JIKA JAM 5.30 WIB
    if (jamWIB !== 5 || menitWIB !== 30) {
      console.log(`⏰ Bukan jam 5.30 WIB (sekarang ${jamWIB}:${menitWIB}), skip kirim`);
      return NextResponse.json({
        message: `Bukan jam 5.30 WIB, sekarang ${jamWIB}:${menitWIB}`,
        status: 'skipped',
        currentTime: `${jamWIB}:${menitWIB}`
      });
    }

    // ===== AMBIL JADWAL =====
    const today = new Date();
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const hariIni = days[today.getDay()];
    const pekan = getPekan(today);

    const semuaJadwal = getJadwal();
    const jadwalHariIni = semuaJadwal[pekan]?.[hariIni] || [];

    let pesan = `📚 <b>JADWAL SEKOLAH</b> 📚\n`;
    pesan += `📅 Hari: ${hariIni.charAt(0).toUpperCase() + hariIni.slice(1)}\n`;
    pesan += `📖 Pekan: ${pekan}\n`;
    pesan += `━━━━━━━━━━━━━━━━━━\n\n`;

    if (jadwalHariIni.length === 0) {
      pesan += '🎉 LIBUR! Tidak ada jadwal hari ini.';
    } else {
      jadwalHariIni.forEach((mapel, index) => {
        const jamPelajaran = 7 + index;
        pesan += `${jamPelajaran}.00 - ${mapel}\n`;
      });
    }

    await kirimTelegram(pesan);
    console.log('✅ Pesan dikirim via cron mode!');
    return NextResponse.json({
      message: 'Pesan dikirim via cron mode!',
      jadwal: jadwalHariIni,
      pekan: pekan,
      hari: hariIni,
      status: 'sent'
    });
  }

  // ===== API NORMAL (dengan offset) =====
  try {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);

    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const hariIni = days[targetDate.getDay()];
    const pekan = getPekan(targetDate);

    const semuaJadwal = getJadwal();
    const jadwalHariIni = semuaJadwal[pekan]?.[hariIni] || [];

    const hariDisplay = targetDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return NextResponse.json({
      message: 'API dijalankan!',
      jadwal: jadwalHariIni,
      pekan: pekan,
      hari: hariIni,
      hariDisplay: hariDisplay,
      offset: offset
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}