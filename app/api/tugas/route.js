import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tugas.json');

function getTugas() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTugas(tugas) {
  fs.writeFileSync(filePath, JSON.stringify(tugas, null, 2));
}

export async function GET() {
  const tugas = getTugas();
  return NextResponse.json(tugas);
}

export async function POST(request) {
  const body = await request.json();
  const tugas = getTugas();
  const newTugas = {
    id: Date.now(),
    text: body.text,
    deadline: body.deadline || null,
    selesai: false,
    createdAt: new Date().toISOString()
  };
  tugas.push(newTugas);
  saveTugas(tugas);
  return NextResponse.json(newTugas);
}

export async function PUT(request) {
  const { id, selesai } = await request.json();
  const tugas = getTugas();
  const index = tugas.findIndex(t => t.id === id);
  if (index !== -1) {
    tugas[index].selesai = selesai;
    saveTugas(tugas);
    return NextResponse.json(tugas[index]);
  }
  return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const tugas = getTugas();
  const filtered = tugas.filter(t => t.id !== id);
  saveTugas(filtered);
  return NextResponse.json({ success: true });
}