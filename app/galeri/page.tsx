'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GaleriOgesi {
  _id: string;
  baslik: string;
  aciklama: string;
  kategori: string;
  musteriAdi: string;
  konum: string;
  resimUrl: string[];
  tamamlanmaTarihi: string;
}

export default function GaleriPage() {
  const [galeriOgeleri, setGaleriOgeleri] = useState<GaleriOgesi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState<string>('Tümü');

  const kategoriler = ['Tümü', 'Mutfak', 'Yatak Odası', 'Salon', 'Banyo', 'Özel Tasarım', 'Diğer'];

  useEffect(() => {
    fetch('http://localhost:5000/api/galeri')
      .then(res => res.json())
      .then(data => {
        setGaleriOgeleri(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Hata:', err);
        setLoading(false);
      });
  }, []);

  const filtrelenmisOgeler = selectedKategori === 'Tümü' 
    ? galeriOgeleri 
    : galeriOgeleri.filter(o => o.kategori === selectedKategori);

  const getImageUrl = (resimUrl: string | string[]): string => {
    if (Array.isArray(resimUrl)) {
      return resimUrl.length > 0 ? resimUrl[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok';
    }
    return resimUrl || 'https://via.placeholder.com/400x300?text=Resim+Yok';
  };

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-24 pb-48 md:pb-56 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Galeri
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto drop-shadow-md">
              Şu ana kadar tamamladığımız projeler ve referanslarımız
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block align-bottom">
            <path d="M0 160L60 145C120 130 240 100 360 85C480 70 600 70 720 77.5C840 85 960 100 1080 107.5C1200 115 1320 115 1380 115L1440 115V160H1380C1320 160 1200 160 1080 160C960 160 840 160 720 160C600 160 480 160 360 160C240 160 120 160 60 160H0Z" fill="rgb(255, 251, 235)"/>
          </svg>
        </div>
      </section>

      {/* Kategori Filtresi */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {kategoriler.map(kat => (
            <button
              key={kat}
              onClick={() => setSelectedKategori(kat)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedKategori === kat
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </section>

      {/* Galeri Grid */}
      <section className="container mx-auto px-4 pb-20">
        {filtrelenmisOgeler.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 max-w-7xl mx-auto">
            {filtrelenmisOgeler.map((oge) => (
              <div
                key={oge._id}
                className="break-inside-avoid mb-6 group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <img
                    src={getImageUrl(oge.resimUrl)}
                    alt={oge.baslik}
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{oge.baslik}</h3>
                      {oge.aciklama && (
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">{oge.aciklama}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-300 mb-2">
                        {oge.musteriAdi && (
                          <span>👤 {oge.musteriAdi}</span>
                        )}
                        {oge.konum && (
                          <span>📍 {oge.konum}</span>
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                        {oge.kategori}
                      </span>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <p className="text-xl text-gray-500 mb-4">
                {selectedKategori === 'Tümü' 
                  ? 'Henüz galeriye iş eklenmemiş' 
                  : 'Bu kategoride iş bulunamadı'}
              </p>
              <Link
                href="/admin-login"
                className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                Admin Paneline Git
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}