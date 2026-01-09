'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface PriceSettings {
  metreFiyat: number;
  cekmeceUcretsizLimit: number;
  cekmeceBirimFiyat: number;
  cnc: {
    acik: boolean;
    fiyat: number;
  };
  ayna: {
    acik: boolean;
    fiyat: number;
  };
}

export default function AyarlarPage() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);

  const [ayarlar, setAyarlar] = useState<PriceSettings>({
    metreFiyat: 11000,
    cekmeceUcretsizLimit: 3,
    cekmeceBirimFiyat: 1000,
    cnc: {
      acik: true,
      fiyat: 5000
    },
    ayna: {
      acik: true,
      fiyat: 4000
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin-login');
    } else if (!isAdmin) {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    // LocalStorage'dan ayarları yükle
    const savedSettings = localStorage.getItem('priceSettings');
    if (savedSettings) {
      setAyarlar(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setAyarlar(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PriceSettings] as any),
          [child]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }
      }));
    } else {
      setAyarlar(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHata(null);

    try {
      // LocalStorage'a kaydet (Backend entegrasyonu eklenebilir)
      localStorage.setItem('priceSettings', JSON.stringify(ayarlar));

      setBasari('Fiyat ayarları başarıyla kaydedildi!');
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
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Panel
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-semibold">Ayarlar</span>
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

            <h1 className="text-5xl md:text-6xl font-bold mb-4">Fiyat Ayarları</h1>
            <p className="text-xl text-amber-100">Fiyatlandırma parametrelerini yönetin</p>
          </div>
        </div>
      </section>

      {/* Menü */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Link
            href="/admin"
            className="flex-1 py-4 rounded-xl font-bold text-lg transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 text-center"
          >
            📦 Ürün & Galeri
          </Link>
          <button
            className="flex-1 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
          >
            ⚙️ Ayarlar
          </button>
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
                {basari}
              </div>
            )}

            {hata && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {hata}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Temel Fiyatlandırma */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Temel Fiyatlandırma
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Metrekare Fiyatı (₺)
                    </label>
                    <input
                      type="number"
                      name="metreFiyat"
                      value={ayarlar.metreFiyat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Çekmece Ayarları */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Çekmece Fiyatlandırması
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ücretsiz Çekmece Limiti (adet)
                    </label>
                    <input
                      type="number"
                      name="cekmeceUcretsizLimit"
                      value={ayarlar.cekmeceUcretsizLimit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Çekmece Birim Fiyatı (₺)
                    </label>
                    <input
                      type="number"
                      name="cekmeceBirimFiyat"
                      value={ayarlar.cekmeceBirimFiyat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ek Özellikler */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Ek Özellikler
                </h3>

                <div className="space-y-6">
                  {/* CNC */}
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">⚙️</span>
                        <div>
                          <h4 className="font-bold text-gray-800">CNC İşleme</h4>
                          <p className="text-sm text-gray-600">Hassas CNC kesim ve işleme</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="cnc.acik"
                          checked={ayarlar.cnc.acik}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    {ayarlar.cnc.acik && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fiyat (₺)
                        </label>
                        <input
                          type="number"
                          name="cnc.fiyat"
                          value={ayarlar.cnc.fiyat}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Ayna */}
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🪞</span>
                        <div>
                          <h4 className="font-bold text-gray-800">Ayna Kaplama</h4>
                          <p className="text-sm text-gray-600">Dekoratif ayna kaplama</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="ayna.acik"
                          checked={ayarlar.ayna.acik}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    {ayarlar.ayna.acik && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fiyat (₺)
                        </label>
                        <input
                          type="number"
                          name="ayna.fiyat"
                          value={ayarlar.ayna.fiyat}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kaydet Butonu */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
