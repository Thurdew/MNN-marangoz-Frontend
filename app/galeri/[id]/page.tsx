import Link from 'next/link';
// Mağazada kullandığımız galeri bileşenini burada da kullanabiliriz!
import ProductGallery from '../../components/ProductGallery';

// --- TİP TANIMLAMALARI ---
interface RichTextBlock {
  type: string;
  children: { type: string; text: string; }[];
}

interface StrapiImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}

interface ProjeDetay {
  id: number;
  Baslik: string;
  Aciklama: RichTextBlock[];
  KapakFotografi: StrapiImage;
  GaleriFotograflari: StrapiImage[]; // Strapi'de bu alanı oluşturmuştuk
}

// --- VERİ ÇEKME ---
async function getProjeDetay(id: string) {
  try {
    // Strapi v5: ID ile filtreleme yapıyoruz
    const res = await fetch(`http://localhost:1337/api/proje-galeris?filters[id][$eq]=${id}&populate=*`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    
    if (!json.data || json.data.length === 0) {
      return null;
    }

    const data = json.data[0];

    // Veriyi düzenle
    const proje: ProjeDetay = {
      id: data.id,
      Baslik: data.Baslik,
      Aciklama: data.Aciklama,
      KapakFotografi: data.KapakFotografi,
      GaleriFotograflari: data.GaleriFotograflari || [],
    };

    return proje;
  } catch (error) {
    console.error('Hata:', error);
    return null;
  }
}

// --- SAYFA BİLEŞENİ ---
export default async function ProjeDetayPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const proje = await getProjeDetay(id);

  if (!proje) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Proje Bulunamadı</h1>
        <Link href="/galeri" className="text-amber-600 hover:underline">Galeriye Dön</Link>
      </div>
    );
  }

  // Kapak fotoğrafı ile diğer galeri fotoğraflarını tek bir dizide birleştiriyoruz
  // Böylece kullanıcı hepsini tek bir albümde görebilir.
  const tumResimler = [proje.KapakFotografi, ...proje.GaleriFotograflari];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/galeri" className="hover:text-amber-600 transition-colors">Galeri</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-800 font-semibold truncate">{proje.Baslik}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Üst Kısım: Başlık */}
          <div className="p-8 lg:p-12 border-b border-gray-100 text-center">
             <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold rounded-full mb-4 tracking-wide uppercase">
                Tamamlanan Proje
             </span>
             <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{proje.Baslik}</h1>
          </div>

          {/* Orta Kısım: Galeri ve İçerik */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* SOL (veya Üst): Resim Galerisi */}
            <div className="lg:col-span-7 p-6 lg:p-10 bg-gray-50 border-r border-gray-100">
              {/* Mağaza için yazdığımız galeri bileşenini burada yeniden kullanıyoruz */}
              <ProductGallery images={tumResimler} />
            </div>

            {/* SAĞ (veya Alt): Proje Detayları */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                Proje Hikayesi
              </h3>
              
              <div className="text-gray-600 leading-relaxed space-y-4 text-lg">
                {proje.Aciklama.map((blok, index) => (
                   <p key={index}>{blok.children[0]?.text}</p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Bu projeyi beğendiniz mi?</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                   <Link 
                     href="/teklif-al" 
                     className="flex-1 text-center bg-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                   >
                     Benzer Bir Proje İçin Teklif Al
                   </Link>
                   <Link 
                     href="/iletisim" 
                     className="flex-1 text-center border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:border-amber-600 hover:text-amber-600 transition-colors"
                   >
                     Bilgi Al
                   </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}