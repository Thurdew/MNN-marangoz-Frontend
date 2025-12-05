// === HAKKIMIZDA SAYFASI (DALGA DÜZELTİLDİ) (app/hakkimizda/page.tsx) ===

import Link from 'next/link';

export default function HakkimizdaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      
      {/* Hero Bölümü */}
      {/* DÜZELTME: 'py-20' yerine 'pt-20 pb-48' kullanılarak dalga efekti için yer açıldı. */}
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
              <span className="text-white font-semibold">Hakkımızda</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Hakkımızda
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              30 yıldır ahşap işçiliğinde ustalaşan bir aile geleneği
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

      {/* Hikayemiz */}
      <section className="container mx-auto px-4 py-16 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sol: Görsel */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-amber-400 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                {/* Placeholder - Gerçek görsel ekleyebilirsiniz */}
                <div className="text-8xl">
                  🪵
                </div>
              </div>
              {/* Dekoratif element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500 rounded-2xl -z-10"></div>
            </div>

            {/* Sağ: İçerik */}
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-amber-600">Ahşap Atölye</strong>, 1995 yılında küçük bir atölyede başlayan yolculuğuyla bugün Türkiyenin önde gelen özel tasarım mobilya üreticilerinden biri haline gelmiştir.
                </p>
                <p>
                  Kurucumuz <strong>Ahmet Usta</strong>nın ahşap sevgisi ve ustalığı, üç kuşaktır süren bir aile geleneğinin devamıdır. Dededen babaya, babadan oğula geçen bu zanaat, modern teknoloji ile birleşerek günümüzün estetik ve fonksiyonel ihtiyaçlarına cevap veren eserler ortaya koymaktadır.
                </p>
                <p>
                  30 yılı aşkın süredir binlerce müşterimize hizmet veren atölyemiz, her projeyi bir sanat eseri titizliğiyle ele alır. Mutfak dolaplarından giyinme odalarına, özel tasarım mobilyalardan tamirat hizmetlerine kadar geniş bir yelpazede çözümler sunuyoruz.
                </p>
                <p className="text-amber-600 font-semibold italic">
                  Her ahşap parçası bir hikaye anlatır, biz de bu hikayeleri evinizde yaşatıyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İşimizi şekillendiren ve her projeye yansıttığımız temel prensiplerimiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 transform hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kalite</h3>
              <p className="text-gray-600">
                En yüksek standartlarda malzeme ve işçilik garantisi
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 transform hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Müşteri Odaklı</h3>
              <p className="text-gray-600">
                İhtiyaçlarınızı dinler, beklentilerinizi aşarız
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 transform hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Yenilikçilik</h3>
              <p className="text-gray-600">
                Geleneksel ustalık ve modern teknolojinin birleşimi
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 transform hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sürdürülebilirlik</h3>
              <p className="text-gray-600">
                Çevreye duyarlı, doğal ve sertifikalı malzemeler
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rakamlarla Biz */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Rakamlarla Ahşap Atölye
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Başarılarımızı ve deneyimimizi gösteren sayılar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
            <div className="text-5xl font-bold mb-2">30+</div>
            <div className="text-lg opacity-90">Yıllık Deneyim</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
            <div className="text-5xl font-bold mb-2">5000+</div>
            <div className="text-lg opacity-90">Tamamlanan Proje</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
            <div className="text-5xl font-bold mb-2">%98</div>
            <div className="text-lg opacity-90">Müşteri Memnuniyeti</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
            <div className="text-5xl font-bold mb-2">15</div>
            <div className="text-lg opacity-90">Uzman Ekip</div>
          </div>
        </div>
      </section>

      {/* Ekibimiz */}
      <section className="bg-gradient-to-b from-white to-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ekibimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uzman ve deneyimli kadromuzla her projede mükemmeliyeti hedefliyoruz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Ekip Üyesi 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all">
              <div className="aspect-square bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white text-6xl">
                👨‍🔧
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Ahmet Yılmaz</h3>
                <p className="text-amber-600 font-semibold mb-3">Kurucu & Usta Marangoz</p>
                <p className="text-gray-600 text-sm">
                  35 yıllık deneyimi ile atölyemizin temelini oluşturan usta marangozumuz
                </p>
              </div>
            </div>

            {/* Ekip Üyesi 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all">
              <div className="aspect-square bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white text-6xl">
                👨‍💼
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Mehmet Demir</h3>
                <p className="text-amber-600 font-semibold mb-3">Proje Yöneticisi</p>
                <p className="text-gray-600 text-sm">
                  Müşteri ilişkileri ve proje yönetiminde 15 yıllık tecrübe
                </p>
              </div>
            </div>

            {/* Ekip Üyesi 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all">
              <div className="aspect-square bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white text-6xl">
                👩‍🎨
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Ayşe Kaya</h3>
                <p className="text-amber-600 font-semibold mb-3">İç Mimar</p>
                <p className="text-gray-600 text-sm">
                  Modern tasarım ve fonksiyonellik konusunda uzman iç mimarımız
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sertifikalar & Ödüller */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Sertifikalar & Ödüller
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kalitemizi tescilleyen belgeler ve aldığımız ödüller
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-3">🏆</div>
              <h4 className="font-bold text-gray-800 mb-1">ISO 9001</h4>
              <p className="text-sm text-gray-600">Kalite Yönetim Sistemi</p>
            </div>

            <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-3">🌿</div>
              <h4 className="font-bold text-gray-800 mb-1">FSC</h4>
              <p className="text-sm text-gray-600">Sürdürülebilir Orman Yönetimi</p>
            </div>

            <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-3">⭐</div>
              <h4 className="font-bold text-gray-800 mb-1">TSE</h4>
              <p className="text-sm text-gray-600">Türk Standartları Enstitüsü</p>
            </div>

            <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-3">🎖️</div>
              <h4 className="font-bold text-gray-800 mb-1">Yılın Atölyesi</h4>
              <p className="text-sm text-gray-600">2023 İstanbul Ticaret Odası</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Siz de Bize Katılın
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Hayalinizdeki projeyi birlikte gerçekleştirelim
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/teklif-al"
              className="px-8 py-4 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transform hover:scale-105 transition-all shadow-xl"
            >
              Ücretsiz Teklif Al
            </Link>
            <Link
              href="/galeri"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-900 transform hover:scale-105 transition-all"
            >
              Projelerimizi İnceleyin
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}