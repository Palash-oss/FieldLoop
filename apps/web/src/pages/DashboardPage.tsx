import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';
import { Calendar, Users, UserCheck, Receipt, ArrowRight, TrendingUp, Loader2 } from 'lucide-react';

type StatusKey = 'COMPLETED' | 'IN_PROGRESS' | 'EN_ROUTE' | 'REQUESTED' | 'SCHEDULED' | 'INVOICED' | 'PAID' | 'CANCELLED' | string;

const StatusBadge: React.FC<{ status: StatusKey }> = ({ status }) => {
  const map: Record<string, { cls: string; label: string }> = {
    COMPLETED:   { cls: 'badge badge-emerald', label: 'Completed' },
    PAID:        { cls: 'badge badge-emerald', label: 'Paid' },
    IN_PROGRESS: { cls: 'badge badge-amber',   label: 'In Progress' },
    EN_ROUTE:    { cls: 'badge badge-amber',   label: 'En Route' },
    REQUESTED:   { cls: 'badge badge-gray',     label: 'Requested' },
    SCHEDULED:   { cls: 'badge badge-gray',     label: 'Scheduled' },
    INVOICED:    { cls: 'badge badge-gray',     label: 'Invoiced' },
    CANCELLED:   { cls: 'badge badge-red',      label: 'Cancelled' },
  };
  const s = map[status] ?? { cls: 'badge badge-gray', label: status };
  return <span className={s.cls}><span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />{s.label}</span>;
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCustomers: 0, activeTechs: 0, scheduledJobs: 0, pendingInvoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, customersRes, usersRes, invoicesRes] = await Promise.all([
          apiClient.get('/jobs?limit=5'),
          apiClient.get('/customers?limit=1'),
          apiClient.get('/users?role=TECHNICIAN'),
          apiClient.get('/invoices?status=DRAFT'),
        ]);
        setJobs(jobsRes.data.data?.jobs || []);
        setStats({
          totalCustomers:  customersRes.data.data?.pagination?.total || 0,
          activeTechs:     usersRes.data.results || 0,
          scheduledJobs:   jobsRes.data.data?.pagination?.total || 0,
          pendingInvoices: invoicesRes.data.data?.pagination?.total || 0,
        });
      } catch { /* silently handle */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Scheduled Jobs',     value: stats.scheduledJobs,   icon: Calendar },
    { label: 'Field Technicians',  value: stats.activeTechs,     icon: UserCheck },
    { label: 'Customer Accounts',  value: stats.totalCustomers,  icon: Users },
    { label: 'Draft Invoices',     value: stats.pendingInvoices, icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFDF2] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#0F0F0F]/15">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F0F0F]">Operations Dispatch Center</h1>
              <p className="text-xs text-[#555555] mt-0.5">Live fleet telemetry for <span className="font-bold text-[#0F0F0F]">{user?.name}</span></p>
            </div>
            <Link to="/jobs" className="btn-amber px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
              New Work Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="panel-card p-5 rounded-xl bg-[#FFFDF2] border-2 border-[#0F0F0F]">
                  <div className="flex items-center justify-between">
                    <span className="label-ui text-[10px] text-[#0F0F0F]">{s.label}</span>
                    <Icon className="w-4 h-4 text-[#0F0F0F]" />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mt-3 text-[#0F0F0F]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {loading ? <div className="skeleton h-8 w-12 rounded" /> : s.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Jobs table */}
          <div className="panel-card rounded-xl overflow-hidden bg-[#FFFDF2] border-2 border-[#0F0F0F]">
            <div className="flex items-center justify-between p-5 border-b-2 border-[#0F0F0F] bg-[#F5F3E9]">
              <div>
                <h2 className="text-sm font-extrabold text-[#0F0F0F]">Recent Work Orders</h2>
                <p className="text-[11px] text-[#555555] mt-0.5">Real-time status from field technicians</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-[#0F0F0F] hover:underline flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#0F0F0F]" />
                <span className="text-xs font-mono text-[#555555]">Loading live telemetry...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 text-center m-6 border-2 border-dashed border-[#0F0F0F]/20 rounded-xl">
                <p className="font-bold text-[#0F0F0F] text-sm mb-1">No jobs dispatched yet</p>
                <p className="text-xs text-[#555555] mb-4">Create your first work order to get started.</p>
                <Link to="/jobs" className="btn-amber px-4 py-2 rounded-lg text-xs font-bold">Create Job</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="label-ui text-[10px] bg-[#0F0F0F] text-[#FFFDF2] border-b border-[#0F0F0F]">
                      <th className="px-5 py-3.5">Service Type</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Assigned Staff</th>
                      <th className="px-5 py-3.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F0F0F]/10">
                    {jobs.map(job => (
                      <tr key={job._id} className="table-row-hover transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-[#0F0F0F]">{job.serviceType}</p>
                          <p className="text-[10px] font-mono text-[#555555] mt-0.5">#{job._id.substring(0, 8)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0F0F0F]">{job.customerId?.name || 'N/A'}</p>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={job.status} /></td>
                        <td className="px-5 py-4">
                          {job.assignedTechnicians?.length > 0 ? (
                            <span className="text-[#0F0F0F] font-bold text-[12px]">{job.assignedTechnicians.map((t: any) => t.name).join(', ')}</span>
                          ) : (
                            <span className="text-[#777777] text-[12px] italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Link to="/jobs" className="text-xs font-extrabold text-[#0F0F0F] hover:underline">Details →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
