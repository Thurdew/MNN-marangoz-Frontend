// === İLETİŞİM SAYFASI (DALGA DÜZELTİLDİ) (app/iletisim/page.tsx) ===

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    adSoyad: '',
    email: '',
    telefon: '',
    konu: '',
    mesaj: ''
  });

  const [gonderildi, setGonderildi] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Konsola yazdır (Backend bağlantısı eklenebilir)
    console.log('Form Verisi:', formData);
    
    // Başarılı gönderim simülasyonu
    setGonderildi(true);
    
    // Formu temizle
    setFormData({
      adSoyad: '',
      email: '',
      telefon: '',
      konu: '',
      mesaj: ''
    });

    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
      setGonderildi(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      
      {/* Hero Bölümü */}
      {/* DÜZELTME: 'py-20' yerine 'pt-20 pb-48' kullanıldı. Dalga için yer açıldı. */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-20 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4NiA2IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-amber-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-semibold">İletişim</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              İletişim
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya proje talepleriniz için bizimle iletişime geçin
            </p>
          </div>
        </div>

        {/* Dalga efekti */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block align-bottom">
            <path d="M0 160L60 145C120 130 240 100 360 85C480 70 600 70 720 77.5C840 85 960 100 1080 107.5C1200 115 1320 115 1380 115L1440 115V160H1380C1320 160 1200 160 1080 160C960 160 840 160 720 160C600 160 480 160 360 160C240 160 120 160 60 160H0Z" fill="rgb(255, 251, 235)"/>
          </svg>
        </div>
      </section>

      {/* İletişim Bilgileri */}
      <section className="container mx-auto px-4 py-16 -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          
          {/* Telefon */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 transition-all border border-amber-100">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Telefon</h3>
            <a href="tel:+902161234567" className="text-amber-600 hover:text-amber-700 font-semibold text-lg">
              +90 (216) 123 45 67
            </a>
            <p className="text-gray-600 text-sm mt-2">Pazartesi - Cumartesi<br />09:00 - 18:00</p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 transition-all border border-amber-100">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">E-posta</h3>
            <a href="mailto:info@ahsapatolye.com" className="text-amber-600 hover:text-amber-700 font-semibold">
              info@ahsapatolye.com
            </a>
            <p className="text-gray-600 text-sm mt-2">7/24 E-posta Desteği<br />24 saat içinde yanıt</p>
          </div>

          {/* Adres */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 transition-all border border-amber-100">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Adres</h3>
            <p className="text-gray-600">
              Atatürk Mahallesi<br />
              Ahşap Sokak No:123<br />
              Kadıköy, İstanbul
            </p>
          </div>

        </div>
      </section>

      {/* İletişim Formu ve Harita */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Mesaj Gönderin</h2>
            <p className="text-gray-600 mb-8">
              Formunu doldurun, en kısa sürede size dönüş yapalım.
            </p>

            {gonderildi && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Mesajınız başarıyla gönderildi!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Ad Soyad */}
              <div>
                <label htmlFor="adSoyad" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  id="adSoyad"
                  name="adSoyad"
                  value={formData.adSoyad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  placeholder="Adınız ve Soyadınız"
                />
              </div>

              {/* Email & Telefon */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefon" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    placeholder="0555 555 55 55"
                  />
                </div>
              </div>

              {/* Konu */}
              <div>
                <label htmlFor="konu" className="block text-sm font-semibold text-gray-700 mb-2">
                  Konu *
                </label>
                <select
                  id="konu"
                  name="konu"
                  value={formData.konu}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                >
                  <option value="">Konu Seçiniz</option>
                  <option value="teklif">Fiyat Teklifi</option>
                  <option value="bilgi">Genel Bilgi</option>
                  <option value="sikayet">Öneri/Şikayet</option>
                  <option value="randevu">Randevu Talebi</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>

              {/* Mesaj */}
              <div>
                <label htmlFor="mesaj" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mesajınız *
                </label>
                <textarea
                  id="mesaj"
                  name="mesaj"
                  value={formData.mesaj}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              {/* Gönder Butonu */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Mesajı Gönder
              </button>

            </form>
          </div>

          {/* Harita ve Ek Bilgiler */}
          <div className="space-y-8">
            
            {/* Google Maps */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="aspect-[4/3] bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.9560462631487!2d29.106424776650833!3d40.982443471353955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac61770503979%3A0x65f22ce67528f081!2zScmWZXJlbmvDtnksIEthZMSxwAG2eS_EsHN0YW5idWw!5e0!3m2!1str!2str!4v1715865325123!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ahşap Atölye Konum"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Atölyemizi Ziyaret Edin</h3>
                <p className="text-gray-600 mb-4">
                  Showroom'umuzda tamamlanmış projelerimizi görebilir, malzeme örneklerini inceleyebilir ve uzman ekibimizle yüz yüze görüşebilirsiniz.
                </p>
                <a
                  href="https://goo.gl/maps/xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Yol Tarifi Al
                </a>
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Çalışma Saatlerimiz
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/30">
                  <span className="font-semibold">Pazartesi - Cuma</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/30">
                  <span className="font-semibold">Cumartesi</span>
                  <span>09:00 - 15:00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold">Pazar</span>
                  <span className="text-amber-200">Kapalı</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}