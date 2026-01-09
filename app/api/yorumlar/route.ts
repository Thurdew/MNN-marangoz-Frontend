import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Yorum from '@/lib/models/Yorum';

// GET - Fetch approved testimonials
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const onlyApproved = searchParams.get('approved') !== 'false';

    const query = onlyApproved ? { onaylandi: true } : {};

    const yorumlar = await Yorum.find(query)
      .sort({ tarih: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: yorumlar,
        count: yorumlar.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Yorumlar GET error:', error);
    return NextResponse.json(
      { error: 'Yorumlar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.musteriAdi || !body.yorum || !body.yildiz || !body.hizmet) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik (musteriAdi, yorum, yildiz, hizmet)' },
        { status: 400 }
      );
    }

    // Validate star rating
    if (body.yildiz < 1 || body.yildiz > 5) {
      return NextResponse.json(
        { error: 'Yıldız değeri 1-5 arasında olmalıdır' },
        { status: 400 }
      );
    }

    // Create new testimonial
    const yorum = await Yorum.create({
      musteriAdi: body.musteriAdi,
      musteriResim: body.musteriResim,
      yildiz: body.yildiz,
      yorum: body.yorum,
      hizmet: body.hizmet,
      fotograflar: body.fotograflar || [],
      onaylandi: false, // New testimonials need approval
      tarih: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: yorum,
        message: 'Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Yorumlar POST error:', error);
    return NextResponse.json(
      { error: 'Yorum oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
