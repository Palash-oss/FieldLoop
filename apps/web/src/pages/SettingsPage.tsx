import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { Settings, Building2, Clock, MapPin, Bell, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [orgName, setOrgName] = useState('Apex Plumbing & Field Services');
  const [timezone, setTimezone] = useState('America/New_York');
  const [businessHours, setBusinessHours] = useState('08:00 AM - 06:00 PM');
  const [serviceRadius, setServiceRadius] = useState('35');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FFFDF2]">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto max-w-4xl bg-[#FFFDF2]">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b-2 border-[#0F0F0F]">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F0F0F]">Organization Settings</h1>
              <p className="text-xs text-[#555555] mt-0.5">Configure business profile, service radius, and notification defaults</p>
            </div>
          </div>

          {saved && (
            <div className="mb-6 p-3 rounded-lg bg-[#ECFDF5] border-2 border-[#047857] text-[#047857] text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> Settings updated successfully.
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSave}>
            {/* Organization Profile */}
            <div className="rounded-xl p-6 bg-[#FFFDF2] border-2 border-[#0F0F0F] space-y-4">
              <h3 className="text-sm font-extrabold text-[#0F0F0F] pb-3 border-b-2 border-[#0F0F0F]">
                Organization Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Business Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>

                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  >
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Business Hours</label>
                  <input
                    type="text"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>

                <div>
                  <label className="label-ui text-[10px] block mb-1 text-[#0F0F0F]">Service Radius (Miles)</label>
                  <input
                    type="number"
                    value={serviceRadius}
                    onChange={(e) => setServiceRadius(e.target.value)}
                    className="input-field py-2 px-3 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-xl p-6 bg-[#FFFDF2] border-2 border-[#0F0F0F] space-y-4">
              <h3 className="text-sm font-extrabold text-[#0F0F0F] pb-3 border-b-2 border-[#0F0F0F]">
                Automated Notifications & Channels
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'SMS Customer ETA Alerts ("Technician is 10 min away")', defaultChecked: true },
                  { label: 'Email Invoices & Digital Signatures automatically to Customer', defaultChecked: true },
                  { label: 'Push Alert to Dispatchers on Technician Delay (>15m late)', defaultChecked: true },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer text-[#0F0F0F] font-semibold">
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="accent-[#0F0F0F] w-4 h-4 rounded border-2 border-[#0F0F0F]" />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-amber px-6 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
