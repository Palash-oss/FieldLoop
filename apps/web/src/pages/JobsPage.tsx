import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { apiClient } from '../api/client';
import {
  Calendar,
  Plus,
  Filter,
  Kanban,
  List,
  Clock,
  UserCheck,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  Loader2,
  MapPin,
  Tag
} from 'lucide-react';

interface Job {
  _id: string;
  serviceType: string;
  description?: string;
  status: 'REQUESTED' | 'SCHEDULED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED' | 'INVOICED' | 'PAID' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  priceEstimate?: number;
  scheduledStart?: string;
  customerId?: { _id: string; name: string; phone?: string; address?: string };
  assignedTechnicians?: { _id: string; name: string }[];
  address?: { street?: string; city?: string; state?: string; zip?: string };
}

const KANBAN_COLUMNS: { id: Job['status']; title: string; badge: string }[] = [
  { id: 'REQUESTED',   title: 'Requested',   badge: 'badge-gray' },
  { id: 'SCHEDULED',   title: 'Scheduled',   badge: 'badge-gray' },
  { id: 'EN_ROUTE',    title: 'En Route',    badge: 'badge-amber' },
  { id: 'IN_PROGRESS', title: 'In Progress', badge: 'badge-amber' },
  { id: 'COMPLETED',   title: 'Completed',   badge: 'badge-emerald' },
  { id: 'INVOICED',    title: 'Invoiced',    badge: 'badge-emerald' },
];

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [serviceType, setServiceType] = useState('Plumbing Diagnostic');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [priceEstimate, setPriceEstimate] = useState('150');

  useEffect(() => {
    fetchJobs();
    fetchDropdowns();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get('/jobs?limit=100');
      setJobs(res.data.data?.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [custRes, techRes] = await Promise.all([
        apiClient.get('/customers?limit=50'),
        apiClient.get('/users?role=TECHNICIAN'),
      ]);
      setCustomers(custRes.data.data?.customers || []);
      setTechnicians(techRes.data.data || techRes.data.users || []);
    } catch (err) {
      console.error('Error fetching dropdowns:', err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert('Please select a customer');
    setSubmitting(true);
    try {
      await apiClient.post('/jobs', {
        customerId,
        serviceType,
        description,
        priority,
        priceEstimate: Number(priceEstimate),
        assignedTechnicians: selectedTech ? [selectedTech] : [],
      });
      setShowModal(false);
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusTransition = async (jobId: string, nextStatus: string) => {
    try {
      await apiClient.patch(`/jobs/${jobId}/status`, { status: nextStatus });
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Status transition failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FFFDF2]">
        <TopBar />

        <main className="flex-1 p-6 overflow-y-auto flex flex-col bg-[#FFFDF2]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b-2 border-[#0F0F0F]">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Job Board & Dispatch Matrix</h1>
              <p className="text-xs text-[#555555] mt-0.5">Schedule, assign technicians, and track work orders</p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher */}
              <div className="flex items-center p-1 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F]">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${
                    viewMode === 'kanban' ? 'bg-[#0F0F0F] text-[#FFFDF2]' : 'text-[#0F0F0F] hover:bg-[#FFFDF2]'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" /> Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${
                    viewMode === 'list' ? 'bg-[#0F0F0F] text-[#FFFDF2]' : 'text-[#0F0F0F] hover:bg-[#FFFDF2]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="btn-amber px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Dispatch New Job
              </button>
            </div>
          </div>

          {/* Main Board Content */}
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0F0F0F]" />
              <span className="text-xs font-mono font-bold text-[#0F0F0F]">Loading Work Orders...</span>
            </div>
          ) : viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1 overflow-x-auto items-start pb-6">
              {KANBAN_COLUMNS.map((col) => {
                const colJobs = jobs.filter((j) => j.status === col.id);
                return (
                  <div
                    key={col.id}
                    className="p-3 rounded-xl flex flex-col min-w-[240px] max-w-[300px] bg-[#F5F3E9] border-2 border-[#0F0F0F]"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#0F0F0F]">
                      <span className="label-ui text-[11px] text-[#0F0F0F]">{col.title}</span>
                      <span className={`${col.badge} text-[10px]`}>{colJobs.length}</span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {colJobs.length === 0 ? (
                        <div className="p-4 text-center border-2 border-dashed border-[#0F0F0F]/20 rounded-lg bg-[#FFFDF2]">
                          <span className="text-[10px] font-bold text-[#555555]">No jobs match</span>
                        </div>
                      ) : (
                        colJobs.map((job) => (
                          <div
                            key={job._id}
                            className="p-3.5 rounded-lg flex flex-col gap-2 bg-[#FFFDF2] border-2 border-[#0F0F0F] shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-extrabold text-[#0F0F0F]">#{job._id.substring(0, 6)}</span>
                              <span className="badge badge-gray text-[9px]">{job.priority}</span>
                            </div>

                            <div>
                              <p className="text-xs font-extrabold text-[#0F0F0F] leading-snug">{job.serviceType}</p>
                              <p className="text-[11px] font-semibold text-[#555555] mt-0.5">{job.customerId?.name || 'Customer'}</p>
                            </div>

                            {job.assignedTechnicians && job.assignedTechnicians.length > 0 ? (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-[#047857]">
                                <UserCheck className="w-3 h-3" />
                                <span>{job.assignedTechnicians.map((t) => t.name).join(', ')}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-[#777777] italic font-semibold">Unassigned</span>
                            )}

                            {/* Transition Buttons */}
                            <div className="pt-2 border-t border-[#0F0F0F]/15 flex justify-end gap-1">
                              {job.status === 'REQUESTED' && (
                                <button
                                  onClick={() => handleStatusTransition(job._id, 'SCHEDULED')}
                                  className="text-[10px] px-2 py-1 rounded bg-[#0F0F0F] text-[#FFFDF2] font-bold hover:bg-[#333333]"
                                >
                                  Schedule →
                                </button>
                              )}
                              {job.status === 'SCHEDULED' && (
                                <button
                                  onClick={() => handleStatusTransition(job._id, 'EN_ROUTE')}
                                  className="text-[10px] px-2 py-1 rounded bg-[#0F0F0F] text-[#FFFDF2] font-bold hover:bg-[#333333]"
                                >
                                  En Route →
                                </button>
                              )}
                              {job.status === 'EN_ROUTE' && (
                                <button
                                  onClick={() => handleStatusTransition(job._id, 'IN_PROGRESS')}
                                  className="text-[10px] px-2 py-1 rounded bg-[#0F0F0F] text-[#FFFDF2] font-bold hover:bg-[#333333]"
                                >
                                  Start Job →
                                </button>
                              )}
                              {job.status === 'IN_PROGRESS' && (
                                <button
                                  onClick={() => handleStatusTransition(job._id, 'COMPLETED')}
                                  className="text-[10px] px-2 py-1 rounded bg-[#047857] text-[#FFFDF2] font-bold hover:bg-[#065F46]"
                                >
                                  Complete →
                                </button>
                              )}
                              {job.status === 'COMPLETED' && (
                                <button
                                  onClick={() => handleStatusTransition(job._id, 'INVOICED')}
                                  className="text-[10px] px-2 py-1 rounded bg-[#047857] text-[#FFFDF2] font-bold hover:bg-[#065F46]"
                                >
                                  Invoice →
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Data Table List View */
            <div className="rounded-xl overflow-hidden bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="label-ui text-[10px] bg-[#0F0F0F] text-[#FFFDF2] border-b-2 border-[#0F0F0F]">
                    <th className="px-4 py-3">Job ID</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Estimate</th>
                    <th className="px-4 py-3">Assigned Tech</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F0F0F]/15">
                  {jobs.map((job) => (
                    <tr key={job._id} className="table-row-hover">
                      <td className="px-4 py-3 font-mono font-bold text-[#0F0F0F]">#{job._id.substring(0, 6)}</td>
                      <td className="px-4 py-3 font-bold text-[#0F0F0F]">{job.serviceType}</td>
                      <td className="px-4 py-3 text-[#333333] font-semibold">{job.customerId?.name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className="badge badge-gray text-[9px]">{job.status}</span>
                      </td>
                      <td className="px-4 py-3 text-[#333333] font-semibold">{job.priority}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#0F0F0F]">${job.priceEstimate || 0}</td>
                      <td className="px-4 py-3 text-[#333333] font-semibold">
                        {job.assignedTechnicians?.map((t) => t.name).join(', ') || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* New Work Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-xl shadow-2xl bg-[#FFFDF2] border-2 border-[#0F0F0F] text-[#0F0F0F]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F0F0F]">
              <h3 className="text-base font-extrabold text-[#0F0F0F]">Dispatch New Work Order</h3>
              <button onClick={() => setShowModal(false)} className="text-[#0F0F0F] hover:bg-[#F5F3E9] p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleCreateJob}>
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
                      {c.name} ({c.phone || 'No phone'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Service Type</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="e.g. Commercial HVAC Repair"
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  required
                />
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Assign Technician</label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                >
                  <option value="">Unassigned (Queue to Requested)</option>
                  {technicians.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Estimate ($)</label>
                  <input
                    type="number"
                    value={priceEstimate}
                    onChange={(e) => setPriceEstimate(e.target.value)}
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
              </div>

              <div>
                <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Job Description & Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed work instructions..."
                  rows={3}
                  className="input-field p-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
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
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Dispatch Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
