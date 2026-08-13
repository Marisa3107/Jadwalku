import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const KEY = 'tugas';

export async function GET() {
  try {
    const tugas = await kv.get(KEY) || [];
    return NextResponse.json(tugas);
  } catch (error) {
    console.error('❌ Error GET tugas:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const tugas = await kv.get(KEY) || [];
    const newTugas = {
      id: Date.now(),
      text: body.text,
      deadline: body.deadline || null,
      selesai: false,
      createdAt: new Date().toISOString()
    };
    tugas.push(newTugas);
    await kv.set(KEY, tugas);
    return NextResponse.json(newTugas);
  } catch (error) {
    console.error('❌ Error POST tugas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, selesai } = await request.json();
    const tugas = await kv.get(KEY) || [];
    const index = tugas.findIndex(t => t.id === id);
    if (index !== -1) {
      tugas[index].selesai = selesai;
      await kv.set(KEY, tugas);
      return NextResponse.json(tugas[index]);
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
    const tugas = await kv.get(KEY) || [];
    const filtered = tugas.filter(t => t.id !== id);
    await kv.set(KEY, filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error DELETE tugas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}