'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface Teklif {
  _id: string;
  adSoyad: string;
  email: string;
  telefon: string;
  adres?: string;
  hizmet: string;
  genislik: number;
  yukseklik: number;
  derinlik: number;
  malzeme: string;
  ekOzellikler: string[];
  cekmeceAdedi: number;
  fiyatDetay: {
    temelFiyat: number;
    malzemeFiyat: number;
    ekOzelliklerFiyat: number;
    cekmeceFiyat: number;
    toplamFiyat: number;
  };
  notlar?: string;
  durum: string;
  createdAt: string;
}

export default function TekliflerPage() {
  const { isAdmin, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();

  const [teklifler, setTeklifler] = useState<Teklif[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('Tümü');
  const [selectedTeklif, setSelectedTeklif] = useState<Teklif | null>(null);

  const durumlar = ['Tümü', 'beklemede', 'inceleniyor', 'teklif-gonderildi', 'onaylandi', 'reddedildi'];
  const durumLabels: { [key: string]: string } = {
    'beklemede': 'Beklemede',
    'inceleniyor': 'İnceleniyor',
    'teklif-gonderildi': 'Teklif Gönderildi',
    'onaylandi': 'Onaylandı',
    'reddedildi': 'Reddedildi'
  };

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
      fetchTeklifler();
    }
  }, [isAdmin]);

  const fetchTeklifler = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/teklif', {
        headers: {
          'Authorization': token || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Teklifler yüklenirken hata oluştu');
      }

      setTeklifler(data.data || []);
    } catch (error) {
      setHata(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeklifler = filter === 'Tümü'
    ? teklifler
    : teklifler.filter(t => t.durum === filter);

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
      case 'beklemede': return 'bg-blue-100 text-blue-800';
      case 'inceleniyor': return 'bg-yellow-100 text-yellow-800';
      case 'teklif-gonderildi': return 'bg-purple-100 text-purple-800';
      case 'onaylandi': return 'bg-green-100 text-green-800';
      case 'reddedildi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHizmetIcon = (hizmet: string) => {
    switch (hizmet.toLowerCase()) {
      case 'mutfak dolabı': return '🍳';
      case 'gardırop': return '👔';
      case 'vestiyer': return '🚪';
      case 'tv ünitesi': return '📺';
      default: return '🪑';
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
      <section className="relative bg-gradient-to-r from-indigo-900 to-indigo-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-indigo-200">
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Panel
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-semibold">Teklifler</span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-semibold"
              >
                Çıkış
              </button>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">📋 Teklif Talepleri</h1>
            <p className="text-xl text-indigo-100">Müşteri teklif taleplerini görüntüleyin ve yönetin</p>
          </div>
        </div>
      </section>

      {/* Filtreler */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('Tümü')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'Tümü'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
              }`}
            >
              Tümü <span className="ml-2 text-sm">({teklifler.length})</span>
            </button>
            {durumlar.filter(d => d !== 'Tümü').map(durum => (
              <button
                key={durum}
                onClick={() => setFilter(durum)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === durum
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {durumLabels[durum]}
                <span className="ml-2 text-sm">
                  ({teklifler.filter(t => t.durum === durum).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Teklifler Listesi */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {hata && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {hata}
            </div>
          )}

          {filteredTeklifler.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Teklif Bulunamadı</h3>
              <p className="text-gray-600">
                {filter === 'Tümü' ? 'Henüz hiç teklif talebi yok.' : `"${durumLabels[filter] || filter}" durumunda teklif bulunamadı.`}
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
                        Hizmet
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Malzeme
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Toplam Fiyat
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
                    {filteredTeklifler.map((teklif) => (
                      <tr key={teklif._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-gray-900">{teklif.adSoyad}</div>
                            <div className="text-sm text-gray-500">{teklif.telefon}</div>
                            <div className="text-sm text-gray-500">{teklif.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getHizmetIcon(teklif.hizmet)}</span>
                            <span className="font-semibold text-gray-900">{teklif.hizmet}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{teklif.malzeme}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-indigo-600 text-lg">
                            {teklif.fiyatDetay.toplamFiyat.toLocaleString('tr-TR')}₺
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDurumColor(teklif.durum)}`}>
                            {durumLabels[teklif.durum] || teklif.durum}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(teklif.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedTeklif(teklif)}
                            className="text-indigo-600 hover:text-indigo-700 font-semibold"
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
      {selectedTeklif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTeklif(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Teklif Detayı</h2>
                  <p className="text-indigo-100 mt-1">#{selectedTeklif._id.slice(-8)}</p>
                </div>
                <button
                  onClick={() => setSelectedTeklif(null)}
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
                  <div><span className="font-semibold">Ad Soyad:</span> {selectedTeklif.adSoyad}</div>
                  <div><span className="font-semibold">Telefon:</span> {selectedTeklif.telefon}</div>
                  <div><span className="font-semibold">Email:</span> {selectedTeklif.email}</div>
                  {selectedTeklif.adres && (
                    <div><span className="font-semibold">Adres:</span> {selectedTeklif.adres}</div>
                  )}
                </div>
              </div>

              {/* Proje Bilgileri */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Proje Detayları</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-semibold">Hizmet:</span>
                    <span className="ml-2">{getHizmetIcon(selectedTeklif.hizmet)} {selectedTeklif.hizmet}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Ölçüler:</span>
                    <span className="ml-2">{selectedTeklif.genislik}cm × {selectedTeklif.yukseklik}cm × {selectedTeklif.derinlik}cm</span>
                  </div>
                  <div><span className="font-semibold">Malzeme:</span> {selectedTeklif.malzeme}</div>
                  {selectedTeklif.ekOzellikler.length > 0 && (
                    <div>
                      <span className="font-semibold">Ek Özellikler:</span>
                      <div className="flex gap-2 mt-1">
                        {selectedTeklif.ekOzellikler.map((ozellik, idx) => (
                          <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                            {ozellik === 'cnc' ? '⚙️ CNC İşleme' : '🪞 Ayna Kaplama'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div><span className="font-semibold">Çekmece Adedi:</span> {selectedTeklif.cekmeceAdedi} adet</div>
                </div>
              </div>

              {/* Fiyat Detayları */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Fiyat Detayları</h3>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Temel Fiyat:</span>
                    <span className="font-semibold">{selectedTeklif.fiyatDetay.temelFiyat.toLocaleString('tr-TR')}₺</span>
                  </div>
                  {selectedTeklif.fiyatDetay.malzemeFiyat > 0 && (
                    <div className="flex justify-between">
                      <span>Malzeme Ek Ücreti:</span>
                      <span className="font-semibold">+{selectedTeklif.fiyatDetay.malzemeFiyat.toLocaleString('tr-TR')}₺</span>
                    </div>
                  )}
                  {selectedTeklif.fiyatDetay.ekOzelliklerFiyat > 0 && (
                    <div className="flex justify-between">
                      <span>Ek Özellikler:</span>
                      <span className="font-semibold">+{selectedTeklif.fiyatDetay.ekOzelliklerFiyat.toLocaleString('tr-TR')}₺</span>
                    </div>
                  )}
                  {selectedTeklif.fiyatDetay.cekmeceFiyat > 0 && (
                    <div className="flex justify-between">
                      <span>Çekmece Ücreti:</span>
                      <span className="font-semibold">+{selectedTeklif.fiyatDetay.cekmeceFiyat.toLocaleString('tr-TR')}₺</span>
                    </div>
                  )}
                  <div className="border-t-2 border-indigo-200 pt-2 mt-2"></div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Toplam Fiyat:</span>
                    <span className="font-bold text-indigo-600">{selectedTeklif.fiyatDetay.toplamFiyat.toLocaleString('tr-TR')}₺</span>
                  </div>
                </div>
              </div>

              {/* Teklif Durumu */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Teklif Durumu</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="font-semibold">Durum:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getDurumColor(selectedTeklif.durum)}`}>
                      {durumLabels[selectedTeklif.durum] || selectedTeklif.durum}
                    </span>
                  </div>
                  <div><span className="font-semibold">Talep Tarihi:</span> {formatDate(selectedTeklif.createdAt)}</div>
                  {selectedTeklif.notlar && (
                    <div><span className="font-semibold">Notlar:</span> {selectedTeklif.notlar}</div>
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
