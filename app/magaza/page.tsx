'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiparisButton from '../components/SiparisButton';

// Node.js Backend'den gelen veri yapısı
interface Urun {
  _id: string;
  ad: string;
  kod: string;
  fiyat: number;
  aciklama: string;
  resimUrl: string[];
  kategori: string;
  malzeme: string;
}

export default function MagazaPage() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    console.log("Veri çekme işlemi başladı...");

    // localStorage'dan token'ı al (varsa)
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};

    // Eğer token varsa Authorization header ekle
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('http://localhost:5000/api/urunler', { headers })
      .then(res => {
        if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
        return res.json();
      })
      .then(data => {
        console.log("Gelen Veriler:", data);
        setUrunler(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Hatası:", err);
        setHata(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Bağlantı Hatası</h2>
          <p className="text-gray-600 mb-4">{hata}</p>
          <p className="text-sm text-gray-500">Backend sunucusu çalışıyor mu kontrol edin.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  const getImageUrl = (resimUrl: string | string[]): string => {
    if (Array.isArray(resimUrl)) {
      return resimUrl.length > 0 ? resimUrl[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok';
    }
    return resimUrl || 'https://via.placeholder.com/400x300?text=Resim+Yok';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      
      {/* Hero Bölümü */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-24 pb-48 md:pb-56 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-amber-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-semibold">Mağaza</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Standart Ürünler
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto drop-shadow-md">
              Eviniz için el işçiliği, kalite garantili standart ürün koleksiyonumuz.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block align-bottom">
            <path d="M0 160L60 145C120 130 240 100 360 85C480 70 600 70 720 77.5C840 85 960 100 1080 107.5C1200 115 1320 115 1380 115L1440 115V160H1380C1320 160 1200 160 1080 160C960 160 840 160 720 160C600 160 480 160 360 160C240 160 120 160 60 160H0Z" fill="rgb(255, 251, 235)"/>
          </svg>
        </div>
      </section>

      {/* Ürün Sayısı */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-semibold">{urunler.length} Ürün Bulundu</span>
          </div>
        </div>
      </section>

      {/* Ürün Grid */}
      <section className="container mx-auto px-4 pb-20">
        
        {urunler.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {urunler.map((urun) => (
              <div
                key={urun._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col border border-gray-100"
              >
                {/* Ürün Görseli */}
                <Link href={`/magaza/${urun._id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer">
                    <img
                      src={getImageUrl(urun.resimUrl)} 
                      alt={urun.ad}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placeholder.com/400x300?text=Resim+Yok";
                      }}
                    />
                    
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
                        {urun.kategori}
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                       </div>
                    </div>
                  </div>
                </Link>

                {/* Ürün Bilgileri */}
                <div className="p-6 flex flex-col flex-grow">
                  <Link href={`/magaza/${urun._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-amber-600 transition-colors cursor-pointer hover:underline">
                      {urun.ad}
                    </h3>
                  </Link>
                  
                  <p className="text-xs text-gray-400 mb-3 font-mono bg-gray-50 inline-block py-0.5 px-2 rounded w-fit">
                    #{urun.kod}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed h-10">
                    {urun.aciklama}
                  </p>

                  {/* Malzeme */}
                  {urun.malzeme && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span>{urun.malzeme}</span>
                    </div>
                  )}

                  {/* Fiyat ve Butonlar */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Satış Fiyatı</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {urun.fiyat.toLocaleString('tr-TR')} <span className="text-sm text-amber-600 font-normal">₺</span>
                        </div>
                      </div>
                    </div>

                    <SiparisButton urun={{
                      id: 0,
                      UrunAdi: urun.ad,
                      UrunKodu: urun.kod,
                      Fiyat: urun.fiyat,
                      Aciklama: [],
                      Fotograflar: []
                    }} />

                    <Link 
                      href={`/magaza/${urun._id}`} 
                      className="block mt-3 w-full text-center py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      Detayları İncele
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Henüz Ürün Eklenmemiş
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Şu anda mağazamızda ürün bulunmamaktadır.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
