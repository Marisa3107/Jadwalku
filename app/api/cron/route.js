import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getJadwal() {
  const filePath = path.join(process.cwd(), 'data', 'jadwal.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

function getPekan() {
  const startDate = new Date(2026, 6, 13);
  const today = new Date();
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
  
  if (testMode) {
    console.log('🧪 TEST MODE: Dipanggil manual!');
    await kirimTelegram('🧪 Test cron job berhasil!');
    return NextResponse.json({ message: 'Test berhasil! Cek Telegram' });
  }

  try {
    const now = new Date();
    const jam = now.getHours();
    const menit = now.getMinutes();

    const today = new Date();
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const hariIni = days[today.getDay()];
    const pekan = getPekan();

    const semuaJadwal = getJadwal();
    const jadwalHariIni = semuaJadwal[pekan][hariIni] || [];

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

    // ✅ HANYA JAM 08.00 WIB (01.00 UTC) YANG BISA KIRIM!
    if (jam === 1 && menit === 10) {
      await kirimTelegram(pesan);
      console.log('✅ Pesan dikirim jam 8.00 WIB!');
      return NextResponse.json({
        message: 'Pesan dikirim!',
        jadwal: jadwalHariIni,
        pekan: pekan,
        hari: hariIni,
        status: 'sent'
      });
    } else {
      console.log(`⏰ Bukan jam 8.00 WIB (sekarang ${jam}:${menit}), skip kirim`);
      return NextResponse.json({
        message: 'Bukan jam 8.00 WIB, pesan tidak dikirim',
        currentTime: `${jam}:${menit}`,
        status: 'skipped',
        jadwal: jadwalHariIni,
        pekan: pekan,
        hari: hariIni
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}