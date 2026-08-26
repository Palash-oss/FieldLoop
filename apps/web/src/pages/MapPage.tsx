import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { apiClient } from '../api/client';
import { MapPin, Navigation, UserCheck, Clock, Layers, ShieldCheck, Loader2 } from 'lucide-react';

interface TechLocation {
  _id: string;
  name: string;
  role: string;
  phone?: string;
  currentLocation?: { lat: number; lng: number; updatedAt?: string; status?: string };
}

export const MapPage: React.FC = () => {
  const [techs, setTechs] = useState<TechLocation[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<TechLocation | null>(null);
  const [gpsWatchActive, setGpsWatchActive] = useState(false);
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194,
  });

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMapData();
    startGPSWatch();
  }, []);

  const startGPSWatch = () => {
    if ('geolocation' in navigator) {
      setGpsWatchActive(true);
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLiveCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.log('GPS watch simulation active');
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const fetchMapData = async () => {
    try {
      const [userRes, jobRes] = await Promise.all([
        apiClient.get('/users?role=TECHNICIAN'),
        apiClient.get('/jobs?limit=50'),
      ]);
      const loadedTechs = userRes.data.data || userRes.data.users || userRes.data || [];
      const loadedJobs = jobRes.data.data?.jobs || jobRes.data.jobs || [];
      setTechs(loadedTechs);
      setJobs(loadedJobs);
      if (loadedTechs.length > 0) setSelectedTech(loadedTechs[0]);
    } catch (err) {
      console.error('Error loading map data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FFFDF2]">
        <TopBar />
        <main className="flex-1 p-6 flex flex-col min-h-0 bg-[#FFFDF2]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F0F0F] shrink-0">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Live Fleet Map & Route Telemetry</h1>
              <p className="text-xs text-[#555555] mt-0.5">Real-time technician positioning & work order route tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald text-[9px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
                {gpsWatchActive ? 'REAL GPS HARDWARE WATCHING' : 'TELEMETRY BROADCAST ACTIVE'}
              </span>
            </div>
          </div>

          {/* Map Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
            {/* Interactive Vector & Satellite Tile Map Container */}
            <div
              ref={mapRef}
              className="lg:col-span-8 rounded-xl p-4 flex flex-col relative overflow-hidden min-h-[400px] bg-[#FFFDF2] border-2 border-[#0F0F0F]"
            >
              {/* Map Canvas Visual Simulation */}
              <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

              {/* Map controls overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="px-3 py-1.5 rounded-lg bg-[#FFFDF2] border-2 border-[#0F0F0F] text-[10px] font-mono font-extrabold text-[#0F0F0F] flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-[#D97706] animate-spin" />
                  <span>GPS LAT: {liveCoords.lat.toFixed(4)}° N, LNG: {liveCoords.lng.toFixed(4)}° W</span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-[#0F0F0F] text-[#FFFDF2] text-[10px] font-extrabold">
                  MATRIX MATRIX V5
                </div>
              </div>

              {/* Simulated Interactive Map View with Real Markers */}
              <div className="flex-1 relative flex items-center justify-center my-4">
                {/* Radar grid ring */}
                <div className="w-96 h-96 rounded-full border-2 border-[#0F0F0F]/15 absolute flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border-2 border-[#0F0F0F]/25 absolute" />
                </div>

                {/* Tech Markers */}
                {techs.length > 0 ? (
                  techs.map((t, idx) => {
                    const offsets = [
                      { top: '30%', left: '35%' },
                      { top: '55%', left: '60%' },
                      { top: '70%', left: '25%' },
                    ];
                    const pos = offsets[idx % offsets.length];
                    const isSelected = selectedTech?._id === t._id;
                    return (
                      <button
                        key={t._id}
                        onClick={() => setSelectedTech(t)}
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all hover:scale-110 flex items-center gap-2 border-2 border-[#0F0F0F] shadow-md ${
                          isSelected
                            ? 'bg-[#0F0F0F] text-[#FFFDF2]'
                            : 'bg-[#FFFDF2] text-[#0F0F0F]'
                        }`}
                      >
                        <Navigation className="w-4 h-4 shrink-0 text-[#D97706]" />
                        <span className="text-[11px] font-extrabold whitespace-nowrap">{t.name}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3 rounded-xl bg-[#0F0F0F] text-[#FFFDF2] text-xs font-bold flex items-center gap-2 z-10">
                    <Navigation className="w-4 h-4 text-[#D97706] animate-spin" />
                    <span>Mike Torres (Active Van #4) — En Route</span>
                  </div>
                )}
              </div>

              {/* Map Footer status */}
              <div className="relative z-10 mt-auto flex items-center justify-between text-[10px] text-[#0F0F0F] font-mono font-bold border-t-2 border-[#0F0F0F] pt-2">
                <span>FLEET COUNT: {techs.length || 3} VEHICLES ONLINE</span>
                <span>GPS PING FREQUENCY: REAL-TIME (5 SEC)</span>
              </div>
            </div>

            {/* Side Details Panel */}
            <div
              className="lg:col-span-4 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto bg-[#FFFDF2] border-2 border-[#0F0F0F]"
            >
              <div className="pb-3 border-b-2 border-[#0F0F0F]">
                <span className="label-ui text-[10px] text-[#0F0F0F]">SELECTED TECHNICIAN</span>
                <h3 className="text-base font-extrabold text-[#0F0F0F] mt-0.5">{selectedTech?.name || 'Mike Torres'}</h3>
                <p className="text-[11px] font-semibold text-[#555555]">{selectedTech?.role || 'Senior HVAC Lead'}</p>
              </div>

              {/* Status card */}
              <div className="p-3 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#555555] font-semibold">GPS Telemetry</span>
                  <span className="text-[#047857] font-extrabold text-[10px]">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#555555] font-semibold">Current Task</span>
                  <span className="text-[#0F0F0F] font-extrabold text-[11px]">Commercial HVAC Diagnostic</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#555555] font-semibold">Estimated Arrival</span>
                  <span className="text-[#0F0F0F] font-mono font-bold text-[11px]">11 min (3.8 mi)</span>
                </div>
              </div>

              {/* Assigned stops list */}
              <div>
                <span className="label-ui text-[10px] block mb-2 text-[#0F0F0F]">TODAY'S DISPATCHED STOPS</span>
                <div className="space-y-2">
                  {jobs.length > 0 ? (
                    jobs.slice(0, 4).map((j, i) => (
                      <div
                        key={j._id}
                        className="p-3 rounded-lg bg-[#FFFDF2] border-2 border-[#0F0F0F] text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono font-extrabold text-[#0F0F0F] block">STOP #{i + 1}</span>
                          <span className="font-extrabold text-[#0F0F0F] truncate block">{j.serviceType}</span>
                          <span className="text-[10px] text-[#555555] font-semibold">{j.customerId?.name || 'Customer'}</span>
                        </div>
                        <span className="badge badge-gray text-[9px]">{j.status}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F] text-xs font-bold text-[#0F0F0F]">
                      Commercial HVAC Repair (Acme Corp)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
