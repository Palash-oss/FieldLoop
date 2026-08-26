import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { apiClient } from '../api/client';
import { UserCheck, UserPlus, Mail, Shield, Phone, X, Loader2 } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Invite Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'TECHNICIAN' | 'DISPATCHER' | 'ACCOUNTANT' | 'OWNER'>('TECHNICIAN');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password123!');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data.data || res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/users', {
        name,
        email,
        role,
        phone,
        password,
      });
      setShowModal(false);
      setName('');
      setEmail('');
      setPhone('');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add staff member');
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
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Team Members & Fleet Roster</h1>
              <p className="text-xs text-[#555555] mt-0.5">Manage staff accounts, roles, and dispatch permissions</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-amber px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add Staff Member
            </button>
          </div>

          {/* Roster Table Container */}
          <div className="rounded-xl overflow-hidden bg-[#FFFDF2] border-2 border-[#0F0F0F]">
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#0F0F0F]" />
                <span className="text-xs font-mono font-bold text-[#0F0F0F]">Loading Fleet Roster...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center m-6 border-2 border-dashed border-[#0F0F0F]/20 rounded-xl bg-[#F5F3E9]">
                <UserCheck className="w-8 h-8 text-[#0F0F0F] mx-auto mb-2" />
                <p className="font-extrabold text-[#0F0F0F] text-sm mb-1">No staff members listed</p>
                <p className="text-xs text-[#555555] mb-4">Add your technicians and dispatchers to assign jobs.</p>
                <button onClick={() => setShowModal(true)} className="btn-amber px-4 py-2 rounded-lg text-xs font-bold">
                  Add First Staff Member
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="label-ui text-[10px] bg-[#0F0F0F] text-[#FFFDF2] border-b-2 border-[#0F0F0F]">
                    <th className="px-4 py-3.5">Staff Name</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Contact Email</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F0F0F]/15">
                  {users.map((u) => (
                    <tr key={u._id} className="table-row-hover">
                      <td className="px-4 py-3.5 font-extrabold text-[#0F0F0F]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-[#0F0F0F] text-[#FFFDF2] font-extrabold text-xs flex items-center justify-center shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="badge badge-amber text-[9px]">{u.role}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[#333333] font-semibold">{u.email}</td>
                      <td className="px-4 py-3.5 text-[#333333] font-semibold">{u.phone || '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className="badge badge-emerald text-[9px]">ACTIVE</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-xl shadow-2xl bg-[#FFFDF2] border-2 border-[#0F0F0F] text-[#0F0F0F]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F0F0F]">
              <h3 className="text-base font-extrabold text-[#0F0F0F]">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)} className="text-[#0F0F0F] hover:bg-[#F5F3E9] p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleInviteStaff}>
              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mike Torres"
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                />
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                >
                  <option value="TECHNICIAN">Technician (Field App)</option>
                  <option value="DISPATCHER">Dispatcher (Board & Calendar)</option>
                  <option value="ACCOUNTANT">Accountant (Invoices & Billing)</option>
                  <option value="OWNER">Owner (Full Admin Access)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mike@apex.com"
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 012-3456"
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Initial Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
