import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { apiClient } from '../api/client';
import { Receipt, Plus, DollarSign, CheckCircle2, Clock, AlertCircle, X, Loader2 } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('350');
  const [description, setDescription] = useState('HVAC Service & Diagnostic Fee');

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await apiClient.get('/invoices');
      setInvoices(res.data.data?.invoices || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await apiClient.get('/customers');
      setCustomers(res.data.data?.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert('Select customer');
    setSubmitting(true);
    try {
      await apiClient.post('/invoices', {
        customerId,
        amount: Number(amount),
        lineItems: [{ description, amount: Number(amount), quantity: 1 }],
      });
      setShowModal(false);
      fetchInvoices();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await apiClient.patch(`/invoices/${id}/status`, { status: 'PAID' });
      fetchInvoices();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FFFDF2]">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto bg-[#FFFDF2]">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b-2 border-[#0F0F0F]">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Billing & Invoices</h1>
              <p className="text-xs text-[#555555] mt-0.5">Track work order invoicing, payment status, and revenue</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-amber px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Issue Invoice
            </button>
          </div>

          {/* Invoices Table Container */}
          <div className="rounded-xl overflow-hidden bg-[#FFFDF2] border-2 border-[#0F0F0F]">
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#0F0F0F]" />
                <span className="text-xs font-mono font-bold text-[#0F0F0F]">Loading Invoices...</span>
              </div>
            ) : invoices.length === 0 ? (
              <div className="py-16 text-center m-6 border-2 border-dashed border-[#0F0F0F]/20 rounded-xl bg-[#F5F3E9]">
                <Receipt className="w-8 h-8 text-[#0F0F0F] mx-auto mb-2" />
                <p className="font-extrabold text-[#0F0F0F] text-sm mb-1">No invoices issued yet</p>
                <p className="text-xs text-[#555555] mb-4">Completed work orders automatically populate invoices.</p>
                <button onClick={() => setShowModal(true)} className="btn-amber px-4 py-2 rounded-lg text-xs font-bold">
                  Issue First Invoice
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="label-ui text-[10px] bg-[#0F0F0F] text-[#FFFDF2] border-b-2 border-[#0F0F0F]">
                    <th className="px-4 py-3.5">Invoice ID</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Issued Date</th>
                    <th className="px-4 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F0F0F]/15">
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="table-row-hover">
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0F0F0F]">#INV-{inv._id.substring(0, 6)}</td>
                      <td className="px-4 py-3.5 font-extrabold text-[#0F0F0F]">{inv.customerId?.name || 'Customer'}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0F0F0F]">${inv.amount || inv.total || 0}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={
                            inv.status === 'PAID'
                              ? 'badge badge-emerald'
                              : inv.status === 'OVERDUE'
                              ? 'badge badge-red'
                              : 'badge badge-amber'
                          }
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#333333] font-mono font-semibold">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        {inv.status !== 'PAID' ? (
                          <button
                            onClick={() => handleMarkPaid(inv._id)}
                            className="text-[11px] font-bold text-[#047857] hover:underline"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#555555] font-bold">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Issue Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-xl shadow-2xl bg-[#FFFDF2] border-2 border-[#0F0F0F] text-[#0F0F0F]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F0F0F]">
              <h3 className="text-base font-extrabold text-[#0F0F0F]">Issue New Invoice</h3>
              <button onClick={() => setShowModal(false)} className="text-[#0F0F0F] hover:bg-[#F5F3E9] p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleCreateInvoice}>
              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  required
                >
                  <option value="">Select Customer...</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Service Line Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                />
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Total Amount ($)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t-2 border-[#0F0F0F]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost px-4 py-2 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-amber px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
