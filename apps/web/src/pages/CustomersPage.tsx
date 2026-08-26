import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { apiClient } from '../api/client';
import { Users, Plus, Phone, Mail, MapPin, X, Loader2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Customer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await apiClient.get('/customers');
      setCustomers(res.data.data?.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/customers', {
        name,
        email,
        phone,
        address: { street, city, state, zip },
      });
      setShowModal(false);
      setName('');
      setEmail('');
      setPhone('');
      setStreet('');
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setSubmitting(false);
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
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Customer Directory</h1>
              <p className="text-xs text-[#555555] mt-0.5">Manage accounts and service locations</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-amber px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Customer
            </button>
          </div>

          {/* Directory Table Container */}
          <div className="rounded-xl overflow-hidden bg-[#FFFDF2] border-2 border-[#0F0F0F]">
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#0F0F0F]" />
                <span className="text-xs font-mono font-bold text-[#0F0F0F]">Loading Customer Directory...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="py-16 text-center m-6 border-2 border-dashed border-[#0F0F0F]/20 rounded-xl bg-[#F5F3E9]">
                <Users className="w-8 h-8 text-[#0F0F0F] mx-auto mb-2" />
                <p className="font-extrabold text-[#0F0F0F] text-sm mb-1">No customers added yet</p>
                <p className="text-xs text-[#555555] mb-4">Click "Add Customer" to register your first client account.</p>
                <button onClick={() => setShowModal(true)} className="btn-amber px-4 py-2 rounded-lg text-xs font-bold">
                  Add First Customer
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="label-ui text-[10px] bg-[#0F0F0F] text-[#FFFDF2] border-b-2 border-[#0F0F0F]">
                    <th className="px-4 py-3.5">Customer Name</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Service Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F0F0F]/15">
                  {customers.map((c) => (
                    <tr key={c._id} className="table-row-hover">
                      <td className="px-4 py-3.5 font-extrabold text-[#0F0F0F]">{c.name}</td>
                      <td className="px-4 py-3.5 text-[#333333] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#0F0F0F]" />
                          <span>{c.phone || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#333333] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#0F0F0F]" />
                          <span>{c.email || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#333333] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0F0F0F]" />
                          <span>
                            {c.address?.street ? `${c.address.street}, ${c.address.city || ''}` : 'No address specified'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-xl shadow-2xl bg-[#FFFDF2] border-2 border-[#0F0F0F] text-[#0F0F0F]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F0F0F]">
              <h3 className="text-base font-extrabold text-[#0F0F0F]">Add Customer Account</h3>
              <button onClick={() => setShowModal(false)} className="text-[#0F0F0F] hover:bg-[#F5F3E9] p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleCreateCustomer}>
              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Customer / Company Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apex Plumbing Solutions"
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 019-2834"
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@apex.com"
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="100 Market St"
                  className="input-field py-2 px-3 text-xs mb-2 bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="input-field py-2 px-2 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="input-field py-2 px-2 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP"
                    className="input-field py-2 px-2 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
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
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
