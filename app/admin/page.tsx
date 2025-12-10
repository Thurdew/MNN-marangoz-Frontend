'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import ImageUploader from '../components/ImageUploader';

type EklemeYeri = 'magaza' | 'galeri';

export default function AdminPage() {
  const { user, isAdmin, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  
  const [eklemeYeri, setEklemeYeri] = useState<EklemeYeri>('magaza');
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);
  const [magazaImageUrls, setMagazaImageUrls] = useState<string[]>([]);
  const [galeriImageUrls, setGaleriImageUrls] = useState<string[]>([]);

  // Mağaza için form data
  const [magazaForm, setMagazaForm] = useState({
    ad: '',
    kod: '',
    fiyat: '',
    kategori: 'Mutfak',
    aciklama: '',
    malzeme: '',
    genislik: '',
    yukseklik: '',
    derinlik: '',
    resimUrl: ''
  });

  // Galeri için form data
  const [galeriForm, setGaleriForm] = useState({
    baslik: '',
    aciklama: '',
    kategori: 'Mutfak',
    musteriAdi: '',
    konum: '',
    tamamlanmaTarihi: '',
    resimUrl: ''
  });

  const kategoriler = ['Mutfak', 'Yatak Odası', 'Salon', 'Banyo', 'Özel Tasarım', 'Diğer'];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin-login');
    } else if (!isAdmin) {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleMagazaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setMagazaForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setHata(null);
    setBasari(null);
  };

  const handleGaleriChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setGaleriForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setHata(null);
    setBasari(null);
  };

  // Resim yükleme fonksiyonu
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    setUploadingImages(true);
    setHata(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': token || ''
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Resimler yüklenirken hata oluştu');
      }

      // Backend'den dönen URL'leri tam URL'ye çevir
      const fullUrls = data.urls.map((url: string) => `http://localhost:5000${url}`);
      return fullUrls;
    } catch (error) {
      setHata(error instanceof Error ? error.message : 'Resim yükleme hatası');
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  // Mağaza resimleri seçildiğinde
  const handleMagazaImagesSelected = async (files: File[]) => {
    const urls = await uploadImages(files);
    if (urls.length > 0) {
      setMagazaImageUrls(urls);
      setMagazaForm(prev => ({ ...prev, resimUrl: urls.join(', ') }));
    }
  };

  // Galeri resimleri seçildiğinde
  const handleGaleriImagesSelected = async (files: File[]) => {
    const urls = await uploadImages(files);
    if (urls.length > 0) {
      setGaleriImageUrls(urls);
      setGaleriForm(prev => ({ ...prev, resimUrl: urls.join(', ') }));
    }
  };

  const handleMagazaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHata(null);

    try {
      const resimUrlArray = magazaForm.resimUrl.split(',').map(url => url.trim()).filter(url => url !== '');

      const payload = {
        ad: magazaForm.ad,
        kod: magazaForm.kod.toUpperCase(),
        fiyat: parseFloat(magazaForm.fiyat),
        kategori: magazaForm.kategori,
        aciklama: magazaForm.aciklama,
        malzeme: magazaForm.malzeme,
        olculer: {
          genislik: magazaForm.genislik ? parseFloat(magazaForm.genislik) : undefined,
          yukseklik: magazaForm.yukseklik ? parseFloat(magazaForm.yukseklik) : undefined,
          derinlik: magazaForm.derinlik ? parseFloat(magazaForm.derinlik) : undefined,
        },
        resimUrl: resimUrlArray
      };

      const response = await fetch('http://localhost:5000/api/urunler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ürün eklenirken bir hata oluştu');
      }

      setBasari('Ürün mağazaya başarıyla eklendi!');
      setMagazaForm({
        ad: '', kod: '', fiyat: '', kategori: 'Mutfak', aciklama: '',
        malzeme: '', genislik: '', yukseklik: '', derinlik: '', resimUrl: ''
      });
      setMagazaImageUrls([]);

      setTimeout(() => setBasari(null), 3000);

    } catch (error) {
      setHata(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGaleriSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHata(null);

    try {
      const resimUrlArray = galeriForm.resimUrl.split(',').map(url => url.trim()).filter(url => url !== '');

      const payload = {
        baslik: galeriForm.baslik,
        aciklama: galeriForm.aciklama,
        kategori: galeriForm.kategori,
        musteriAdi: galeriForm.musteriAdi,
        konum: galeriForm.konum,
        tamamlanmaTarihi: galeriForm.tamamlanmaTarihi || new Date().toISOString(),
        resimUrl: resimUrlArray
      };

      const response = await fetch('http://localhost:5000/api/galeri', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Galeri öğesi eklenirken bir hata oluştu');
      }

      setBasari('İş galeriye başarıyla eklendi!');
      setGaleriForm({
        baslik: '', aciklama: '', kategori: 'Mutfak',
        musteriAdi: '', konum: '', tamamlanmaTarihi: '', resimUrl: ''
      });
      setGaleriImageUrls([]);

      setTimeout(() => setBasari(null), 3000);

    } catch (error) {
      setHata(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Yetkilendiriliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-amber-200">
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-semibold">Admin Panel</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-amber-200">Hoşgeldiniz</div>
                  <div className="font-bold">{user?.adSoyad}</div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-semibold"
                >
                  Çıkış
                </button>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">Yönetim Paneli</h1>
            <p className="text-xl text-amber-100">Mağaza ve galeri için içerik ekleyin</p>
          </div>
        </div>
      </section>

      {/* Seçim Butonları */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => setEklemeYeri('magaza')}
            className={`py-4 rounded-xl font-bold text-base transition-all ${
              eklemeYeri === 'magaza'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            🛒 Mağaza
          </button>
          <button
            onClick={() => setEklemeYeri('galeri')}
            className={`py-4 rounded-xl font-bold text-base transition-all ${
              eklemeYeri === 'galeri'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            🖼️ Galeri
          </button>
          <Link
            href="/admin/ayarlar"
            className="py-4 rounded-xl font-bold text-base transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 text-center flex items-center justify-center"
          >
            ⚙️ Ayarlar
          </Link>
          <Link
            href="/admin/siparisler"
            className="py-4 rounded-xl font-bold text-base transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 text-center flex items-center justify-center"
          >
            📦 Siparişler
          </Link>
          <Link
            href="/admin/teklifler"
            className="py-4 rounded-xl font-bold text-base transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 text-center flex items-center justify-center"
          >
            📋 Teklifler
          </Link>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {basari && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{basari}</span>
              </div>
            )}

            {hata && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{hata}</span>
              </div>
            )}

            {/* MAĞAZA FORMU */}
            {eklemeYeri === 'magaza' && (
              <form onSubmit={handleMagazaSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Mağazaya Ürün Ekle</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Adı *</label>
                    <input
                      type="text"
                      name="ad"
                      value={magazaForm.ad}
                      onChange={handleMagazaChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="Modern Mutfak Dolabı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Kodu *</label>
                    <input
                      type="text"
                      name="kod"
                      value={magazaForm.kod}
                      onChange={handleMagazaChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none uppercase"
                      placeholder="URN-001"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fiyat (₺) *</label>
                    <input
                      type="number"
                      name="fiyat"
                      value={magazaForm.fiyat}
                      onChange={handleMagazaChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="25000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                    <select
                      name="kategori"
                      value={magazaForm.kategori}
                      onChange={handleMagazaChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    >
                      {kategoriler.map(kat => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Malzeme *</label>
                  <input
                    type="text"
                    name="malzeme"
                    value={magazaForm.malzeme}
                    onChange={handleMagazaChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Birinci Sınıf MDF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama *</label>
                  <textarea
                    name="aciklama"
                    value={magazaForm.aciklama}
                    onChange={handleMagazaChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none"
                    placeholder="Ürün açıklaması..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Genişlik (cm)</label>
                    <input
                      type="number"
                      name="genislik"
                      value={magazaForm.genislik}
                      onChange={handleMagazaChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yükseklik (cm)</label>
                    <input
                      type="number"
                      name="yukseklik"
                      value={magazaForm.yukseklik}
                      onChange={handleMagazaChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Derinlik (cm)</label>
                    <input
                      type="number"
                      name="derinlik"
                      value={magazaForm.derinlik}
                      onChange={handleMagazaChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Ürün Resimleri * {uploadingImages && <span className="text-amber-600">(Yükleniyor...)</span>}
                  </label>
                  <ImageUploader
                    onImagesSelected={handleMagazaImagesSelected}
                    multiple={true}
                    maxFiles={10}
                  />
                  {magazaImageUrls.length > 0 && (
                    <p className="mt-3 text-sm text-green-600 font-semibold">
                      ✓ {magazaImageUrls.length} resim yüklendi
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all"
                >
                  {loading ? 'Ekleniyor...' : '🛒 Mağazaya Ekle'}
                </button>
              </form>
            )}

            {/* GALERİ FORMU */}
            {eklemeYeri === 'galeri' && (
              <form onSubmit={handleGaleriSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Galeriye İş Ekle</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İş Başlığı *</label>
                  <input
                    type="text"
                    name="baslik"
                    value={galeriForm.baslik}
                    onChange={handleGaleriChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    placeholder="Özel Tasarım Mutfak Projesi"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                    <select
                      name="kategori"
                      value={galeriForm.kategori}
                      onChange={handleGaleriChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    >
                      {kategoriler.map(kat => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tamamlanma Tarihi</label>
                    <input
                      type="date"
                      name="tamamlanmaTarihi"
                      value={galeriForm.tamamlanmaTarihi}
                      onChange={handleGaleriChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Müşteri Adı</label>
                    <input
                      type="text"
                      name="musteriAdi"
                      value={galeriForm.musteriAdi}
                      onChange={handleGaleriChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Konum</label>
                    <input
                      type="text"
                      name="konum"
                      value={galeriForm.konum}
                      onChange={handleGaleriChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                      placeholder="İstanbul, Türkiye"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    name="aciklama"
                    value={galeriForm.aciklama}
                    onChange={handleGaleriChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none resize-none"
                    placeholder="İş hakkında detaylı açıklama..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    İş Resimleri * {uploadingImages && <span className="text-amber-600">(Yükleniyor...)</span>}
                  </label>
                  <ImageUploader
                    onImagesSelected={handleGaleriImagesSelected}
                    multiple={true}
                    maxFiles={10}
                  />
                  {galeriImageUrls.length > 0 && (
                    <p className="mt-3 text-sm text-green-600 font-semibold">
                      ✓ {galeriImageUrls.length} resim yüklendi
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all"
                >
                  {loading ? 'Ekleniyor...' : '🖼️ Galeriye Ekle'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}