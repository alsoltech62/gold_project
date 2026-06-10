import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/user/notifications.php');
      const data = response.data;
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        toast.error(data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      toast.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Notifications</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={notification.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-start space-x-4"
            >
              <div className="bg-primary/10 p-3 rounded-full">
                {notification.type === 'transaction' ? (
                  <AlertCircle className="w-6 h-6 text-primary" />
                ) : (
                  <Bell className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                <p className="text-gray-400 mt-1">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
