'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Yorum veri yapısı
export interface Yorum {
  _id: string;
  musteriAdi: string;
  musteriResim?: string;
  yildiz: number;
  yorum: string;
  hizmet: string;
  tarih: string;
  fotograflar?: string[];
  onaylandi: boolean;
}

// Varsayılan yorumlar (backend olmadan da çalışsın diye)
const varsayilanYorumlar: Yorum[] = [
  {
    _id: '1',
    musteriAdi: 'Ayşe Yılmaz',
    yildiz: 5,
    yorum: 'Mutfak dolabı projemiz harika oldu! Ekip çok profesyonel ve titiz çalıştı. Özellikle detaylara gösterdikleri özen bizi çok memnun etti. Kesinlikle tavsiye ediyorum.',
    hizmet: 'Mutfak Dolabı',
    tarih: '2024-11-15',
    onaylandi: true
  },
  {
    _id: '2',
    musteriAdi: 'Mehmet Demir',
    yildiz: 5,
    yorum: 'Giyinme odamızı tam istediğimiz gibi yaptılar. Kaliteli malzeme ve mükemmel işçilik. Fiyat performans açısından da gayet makul. Teşekkürler!',
    hizmet: 'Giyinme Odası',
    tarih: '2024-11-10',
    onaylandi: true
  },
  {
    _id: '3',
    musteriAdi: 'Zeynep Kaya',
    yildiz: 5,
    yorum: 'TV ünitesi ve dolap işimiz için çalıştık. Hem tasarım hem uygulama sürecinde çok yardımcı oldular. Sonuçtan son derece memnunuz!',
    hizmet: 'TV Ünitesi',
    tarih: '2024-11-05',
    onaylandi: true
  }
];

export default function Testimonials() {
  const [yorumlar, setYorumlar] = useState<Yorum[]>(varsayilanYorumlar);
  const [loading, setLoading] = useState(true);
  const [aktifIndex, setAktifIndex] = useState(0);

  // Railway Backend URL
  const BACKEND_URL = 'https://keen-sparkle-production.up.railway.app';

  // Backend'den yorumları çek
  useEffect(() => {
    const fetchYorumlar = async () => {
      try {
        // Localhost yerine Railway URL'i kullanıldı
        const response = await fetch(`${BACKEND_URL}/api/yorumlar`);
        if (response.ok) {
          const data = await response.json();
          // Backend'den gelen veri yapısına göre (data.data veya data) kontrolü
          const gelenYorumlar = data.data || data;
          if (gelenYorumlar && gelenYorumlar.length > 0) {
            setYorumlar(gelenYorumlar);
          }
        }
      } catch (error) {
        console.log('Backend bağlantısı kurulamadı, varsayılan yorumlar gösteriliyor.');
      } finally {
        setLoading(false);
      }
    };

    fetchYorumlar();
  }, [BACKEND_URL]);

  // Otomatik slider
  useEffect(() => {
    if (yorumlar.length === 0) return;
    const interval = setInterval(() => {
      setAktifIndex((prevIndex) => (prevIndex + 1) % yorumlar.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [yorumlar.length]);

  // Yıldız render fonksiyonu
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600 mx-auto"></div>
      </div>
    );
  }

  const gosterilecekYorumlar = yorumlar.filter(y => y.onaylandi);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">

        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-600 font-semibold mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Müşteri Yorumları
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Müşterilerimiz Ne Diyor?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Binlerce mutlu müşterimizin deneyimlerini keşfedin</p>
        </div>

        {/* Yorum Kartları - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {gosterilecekYorumlar.slice(0, 3).map((yorum) => (
            <div key={yorum._id} className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-2 transition-all duration-300">
              <div className="mb-4">{renderStars(yorum.yildiz)}</div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{yorum.yorum}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {yorum.musteriAdi.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{yorum.musteriAdi}</h4>
                  <p className="text-sm text-gray-500">{yorum.hizmet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Yorum Slider - Mobile */}
        <div className="md:hidden max-w-lg mx-auto mb-12">
          <div className="relative">
            {gosterilecekYorumlar.map((yorum, index) => (
              <div key={yorum._id} className={index === aktifIndex ? 'block animate-fade-in' : 'hidden'}>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="mb-4">{renderStars(yorum.yildiz)}</div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{yorum.yorum}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                      {yorum.musteriAdi.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{yorum.musteriAdi}</h4>
                      <p className="text-sm text-gray-500">{yorum.hizmet}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 mb-2">{gosterilecekYorumlar.length}+</div>
            <div className="text-gray-600 text-sm">Müşteri Yorumu</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 mb-2">
              {gosterilecekYorumlar.length > 0 
                ? (gosterilecekYorumlar.reduce((sum, y) => sum + y.yildiz, 0) / gosterilecekYorumlar.length).toFixed(1) 
                : "5.0"}
            </div>
            <div className="text-gray-600 text-sm">Ortalama Puan</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 mb-2">
              %{gosterilecekYorumlar.length > 0 
                ? Math.round((gosterilecekYorumlar.filter(y => y.yildiz === 5).length / gosterilecekYorumlar.length) * 100) 
                : "100"}
            </div>
            <div className="text-gray-600 text-sm">5 Yıldız</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 mb-2">%100</div>
            <div className="text-gray-600 text-sm">Tavsiye Oranı</div>
          </div>
        </div>

      </div>
    </section>
  );
}