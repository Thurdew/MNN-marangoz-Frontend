// === Sipariş Butonu Kodu (RENK DÜZELTİLDİ: AMBER) (app/components/SiparisButton.tsx) ===

'use client';

interface RichTextBlock { type: string; children: { type: string; text: string; }[]; }
interface StrapiImage { id: number; url: string; width: number; height: number; name: string; }
interface Urun { id: number; UrunAdi: string; UrunKodu: string; Aciklama: RichTextBlock[]; Fiyat: number; Fotograflar: StrapiImage[]; }
interface Props { urun: Urun; }

export default function SiparisButton({ urun }: Props) {

  const handleSiparisVer = async () => {
    
    const siparisDetayi = {
      urunAdi: urun.UrunAdi,
      urunKodu: urun.UrunKodu,
      fiyat: urun.Fiyat,
      adet: 1
    };

    const payload = {
      data: {
        MusteriAdi: "Test Müşterisi",
        MusteriTelefon: "555 123 4567",
        TeslimatAdresi: [
          {
            type: "paragraph",
            children: [{ text: "Deneme mahallesi, Test sokak, No: 1 Daire: 2" }]
          }
        ],
        SiparisDetayiJSON: siparisDetayi,
        Durum: "Yeni"
      }
    };

    try {
      const response = await fetch('http://localhost:1337/api/urun-siparisis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Strapi'den gelen hata detayı:", errorData);
        throw new Error(`Sipariş gönderilemedi. Hata Kodu: ${response.status}`);
      }

      alert(`'${urun.UrunAdi}' için sipariş talebiniz alındı!`);

    } catch (error) {
      console.error('Sipariş Hatası:', error);
      alert('Sipariş oluşturulurken bir hata oluştu. (Konsolu kontrol edin)');
    }
  };

  return (
    <button 
      onClick={handleSiparisVer}
      // DÜZELTME: Mavi renkler (blue-500) yerine Amber (amber-600) kullanıldı.
      className="w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
    >
      <span>Sipariş Ver</span>
      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
}