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
    console.log('⏳ Mencoba kirim ke Telegram...');
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
    console.log('📨 Response dari Telegram:', result);

    if (response.ok) {
      console.log('✅ PESAN TELEGRAM BERHASIL TERKIRIM!');
    } else {
      console.log('❌ TELEGRAM NGASIH ERROR:', result.description);
    }
  } catch (error) {
    console.error('❌ GAGAL KIRIM TELEGRAM:', error.message);
  }
}

export async function GET() {
  console.log('⏳ API /api/cron dipanggil!');
  try {
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
        const jam = 7 + index;
        pesan += `${jam}.00 - ${mapel}\n`;
      });
    }

    console.log('📝 Isi Pesan:', pesan);
    await kirimTelegram(pesan);

    return NextResponse.json({
      message: 'API dijalankan!',
      jadwal: jadwalHariIni,
      pekan: pekan,
      hari: hariIni,
    });

  } catch (error) {
    console.error('❌ ERROR UTAMA:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}