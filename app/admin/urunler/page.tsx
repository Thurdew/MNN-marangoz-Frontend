'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface Urun {
  _id: string;
  ad: string;
  kod: string;
  fiyat: number;
  aciklama: string;
  resimUrl: string[];
  kategori: string;
  malzeme: string;
  olculer?: {
    genislik?: number;
    yukseklik?: number;
    derinlik?: number;
  };
}

export default function UrunYonetimPage() {
  const { isAdmin, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();

  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [editModal, setEditModal] = useState<{ open: boolean; urun: Urun | null }>({ open: false, urun: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; urunId: string | null }>({ open: false, urunId: null });
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    ad: '',
    kod: '',
    fiyat: '',
    kategori: '',
    aciklama: '',
    malzeme: '',
    genislik: '',
    yukseklik: '',
    derinlik: ''
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

  useEffect(() => {
    if (isAdmin && token) {
      fetchUrunler();
    }
  }, [isAdmin, token]);

  const fetchUrunler = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/urunler', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();
      setUrunler(data.data || data);
      setLoading(false);
    } catch (error) {
      setHata('Ürünler yüklenirken hata oluştu');
      setLoading(false);
    }
  };

  const openEditModal = (urun: Urun) => {
    setEditForm({
      ad: urun.ad,
      kod: urun.kod,
      fiyat: urun.fiyat.toString(),
      kategori: urun.kategori,
      aciklama: urun.aciklama,
      malzeme: urun.malzeme,
      genislik: urun.olculer?.genislik?.toString() || '',
      yukseklik: urun.olculer?.yukseklik?.toString() || '',
      derinlik: urun.olculer?.derinlik?.toString() || ''
    });
    setEditModal({ open: true, urun });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, urun: null });
    setEditForm({
      ad: '', kod: '', fiyat: '', kategori: '', aciklama: '',
      malzeme: '', genislik: '', yukseklik: '', derinlik: ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.urun || !token) return;

    setSubmitting(true);
    try {
      const payload = {
        ad: editForm.ad,
        kod: editForm.kod.toUpperCase(),
        fiyat: parseFloat(editForm.fiyat),
        kategori: editForm.kategori,
        aciklama: editForm.aciklama,
        malzeme: editForm.malzeme,
        olculer: {
          genislik: editForm.genislik ? parseFloat(editForm.genislik) : undefined,
          yukseklik: editForm.yukseklik ? parseFloat(editForm.yukseklik) : undefined,
          derinlik: editForm.derinlik ? parseFloat(editForm.derinlik) : undefined,
        }
      };

      const response = await fetch(`http://localhost:5000/api/urunler/${editModal.urun._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Güncelleme başarısız');
      }

      showToast('Ürün başarıyla güncellendi!', 'success');
      closeEditModal();
      fetchUrunler();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Güncelleme hatası', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.urunId || !token) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/urunler/${deleteModal.urunId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Silme başarısız');
      }

      showToast('Ürün başarıyla silindi!', 'success');
      setDeleteModal({ open: false, urunId: null });
      fetchUrunler();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Silme hatası', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getImageUrl = (resimUrl: string | string[]): string => {
    const url = Array.isArray(resimUrl) ? resimUrl[0] : resimUrl;
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
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
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-semibold`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-amber-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-semibold">Ürün Yönetimi</span>
            </div>

            <h1 className="text-5xl font-bold mb-4">Ürün Yönetimi</h1>
            <p className="text-xl text-amber-100">Mağaza ürünlerini düzenleyin veya silin</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600 font-semibold">Ürünler yükleniyor...</p>
            </div>
          ) : hata ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-xl border border-red-200">
                <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Hata</h2>
                <p className="text-gray-600">{hata}</p>
              </div>
            </div>
          ) : urunler.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Henüz ürün eklenmemiş</p>
              <Link href="/admin" className="mt-4 inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors">
                Ürün Ekle
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold">Resim</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Ürün Adı</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Kod</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Fiyat</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Kategori</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {urunler.map((urun) => (
                      <tr key={urun._id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4">
                          <img
                            src={getImageUrl(urun.resimUrl)}
                            alt={urun.ad}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EX%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800">{urun.ad}</div>
                          <div className="text-sm text-gray-500">{urun.malzeme}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{urun.kod}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{urun.fiyat.toLocaleString('tr-TR')} ₺</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                            {urun.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(urun)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Düzenle
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, urunId: urun._id })}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Sil
                            </button>
                          </div>
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

      {/* Edit Modal */}
      {editModal.open && editModal.urun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Ürün Düzenle</h2>
              <p className="text-blue-100">#{editModal.urun.kod}</p>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Adı *</label>
                  <input
                    type="text"
                    value={editForm.ad}
                    onChange={(e) => setEditForm({ ...editForm, ad: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Kodu *</label>
                  <input
                    type="text"
                    value={editForm.kod}
                    onChange={(e) => setEditForm({ ...editForm, kod: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fiyat (₺) *</label>
                  <input
                    type="number"
                    value={editForm.fiyat}
                    onChange={(e) => setEditForm({ ...editForm, fiyat: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                  <select
                    value={editForm.kategori}
                    onChange={(e) => setEditForm({ ...editForm, kategori: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
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
                  value={editForm.malzeme}
                  onChange={(e) => setEditForm({ ...editForm, malzeme: e.target.value })}
                  required
                  className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama *</label>
                <textarea
                  value={editForm.aciklama}
                  onChange={(e) => setEditForm({ ...editForm, aciklama: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Genişlik (cm)</label>
                  <input
                    type="number"
                    value={editForm.genislik}
                    onChange={(e) => setEditForm({ ...editForm, genislik: e.target.value })}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Yükseklik (cm)</label>
                  <input
                    type="number"
                    value={editForm.yukseklik}
                    onChange={(e) => setEditForm({ ...editForm, yukseklik: e.target.value })}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Derinlik (cm)</label>
                  <input
                    type="number"
                    value={editForm.derinlik}
                    onChange={(e) => setEditForm({ ...editForm, derinlik: e.target.value })}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ürünü Sil</h3>
              <p className="text-gray-600 mb-6">Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, urunId: null })}
                  className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
