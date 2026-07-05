import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api, { formatINR } from '../../utils/api';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminWithdrawals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Create admin withdrawal endpoint later if needed, but assuming standard admin list
      const res = await api.get('/admin/withdrawals.php');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (e) {
      toast.error('Failed to load withdrawals');
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      const res = await api.post('/admin/withdrawals_action.php', { id, action });
      if (res.data.success) {
        toast.success(`Request ${action} successfully`);
        fetchRequests();
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Withdrawal Requests</h1>
      <div className="card-dark overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">User</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Bank Details</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="p-4 text-sm text-white">
                  <div>{req.user_name}</div>
                  <div className="text-xs text-gray-400">{req.mobile}</div>
                  <div className="text-[10px] text-white/30">ID: {req.user_id}</div>
                </td>
                <td className="p-4 text-sm font-bold text-amber-500">{formatINR(req.amount)}</td>
                <td className="p-4 text-xs text-gray-400">
                  <p>Bank: {req.bank_name}</p>
                  <p>A/C: {req.account_number}</p>
                  <p>IFSC: {req.ifsc_code}</p>
                  <p>Name: {req.account_holder_name}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : req.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4">
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(req.id, 'approve')} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleAction(req.id, 'reject')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg">
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No withdrawal requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
