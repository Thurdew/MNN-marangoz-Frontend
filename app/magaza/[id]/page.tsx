// === SADE ÜRÜN DETAY SAYFASI (app/magaza/[id]/page.tsx) ===

'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiparisButton from '@/app/components/SiparisButton';
import { useState } from 'react';

interface RichTextBlock {
  type: string;
  children: {
    type: string;
    text: string;
  }[];
}

interface Urun {
  id: number;
  documentId: string;
  UrunAdi: string;
  Fiyat: number;
  Aciklama: RichTextBlock[];
  UrunKodu: string;
  Fotograflar: {
    id: number;
    url: string;
    width: number;
    height: number;
    name: string;
  }[];
}

interface StrapiUrunData {
  id: number;
  documentId: string;
  UrunAdi: string;
  Fiyat: number;
  Aciklama: RichTextBlock[];
  UrunKodu?: string;
  Fotograflar: {
    id: number;
    url: string;
    width: number;
    height: number;
    name: string;
  }[];
}

async function getUrun(id: string) {
  try {
    const res = await fetch(
      'http://localhost:1337/api/standart-uruns?populate=*',
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return null;
    }

    const jsonResponse: { data: StrapiUrunData[] } = await res.json();
    const item = jsonResponse.data.find(item => item.id === parseInt(id));
    
    if (!item || !item.Fotograflar || item.Fotograflar.length === 0) {
      return null;
    }

    const urun: Urun = {
      id: item.id,
      documentId: item.documentId,
      UrunAdi: item.UrunAdi,
      Fiyat: item.Fiyat,
      Aciklama: item.Aciklama,
      UrunKodu: item.UrunKodu || `URN-${item.id}`,
      Fotograflar: item.Fotograflar,
    };

    return urun;
  } catch (error) {
    console.error('Hata detayı:', error);
    return null;
  }
}

// Client Component
function UrunDetayClient({ urun }: { urun: Urun }) {
  const [secilenFoto, setSecilenFoto] = useState(0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero/Breadcrumb */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-amber-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/magaza" className="hover:text-white transition-colors">
              Mağaza
            </Link>
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
              {/* Ana Görsel */}
              <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src={`http://localhost:1337${urun.Fotograflar[secilenFoto].url}`}
                  alt={`${urun.UrunAdi} - ${secilenFoto + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigasyon Okları */}
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

                    {/* Fotoğraf Sayacı */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      {secilenFoto + 1} / {urun.Fotograflar.length}
                    </div>
                  </>
                )}
              </div>

              {/* Küçük Görseller */}
              {urun.Fotograflar.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {urun.Fotograflar.map((foto, index) => (
                    <button
                      key={foto.id}
                      onClick={() => setSecilenFoto(index)}
                      className={`aspect-square bg-white rounded-lg shadow overflow-hidden border-2 transition-all transform hover:scale-105 ${
                        secilenFoto === index 
                          ? 'border-amber-500 ring-2 ring-amber-200' 
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <img
                        src={`http://localhost:1337${foto.url}`}
                        alt={`${urun.UrunAdi} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ: Bilgiler */}
            <div className="space-y-6">
              {/* Başlık */}
              <div>
                <span className="text-sm text-gray-500 font-mono">#{urun.UrunKodu}</span>
                <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                  {urun.UrunAdi}
                </h1>
              </div>

              {/* Fiyat */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-200">
                <div className="text-sm text-gray-600 mb-1">Satış Fiyatı</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {urun.Fiyat.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-2xl text-amber-600 font-semibold">₺</span>
                </div>
                <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-amber-200">
                  * Ölçü ve malzeme değişikliklerine göre fiyat değişebilir
                </p>
              </div>

              {/* Açıklama */}
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

              {/* Butonlar */}
              <div className="space-y-3">
                <SiparisButton urun={urun} />
                
                <Link
                  href="/iletisim"
                  className="block w-full text-center py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Detaylı Bilgi İçin İletişime Geçin
                  </div>
                </Link>
              </div>

              {/* Bilgilendirme */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Önemli Not</p>
                    <p>
                      Bu ürün standart modelimizdir. Ölçü, renk, malzeme ve tasarım konusunda 
                      değişiklik yapabilir, size özel üretim gerçekleştirebiliriz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Özellikler */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ürün Özellikleri
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">El işçiliği</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Kaliteli malzeme</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Garanti kapsamında</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Özelleştirilebilir</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geri Dön */}
          <div className="mt-12 text-center">
            <Link
              href="/magaza"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Mağazaya Geri Dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Server Component Wrapper
export default async function UrunDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const urun = await getUrun(resolvedParams.id);

  if (!urun) {
    notFound();
  }

  return <UrunDetayClient urun={urun} />;
}