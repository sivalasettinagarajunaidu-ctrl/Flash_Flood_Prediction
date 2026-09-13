import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  MapPin,
  Compass,
  CheckCircle2,
  Bell,
  Navigation,
  ArrowUpRight,
  PhoneCall,
  Heart,
} from 'lucide-react';
import { Region, Shelter } from '../types';

interface UserDashboardPageProps {
  selectedRegion: Region;
  shelters: Shelter[];
  onNavigate: (tab: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  selectedRegion,
  shelters,
  onNavigate,
}) => {
  const [familySafeStatus, setFamilySafeStatus] = useState<boolean>(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(true);
  const [sirenPushEnabled, setSirenPushEnabled] = useState<boolean>(true);
  const [checkedInMessage, setCheckedInMessage] = useState<string | null>(null);

  const nearestShelter = shelters.find((s) => s.regionId === selectedRegion.id) || shelters[0];

  const handleCheckIn = () => {
    setCheckedInMessage(
      `Check-in recorded: Family marked SAFE at ${nearestShelter.name} (${nearestShelter.heightAboveRiverM}m high ground). Shared with NDRF registry.`
    );
    setTimeout(() => setCheckedInMessage(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* User Hero */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Ramesh Sharma</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Registered Resident
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assigned Valley: <strong className="text-white">{selectedRegion.name}</strong> • Floodplain Buffer: 180m
            </p>
          </div>
        </div>

        {/* Family Safe Status Check-In Button */}
        <button
          onClick={handleCheckIn}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-transform active:scale-95"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>I am Safe (Disaster Check-In)</span>
        </button>
      </div>

      {checkedInMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600 text-xs text-emerald-300 flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-400 flex-shrink-0" />
          <span>{checkedInMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearest Designated Shelter Route */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>My Nearest High-Ground Shelter</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">0.6 km away</span>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-sm text-emerald-300">{nearestShelter.name}</h4>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Elevation Safety Buffer:</span>
                <b className="text-emerald-400 font-mono">+{nearestShelter.heightAboveRiverM} m above river</b>
              </div>
              <div className="flex justify-between">
                <span>Current Capacity:</span>
                <b className="text-white">
                  {nearestShelter.currentOccupancy} / {nearestShelter.capacity} Occupied
                </b>
              </div>
              <div className="flex justify-between">
                <span>Contact Officer:</span>
                <span>{nearestShelter.contactPerson} ({nearestShelter.contactPhone})</span>
              </div>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${nearestShelter.lat},${nearestShelter.lng}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="h-3.5 w-3.5 text-cyan-400" />
            <span>Open Evacuation Path on GPS</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>

        {/* Resident Emergency Notification Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyan-400" />
              <span>Early Warning Subscriptions</span>
            </h3>
            <span className="text-[10px] text-slate-400">Civil Defense Settings</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-semibold text-white block">Cellular CAP SMS Alerts</span>
                <span className="text-[11px] text-slate-400">Receive instant high-priority text when rainfall &gt;45mm/h</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="accent-cyan-400 h-4 w-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-semibold text-white block">Automated Valley Audio Sirens</span>
                <span className="text-[11px] text-slate-400">Trigger acoustic alarm test directly to device speakers</span>
              </div>
              <input
                type="checkbox"
                checked={sirenPushEnabled}
                onChange={(e) => setSirenPushEnabled(e.target.checked)}
                className="accent-cyan-400 h-4 w-4 rounded"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('sos')}
              className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span>Emergency SOS Beacon Shortcut</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
