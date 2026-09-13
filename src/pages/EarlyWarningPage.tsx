import React, { useState } from 'react';
import {
  AlertTriangle,
  Volume2,
  VolumeX,
  Radio,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Bell,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { AlertItem, Region } from '../types';
import { audioAlert } from '../components/AudioAlertService';

interface EarlyWarningPageProps {
  alerts: AlertItem[];
  regions: Region[];
  onBroadcastAlert?: (newAlert: Partial<AlertItem>) => void;
}

export const EarlyWarningPage: React.FC<EarlyWarningPageProps> = ({ alerts, regions }) => {
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [capRecipient, setCapRecipient] = useState('All Residents in Mandakini & Wayanad Basins');
  const [testSmsStatus, setTestSmsStatus] = useState<string | null>(null);

  const toggleSiren = () => {
    const active = audioAlert.toggleSiren();
    setIsSirenOn(active);
  };

  const simulateSmsBroadcast = () => {
    setTestSmsStatus('Broadcasting cellular CAP push alert via telecom cell-broadcast...');
    setTimeout(() => {
      setTestSmsStatus('SUCCESS: Broadcast transmitted to 42,800 mobile handsets in target gorge sectors.');
      setTimeout(() => setTestSmsStatus(null), 5000);
    }, 1200);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Emergency':
        return {
          badge: 'bg-red-600 text-white animate-pulse',
          card: 'bg-red-950/30 border-red-800/80 shadow-red-950/40',
          title: 'text-red-400',
        };
      case 'Warning':
        return {
          badge: 'bg-orange-600 text-white',
          card: 'bg-orange-950/30 border-orange-800/80',
          title: 'text-orange-400',
        };
      case 'Watch':
        return {
          badge: 'bg-amber-600 text-white',
          card: 'bg-amber-950/30 border-amber-800/80',
          title: 'text-amber-400',
        };
      default:
        return {
          badge: 'bg-emerald-600 text-white',
          card: 'bg-emerald-950/30 border-emerald-800/80',
          title: 'text-emerald-400',
        };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Siren Audio Test Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider">
              Life-Safety Sentinel
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Early Warning & Alert System</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Automated multi-channel hazard dissemination. Couples hydrologic threshold breaches with community sirens, cellular SMS, and CAP protocols.
          </p>
        </div>

        {/* Big Audio Siren Controller */}
        <button
          onClick={toggleSiren}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl ${
            isSirenOn
              ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-red-300 animate-pulse shadow-red-600/50'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
          }`}
        >
          {isSirenOn ? (
            <>
              <VolumeX className="h-5 w-5 animate-bounce" />
              <span>SILENCE VALLEY SIREN</span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5 text-amber-400" />
              <span>TEST VALLEY EMERGENCY SIREN</span>
            </>
          )}
        </button>
      </div>

      {/* 4-Tier Flash Flood Alert Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">GREEN</span>
            <span className="text-xs text-slate-400">P &lt; 25%</span>
          </div>
          <h4 className="font-bold text-sm text-emerald-300">Flood Advisory</h4>
          <p className="text-[11px] text-slate-400">
            Precipitation and soil saturation within baseline limits. Normal river recreational activities permitted.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">YELLOW</span>
            <span className="text-xs text-slate-400">P = 25 - 39%</span>
          </div>
          <h4 className="font-bold text-sm text-amber-300">Flash Flood Watch</h4>
          <p className="text-[11px] text-slate-400">
            Atmospheric conditions favorable for mountain cloudbursts. Hill slope residents advised to prepare go-bags.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white">ORANGE</span>
            <span className="text-xs text-slate-400">P = 40 - 69%</span>
          </div>
          <h4 className="font-bold text-sm text-orange-300">Flash Flood Warning</h4>
          <p className="text-[11px] text-slate-400">
            High runoff certainty. River levels climbing near warning mark. Evacuate campers and riverbank dwellings.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse">RED</span>
            <span className="text-xs text-slate-400">P &ge; 70%</span>
          </div>
          <h4 className="font-bold text-sm text-red-300">FLASH FLOOD EMERGENCY</h4>
          <p className="text-[11px] text-slate-400">
            Immediate catastrophic danger to life. Debris torrents active. Immediate mandatory high-ground evacuation.
          </p>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Active Real-Time Early Warnings ({alerts.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Auto-updated via Sentinel Engine</span>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-6 rounded-2xl border shadow-xl transition-all space-y-4 ${style.card}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${style.badge}`}>
                      {alert.severity}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white">{alert.regionName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Issued: {alert.issuedAt}</span>
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{alert.expiresAt}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-base sm:text-lg font-black tracking-tight ${style.title}`}>
                    {alert.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Mandated Action Box */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-amber-300">Mandated Civil Action:</span>
                    <p className="text-slate-300">{alert.actionRequired}</p>
                  </div>
                </div>

                {/* Affected Watercourses */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="font-bold">Affected River Channels:</span>
                  {(alert.affectedRivers || []).map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cellular CAP & Broadcast Simulation Center */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Emergency Broadcast & CAP Simulator</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">ITU-T X.1303 Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-xs">
            <p className="text-slate-300 leading-relaxed">
              When the AI prediction engine flags a <strong>HIGH RISK (&ge;70%)</strong> threshold, the Common Alerting Protocol (CAP) payload is automatically constructed for multi-tower cell-broadcast.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800">
              {`{
  "identifier": "DISASTER-FLASH-2026-081",
  "sender": "NDMA-CWC-GEOHYDRO",
  "msgType": "Alert",
  "scope": "Public",
  "area": "Gaurikund to Rudraprayag Gorge (Elevation <2400m)",
  "urgency": "Immediate",
  "severity": "Extreme",
  "certainty": "Observed"
}`}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Target Broadcast Zone</label>
              <input
                type="text"
                value={capRecipient}
                onChange={(e) => setCapRecipient(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <button
              onClick={simulateSmsBroadcast}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Send className="h-4 w-4" />
              <span>Simulate Multi-Tower Cellular Alert Broadcast</span>
            </button>

            {testSmsStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{testSmsStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
