import { NextResponse } from 'next/server';

// ===== SIMPAN DI MEMORY (DATA ILANG KALO REDEPLOY) =====
let tugasMemory = [];

export async function GET() {
  return NextResponse.json(tugasMemory);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newTugas = {
      id: Date.now(),
      text: body.text,
      deadline: body.deadline || null,
      selesai: false,
      createdAt: new Date().toISOString()
    };
    tugasMemory.push(newTugas);
    return NextResponse.json(newTugas);
  } catch (error) {
    console.error('❌ Error POST tugas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, selesai } = await request.json();
    const index = tugasMemory.findIndex(t => t.id === id);
    if (index !== -1) {
      tugasMemory[index].selesai = selesai;
      return NextResponse.json(tugasMemory[index]);
    }
    return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
  } catch (error) {
    console.error('❌ Error PUT tugas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    tugasMemory = tugasMemory.filter(t => t.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error DELETE tugas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}