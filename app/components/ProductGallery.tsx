'use client';

import { useState } from 'react';

interface ImageProps {
  id?: number;
  url: string;
  name?: string;
}

interface ProductGalleryProps {
  images: ImageProps[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]?.url || '');

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
        Görsel Yok
      </div>
    );
  }

  // Backend'den gelen URL'leri düzelt
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // SVG fallback resim (network isteği yok)
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400'%3E%3Crect width='500' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E";
  const fallbackThumbnail = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EX%3C/text%3E%3C/svg%3E";

  return (
    <div className="space-y-4">
      {/* Büyük Resim */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg border border-gray-100">
        <img
          src={getImageUrl(mainImage)}
          alt="Ürün Görseli"
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Küçük Resimler (Thumbnail) */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={`${img.id || index}-${index}`}
            onClick={() => setMainImage(img.url)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              mainImage === img.url
                ? 'border-amber-600 ring-2 ring-amber-100'
                : 'border-transparent hover:border-amber-300'
            }`}
          >
            <img
              src={getImageUrl(img.url)}
              alt={img.name || `Resim ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackThumbnail;
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
