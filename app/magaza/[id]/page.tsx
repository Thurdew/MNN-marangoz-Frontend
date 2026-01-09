'use client';

import Link from 'next/link';
import SiparisButton from '@/app/components/SiparisButton';
import { useState, useEffect, use } from 'react';

// Backend'den gelen ürün yapısı
interface BackendUrun {
  _id: string;
  ad: string;
  kod: string;
  fiyat: number;
  aciklama: string;
  resimUrl: string[];
  kategori: string;
  malzeme: string;
}

// Component için kullanılacak yapı
interface Urun {
  id: number;
  documentId: string;
  UrunAdi: string;
  Fiyat: number;
  Aciklama: { type: string; children: { type: string; text: string }[] }[];
  UrunKodu: string;
  Fotograflar: { id: number; url: string; width: number; height: number; name: string }[];
}

export default function UrunDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [urun, setUrun] = useState<Urun | null>(null);
  const [loading, setLoading] = useState(true);
  const [secilenFoto, setSecilenFoto] = useState(0);

  // Railway Backend URL
  const BACKEND_URL = 'https://keen-sparkle-production.up.railway.app';

  useEffect(() => {
    // Localhost yerine Railway URL'i kullanıldı
    fetch(`${BACKEND_URL}/api/urunler/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Ürün bulunamadı');
        return res.json();
      })
      .then(response => {
        const backendUrun: BackendUrun = response.data;
        
        const transformedUrun: Urun = {
          id: 0,
          documentId: backendUrun._id,
          UrunAdi: backendUrun.ad,
          Fiyat: backendUrun.fiyat,
          Aciklama: [{
            type: 'paragraph',
            children: [{ type: 'text', text: backendUrun.aciklama }]
          }],
          UrunKodu: backendUrun.kod,
          Fotograflar: backendUrun.resimUrl.map((url, index) => ({
            id: index,
            url: url,
            width: 800,
            height: 600,
            name: `${backendUrun.ad} - ${index + 1}`
          }))
        };
        
        setUrun(transformedUrun);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ürün yükleme hatası:', err);
        setLoading(false);
      });
  }, [id]); 

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
          <p className="text-xl text-gray-600 font-semibold">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!urun) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ürün Bulunamadı</h2>
          <Link href="/magaza" className="text-amber-600 hover:underline">
            Mağazaya Geri Dön
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-amber-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/magaza" className="hover:text-white transition-colors">Mağaza</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-semibold">{urun.UrunAdi}</span>
          </div>
        </div>
      </section>

      {/* Ürün Detayı */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Sol: Görsel Galerisi */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src={getImageUrl(urun.Fotograflar[secilenFoto].url)}
                  alt={`${urun.UrunAdi} - ${secilenFoto + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                />

                {urun.Fotograflar.length > 1 && (
                  <>
                    <button
                      onClick={() => setSecilenFoto(secilenFoto === 0 ? urun.Fotograflar.length - 1 : secilenFoto - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSecilenFoto(secilenFoto === urun.Fotograflar.length - 1 ? 0 : secilenFoto + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      {secilenFoto + 1} / {urun.Fotograflar.length}
                    </div>
                  </>
                )}
              </div>

              {urun.Fotograflar.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {urun.Fotograflar.map((foto, index) => (
                    <button
                      key={foto.id}
                      onClick={() => setSecilenFoto(index)}
                      className={`aspect-square bg-white rounded-lg shadow overflow-hidden border-2 transition-all transform hover:scale-105 ${
                        secilenFoto === index ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(foto.url)}
                        alt={`${urun.UrunAdi} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ: Bilgiler */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-gray-500 font-mono">#{urun.UrunKodu}</span>
                <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{urun.UrunAdi}</h1>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
                <div className="text-sm text-gray-600 mb-1">Satış Fiyatı</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">{urun.Fiyat.toLocaleString('tr-TR')}</span>
                  <span className="text-2xl text-amber-600 font-semibold">₺</span>
                </div>
                <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-amber-200">
                  * Ölçü ve malzeme değişikliklerine göre fiyat değişebilir
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ürün Açıklaması
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {urun.Aciklama.map((block, index) => (
                    <p key={index} className="mb-3">
                      {block.children.map((child) => child.text).join(' ')}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <SiparisButton urun={urun} />
                <Link
                  href="/iletisim"
                  className="block w-full text-center py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all"
                >
                  Detaylı Bilgi İçin İletişime Geçin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}