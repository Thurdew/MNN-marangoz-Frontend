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

  // Railway Backend URL
  const BACKEND_URL = 'https://keen-sparkle-production.up.railway.app';

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
    const secilenHizmet = hizmetler.find(h => h.name === formData.hizmet) || hizmetler[0];
    const secilenMalzeme = malzemeler.find(m => m.name === formData.malzeme) || malzemeler[0];
    const metrekare = (formData.genislik / 100) * (formData.yukseklik / 100);
    const derinlikKatsayisi = formData.derinlik > 60 ? 1.2 : 1.0;
    const temelFiyat = Math.round(metrekare * secilenHizmet.birimFiyat * secilenHizmet.katsayi * derinlikKatsayisi);
    const malzemeFiyat = Math.round(temelFiyat * (secilenMalzeme.katsayi - 1));
    const ekOzelliklerFiyat = formData.ekOzellikler.reduce((toplam, ozellikId) => {
      const ozellik = ekOzellikler.find(ek => ek.id === ozellikId);
      return toplam + (ozellik ? ozellik.fiyat : 0);
    }, 0);
    const cekmeceFiyat = formData.cekmeceAdedi > 3 ? (formData.cekmeceAdedi - 3) * 1000 : 0;
    const toplamFiyat = temelFiyat + malzemeFiyat + ekOzelliklerFiyat + cekmeceFiyat;

    setFiyatDetay({ temelFiyat, malzemeFiyat, ekOzelliklerFiyat, cekmeceFiyat, toplamFiyat });
    return toplamFiyat;
  };

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

    try {
      // Localhost yerine Railway URL'i kullanıldı
      const response = await fetch(`${BACKEND_URL}/api/teklif`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Teklif gönderilirken hata oluştu');
      }

      setStep(7); // Başarı ekranına geç
    } catch (error) {
      console.error("Teklif Gönderme Hatası:", error);
      alert(error instanceof Error ? error.message : "Teklif gönderilirken bir hata oluştu.");
    }
  };

  return (
    <main className="min-h-screen bg-amber-50 py-20 px-4">
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
          <p className="text-lg text-gray-600">Hayalinizdeki projeyi 4 basit adımda oluşturun</p>
        </div>

        {/* Progress Bar */}
        {step < 7 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex-1 flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-all text-sm md:text-base ${
                    step >= num ? 'bg-amber-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
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
              <span>Hizmet</span><span>Ölçüler</span><span>Malzeme</span><span>Ekstralar</span><span>İletişim</span><span>Özet</span>
            </div>
          </div>
        )}

        {/* Ana Kart */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12">

            {/* Adım 1: Hizmet Seçimi */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Hangi Hizmeti İstiyorsunuz?</h2>
                  <p className="text-gray-600">Size en uygun hizmeti seçin</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hizmetler.map((hizmet) => (
                    <button key={hizmet.id} onClick={() => setFormData({ ...formData, hizmet: hizmet.name })}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        formData.hizmet === hizmet.name ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-5xl mb-3">{hizmet.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{hizmet.name}</h3>
                      <p className="text-sm text-gray-600">{hizmet.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adım 2: Ölçüler */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Ölçüleri Belirleyin</h2>
                  <p className="text-gray-600">Santimetre cinsinden ölçüler girin</p>
                </div>
                <div className="max-w-md mx-auto space-y-6">
                  {['genislik', 'yukseklik', 'derinlik'].map((name) => (
                    <div key={name} className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-lg font-semibold text-gray-800 mb-4 capitalize">{name}</label>
                      <input type="number" name={name} value={formData[name as keyof FormData] as number} onChange={handleChange}
                        className="w-full p-4 text-2xl font-bold border-2 rounded-lg focus:border-amber-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adım 3: Malzeme Seçimi */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Malzeme Seçin</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {malzemeler.map((malzeme) => (
                    <button key={malzeme.id} onClick={() => setFormData({ ...formData, malzeme: malzeme.name })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.malzeme === malzeme.name ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-5xl mb-3">{malzeme.icon}</div>
                      <h3 className="text-xl font-bold">{malzeme.name}</h3>
                      <p className="text-sm text-gray-600">{malzeme.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adım 4: Ekstralar */}
            {step === 4 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Ek Özellikler</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {ekOzellikler.map((ozellik) => (
                    <button key={ozellik.id} onClick={() => toggleEkOzellik(ozellik.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.ekOzellikler.includes(ozellik.id) ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-4xl mb-3">{ozellik.icon}</div>
                      <h3 className="font-bold">{ozellik.name}</h3>
                      <p className="text-amber-600">+{ozellik.fiyat}₺</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adım 5: İletişim */}
            {step === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-8">İletişim Bilgileri</h2>
                <div className="space-y-4 max-w-lg mx-auto">
                  <input type="text" name="adSoyad" placeholder="Ad Soyad" onChange={handleChange} className="w-full p-4 border rounded-lg" />
                  <input type="tel" name="telefon" placeholder="Telefon" onChange={handleChange} className="w-full p-4 border rounded-lg" />
                  <input type="email" name="email" placeholder="E-posta" onChange={handleChange} className="w-full p-4 border rounded-lg" />
                  <textarea name="adres" placeholder="Adres" onChange={(e) => setFormData({...formData, adres: e.target.value})} className="w-full p-4 border rounded-lg" rows={3}></textarea>
                </div>
              </div>
            )}

            {/* Adım 6: Özet */}
            {step === 6 && (
              <div className="animate-fade-in text-center">
                <h2 className="text-3xl font-bold mb-8">Teklif Özeti</h2>
                <div className="bg-amber-600 text-white p-8 rounded-2xl mb-8">
                  <p className="text-xl opacity-90">Toplam Tahmini Fiyat</p>
                  <p className="text-6xl font-bold">{fiyatDetay.toplamFiyat.toLocaleString('tr-TR')}₺</p>
                </div>
                <p className="text-gray-500">* Bu bir ön tekliftir, uzman incelemesi sonrası netleşecektir.</p>
              </div>
            )}

            {/* Adım 7: Başarı */}
            {step === 7 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Teklif Talebiniz Alındı!</h2>
                <p className="mb-8">Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                <Link href="/" className="bg-amber-500 text-white px-8 py-4 rounded-lg font-bold">Ana Sayfaya Dön</Link>
              </div>
            )}

          </div>

          {/* Alt Navigasyon */}
          {step < 7 && (
            <div className="bg-gray-50 p-6 border-t flex justify-between">
              {step > 1 ? (
                <button onClick={handleBack} className="px-6 py-3 bg-gray-200 rounded-lg font-semibold">Geri</button>
              ) : <div></div>}
              {step < 6 ? (
                <button onClick={handleNext} className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold">İleri</button>
              ) : (
                <button onClick={handleSubmit} className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg">Teklif Gönder</button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}