'use client';
import { useState } from 'react';
import Link from 'next/link';

// Form verimizin yapısını tanımlıyoruz
interface FormData {
  hizmet: string;
  genislik: number;
  yukseklik: number;
  malzeme: string;
}

// Hizmet seçenekleri
const hizmetler = [
  { id: 'mutfak', name: 'Mutfak Dolabı', icon: '🍳', aciklama: 'Özel tasarım mutfak dolapları' },
  { id: 'gardirop', name: 'Gardırop', icon: '👔', aciklama: 'Giyinme odası ve gardırop sistemleri' },
  { id: 'vestiyer', name: 'Vestiyer', icon: '🚪', aciklama: 'Antre ve vestiyer çözümleri' },
  { id: 'tv', name: 'TV Ünitesi', icon: '📺', aciklama: 'Modern TV ünite tasarımları' },
];

// Malzeme seçenekleri
const malzemeler = [
  { id: 'mdf', name: 'MDF', katsayi: 1, aciklama: 'Ekonomik ve dayanıklı', icon: '🪵' },
  { id: 'lake', name: 'Lake', katsayi: 1.5, aciklama: 'Parlak ve şık görünüm', icon: '✨' },
  { id: 'masif', name: 'Masif', katsayi: 2.5, aciklama: 'Premium ahşap malzeme', icon: '🌳' },
];

export default function TeklifAlPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    hizmet: 'Mutfak Dolabı',
    genislik: 200,
    yukseklik: 80,
    malzeme: 'MDF',
  });
  const [tahminiFiyat, setTahminiFiyat] = useState(0);

  // Formdaki değişikliklerini state'e kaydeder
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'genislik' || name === 'yukseklik' ? Number(value) : value,
    }));
  };

  // Basit bir fiyat hesaplama mantığı
  const calculatePrice = () => {
    let malzemeKatsayisi = 1;
    if (formData.malzeme === 'Lake') malzemeKatsayisi = 1.5;
    if (formData.malzeme === 'Masif') malzemeKatsayisi = 2.5;
    const metrekare = (formData.genislik / 100) * (formData.yukseklik / 100);
    const fiyat = (metrekare * 5000 * malzemeKatsayisi) + 1000;
    return Math.round(fiyat);
  };

  const handleNext = () => {
    if (step === 3) {
      const fiyat = calculatePrice();
      setTahminiFiyat(fiyat);
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // Formu Strapi'ye gönder
  const handleSubmit = async () => {
    const payload = {
      data: {
        MusteriAdi: "Teklif Test Müşterisi",
        MusteriTelefon: "555 000 0000",
        IstenenHizmet: formData.hizmet,
        OlculerJSON: { genislik: formData.genislik, yukseklik: formData.yukseklik },
        Malzeme: formData.malzeme,
        TahminiFiyat: tahminiFiyat,
        Durum: "Yeni"
      }
    };

    try {
      const response = await fetch('http://localhost:1337/api/ozel-teklif-talebis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Strapi Hata Detayı:", err);
        throw new Error(`API Hatası: ${response.status}`);
      }

      setStep(5);

    } catch (error) {
      console.error("Teklif Gönderme Hatası:", error);
      alert("Teklif gönderilirken bir hata oluştu. Lütfen konsolu kontrol edin.");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-r from-amber-50 to-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Üst Başlık */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Ücretsiz Fiyat Teklifi
          </h1>
          <p className="text-lg text-gray-600">
            Hayalinizdeki projeyi 4 basit adımda oluşturun
          </p>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex-1 flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                    step >= num 
                      ? 'bg-amber-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > num ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                  {num < 4 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      step > num ? 'bg-amber-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Hizmet</span>
              <span>Ölçüler</span>
              <span>Malzeme</span>
              <span>Özet</span>
            </div>
          </div>
        )}

        {/* Ana Kart */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          
          {/* İçerik Alanı */}
          <div className="p-8 md:p-12">

            {/* Adım 1: Hizmet Seçimi */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Hangi Hizmeti İstiyorsunuz?
                  </h2>
                  <p className="text-gray-600">Size en uygun hizmeti seçin</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hizmetler.map((hizmet) => (
                    <button
                      key={hizmet.id}
                      onClick={() => setFormData({ ...formData, hizmet: hizmet.name })}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 hover:shadow-lg ${
                        formData.hizmet === hizmet.name
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-5xl mb-3">{hizmet.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {hizmet.name}
                      </h3>
                      <p className="text-sm text-gray-600">{hizmet.aciklama}</p>
                      {formData.hizmet === hizmet.name && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-amber-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Seçildi
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adım 2: Ölçüler */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Ölçüleri Belirleyin
                  </h2>
                  <p className="text-gray-600">Santimetre cinsinden ölçüler girin</p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  {/* Genişlik */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Genişlik
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="genislik"
                        value={formData.genislik}
                        onChange={handleChange}
                        className="w-full p-4 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                        min="50"
                        max="1000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        cm
                      </span>
                    </div>
                    <input
                      type="range"
                      name="genislik"
                      value={formData.genislik}
                      onChange={handleChange}
                      min="50"
                      max="1000"
                      className="w-full mt-4 accent-amber-500"
                    />
                  </div>

                  {/* Yükseklik */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      Yükseklik
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="yukseklik"
                        value={formData.yukseklik}
                        onChange={handleChange}
                        className="w-full p-4 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                        min="50"
                        max="500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        cm
                      </span>
                    </div>
                    <input
                      type="range"
                      name="yukseklik"
                      value={formData.yukseklik}
                      onChange={handleChange}
                      min="50"
                      max="500"
                      className="w-full mt-4 accent-amber-500"
                    />
                  </div>

                  {/* Görsel Önizleme */}
                  <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
                    <p className="text-center text-gray-700 mb-3 font-medium">
                      Tahmini Alan
                    </p>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-amber-600">
                        {((formData.genislik / 100) * (formData.yukseklik / 100)).toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-600 ml-2">m²</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adım 3: Malzeme Seçimi */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Malzeme Seçin
                  </h2>
                  <p className="text-gray-600">Projeniz için uygun malzemeyi belirleyin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {malzemeler.map((malzeme) => (
                    <button
                      key={malzeme.id}
                      onClick={() => setFormData({ ...formData, malzeme: malzeme.name })}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 hover:shadow-lg ${
                        formData.malzeme === malzeme.name
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-5xl mb-3">{malzeme.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {malzeme.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{malzeme.aciklama}</p>
                      <div className="text-sm font-medium text-amber-600">
                        Katsayı: x{malzeme.katsayi}
                      </div>
                      {formData.malzeme === malzeme.name && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-amber-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Seçildi
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adım 4: Özet ve Onay */}
            {step === 4 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Teklif Özeti
                  </h2>
                  <p className="text-gray-600">Bilgilerinizi kontrol edin</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Özet Kartları */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-linear-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hizmet Türü</p>
                          <p className="font-bold text-gray-800">{formData.hizmet}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ölçüler</p>
                          <p className="font-bold text-gray-800">
                            {formData.genislik} × {formData.yukseklik} cm
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Malzeme</p>
                          <p className="font-bold text-gray-800">{formData.malzeme}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Alan</p>
                          <p className="font-bold text-gray-800">
                            {((formData.genislik / 100) * (formData.yukseklik / 100)).toFixed(2)} m²
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fiyat Kartı */}
                  <div className="bg-linear-to-br from-amber-500 to-amber-600 p-8 rounded-2xl shadow-2xl text-white text-center">
                    <p className="text-lg mb-2 opacity-90">Tahmini Fiyat</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl md:text-6xl font-bold">
                        {tahminiFiyat.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-3xl font-bold">₺</span>
                    </div>
                    <p className="mt-4 text-sm opacity-80">
                      * Bu fiyat tahmini olup, keşif sonrası netleşecektir.
                    </p>
                  </div>

                  {/* Bilgi Notu */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Önemli Bilgi</p>
                        <p>Teklif talebiniz alındıktan sonra uzman ekibimiz sizinle iletişime geçecek ve detaylı bir keşif yapılacaktır. Son fiyat keşif sonrası belirlenecektir.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adım 5: Başarı Ekranı */}
            {step === 5 && (
              <div className="animate-fade-in text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Teklif Talebiniz Alındı!
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Başvurunuz başarıyla kaydedildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-md mx-auto mb-8">
                  <p className="text-sm text-gray-700">
                    <strong>Referans Numarası:</strong> #{Math.random().toString(36).substring(7).toUpperCase()}
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Ana Sayfaya Dön
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Alt Navigasyon */}
          {step < 5 && (
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ml-auto"
                  >
                    İleri
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {step === 4 && (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ml-auto text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Teklif Talebini Gönder
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Yardım Bölümü */}
        {step < 5 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Yardıma mı ihtiyacınız var?</p>
            <Link href="/iletisim" className="text-amber-600 hover:text-amber-700 font-semibold">
              Bize Ulaşın →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}