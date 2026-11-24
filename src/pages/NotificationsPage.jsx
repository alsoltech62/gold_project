import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertCircle, Sparkles, Languages, Eye, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('gold_user_lang') || 'en');
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchNotifications(lang);
  }, [lang]);

  const fetchNotifications = async (currentLang = lang) => {
    setLoading(true);
    try {
      const response = await api.get(`/user/notifications.php?lang=${currentLang}`);
      const data = response.data;
      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        toast.error(data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      toast.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('gold_user_lang', newLang);
    // Also inform backend of user's language choice
    api.post('/user/update_language.php', { language: newLang }).catch(() => {});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <span>{lang === 'hi' ? 'अधिसूचनाएं' : 'Notifications'}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {lang === 'hi'
              ? 'आपके खाते, बाज़ार दरों और विशेष ऑफ़र के सभी अपडेट'
              : 'All updates about your account, market rates, and special offers'}
          </p>
        </div>

        {/* Hindi / English Switcher */}
        <div className="flex items-center bg-gray-800 p-1.5 rounded-xl border border-gray-700 self-start sm:self-auto">
          <Languages className="w-4 h-4 text-primary ml-2 mr-1" />
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              lang === 'en'
                ? 'bg-primary text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              lang === 'hi'
                ? 'bg-primary text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
          <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300">
            {lang === 'hi' ? 'कोई अधिसूचना नहीं मिली' : 'No notifications found'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {lang === 'hi'
              ? 'नई सूचनाएं और घोषणाएं यहाँ दिखाई देंगी।'
              : 'New updates and announcements will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const displayTitle = lang === 'hi' ? (notification.title_hi || notification.title) : (notification.title_en || notification.title);
            const displayMsg = lang === 'hi' ? (notification.message_hi || notification.message) : (notification.message_en || notification.message);
            const banner = notification.image_url;

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={notification.id}
                className="bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all overflow-hidden shadow-lg"
              >
                {/* Optional Banner Image */}
                {banner && (
                  <div
                    onClick={() => setSelectedBanner(banner)}
                    className="relative w-full h-44 sm:h-52 bg-black cursor-pointer group overflow-hidden border-b border-gray-700"
                  >
                    <img
                      src={banner.startsWith('http') ? banner : `/${banner}`}
                      alt="Notification Banner"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'बड़ा देखें' : 'View Banner'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-5 flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 shrink-0">
                    {notification.type === 'transaction' ? (
                      <AlertCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <Bell className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold text-white">
                        {displayTitle}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mt-1">
                      {displayMsg}
                    </p>

                    {/* Secondary translation indicator if opposite language available */}
                    {lang === 'en' && notification.title_hi && notification.title_hi !== notification.title_en && (
                      <details className="mt-2 text-xs text-yellow-400/80 cursor-pointer">
                        <summary className="hover:underline select-none">
                          हिंदी में पढ़ें (Read in Hindi)
                        </summary>
                        <div className="p-2.5 mt-1 bg-gray-900/60 rounded-lg border border-yellow-500/10">
                          <p className="font-semibold">{notification.title_hi}</p>
                          <p className="text-gray-300 mt-0.5">{notification.message_hi}</p>
                        </div>
                      </details>
                    )}
                    {lang === 'hi' && notification.title_en && notification.title_en !== notification.title_hi && (
                      <details className="mt-2 text-xs text-primary/80 cursor-pointer">
                        <summary className="hover:underline select-none">
                          Read in English
                        </summary>
                        <div className="p-2.5 mt-1 bg-gray-900/60 rounded-lg border border-primary/10">
                          <p className="font-semibold">{notification.title_en}</p>
                          <p className="text-gray-300 mt-0.5">{notification.message_en}</p>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
            >
              <button
                onClick={() => setSelectedBanner(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedBanner.startsWith('http') ? selectedBanner : `/${selectedBanner}`}
                alt="Banner full preview"
                className="w-full max-h-[85vh] object-contain bg-black"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
