import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Teklif from '@/lib/models/Teklif';

// GET - Fetch all quotes (for admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const durum = searchParams.get('durum');

    const query = durum ? { durum } : {};

    const teklifler = await Teklif.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: teklifler,
        count: teklifler.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Teklif GET error:', error);
    return NextResponse.json(
      { error: 'Teklifler getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Create new quote request
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'adSoyad',
      'email',
      'telefon',
      'hizmet',
      'genislik',
      'yukseklik',
      'derinlik',
      'malzeme',
      'fiyatDetay',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} alanı gereklidir` },
          { status: 400 }
        );
      }
    }

    // Validate cekmeceAdedi
    if (body.cekmeceAdedi !== undefined) {
      if (body.cekmeceAdedi < 0 || body.cekmeceAdedi > 20) {
        return NextResponse.json(
          { error: 'Çekmece adedi 0-20 arasında olmalıdır' },
          { status: 400 }
        );
      }
    }

    // Create new quote
    const teklif = await Teklif.create({
      adSoyad: body.adSoyad,
      email: body.email,
      telefon: body.telefon,
      adres: body.adres,
      hizmet: body.hizmet,
      genislik: body.genislik,
      yukseklik: body.yukseklik,
      derinlik: body.derinlik,
      malzeme: body.malzeme,
      ekOzellikler: body.ekOzellikler || [],
      cekmeceAdedi: body.cekmeceAdedi || 0,
      fiyatDetay: body.fiyatDetay,
      notlar: body.notlar,
      durum: 'beklemede',
    });

    return NextResponse.json(
      {
        success: true,
        data: teklif,
        message: 'Teklif talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Teklif POST error:', error);
    return NextResponse.json(
      { error: 'Teklif oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
