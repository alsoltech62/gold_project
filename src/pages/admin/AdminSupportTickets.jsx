import React, { useState, useEffect } from 'react';
import { Ticket, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/admin/tickets.php');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.post('/admin/tickets.php', {
        ticket_id: id,
        status: status
      });
      if (res.data.success) {
        toast.success('Ticket updated');
        fetchTickets();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="text-blue-500" />
          Support Tickets
        </h1>
        <p className="text-white/40 text-sm">Manage user support requests</p>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 && !loading ? (
          <div className="text-center py-12 text-white/40 bg-[#1a1a1a] rounded-2xl border border-white/5">No tickets found.</div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-bold">{t.subject}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    t.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                    t.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-3">{t.description}</p>
                <div className="text-white/40 text-xs flex items-center gap-4">
                  <span>User: {t.name} ({t.mobile})</span>
                  <span>Date: {new Date(t.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {t.status !== 'closed' && (
                  <button onClick={() => updateStatus(t.id, 'closed')} className="px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-xs font-bold transition-colors">
                    Mark Closed
                  </button>
                )}
                {t.status === 'open' && (
                  <button onClick={() => updateStatus(t.id, 'pending')} className="px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-xs font-bold transition-colors">
                    Mark Pending
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
