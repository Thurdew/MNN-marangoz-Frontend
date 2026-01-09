'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface GaleriOgesi {
  _id: string;
  baslik: string;
  aciklama: string;
  kategori: string;
  musteriAdi: string;
  konum: string;
  resimUrl: string[];
  tamamlanmaTarihi: string;
}

export default function GaleriYonetimPage() {
  const { isAdmin, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();

  const [galeriOgeleri, setGaleriOgeleri] = useState<GaleriOgesi[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [editModal, setEditModal] = useState<{ open: boolean; oge: GaleriOgesi | null }>({ open: false, oge: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; ogeId: string | null }>({ open: false, ogeId: null });
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    baslik: '',
    aciklama: '',
    kategori: '',
    musteriAdi: '',
    konum: '',
    tamamlanmaTarihi: ''
  });

  const kategoriler = ['Mutfak', 'Yatak Odası', 'Salon', 'Banyo', 'Özel Tasarım', 'Diğer'];

  // Railway Backend URL
  const BACKEND_URL = 'https://keen-sparkle-production.up.railway.app';

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
      fetchGaleri();
    }
  }, [isAdmin, token]);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/galeri`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();
      setGaleriOgeleri(data.data || data);
      setLoading(false);
    } catch (error) {
      setHata('Galeri yüklenirken hata oluştu');
      setLoading(false);
    }
  };

  const openEditModal = (oge: GaleriOgesi) => {
    setEditForm({
      baslik: oge.baslik,
      aciklama: oge.aciklama,
      kategori: oge.kategori,
      musteriAdi: oge.musteriAdi,
      konum: oge.konum,
      tamamlanmaTarihi: oge.tamamlanmaTarihi ? new Date(oge.tamamlanmaTarihi).toISOString().split('T')[0] : ''
    });
    setEditModal({ open: true, oge });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, oge: null });
    setEditForm({
      baslik: '', aciklama: '', kategori: '',
      musteriAdi: '', konum: '', tamamlanmaTarihi: ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.oge || !token) return;

    setSubmitting(true);
    try {
      const payload = {
        baslik: editForm.baslik,
        aciklama: editForm.aciklama,
        kategori: editForm.kategori,
        musteriAdi: editForm.musteriAdi,
        konum: editForm.konum,
        tamamlanmaTarihi: editForm.tamamlanmaTarihi || new Date().toISOString()
      };

      const response = await fetch(`${BACKEND_URL}/api/galeri/${editModal.oge._id}`, {
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

      showToast('Galeri öğesi başarıyla güncellendi!', 'success');
      closeEditModal();
      fetchGaleri();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Güncelleme hatası', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.ogeId || !token) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/galeri/${deleteModal.ogeId}`, {
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

      showToast('Galeri öğesi başarıyla silindi!', 'success');
      setDeleteModal({ open: false, ogeId: null });
      fetchGaleri();
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
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
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
      <section className="relative bg-gradient-to-r from-purple-900 to-purple-700 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-purple-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-semibold">Galeri Yönetimi</span>
            </div>

            <h1 className="text-5xl font-bold mb-4">Galeri Yönetimi</h1>
            <p className="text-xl text-purple-100">Tamamlanmış projeleri düzenleyin veya silin</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600 font-semibold">Galeri yükleniyor...</p>
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
          ) : galeriOgeleri.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Henüz galeri öğesi eklenmemiş</p>
              <Link href="/admin" className="mt-4 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                Galeri Öğesi Ekle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galeriOgeleri.map((oge) => (
                <div key={oge._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <img
                      src={getImageUrl(oge.resimUrl)}
                      alt={oge.baslik}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EResim Yok%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                        {oge.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{oge.baslik}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{oge.aciklama}</p>

                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      {oge.musteriAdi && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{oge.musteriAdi}</span>
                        </div>
                      )}
                      {oge.konum && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{oge.konum}</span>
                        </div>
                      )}
                      {oge.tamamlanmaTarihi && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(oge.tamamlanmaTarihi).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(oge)}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Düzenle
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, ogeId: oge._id })}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {editModal.open && editModal.oge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Galeri Öğesi Düzenle</h2>
              <p className="text-blue-100">{editModal.oge.baslik}</p>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">İş Başlığı *</label>
                <input
                  type="text"
                  value={editForm.baslik}
                  onChange={(e) => setEditForm({ ...editForm, baslik: e.target.value })}
                  required
                  className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tamamlanma Tarihi</label>
                  <input
                    type="date"
                    value={editForm.tamamlanmaTarihi}
                    onChange={(e) => setEditForm({ ...editForm, tamamlanmaTarihi: e.target.value })}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Müşteri Adı</label>
                  <input
                    type="text"
                    value={editForm.musteriAdi}
                    onChange={(e) => setEditForm({ ...editForm, musteriAdi: e.target.value })}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Konum</label>
                  <input
                    type="text"
                    value={editForm.konum}
                    onChange={(e) => setEditForm({ ...editForm, konum: e.target.value })}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={editForm.aciklama}
                  onChange={(e) => setEditForm({ ...editForm, aciklama: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none"
                />
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Galeri Öğesini Sil</h3>
              <p className="text-gray-600 mb-6">Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, ogeId: null })}
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