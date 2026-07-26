import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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

export async function GET() {
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
    
    // ⚠️ GANTI INI DENGAN TOKEN DAN CHAT ID ASLI KAMU!
    const TOKEN = '8860261405:AAHjKOzyVXCglqHrpJm7Xb4he1mGkCqURlY'; // Ganti!
    const CHAT_ID = '5698906519'; // Ganti!
    
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: pesan,
      parse_mode: 'HTML'
    });
    
    console.log('✅ Pesan Telegram terkirim!');
    
    return NextResponse.json({ 
      message: 'Cron job berhasil dijalankan!', 
      jadwal: jadwalHariIni,
      pekan: pekan,
      hari: hariIni,
      pesan: pesan
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}