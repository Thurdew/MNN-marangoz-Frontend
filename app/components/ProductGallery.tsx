'use client';

import { useState } from 'react';
import { API_CONFIG } from '@/lib/api';

interface ImageProps {
  id: number;
  url: string;
  name: string;
}

interface ProductGalleryProps {
  images: ImageProps[];
  productName?: string;
}

export default function ProductGallery({ images, productName = 'Ürün' }: ProductGalleryProps) {
  // Varsayılan olarak ilk resmi göster
  const [mainImage, setMainImage] = useState(images[0]?.url);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
        Görsel Yok
      </div>
    );
  }

  const handleImageSelect = (url: string, index: number) => {
    setMainImage(url);
    setSelectedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Büyük Resim */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg border border-gray-100">
        <img
          src={`${API_CONFIG.STRAPI_URL}${mainImage}`}
          alt={`${productName} - Görsel ${selectedIndex + 1}`}
          loading="eager"
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Küçük Resimler (Thumbnail) */}
      <div className="flex gap-4 overflow-x-auto pb-2" role="tablist" aria-label="Ürün görselleri">
        {images.map((img, index) => (
          <button
            key={`${img.id}-${index}`}
            onClick={() => handleImageSelect(img.url, index)}
            role="tab"
            aria-selected={mainImage === img.url}
            aria-label={`${productName} görsel ${index + 1}`}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              mainImage === img.url
                ? 'border-amber-600 ring-2 ring-amber-100'
                : 'border-transparent hover:border-amber-300'
            }`}
          >
            <img
              src={`${API_CONFIG.STRAPI_URL}${img.url}`}
              alt={`${productName} küçük resim ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}