import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Settings from '@/lib/models/Settings';

// GET - Fetch settings
export async function GET() {
  try {
    await connectDB();

    // Get the latest settings or create default if none exist
    let settings = await Settings.findOne().sort({ updatedAt: -1 });

    if (!settings) {
      // Create default settings
      settings = await Settings.create({
        metreFiyat: 11000,
        cekmeceUcretsizLimit: 3,
        cekmeceBirimFiyat: 1000,
        cnc: { acik: true, fiyat: 5000 },
        ayna: { acik: true, fiyat: 4000 },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Ayarlar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Update settings
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.metreFiyat || !body.cekmeceBirimFiyat || !body.cekmeceUcretsizLimit) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Create new settings document
    const settings = await Settings.create({
      metreFiyat: body.metreFiyat,
      cekmeceUcretsizLimit: body.cekmeceUcretsizLimit,
      cekmeceBirimFiyat: body.cekmeceBirimFiyat,
      cnc: body.cnc,
      ayna: body.ayna,
    });

    return NextResponse.json(
      {
        success: true,
        data: settings,
        message: 'Ayarlar başarıyla güncellendi',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json(
      { error: 'Ayarlar güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
