'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface Siparis {
  _id: string;
  musteriAdi: string;
  telefon: string;
  adres: string;
  urun: {
    ad: string;
    kod: string;
    fiyat: number;
    kategori: string;
  };
  durum: string;
  notlar?: string;
  tarih: string;
  createdAt: string;
}

export default function SiparislerPage() {
  const { isAdmin, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();

  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('Tümü');
  const [selectedSiparis, setSelectedSiparis] = useState<Siparis | null>(null);

  const durumlar = ['Tümü', 'Yeni', 'İşlemde', 'Üretimde', 'Tamamlandı', 'İptal'];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin-login');
    } else if (!isAdmin) {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchSiparisler();
    }
  }, [isAdmin]);

  const fetchSiparisler = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/siparisler', {
        headers: {
          'Authorization': token || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Siparişler yüklenirken hata oluştu');
      }

      setSiparisler(data.data || []);
    } catch (error) {
      setHata(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredSiparisler = filter === 'Tümü'
    ? siparisler
    : siparisler.filter(s => s.durum === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Yeni': return 'bg-blue-100 text-blue-800';
      case 'İşlemde': return 'bg-yellow-100 text-yellow-800';
      case 'Üretimde': return 'bg-purple-100 text-purple-800';
      case 'Tamamlandı': return 'bg-green-100 text-green-800';
      case 'İptal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-green-200">
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Panel
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-semibold">Siparişler</span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-semibold"
              >
                Çıkış
              </button>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">📦 Siparişler</h1>
            <p className="text-xl text-green-100">Tüm siparişleri görüntüleyin ve yönetin</p>
          </div>
        </div>
      </section>

      {/* Filtreler */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6">
            {durumlar.map(durum => (
              <button
                key={durum}
                onClick={() => setFilter(durum)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === durum
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
                }`}
              >
                {durum}
                {durum !== 'Tümü' && (
                  <span className="ml-2 text-sm">
                    ({siparisler.filter(s => s.durum === durum).length})
                  </span>
                )}
                {durum === 'Tümü' && (
                  <span className="ml-2 text-sm">({siparisler.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Siparişler Listesi */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {hata && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {hata}
            </div>
          )}

          {filteredSiparisler.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sipariş Bulunamadı</h3>
              <p className="text-gray-600">
                {filter === 'Tümü' ? 'Henüz hiç sipariş yok.' : `"${filter}" durumunda sipariş bulunamadı.`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ürün
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fiyat
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSiparisler.map((siparis) => (
                      <tr key={siparis._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-gray-900">{siparis.musteriAdi}</div>
                            <div className="text-sm text-gray-500">{siparis.telefon}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{siparis.urun.ad}</div>
                            <div className="text-sm text-gray-500">{siparis.urun.kod}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            {siparis.urun.fiyat.toLocaleString('tr-TR')}₺
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDurumColor(siparis.durum)}`}>
                            {siparis.durum}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(siparis.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedSiparis(siparis)}
                            className="text-green-600 hover:text-green-700 font-semibold"
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Detay Modal */}
      {selectedSiparis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSiparis(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Sipariş Detayı</h2>
                  <p className="text-green-100 mt-1">#{selectedSiparis._id.slice(-8)}</p>
                </div>
                <button
                  onClick={() => setSelectedSiparis(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Müşteri Bilgileri */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Müşteri Bilgileri</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div><span className="font-semibold">Ad Soyad:</span> {selectedSiparis.musteriAdi}</div>
                  <div><span className="font-semibold">Telefon:</span> {selectedSiparis.telefon}</div>
                  <div><span className="font-semibold">Adres:</span> {selectedSiparis.adres}</div>
                </div>
              </div>

              {/* Ürün Bilgileri */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Ürün Bilgileri</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div><span className="font-semibold">Ürün Adı:</span> {selectedSiparis.urun.ad}</div>
                  <div><span className="font-semibold">Ürün Kodu:</span> {selectedSiparis.urun.kod}</div>
                  <div><span className="font-semibold">Kategori:</span> {selectedSiparis.urun.kategori}</div>
                  <div><span className="font-semibold">Fiyat:</span> <span className="text-green-600 font-bold text-lg">{selectedSiparis.urun.fiyat.toLocaleString('tr-TR')}₺</span></div>
                </div>
              </div>

              {/* Sipariş Bilgileri */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Sipariş Durumu</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="font-semibold">Durum:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getDurumColor(selectedSiparis.durum)}`}>
                      {selectedSiparis.durum}
                    </span>
                  </div>
                  <div><span className="font-semibold">Sipariş Tarihi:</span> {formatDate(selectedSiparis.createdAt)}</div>
                  {selectedSiparis.notlar && (
                    <div><span className="font-semibold">Notlar:</span> {selectedSiparis.notlar}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
