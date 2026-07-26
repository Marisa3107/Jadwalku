import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Fungsi untuk membaca file JSON
function getJadwal() {
  const filePath = path.join(process.cwd(), 'data', 'jadwal.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

// Fungsi untuk menentukan pekan ke berapa
function getPekan() {
  // Ganti tanggal ini sesuai awal semester kamu!
  const startDate = new Date(2026, 6, 1); // 1 Juli 2026
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
    
    // Buat pesan notifikasi
    let pesan = `📚 JADWAL SEKOLAH 📚\n`;
    pesan += `📅 Hari: ${hariIni.charAt(0).toUpperCase() + hariIni.slice(1)}\n`;
    pesan += `📖 Pekan: ${pekan}\n`;
    pesan += `━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (jadwalHariIni.length === 0) {
      pesan += '🎉 LIBUR! Tidak ada jadwal hari ini.';
    } else {
      jadwalHariIni.forEach((mapel, index) => {
        pesan += `${index + 1}. ${mapel}\n`;
      });
    }
    
    console.log(pesan); // Nanti kalo udah deploy, ini akan muncul di log Vercel
    
    return NextResponse.json({ 
      message: 'Cron job berhasil dijalankan!', 
      jadwal: jadwalHariIni,
      pekan: pekan,
      hari: hariIni,
      pesan: pesan
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}