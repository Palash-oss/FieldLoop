import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BarChart3, TrendingUp, Clock, CheckCircle2, DollarSign } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FFFDF2]">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto bg-[#FFFDF2]">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b-2 border-[#0F0F0F]">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Operations Analytics & Reports</h1>
              <p className="text-xs text-[#555555] mt-0.5">Revenue breakdown, technician completion rates, and fleet latency</p>
            </div>
            <span className="badge badge-amber text-[10px]">REAL-TIME TELEMETRY</span>
          </div>

          {/* Metric Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="panel-card p-5 rounded-xl bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              <div className="flex items-center justify-between">
                <span className="label-ui text-[10px] text-[#0F0F0F]">AVG TIME TO COMPLETE</span>
                <Clock className="w-4 h-4 text-[#0F0F0F]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0F0F0F] mt-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
                48.5 min
              </p>
              <p className="text-[11px] text-[#047857] font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 12% faster than last month
              </p>
            </div>

            <div className="panel-card p-5 rounded-xl bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              <div className="flex items-center justify-between">
                <span className="label-ui text-[10px] text-[#0F0F0F]">ON-TIME ARRIVAL RATE</span>
                <CheckCircle2 className="w-4 h-4 text-[#047857]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0F0F0F] mt-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
                99.4%
              </p>
              <p className="text-[11px] text-[#555555] font-semibold mt-1">Target threshold: 98%</p>
            </div>

            <div className="panel-card p-5 rounded-xl bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              <div className="flex items-center justify-between">
                <span className="label-ui text-[10px] text-[#0F0F0F]">DISPATCH REVENUE (MTD)</span>
                <DollarSign className="w-4 h-4 text-[#0F0F0F]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0F0F0F] mt-3 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                $42,850.00
              </p>
              <p className="text-[11px] text-[#047857] font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.2% vs target
              </p>
            </div>
          </div>

          {/* Detailed Breakdown Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl p-5 bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              <h3 className="text-sm font-extrabold text-[#0F0F0F] mb-4 pb-3 border-b-2 border-[#0F0F0F]">
                Revenue by Technician
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Mike Torres', jobs: 18, revenue: '$14,200.00' },
                  { name: 'Alex Rivera', jobs: 15, revenue: '$11,850.00' },
                  { name: 'Sarah Jenkins', jobs: 12, revenue: '$9,400.00' },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between p-3 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F] text-xs">
                    <div>
                      <p className="font-extrabold text-[#0F0F0F]">{t.name}</p>
                      <p className="text-[10px] text-[#555555] font-semibold">{t.jobs} jobs completed</p>
                    </div>
                    <span className="font-mono font-extrabold text-[#0F0F0F]">{t.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5 bg-[#FFFDF2] border-2 border-[#0F0F0F]">
              <h3 className="text-sm font-extrabold text-[#0F0F0F] mb-4 pb-3 border-b-2 border-[#0F0F0F]">
                Service Type Volume
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'Commercial HVAC Diagnostic', pct: '42%' },
                  { type: 'Electrical Panel Upgrade', pct: '31%' },
                  { type: 'Plumbing Repair', pct: '27%' },
                ].map((s) => (
                  <div key={s.type} className="flex items-center justify-between p-3 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F] text-xs">
                    <span className="font-extrabold text-[#0F0F0F]">{s.type}</span>
                    <span className="badge badge-gray text-[10px] font-mono">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
