import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Clock, Calendar, Repeat, Image as ImageIcon, Trash2, 
  Play, Pause, RefreshCw, CheckCircle, AlertTriangle, Globe, 
  Languages, History, Plus, Search, Eye, Users, Bell, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'schedules', 'history'

  // Form State
  const [isScheduled, setIsScheduled] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [messageHi, setMessageHi] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [targetType, setTargetType] = useState('all'); // 'all', 'specific_user'
  const [targetUserId, setTargetUserId] = useState('');
  
  // Scheduling State
  const [scheduledAt, setScheduledAt] = useState('');
  const [repeatType, setRepeatType] = useState('none'); // 'none', 'daily', 'weekly', 'monthly', 'custom'
  const [repeatIntervalDays, setRepeatIntervalDays] = useState(1);
  const [repeatUntil, setRepeatUntil] = useState('');

  // UI / Preview State
  const [previewLang, setPreviewLang] = useState('en'); // 'en' or 'hi'
  const [loading, setLoading] = useState(false);

  // Schedules List State
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // History List State
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  // Trigger Cron State
  const [runningCron, setRunningCron] = useState(false);

  // Modal / Lightbox State
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Set default scheduled time to 1 hour from now formatted for datetime-local
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setScheduledAt(localIso);
  }, []);

  useEffect(() => {
    if (activeTab === 'schedules') {
      fetchSchedules();
    } else if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, statusFilter]);

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const url = statusFilter !== 'all' ? `/admin/schedules.php?status=${statusFilter}` : '/admin/schedules.php';
      const res = await api.get(url);
      if (res.data.success) {
        setSchedules(res.data.schedules || []);
      }
    } catch (err) {
      toast.error('Failed to load schedules');
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const url = historySearch ? `/admin/notification_history.php?search=${encodeURIComponent(historySearch)}` : '/admin/notification_history.php';
      const res = await api.get(url);
      if (res.data.success) {
        setHistoryList(res.data.history || []);
      }
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn && !titleHi) {
      toast.error('Please enter notification title (English or Hindi)');
      return;
    }
    if (!messageEn && !messageHi) {
      toast.error('Please enter notification message');
      return;
    }

    if (isScheduled && !scheduledAt) {
      toast.error('Please select schedule date and time');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title_en', titleEn);
      formData.append('title_hi', titleHi);
      formData.append('message_en', messageEn);
      formData.append('message_hi', messageHi);
      formData.append('target_type', targetType);
      if (targetType === 'specific_user' && targetUserId) {
        formData.append('user_id', targetUserId);
        formData.append('target_user_id', targetUserId);
      }
      if (image) {
        formData.append('image', image);
      }

      if (isScheduled) {
        // Create Schedule
        formData.append('scheduled_at', scheduledAt);
        formData.append('repeat_type', repeatType);
        formData.append('repeat_interval_days', repeatIntervalDays);
        if (repeatUntil) {
          formData.append('repeat_until', repeatUntil);
        }

        const res = await api.post('/admin/schedules.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          toast.success('Notification scheduled successfully!');
          resetForm();
          setActiveTab('schedules');
        } else {
          toast.error(res.data.message || 'Failed to schedule');
        }
      } else {
        // Send Immediate
        const res = await api.post('/admin/send_notification.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          toast.success(res.data.message || 'Notification sent successfully!');
          resetForm();
          setActiveTab('history');
        } else {
          toast.error(res.data.message || 'Failed to send notification');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitleEn('');
    setTitleHi('');
    setMessageEn('');
    setMessageHi('');
    setImage(null);
    setImagePreview('');
    setTargetType('all');
    setTargetUserId('');
    setRepeatType('none');
    setRepeatUntil('');
  };

  const handleToggleSchedule = async (id) => {
    try {
      const res = await api.post('/admin/schedule_action.php', {
        id,
        action: 'toggle_status'
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSchedules();
      }
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleRunScheduleNow = async (id) => {
    if (!window.confirm('Trigger immediate dispatch for this schedule?')) return;
    try {
      const res = await api.post('/admin/schedule_action.php', {
        id,
        action: 'run_now'
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSchedules();
      }
    } catch (err) {
      toast.error('Failed to execute schedule');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      const res = await api.delete(`/admin/schedules.php?id=${id}`);
      if (res.data.success) {
        toast.success('Schedule deleted');
        fetchSchedules();
      }
    } catch (err) {
      toast.error('Failed to delete schedule');
    }
  };

  const handleTriggerCron = async () => {
    setRunningCron(true);
    try {
      const res = await api.get('/cron/process_schedules.php?key=secret_cron_key');
      if (res.data.success) {
        toast.success(`Cron executed: ${res.data.processed_count} schedule(s) processed`);
        if (activeTab === 'schedules') fetchSchedules();
        if (activeTab === 'history') fetchHistory();
      } else {
        toast.error(res.data.message || 'Cron execution failed');
      }
    } catch (err) {
      toast.error('Failed to run cron job');
    } finally {
      setRunningCron(false);
    }
  };

  const handleDeleteHistoryLog = async (id) => {
    try {
      const res = await api.delete(`/admin/notification_history.php?id=${id}`);
      if (res.data.success) {
        toast.success('Log record removed');
        fetchHistory();
      }
    } catch (err) {
      toast.error('Failed to delete log');
    }
  };

  const activeDisplayTitle = previewLang === 'hi' ? (titleHi || titleEn || 'अधिसूचना शीर्षक') : (titleEn || titleHi || 'Notification Title');
  const activeDisplayMessage = previewLang === 'hi' ? (messageHi || messageEn || 'आपकी अधिसूचना का संदेश यहाँ दिखाई देगा...') : (messageEn || messageHi || 'Your notification message preview will appear here...');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notification Hub & Scheduler
          </h1>
          <p className="text-gray-400 mt-1">
            Dynamic English & Hindi Notifications with Banners, Recurrence Schedules, and History
          </p>
        </div>

        {/* Global Action: Trigger Pending Cron */}
        <button
          onClick={handleTriggerCron}
          disabled={runningCron}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-yellow-500 border border-yellow-500/30 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
          title="Process any scheduled notifications whose time has arrived"
        >
          <RefreshCw className={`w-4 h-4 ${runningCron ? 'animate-spin' : ''}`} />
          <span>{runningCron ? 'Executing...' : 'Run Due Schedules Now'}</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-700 mb-8 space-x-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === 'create'
              ? 'border-primary text-primary bg-gray-800/60'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Create & Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === 'schedules'
              ? 'border-primary text-primary bg-gray-800/60'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Schedules</span>
          {schedules.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
              {schedules.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === 'history'
              ? 'border-primary text-primary bg-gray-800/60'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Notification History & Logs</span>
        </button>
      </div>

      {/* TAB 1: CREATE & SCHEDULE */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-7 bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Mode Toggle */}
              <div className="bg-gray-900/80 p-1.5 rounded-xl border border-gray-700 flex">
                <button
                  type="button"
                  onClick={() => setIsScheduled(false)}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    !isScheduled
                      ? 'bg-primary text-black font-semibold shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Immediately</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsScheduled(true)}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    isScheduled
                      ? 'bg-primary text-black font-semibold shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule for Future</span>
                </button>
              </div>

              {/* Language Section Tabs Indicator */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" />
                  Dynamic Multilingual Content (Hindi & English)
                </span>
                <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-500/20">
                  Auto-routed to user's language
                </span>
              </div>

              {/* English Section */}
              <div className="space-y-3 p-4 bg-gray-900/60 rounded-xl border border-gray-700/70">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Globe className="w-3.5 h-3.5" />
                  <span>English (Default)</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    placeholder="e.g. Gold Rate Dropped! Buy Today"
                    required={!titleHi}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    English Message Content *
                  </label>
                  <textarea
                    value={messageEn}
                    onChange={(e) => setMessageEn(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    placeholder="e.g. 24K pure digital gold is at its best rate today. Invest now with GoldBarPe!"
                    required={!messageHi}
                  ></textarea>
                </div>
              </div>

              {/* Hindi Section */}
              <div className="space-y-3 p-4 bg-gray-900/60 rounded-xl border border-amber-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>हिंदी भाषा (Hindi)</span>
                  </div>
                  <span className="text-xs text-gray-500">हिंदी उपयोगकर्ताओं के लिए</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    हिंदी शीर्षक (Hindi Title)
                  </label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    placeholder="उदा. सोने के दाम घटे! आज ही 24K सोना खरीदें"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    हिंदी संदेश (Hindi Message Content)
                  </label>
                  <textarea
                    value={messageHi}
                    onChange={(e) => setMessageHi(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    placeholder="उदा. आज शुद्ध 24K डिजिटल सोना सबसे बेहतरीन भाव पर उपलब्ध है। अभी निवेश करें!"
                  ></textarea>
                </div>
              </div>

              {/* Banner / Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>Notification Banner Image (Optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-yellow-500 cursor-pointer"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview('');
                      }}
                      className="px-3 py-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Audience Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Target Audience</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetType('all')}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      targetType === 'all'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-700 bg-gray-900 text-gray-400'
                    }`}
                  >
                    All Users (Broadcast)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('specific_user')}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      targetType === 'specific_user'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-700 bg-gray-900 text-gray-400'
                    }`}
                  >
                    Specific User ID
                  </button>
                </div>
                {targetType === 'specific_user' && (
                  <input
                    type="number"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    placeholder="Enter User ID"
                    className="mt-3 w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm"
                    required
                  />
                )}
              </div>

              {/* Schedule Parameters (Conditional) */}
              {isScheduled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 p-5 bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/20 rounded-xl border border-yellow-500/30"
                >
                  <div className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Schedule & Recurrence Rules</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Schedule Time */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Schedule Time (Start) *
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none"
                        required={isScheduled}
                      />
                    </div>

                    {/* Auto Repeat Frequency */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Auto Repeat Frequency
                      </label>
                      <select
                        value={repeatType}
                        onChange={(e) => setRepeatType(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      >
                        <option value="none">None (One-time only)</option>
                        <option value="daily">Daily (Every Day)</option>
                        <option value="weekly">Weekly (Every Week)</option>
                        <option value="monthly">Monthly (Every Month)</option>
                        <option value="custom">Custom Interval (Days)</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Interval Days */}
                  {repeatType === 'custom' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Repeat Every (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={repeatIntervalDays}
                        onChange={(e) => setRepeatIntervalDays(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                    </div>
                  )}

                  {/* Repeat Until Date */}
                  {repeatType !== 'none' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Repeat Until Date (Optional Expiry)
                      </label>
                      <input
                        type="datetime-local"
                        value={repeatUntil}
                        onChange={(e) => setRepeatUntil(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-primary outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave blank to run indefinitely until paused or deleted.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-yellow-500 text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-50"
              >
                {isScheduled ? <Clock className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                <span>
                  {loading
                    ? (isScheduled ? 'Scheduling...' : 'Sending...')
                    : (isScheduled ? 'Save & Activate Schedule' : 'Send Broadcast Now')}
                </span>
              </button>
            </form>
          </div>

          {/* Live Mobile Notification Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm sticky top-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  Live Device Preview
                </span>
                {/* Language Switch for Preview */}
                <div className="flex items-center bg-gray-800 p-1 rounded-lg border border-gray-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewLang('en')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      previewLang === 'en' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang('hi')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      previewLang === 'hi' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Simulated Phone Shell */}
              <div className="bg-gray-900 border-4 border-gray-700 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
                {/* Notch / Speaker */}
                <div className="w-24 h-4 bg-gray-800 rounded-full mx-auto mb-4"></div>

                {/* Status Bar */}
                <div className="flex justify-between text-gray-500 text-[10px] px-2 mb-3">
                  <span>9:41 AM</span>
                  <div className="flex gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Simulated Notification Card */}
                <motion.div
                  key={previewLang}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-700/80 shadow-lg text-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-yellow-500 flex items-center justify-center text-[10px] font-bold text-black">
                        G
                      </div>
                      <span className="text-xs font-semibold text-gray-200">GoldBarPe</span>
                    </div>
                    <span className="text-[10px] text-gray-400">now</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                    {activeDisplayTitle}
                  </h4>

                  <p className="text-xs text-gray-300 leading-relaxed mb-2.5 line-clamp-3">
                    {activeDisplayMessage}
                  </p>

                  {/* Banner Preview inside notification */}
                  {imagePreview && (
                    <div className="rounded-xl overflow-hidden aspect-[16/9] bg-black/60 border border-gray-700">
                      <img src={imagePreview} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  )}
                </motion.div>

                <div className="mt-6 text-center">
                  <span className="text-[11px] text-gray-500">
                    {isScheduled ? `Scheduled for: ${scheduledAt || 'Not set'}` : 'Delivery: Immediate Push'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-300">Filter Status:</span>
              <div className="flex gap-2">
                {['all', 'active', 'paused', 'completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                      statusFilter === st
                        ? 'bg-primary text-black font-bold'
                        : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={fetchSchedules}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSchedules ? 'animate-spin' : ''}`} />
              <span>Refresh List</span>
            </button>
          </div>

          {loadingSchedules ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300">No schedules found</h3>
              <p className="text-gray-500 text-sm mt-1">
                Create a recurring or future schedule using the Create & Schedule tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Status and Repeat Frequency */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-full font-semibold border border-yellow-500/20 flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        <span className="capitalize">{sch.repeat_type}</span>
                        {sch.repeat_type === 'custom' && ` (${sch.repeat_interval_days}d)`}
                      </span>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          sch.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : sch.status === 'paused'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {sch.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1 mb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{sch.title_en}</span>
                      </h3>
                      {sch.title_hi && (
                        <p className="text-xs text-yellow-400/90 font-medium">
                          हिंदी: {sch.title_hi}
                        </p>
                      )}
                    </div>

                    {/* Message Preview */}
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                      {sch.message_en}
                    </p>

                    {/* Banner Thumbnail */}
                    {sch.image_url && (
                      <div
                        onClick={() => setSelectedImage(sch.image_url)}
                        className="cursor-pointer mb-3 rounded-lg overflow-hidden h-24 bg-black/40 border border-gray-700 relative group"
                      >
                        <img
                          src={sch.image_url.startsWith('http') ? sch.image_url : `/${sch.image_url}`}
                          alt="Banner"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Schedule Metadata */}
                    <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-700/60 text-xs space-y-1.5 text-gray-300 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Next Run:</span>
                        <span className="font-semibold text-primary">
                          {new Date(sch.next_run_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Repeat Until:</span>
                        <span>
                          {sch.repeat_until ? new Date(sch.repeat_until).toLocaleDateString() : 'Indefinite'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Runs:</span>
                        <span>{sch.total_runs} time(s)</span>
                      </div>
                      {sch.last_run_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Executed:</span>
                          <span>{new Date(sch.last_run_at).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-700/80">
                    <button
                      onClick={() => handleRunScheduleNow(sch.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                      title="Dispatch notification right now without waiting for scheduled time"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Run Now</span>
                    </button>

                    <button
                      onClick={() => handleToggleSchedule(sch.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                    >
                      {sch.status === 'active' ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteSchedule(sch.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
                      title="Delete Schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORY & DELIVERY LOGS */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
                placeholder="Search history by title or text..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={fetchHistory}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : historyList.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
              <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300">No logs found</h3>
              <p className="text-gray-500 text-sm mt-1">
                Sent notifications and scheduled runs will be logged here.
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-700">
                    <tr>
                      <th className="py-3.5 px-4">Triggered At</th>
                      <th className="py-3.5 px-4">Banner</th>
                      <th className="py-3.5 px-4">Title & Message (EN / HI)</th>
                      <th className="py-3.5 px-4">Triggered By</th>
                      <th className="py-3.5 px-4">Recipients / Delivered</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {historyList.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-750/50 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-gray-400">
                          {new Date(log.triggered_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {log.image_url ? (
                            <img
                              src={log.image_url.startsWith('http') ? log.image_url : `/${log.image_url}`}
                              alt="Banner"
                              onClick={() => setSelectedImage(log.image_url)}
                              className="w-10 h-10 object-cover rounded-lg cursor-pointer border border-gray-700 hover:opacity-80"
                            />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-white">{log.title_en}</div>
                          {log.title_hi && (
                            <div className="text-[11px] text-yellow-400/90 font-medium">
                              हिंदी: {log.title_hi}
                            </div>
                          )}
                          <div className="text-gray-400 truncate text-[11px] mt-0.5">
                            {log.message_en}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              log.triggered_by === 'schedule'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {log.triggered_by}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="text-green-400">{log.success_count}</span>
                            <span className="text-gray-500">/</span>
                            <span>{log.sent_to_count}</span>
                          </div>
                          {log.failed_count > 0 && (
                            <div className="text-[10px] text-red-400">
                              {log.failed_count} failed
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              log.status === 'success'
                                ? 'bg-green-500/20 text-green-400'
                                : log.status === 'partial'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteHistoryLog(log.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                            title="Delete log entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* Image Modal Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.startsWith('http') ? selectedImage : `/${selectedImage}`}
                alt="Banner full view"
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
