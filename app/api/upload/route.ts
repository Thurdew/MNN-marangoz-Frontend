import { NextRequest, NextResponse } from 'next/server';
import { saveMultipleFiles, validateImage } from '@/lib/utils/fileUpload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Hiç dosya yüklenmedi' },
        { status: 400 }
      );
    }

    // Validate all files
    for (const file of files) {
      const validation = validateImage(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // Save files
    const urls = await saveMultipleFiles(files);

    return NextResponse.json(
      {
        success: true,
        urls,
        message: `${files.length} dosya başarıyla yüklendi`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yükleme hatası' },
      { status: 500 }
    );
  }
}

// Configuration for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};
