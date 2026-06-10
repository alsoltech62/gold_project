import React, { useState, useEffect } from 'react';
import { Truck, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/admin/deliveries.php');
      if (res.data.success) {
        setDeliveries(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load deliveries');
    }
    setLoading(false);
  };

  const updateStatus = async (id, status, tracking = '') => {
    try {
      const res = await api.post('/admin/deliveries.php', {
        delivery_id: id,
        status: status,
        tracking_number: tracking
      });
      if (res.data.success) {
        toast.success('Delivery status updated');
        fetchDeliveries();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = deliveries.filter(d => filter === 'all' || d.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="text-amber-500" />
            Physical Deliveries
          </h1>
          <p className="text-white/40 text-sm">Manage gold and silver delivery requests</p>
        </div>
        
        <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
          {['all', 'pending', 'processing', 'dispatched', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/60">
            <thead className="bg-white/5 text-xs uppercase text-white/40">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Grams</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{d.name}</p>
                    <p className="text-xs">{d.mobile}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-[200px] truncate" title={d.delivery_address}>{d.delivery_address}</p>
                    <p className="text-xs">{d.delivery_city}, {d.delivery_state} - {d.delivery_pincode}</p>
                  </td>
                  <td className="px-6 py-4 text-amber-500 font-bold">{parseFloat(d.gold_grams).toFixed(4)}g</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      d.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      d.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                      d.status === 'dispatched' ? 'bg-purple-500/10 text-purple-500' :
                      d.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {d.status === 'pending' && (
                      <button onClick={() => updateStatus(d.id, 'processing')} className="text-blue-400 hover:text-blue-300">Process</button>
                    )}
                    {d.status === 'processing' && (
                      <button onClick={() => {
                        const tr = prompt('Enter Tracking Number:');
                        if (tr) updateStatus(d.id, 'dispatched', tr);
                      }} className="text-purple-400 hover:text-purple-300">Dispatch</button>
                    )}
                    {d.status === 'dispatched' && (
                      <button onClick={() => updateStatus(d.id, 'delivered')} className="text-green-400 hover:text-green-300">Mark Delivered</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-white/40">No deliveries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
