'use client';
import { useState } from 'react';
import Link from 'next/link';

// Form verimizin yapısını tanımlıyoruz
interface FormData {
  hizmet: string;
  genislik: number;
  yukseklik: number;
  derinlik: number;
  malzeme: string;
  ekOzellikler: string[];
  cekmeceAdedi: number;
  adSoyad: string;
  telefon: string;
  email: string;
  adres: string;
}

// Hizmet seçenekleri (hizmetlere özel katsayılar eklendi)
const hizmetler = [
  { id: 'mutfak', name: 'Mutfak Dolabı', icon: '🍳', aciklama: 'Özel tasarım mutfak dolapları', katsayi: 1.3, birimFiyat: 11000 },
  { id: 'gardirop', name: 'Gardırop', icon: '👔', aciklama: 'Giyinme odası ve gardırop sistemleri', katsayi: 1.2, birimFiyat: 11000 },
  { id: 'vestiyer', name: 'Vestiyer', icon: '🚪', aciklama: 'Antre ve vestiyer çözümleri', katsayi: 1.0, birimFiyat: 11000 },
  { id: 'tv', name: 'TV Ünitesi', icon: '📺', aciklama: 'Modern TV ünite tasarımları', katsayi: 1.1, birimFiyat: 11000 },
];

// Malzeme seçenekleri (detaylandırılmış)
const malzemeler = [
  { id: 'sunta', name: 'Sunta', katsayi: 1, aciklama: 'Ekonomik ve kullanışlı', icon: '🪵', garanti: '3 yıl' },
  { id: 'mdf', name: 'MDF', katsayi: 1.2, aciklama: 'Dayanıklı ve kaliteli', icon: '🌲', garanti: '5 yıl' },
];

// Ek özellikler
const ekOzellikler = [
  { id: 'cnc', name: 'CNC İşleme', fiyat: 5000, icon: '⚙️', aciklama: 'Hassas CNC kesim ve işleme' },
  { id: 'ayna', name: 'Ayna Kaplama', fiyat: 4000, icon: '🪞', aciklama: 'Dekoratif ayna kaplama' },
];

export default function TeklifAlPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    hizmet: 'Mutfak Dolabı',
    genislik: 200,
    yukseklik: 80,
    derinlik: 60,
    malzeme: 'MDF',
    ekOzellikler: [],
    cekmeceAdedi: 3,
    adSoyad: '',
    telefon: '',
    email: '',
    adres: '',
  });
  const [tahminiFiyat, setTahminiFiyat] = useState(0);
  const [fiyatDetay, setFiyatDetay] = useState({
    temelFiyat: 0,
    malzemeFiyat: 0,
    ekOzelliklerFiyat: 0,
    cekmeceFiyat: 0,
    toplamFiyat: 0
  });

  // Formdaki değişikliklerini state'e kaydeder
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'genislik' || name === 'yukseklik' || name === 'derinlik' || name === 'cekmeceAdedi' ? Number(value) : value,
    }));
  };

  // Geliştirilmiş fiyat hesaplama mantığı
  const calculatePrice = () => {
    // Seçilen hizmeti bul
    const secilenHizmet = hizmetler.find(h => h.name === formData.hizmet) || hizmetler[0];

    // Seçilen malzemeyi bul
    const secilenMalzeme = malzemeler.find(m => m.name === formData.malzeme) || malzemeler[0];

    // Metrekare hesapla (genişlik * yükseklik)
    const metrekare = (formData.genislik / 100) * (formData.yukseklik / 100);

    // Derinlik katsayısı (60cm'den fazlaysa ekstra ücret)
    const derinlikKatsayisi = formData.derinlik > 60 ? 1.2 : 1.0;

    // Temel fiyat: metrekare * hizmet birim fiyat * hizmet katsayısı
    const temelFiyat = Math.round(metrekare * secilenHizmet.birimFiyat * secilenHizmet.katsayi * derinlikKatsayisi);

    // Malzeme fark fiyatı
    const malzemeFiyat = Math.round(temelFiyat * (secilenMalzeme.katsayi - 1));

    // Ek özellikler toplamı
    const ekOzelliklerFiyat = formData.ekOzellikler.reduce((toplam, ozellikId) => {
      const ozellik = ekOzellikler.find(ek => ek.id === ozellikId);
      return toplam + (ozellik ? ozellik.fiyat : 0);
    }, 0);

    // Çekmece ücreti (3 çekmece ücretsiz, sonrası her çekmece 1000 TL)
    const cekmeceFiyat = formData.cekmeceAdedi > 3 ? (formData.cekmeceAdedi - 3) * 1000 : 0;

    // Toplam fiyat
    const toplamFiyat = temelFiyat + malzemeFiyat + ekOzelliklerFiyat + cekmeceFiyat;

    setFiyatDetay({
      temelFiyat,
      malzemeFiyat,
      ekOzelliklerFiyat,
      cekmeceFiyat,
      toplamFiyat
    });

    return toplamFiyat;
  };

  // Ek özellik toggle fonksiyonu
  const toggleEkOzellik = (ozellikId: string) => {
    setFormData(prev => ({
      ...prev,
      ekOzellikler: prev.ekOzellikler.includes(ozellikId)
        ? prev.ekOzellikler.filter(id => id !== ozellikId)
        : [...prev.ekOzellikler, ozellikId]
    }));
  };

  const handleNext = () => {
    if (step === 4) {
      const fiyat = calculatePrice();
      setTahminiFiyat(fiyat);
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // Formu backend'e gönder
  const handleSubmit = async () => {
    // Validation
    if (!formData.adSoyad || !formData.telefon || !formData.email) {
      alert('Lütfen tüm iletişim bilgilerini doldurun.');
      return;
    }

    const payload = {
      hizmet: formData.hizmet,
      genislik: formData.genislik,
      yukseklik: formData.yukseklik,
      derinlik: formData.derinlik,
      malzeme: formData.malzeme.toLowerCase(),
      ekOzellikler: formData.ekOzellikler,
      cekmeceAdedi: formData.cekmeceAdedi,
      adSoyad: formData.adSoyad,
      telefon: formData.telefon,
      email: formData.email,
      adres: formData.adres,
      fiyatDetay: fiyatDetay,
      durum: 'beklemede'
    };

    console.log("Gönderilen payload:", payload);

    try {
      const response = await fetch('http://localhost:5000/api/teklif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend hatası detayı:", data);
        throw new Error(data.message || data.error || 'Teklif gönderilirken hata oluştu');
      }

      console.log("Teklif başarıyla gönderildi:", data);
      setStep(7); // Başarı ekranına geç

    } catch (error) {
      console.error("Teklif Gönderme Hatası:", error);
      alert(error instanceof Error ? error.message : "Teklif gönderilirken bir hata oluştu.");
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
        {step < 7 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex-1 flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-all text-sm md:text-base ${
                    step >= num
                      ? 'bg-amber-500 text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > num ? (
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                  {num < 6 && (
                    <div className={`flex-1 h-1 mx-1 md:mx-2 transition-all ${
                      step > num ? 'bg-amber-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm text-gray-600">
              <span>Hizmet</span>
              <span>Ölçüler</span>
              <span>Malzeme</span>
              <span>Ekstralar</span>
              <span>İletişim</span>
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
                        className="w-full p-4 text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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
                        className="w-full p-4 text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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

                  {/* Derinlik */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      Derinlik
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="derinlik"
                        value={formData.derinlik}
                        onChange={handleChange}
                        className="w-full p-4 text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                        min="30"
                        max="100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        cm
                      </span>
                    </div>
                    <input
                      type="range"
                      name="derinlik"
                      value={formData.derinlik}
                      onChange={handleChange}
                      min="30"
                      max="100"
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
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Derinlik: {formData.derinlik} cm
                    </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <p className="text-sm text-gray-600 mb-2">{malzeme.aciklama}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        Garanti: {malzeme.garanti}
                      </div>
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

            {/* Adım 4: Ek Özellikler ve Çekmece */}
            {step === 4 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Ek Özellikler
                  </h2>
                  <p className="text-gray-600">İsterseniz projenize ekstra özellikler ekleyin</p>
                </div>

                {/* Çekmece Sayısı Seçimi */}
                <div className="max-w-md mx-auto mb-8 bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Çekmece Sayısı
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="cekmeceAdedi"
                      value={formData.cekmeceAdedi}
                      onChange={handleChange}
                      className="w-full p-4 text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      min="0"
                      max="20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      adet
                    </span>
                  </div>
                  <input
                    type="range"
                    name="cekmeceAdedi"
                    value={formData.cekmeceAdedi}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    className="w-full mt-4 accent-amber-500"
                  />
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    {formData.cekmeceAdedi <= 3 ? (
                      <span className="text-green-600 font-semibold">
                        ✓ İlk 3 çekmece ücretsiz
                      </span>
                    ) : (
                      <span>
                        İlk 3 ücretsiz, <span className="font-bold text-amber-600">{formData.cekmeceAdedi - 3} çekmece</span> için
                        <span className="font-bold text-amber-600"> +{((formData.cekmeceAdedi - 3) * 1000).toLocaleString('tr-TR')}₺</span>
                      </span>
                    )}
                  </p>
                </div>

                {/* Ek Özellikler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {ekOzellikler.map((ozellik) => {
                    const isSelected = formData.ekOzellikler.includes(ozellik.id);
                    return (
                      <button
                        key={ozellik.id}
                        onClick={() => toggleEkOzellik(ozellik.id)}
                        className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 hover:shadow-lg text-left ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">{ozellik.icon}</div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {ozellik.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{ozellik.aciklama}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-amber-600">
                            +{ozellik.fiyat.toLocaleString('tr-TR')}₺
                          </span>
                          {isSelected && (
                            <span className="text-sm text-green-600 font-semibold">Seçildi</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Seçilen ek özellik sayısı: <span className="font-bold text-amber-600">{formData.ekOzellikler.length}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Adım 5: İletişim Bilgileri */}
            {step === 5 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    İletişim Bilgileriniz
                  </h2>
                  <p className="text-gray-600">Size ulaşabilmemiz için bilgilerinizi girin</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Ad Soyad */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="adSoyad"
                      value={formData.adSoyad}
                      onChange={handleChange}
                      className="w-full p-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>

                  {/* Telefon */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      className="w-full p-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      placeholder="0555 123 45 67"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>

                  {/* Adres (opsiyonel) */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Adres (Opsiyonel)
                    </label>
                    <textarea
                      name="adres"
                      value={formData.adres}
                      onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                      className="w-full p-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
                      placeholder="İl, ilçe, mahalle..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Adım 6: Özet ve Onay */}
            {step === 6 && (
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

                  {/* Ek Özellikler Listesi */}
                  {formData.ekOzellikler.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Seçilen Ek Özellikler
                      </h4>
                      <ul className="space-y-2">
                        {formData.ekOzellikler.map(ozellikId => {
                          const ozellik = ekOzellikler.find(ek => ek.id === ozellikId);
                          return ozellik ? (
                            <li key={ozellikId} className="flex items-center justify-between text-gray-700">
                              <span className="flex items-center gap-2">
                                <span>{ozellik.icon}</span>
                                <span>{ozellik.name}</span>
                              </span>
                              <span className="font-bold text-green-600">+{ozellik.fiyat.toLocaleString('tr-TR')}₺</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Fiyat Detay Kartı */}
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 rounded-2xl shadow-2xl text-white">
                    <h3 className="text-2xl font-bold mb-6 text-center">Fiyat Detayı</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center pb-3 border-b border-white/30">
                        <span className="opacity-90">Temel Fiyat</span>
                        <span className="font-bold">{fiyatDetay.temelFiyat.toLocaleString('tr-TR')}₺</span>
                      </div>

                      {fiyatDetay.malzemeFiyat > 0 && (
                        <div className="flex justify-between items-center pb-3 border-b border-white/30">
                          <span className="opacity-90">Malzeme Ek Ücreti ({formData.malzeme})</span>
                          <span className="font-bold">+{fiyatDetay.malzemeFiyat.toLocaleString('tr-TR')}₺</span>
                        </div>
                      )}

                      {fiyatDetay.ekOzelliklerFiyat > 0 && (
                        <div className="flex justify-between items-center pb-3 border-b border-white/30">
                          <span className="opacity-90">Ek Özellikler</span>
                          <span className="font-bold">+{fiyatDetay.ekOzelliklerFiyat.toLocaleString('tr-TR')}₺</span>
                        </div>
                      )}

                      {fiyatDetay.cekmeceFiyat > 0 && (
                        <div className="flex justify-between items-center pb-3 border-b border-white/30">
                          <span className="opacity-90">Ekstra Çekmece ({formData.cekmeceAdedi - 3} adet)</span>
                          <span className="font-bold">+{fiyatDetay.cekmeceFiyat.toLocaleString('tr-TR')}₺</span>
                        </div>
                      )}
                    </div>

                    <div className="text-center pt-4 border-t-2 border-white/50">
                      <p className="text-lg mb-2 opacity-90">Toplam Tahmini Fiyat</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-5xl md:text-6xl font-bold">
                          {fiyatDetay.toplamFiyat.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-3xl font-bold">₺</span>
                      </div>
                    </div>

                    <p className="mt-6 text-center text-sm opacity-80">
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

            {/* Adım 7: Başarı Ekranı */}
            {step === 7 && (
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
          {step < 7 && (
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

                {step < 6 && (
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

                {step === 6 && (
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
        {step < 7 && (
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