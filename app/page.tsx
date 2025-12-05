import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
       {/* Arka Plan Görseli */}
<div className="absolute inset-0 z-0">
  {/* Görsel yerine sadece gradient */}
  <div className="absolute inset-0 bg-linear-to-br from-amber-900 via-neutral-800 to-stone-900" />
  
  {/* Ahşap doku pattern overlay */}
  <div 
    className="absolute inset-0 opacity-20"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
  
  {/* Koyu overlay katmanı */}
  <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />
</div>
        {/* İçerik Alanı */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Üst Etiket */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-200 text-sm sm:text-base font-medium tracking-wide">
                30 Yıllık Tecrübe
              </span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Hayalinizdeki Ahşabı
              <span className="block mt-2 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                Şekillendiriyoruz
              </span>
            </h1>

            {/* Alt Açıklama */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              30 yıllık tecrübe ile özel tasarım mutfak, dolap ve yaşam alanı çözümleri sunuyoruz. 
              Her proje, ustalık ve detay odaklı çalışmanın bir yansımasıdır.
            </p>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              {/* Birincil Buton */}
              <Link 
                href="/galeri"
                className="group relative w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg rounded-lg overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/50 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Projelerimizi Görün
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* Hover efekti */}
                <div className="absolute inset-0 bg-linear-to-r from-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>

              {/* İkincil Buton */}
              <Link 
                href="/teklif-al"
                className="group w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white hover:border-amber-500 text-white hover:text-amber-500 font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm hover:bg-white/5 transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Ücretsiz Teklif Al
                  <svg 
                    className="w-5 h-5 transform group-hover:rotate-12 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Güven Göstergeleri */}
            <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto px-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                  1000+
                </div>
                <div className="text-sm sm:text-base text-gray-300">
                  Tamamlanan Proje
                </div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                  30+
                </div>
                <div className="text-sm sm:text-base text-gray-300">
                  Yıllık Deneyim
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                  %100
                </div>
                <div className="text-sm sm:text-base text-gray-300">
                  Müşteri Memnuniyeti
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aşağı Scroll İşareti */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg 
            className="w-6 h-6 text-white/70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Diğer içerikleriniz buraya gelecek */}
    </main>
  );
}