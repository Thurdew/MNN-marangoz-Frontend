// === HİZMETLERİMİZ SAYFASI (DÜZELTİLMİŞ) (app/hizmetler/page.tsx) ===

import Link from 'next/link';

// Hizmet kartları için veri yapısı
interface Hizmet {
  id: number;
  icon: string;
  baslik: string;
  kisaAciklama: string;
  detaylar: string[];
  ozellikler: string[];
  surec: string[];
  fiyatAraligi: string;
  sure: string;
}

// Hizmet verileri
const hizmetler: Hizmet[] = [
  {
    id: 1,
    icon: '🍳',
    baslik: 'Mutfak Dolapları',
    kisaAciklama: 'Modern ve fonksiyonel mutfak dolabı çözümleri ile hayalinizdeki mutfağı oluşturun.',
    detaylar: [
      'Özel ölçü mutfak dolabı tasarımı',
      'Yerinde ölçüm ve montaj hizmeti',
      'Kaliteli malzeme seçenekleri (MDF, Lake, Masif)',
      'Ankastre cihaz entegrasyonu',
      'Akıllı depolama çözümleri'
    ],
    ozellikler: [
      'Su geçirmez malzemeler',
      '10 yıl garanti',
      'Özel renk seçenekleri',
      'Soft-close menteşe ve ray sistemleri',
      'LED aydınlatma opsiyonları'
    ],
    surec: [
      'Ücretsiz keşif ve ölçüm',
      '3D tasarım sunumu',
      'Malzeme seçimi',
      'Üretim süreci (2-3 hafta)',
      'Profesyonel montaj'
    ],
    fiyatAraligi: '25.000₺ - 80.000₺',
    sure: '3-4 Hafta',
  },
  {
    id: 2,
    icon: '👔',
    baslik: 'Giyinme Odası & Gardırop',
    kisaAciklama: 'Kişiye özel gardırop ve giyinme odası tasarımları ile yaşam alanınızı düzenleyin.',
    detaylar: [
      'Gömme ve açık gardırop sistemleri',
      'Walk-in giyinme odası tasarımı',
      'Modüler dolap sistemleri',
      'Çekmece ve aksesuar organizasyonu',
      'Ayna ve aydınlatma çözümleri'
    ],
    ozellikler: [
      'Maksimum depolama alanı',
      'Ayarlanabilir raf sistemleri',
      'Premium sürgü sistemleri',
      'Özel bölümlendirme',
      'Kravat, kemer ve takı organizatörleri'
    ],
    surec: [
      'Mekan analizi ve planlama',
      '3D görselleştirme',
      'İç düzenleme tasarımı',
      'Üretim (2-3 hafta)',
      'Kurulum ve organizasyon'
    ],
    fiyatAraligi: '15.000₺ - 60.000₺',
    sure: '2-3 Hafta',
  },
  {
    id: 3,
    icon: '📺',
    baslik: 'TV Üniteleri',
    kisaAciklama: 'Modern ve şık TV ünitesi tasarımları ile salon dekorasyonunuzu tamamlayın.',
    detaylar: [
      'Duvar ünitesi ve TV paneli',
      'Kablolama ve kablo gizleme çözümleri',
      'Açık ve kapalı depolama alanları',
      'LED ışıklandırma sistemleri',
      'Soundbar ve oyun konsolu alanları'
    ],
    ozellikler: [
      'Minimalist tasarım',
      'Dayanıklı yapı',
      'Çeşitli renk seçenekleri',
      'Push-to-open sistemler',
      'Elektrik priz entegrasyonu'
    ],
    surec: [
      'Ölçüm ve tasarım',
      'Materyal seçimi',
      'Üretim süreci',
      'Elektrik hazırlığı',
      'Montaj ve test'
    ],
    fiyatAraligi: '12.000₺ - 45.000₺',
    sure: '2-3 Hafta',
  },
  {
    id: 4,
    icon: '🚪',
    baslik: 'Vestiyer & Antre',
    kisaAciklama: 'İşlevsel ve estetik vestiyer çözümleri ile evinize giriş yapın.',
    detaylar: [
      'Compact vestiyer tasarımları',
      'Ayakkabı dolabı sistemleri',
      'Askılık ve raflama çözümleri',
      'Ayna ve konsol entegrasyonu',
      'Oturma bankı tasarımları'
    ],
    ozellikler: [
      'Alan optimizasyonu',
      'Hızlı montaj',
      'Kompakt tasarım',
      'Çok fonksiyonlu kullanım',
      'Ekonomik çözümler'
    ],
    surec: [
      'Mekan ölçümü',
      'Tasarım önerisi',
      'Hızlı üretim (1-2 hafta)',
      'Kolay montaj',
      'Organizasyon desteği'
    ],
    fiyatAraligi: '8.000₺ - 25.000₺',
    sure: '1-2 Hafta',
  },
  {
    id: 5,
    icon: '🛋️',
    baslik: 'Özel Mobilya Tasarımı',
    kisaAciklama: 'Hayal ettiğiniz her türlü özel mobilya projesini gerçekleştiriyoruz.',
    detaylar: [
      'Çalışma masası ve ofis mobilyaları',
      'Kitaplık ve kütüphane sistemleri',
      'Yatak odası takımları',
      'Çocuk odası mobilyaları',
      'Bar ve şarap dolabı'
    ],
    ozellikler: [
      'Sınırsız tasarım özgürlüğü',
      'Premium malzeme kullanımı',
      'El işçiliği detayları',
      'Unique tasarımlar',
      'Uzun ömürlü kullanım'
    ],
    surec: [
      'İhtiyaç analizi',
      'Konsept geliştirme',
      'Prototip ve onay',
      'Özel üretim',
      'Premium montaj'
    ],
    fiyatAraligi: 'Proje Bazlı',
    sure: '4-8 Hafta',
  },
  {
    id: 6,
    icon: '🔧',
    baslik: 'Tamirat & Bakım',
    kisaAciklama: 'Mevcut mobilyalarınızın tamiri, yenilenmesi ve bakım hizmetleri.',
    detaylar: [
      'Mobilya onarım ve yenileme',
      'Menteşe ve ray değişimi',
      'Boya ve cila yenileme',
      'Kaplama değişimi',
      'Periyodik bakım hizmetleri'
    ],
    ozellikler: [
      'Hızlı servis',
      'Orijinal yedek parça',
      'Uygun fiyat',
      'Yerinde müdahale',
      'Garanti kapsamı'
    ],
    surec: [
      'Arıza tespiti',
      'Fiyat teklifi',
      'Parça temini',
      'Tamirat işlemi',
      'Kalite kontrolü'
    ],
    fiyatAraligi: '500₺ - 5.000₺',
    sure: '1-7 Gün',
  }
];

export default function HizmetlerimizPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      
      {/* Hero Bölümü */}
      {/* DÜZELTME: 'py-20' yerine 'pt-20 pb-48' kullanıldı. */}
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
              <span className="text-white font-semibold">Hizmetlerimiz</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Hizmetlerimiz
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              30 yıllık deneyimimizle, hayalinizdeki ahşap işlerini profesyonel ekibimizle hayata geçiriyoruz
            </p>
          </div>
        </div>

        {/* Dalga efekti */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block align-bottom">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(255, 251, 235)"/>
          </svg>
        </div>
      </section>

      {/* Neden Bizi Seçmelisiniz */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Neden Ahşap Atölye?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kalite, güven ve mükemmellik arayışındaki müşterilerimiz için fark yaratan özelliklerimiz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Kalite Garantisi</h3>
            <p className="text-gray-600">10 yıl garanti ile gönül rahatlığı</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Zamanında Teslimat</h3>
            <p className="text-gray-600">Belirlenen sürede eksiksiz teslim</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Müşteri Memnuniyeti</h3>
            <p className="text-gray-600">%100 müşteri memnuniyeti hedefi</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Uygun Fiyat</h3>
            <p className="text-gray-600">Kalite ve fiyat dengesinde uzman</p>
          </div>
        </div>
      </section>

      {/* Hizmet Detayları */}
      <section className="container mx-auto px-4 pb-20">
        <div className="space-y-8">
          {hizmetler.map((hizmet) => (
            <div
              key={hizmet.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row transform hover:shadow-2xl transition-all"
            >
              {/* Sol: İkon ve Başlık */}
              <div className="lg:w-1/3 bg-gradient-to-br from-amber-500 to-amber-600 p-8 flex flex-col justify-center items-center text-white">
                <div className="text-8xl mb-6">{hizmet.icon}</div>
                <h3 className="text-3xl font-bold mb-3 text-center">{hizmet.baslik}</h3>
                <p className="text-amber-100 text-center mb-6">{hizmet.kisaAciklama}</p>
                
                {/* Fiyat ve Süre */}
                <div className="w-full space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">Fiyat Aralığı</div>
                    <div className="text-xl font-bold">{hizmet.fiyatAraligi}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">Teslim Süresi</div>
                    <div className="text-xl font-bold">{hizmet.sure}</div>
                  </div>
                </div>
              </div>

              {/* Sağ: Detaylar */}
              <div className="lg:w-2/3 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Detaylar */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                      Hizmet Detayları
                    </h4>
                    <ul className="space-y-2">
                      {hizmet.detaylar.map((detay, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {detay}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Özellikler */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                      Özellikler
                    </h4>
                    <ul className="space-y-2">
                      {hizmet.ozellikler.map((ozellik, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {ozellik}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Süreç */}
                <div className="mt-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Çalışma Süreci
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hizmet.surec.map((adim, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{adim}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Butonlar */}
                <div className="mt-6 flex gap-4">
                  <Link
                    href="/teklif-al"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Teklif Al
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/galeri"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all"
                  >
                    Örnekleri Gör
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Projenizi Konuşalım
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz size en uygun çözümü bulmak için hazır
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/teklif-al"
              className="px-8 py-4 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transform hover:scale-105 transition-all shadow-xl"
            >
              Hemen Teklif Al
            </Link>
            <Link
              href="/iletisim"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-900 transform hover:scale-105 transition-all"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}