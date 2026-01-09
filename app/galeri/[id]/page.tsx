'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';

interface BackendGaleri {
  _id: string;
  baslik: string;
  aciklama: string;
  resimUrl: string[];
  kategori: string;
  tamamlanmaTarihi: string;
}

interface Galeri {
  id: string;
  baslik: string;
  aciklama: string;
  resimler: { id: number; url: string; name: string }[];
  kategori: string;
  tarih: string;
}

export default function GaleriDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [galeri, setGaleri] = useState<Galeri | null>(null);
  const [loading, setLoading] = useState(true);
  const [secilenFoto, setSecilenFoto] = useState(0);

  // Railway Backend URL
  const BACKEND_URL = 'https://keen-sparkle-production.up.railway.app';

  useEffect(() => {
    // Localhost yerine Railway URL'i kullanıldı
    fetch(`${BACKEND_URL}/api/galeri/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Galeri öğesi bulunamadı');
        return res.json();
      })
      .then(response => {
        const backendGaleri: BackendGaleri = response.data;
        
        const transformedGaleri: Galeri = {
          id: backendGaleri._id,
          baslik: backendGaleri.baslik,
          aciklama: backendGaleri.aciklama,
          resimler: backendGaleri.resimUrl.map((url, index) => ({
            id: index,
            url: url,
            name: `${backendGaleri.baslik} - ${index + 1}`
          })),
          kategori: backendGaleri.kategori,
          tarih: new Date(backendGaleri.tamamlanmaTarihi).toLocaleDateString('tr-TR')
        };
        
        setGaleri(transformedGaleri);
        setLoading(false);
      })
      .catch(err => {
        console.error('Galeri yükleme hatası:', err);
        setLoading(false);
      });
  }, [id, BACKEND_URL]);

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    // Resim yolları Railway sunucusu üzerinden çekilecek şekilde güncellendi
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect width='800' height='800' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Galeri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!galeri) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Galeri Öğesi Bulunamadı</h2>
          <Link href="/galeri" className="text-amber-600 hover:underline">
            Galeriye Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero/Breadcrumb */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-amber-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/galeri" className="hover:text-white transition-colors">Galeri</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-semibold">{galeri.baslik}</span>
          </div>
        </div>
      </section>

      {/* Galeri Detayı */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-3">
              {galeri.kategori}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{galeri.baslik}</h1>
            <p className="text-gray-600">Tamamlanma: {galeri.tarih}</p>
          </div>

          {/* Ana Görsel */}
          <div className="relative aspect-video bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6">
            <img
              src={getImageUrl(galeri.resimler[secilenFoto].url)}
              alt={`${galeri.baslik} - ${secilenFoto + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />

            {/* Navigasyon Okları */}
            {galeri.resimler.length > 1 && (
              <>
                <button
                  onClick={() => setSecilenFoto(secilenFoto === 0 ? galeri.resimler.length - 1 : secilenFoto - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSecilenFoto(secilenFoto === galeri.resimler.length - 1 ? 0 : secilenFoto + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  {secilenFoto + 1} / {galeri.resimler.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Grid */}
          {galeri.resimler.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-8">
              {galeri.resimler.map((resim, index) => (
                <button
                  key={resim.id}
                  onClick={() => setSecilenFoto(index)}
                  className={`aspect-square bg-white rounded-lg shadow overflow-hidden border-2 transition-all transform hover:scale-105 ${
                    secilenFoto === index 
                      ? 'border-amber-500 ring-2 ring-amber-200' 
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <img
                    src={getImageUrl(resim.url)}
                    alt={resim.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EX%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Açıklama */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Proje Hakkında</h2>
            <p className="text-gray-700 leading-relaxed">{galeri.aciklama}</p>
          </div>

          {/* Geri Dön */}
          <div className="text-center">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Galeriye Geri Dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}