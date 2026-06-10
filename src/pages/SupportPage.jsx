import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Ticket, Clock, CheckCircle } from 'lucide-react';
import api from '../utils/api';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    api.get('/user/tickets.php').then(r => {
      if(r.data.success) setTickets(r.data.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) return;
    setLoading(true);
    try {
      const res = await api.post('/user/tickets.php', { subject, description });
      if (res.data.success) {
        toast.success('Ticket created successfully');
        setSubject('');
        setDescription('');
        setShowForm(false);
        fetchTickets();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to create ticket');
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full font-bold">Open</span>;
      case 'pending': return <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full font-bold">Pending</span>;
      case 'closed': return <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full font-bold">Closed</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Support Tickets</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Need help? Raise a ticket here.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          {showForm ? 'Cancel' : <><PlusCircle size={20} /> New Ticket</>}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 space-y-4">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-2 block">Subject</label>
            <input 
              type="text" 
              value={subject} 
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-2 block">Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide all details here..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-12 text-white/40">No tickets found.</div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Ticket size={16} className="text-amber-500" />
                  <h3 className="text-white font-bold">{t.subject}</h3>
                  {getStatusBadge(t.status)}
                </div>
                <p className="text-white/60 text-sm mb-2">{t.description}</p>
                <div className="text-white/30 text-xs flex items-center gap-2">
                  <Clock size={12} /> {new Date(t.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
