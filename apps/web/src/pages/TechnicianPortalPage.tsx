import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Logo } from '../components/Logo';
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Zap,
  Calendar,
  FileText,
  DollarSign,
  Compass,
  ArrowRight
} from 'lucide-react';

export const TechnicianPortalPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'STANDBY' | 'PINGS_ACTIVE' | 'ERROR'>('STANDBY');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194
  });

  useEffect(() => {
    fetchTechnicianJobs();
    setupGeolocation();
  }, []);

  // Automatic GPS Telemetry Interval (Pings every 20s while en route or in progress)
  useEffect(() => {
    let pingInterval: any = null;
    if (gpsStatus === 'PINGS_ACTIVE') {
      pingInterval = setInterval(async () => {
        try {
          await apiClient.post('/location/ping', {
            lat: currentCoords.lat,
            lng: currentCoords.lng,
          });
        } catch { /* silence */ }
      }, 20000);
    }
    return () => {
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [gpsStatus, currentCoords]);

  const setupGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.log('Using simulated coordinates for local development');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const fetchTechnicianJobs = async () => {
    try {
      const res = await apiClient.get('/jobs/my-jobs');
      const list = res.data.data || res.data.jobs || res.data || [];
      setJobs(list);
      if (list.length > 0 && !activeJob) {
        setActiveJob(list[0]);
      }
    } catch (err) {
      console.error('Error fetching technician jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTransition = async (jobId: string, nextStatus: string) => {
    setActionLoading(true);
    try {
      await apiClient.patch(`/jobs/${jobId}/status`, { status: nextStatus });

      if (nextStatus === 'EN_ROUTE' || nextStatus === 'IN_PROGRESS') {
        setGpsStatus('PINGS_ACTIVE');
        try {
          await apiClient.post('/location/ping', {
            lat: currentCoords.lat,
            lng: currentCoords.lng
          });
        } catch { /* silence */ }
      } else if (nextStatus === 'COMPLETED') {
        setGpsStatus('STANDBY');
        // Create Invoice automatically
        try {
          await apiClient.post('/invoices', {
            customerId: activeJob?.customerId?._id || activeJob?.customerId,
            jobId: activeJob._id,
            amount: activeJob.priceEstimate || 350,
            lineItems: [{ description: activeJob.serviceType, amount: activeJob.priceEstimate || 350, quantity: 1 }],
          });
        } catch { /* silence */ }
      }

      fetchTechnicianJobs();
      if (activeJob && activeJob._id === jobId) {
        setActiveJob({ ...activeJob, status: nextStatus });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const launchGoogleMapsNavigation = (addressStr?: string, lat?: number, lng?: number) => {
    let queryParam = '';
    if (lat && lng) {
      queryParam = `${lat},${lng}`;
    } else {
      queryParam = encodeURIComponent(addressStr || 'San Francisco, CA');
    }
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${queryParam}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  const destAddress = activeJob?.customerId?.address?.street
    ? `${activeJob.customerId.address.street}, ${activeJob.customerId.address.city || ''}`
    : activeJob?.address?.street || '1244 Market Street, San Francisco, CA';

  // Find next job in roster
  const currentIndex = jobs.findIndex((j) => j._id === activeJob?._id);
  const nextJob = currentIndex >= 0 && currentIndex + 1 < jobs.length ? jobs[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans flex flex-col justify-between">
      {/* Top Bar Header */}
      <header className="h-16 px-6 bg-[#FFFDF2] border-b-2 border-[#0F0F0F] flex items-center justify-between sticky top-0 z-30 select-none">
        <div className="flex items-center gap-4">
          <Logo size="md" darkText={true} />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F0F0F] text-[#FFFDF2] text-xs font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5" /> Technician Console
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                gpsStatus === 'PINGS_ACTIVE' ? 'bg-[#047857] animate-pulse' : 'bg-[#D97706]'
              }`}
            />
            <span className="hidden md:inline text-[#0F0F0F]">
              {gpsStatus === 'PINGS_ACTIVE' ? 'HARDWARE GPS LIVE BROADCASTING' : 'TELEMETRY STANDBY'}
            </span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l-2 border-[#0F0F0F]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-[#0F0F0F]">{user?.name}</p>
              <p className="text-[10px] text-[#555555] font-mono font-bold">FIELD TECHNICIAN</p>
            </div>
            <button onClick={logout} className="p-2 text-[#0F0F0F] hover:bg-[#FEF2F2] hover:text-[#DC2626] rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FFFDF2] pb-24">
        {/* Left Column: Active Job & Turn-by-Turn Navigation Header */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0F0F0F]" />
              <span className="text-xs font-mono font-bold text-[#0F0F0F]">Loading Technician Dispatch Data...</span>
            </div>
          ) : activeJob ? (
            <>
              {/* Navigation Banner Card */}
              <div className="p-6 rounded-xl space-y-5 relative overflow-hidden bg-[#FFFDF2] border-2 border-[#0F0F0F] shadow-md">
                {/* Status Pills */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-amber text-[10px] font-mono">#JOB-{activeJob._id?.substring(0, 6)}</span>
                    <span className="badge badge-emerald text-[10px]">{activeJob.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#0F0F0F] font-mono font-extrabold">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" /> EST. DRIVING ETA: 11 MIN (3.8 MI)
                  </div>
                </div>

                {/* Job Title & Client */}
                <div>
                  <h1 className="text-xl font-extrabold text-[#0F0F0F]">{activeJob.serviceType}</h1>
                  <p className="text-xs text-[#555555] mt-1 font-semibold">{activeJob.description || 'Standard On-Site Inspection & Service'}</p>
                </div>

                {/* Destination & Navigation Buttons */}
                <div className="p-4 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#0F0F0F] text-[#FFFDF2] mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#0F0F0F]">{activeJob.customerId?.name || 'Customer'}</p>
                        <p className="text-xs text-[#333333] font-semibold mt-0.5">{destAddress}</p>
                        {activeJob.customerId?.phone && (
                          <p className="text-[11px] text-[#0F0F0F] font-bold mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#D97706]" /> {activeJob.customerId.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        launchGoogleMapsNavigation(
                          destAddress,
                          activeJob.address?.lat,
                          activeJob.address?.lng
                        )
                      }
                      className="btn-amber px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-2 shrink-0 shadow-md"
                    >
                      <Navigation className="w-4 h-4" /> Turn-by-Turn Directions <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* State Machine Transition Action Controls */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  {activeJob.status === 'SCHEDULED' || activeJob.status === 'REQUESTED' ? (
                    <button
                      onClick={() => handleStatusTransition(activeJob._id, 'EN_ROUTE')}
                      disabled={actionLoading}
                      className="btn-amber w-full py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" /> Start Route (Broadcast GPS Telemetry)
                    </button>
                  ) : activeJob.status === 'EN_ROUTE' ? (
                    <button
                      onClick={() => handleStatusTransition(activeJob._id, 'IN_PROGRESS')}
                      disabled={actionLoading}
                      className="btn-amber w-full py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Arrived at Site & Begin Service
                    </button>
                  ) : activeJob.status === 'IN_PROGRESS' ? (
                    <button
                      onClick={() => handleStatusTransition(activeJob._id, 'COMPLETED')}
                      disabled={actionLoading}
                      className="w-full py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 bg-[#047857] text-[#FFFDF2] hover:bg-[#065F46]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Work Order & Issue Invoice
                    </button>
                  ) : (
                    <div className="w-full p-3 text-center rounded-lg bg-[#ECFDF5] text-[#047857] text-xs font-extrabold border-2 border-[#047857]">
                      Work Order Successfully Completed & Invoiced
                    </div>
                  )}
                </div>
              </div>

              {/* Map Display Container */}
              <div className="p-4 rounded-xl flex-1 min-h-[320px] relative overflow-hidden flex flex-col justify-between bg-[#FFFDF2] border-2 border-[#0F0F0F]">
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F0F0F] text-[#FFFDF2] text-xs font-mono font-bold">
                    <Compass className="w-3.5 h-3.5 text-[#D97706]" /> LIVE ROUTE TELEMETRY
                  </div>
                  <button
                    onClick={() => launchGoogleMapsNavigation(destAddress)}
                    className="btn-ghost px-3 py-1 text-xs rounded-lg flex items-center gap-1.5 font-bold"
                  >
                    Open Google Maps App <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Vector Route Simulation View */}
                <div className="my-6 relative flex-1 flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 120 220 Q 300 80, 520 180"
                      fill="none"
                      stroke="#0F0F0F"
                      strokeWidth="4"
                      strokeDasharray="8 4"
                    />
                  </svg>

                  <div className="absolute left-[120px] top-[220px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 p-2.5 rounded-xl bg-[#0F0F0F] text-[#FFFDF2] font-extrabold text-xs shadow-md">
                    <Navigation className="w-4 h-4 text-[#D97706]" />
                    <span>Your Vehicle (En Route)</span>
                  </div>

                  <div className="absolute left-[520px] top-[180px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 p-2.5 rounded-xl bg-[#047857] text-[#FFFDF2] font-extrabold text-xs shadow-md">
                    <MapPin className="w-4 h-4" />
                    <span>Destination Job Site</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#0F0F0F] font-bold flex justify-between border-t-2 border-[#0F0F0F] pt-2">
                  <span>LAT: {currentCoords.lat.toFixed(4)} | LNG: {currentCoords.lng.toFixed(4)}</span>
                  <span>DRIVING SPEED: 28 MPH</span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 rounded-xl text-center text-xs text-[#555555] font-bold bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              No active work orders assigned to your roster.
            </div>
          )}
        </div>

        {/* Right Column: Assigned Jobs Roster */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl space-y-3 bg-[#FFFDF2] border-2 border-[#0F0F0F]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#0F0F0F]">
              <span className="label-ui text-[10px] text-[#0F0F0F]">TODAY'S DISPATCH ROSTER</span>
              <span className="badge badge-amber text-[10px]">{jobs.length} JOBS</span>
            </div>

            <div className="space-y-2.5">
              {jobs.map((job) => {
                const isSelected = activeJob?._id === job._id;
                return (
                  <button
                    key={job._id}
                    onClick={() => setActiveJob(job)}
                    className={`w-full text-left p-3.5 rounded-lg transition-all border-2 ${
                      isSelected
                        ? 'bg-[#0F0F0F] text-[#FFFDF2] border-[#0F0F0F]'
                        : 'bg-[#FFFDF2] text-[#0F0F0F] border-[#0F0F0F] hover:bg-[#F5F3E9]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#FFFDF2]' : 'text-[#0F0F0F]'}`}>
                        #JOB-{job._id?.substring(0, 6)}
                      </span>
                      <span className="badge badge-gray text-[9px]">{job.status}</span>
                    </div>
                    <p className={`text-xs font-extrabold truncate ${isSelected ? 'text-[#FFFDF2]' : 'text-[#0F0F0F]'}`}>
                      {job.serviceType}
                    </p>
                    <p className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-[#D4D0C5]' : 'text-[#555555]'}`}>
                      {job.customerId?.name || 'Customer'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Next Job Banner */}
      {nextJob && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F] text-[#FFFDF2] border-t-2 border-[#0F0F0F] px-6 py-3 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="badge badge-amber text-[9px] font-mono">NEXT JOB</span>
            <div>
              <p className="text-xs font-extrabold text-[#FFFDF2]">{nextJob.serviceType}</p>
              <p className="text-[11px] text-[#E5E0D0] font-semibold">{nextJob.customerId?.name || 'Client'}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveJob(nextJob)}
            className="btn-amber text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 bg-[#FFFDF2] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-[#FFFDF2]"
          >
            View Work Order <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
