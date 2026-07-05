import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Image as ImageIcon, Power, PowerOff } from 'lucide-react';
import api from '../../utils/api';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = () => {
    setLoading(true);
    api.get('/admin/banners.php')
      .then(res => {
        setBanners(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG and WEBP images are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('banner', file);

    setUploading(true);
    try {
      const res = await api.post('/admin/banners.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Banner uploaded successfully');
        fetchBanners();
      } else {
        toast.error(res.data.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Network error. Failed to upload.');
    }
    setUploading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.put(`/admin/banners.php?id=${id}`, { is_active: currentStatus ? 0 : 1 });
      if (res.data.success) {
        toast.success('Status updated');
        fetchBanners();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await api.delete(`/admin/banners.php?id=${id}`);
      if (res.data.success) {
        toast.success('Banner deleted');
        fetchBanners();
      }
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  // Helper to resolve image URL if backend is on a different port/domain
  // Currently api.defaults.baseURL is used for API, we can guess the root URL
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    return `${baseUrl}/${path}`;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Manage Banners</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Upload and toggle dashboard carousel banners</p>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <button className="btn-gold flex items-center gap-2 px-6 py-3 w-full justify-center" disabled={uploading}>
            {uploading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <><Plus size={18} /> Upload New Banner</>}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl"></div>)}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <ImageIcon className="mx-auto text-white/20 mb-4" size={48} />
          <p className="text-white/40 font-bold uppercase tracking-widest text-sm">No banners found</p>
          <p className="text-white/20 text-xs mt-2">Upload a banner to show it on the dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className={`relative group card-premium p-4 border overflow-hidden ${banner.is_active ? 'border-[#D4AF37]/30' : 'border-white/10 opacity-70'}`}>
              <div className="aspect-[21/9] w-full rounded-xl overflow-hidden bg-black mb-4 relative">
                <img src={getImageUrl(banner.image_url)} alt="Banner" className="w-full h-full object-cover" />
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white/80 font-bold tracking-widest uppercase text-sm border border-white/20 px-3 py-1 rounded-lg">Inactive</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => toggleStatus(banner.id, banner.is_active)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${banner.is_active ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                >
                  {banner.is_active ? <Power size={14} /> : <PowerOff size={14} />}
                  {banner.is_active ? 'Active' : 'Activate'}
                </button>
                <button 
                  onClick={() => deleteBanner(banner.id)}
                  className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
