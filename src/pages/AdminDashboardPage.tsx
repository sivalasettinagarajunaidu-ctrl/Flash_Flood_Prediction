import React, { useState } from 'react';
import {
  Sliders,
  Radio,
  Cpu,
  ShieldAlert,
  BatteryCharging,
  Signal,
  RotateCcw,
  CheckCircle2,
  Send,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { SensorNode, Region, AlertItem } from '../types';

interface AdminDashboardPageProps {
  sensors: SensorNode[];
  regions: Region[];
  onBroadcastCustomAlert?: (alert: Partial<AlertItem>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  sensors,
  regions,
  onBroadcastCustomAlert,
}) => {
  // Configurable thresholds
  const [rainThreshold, setRainThreshold] = useState(50);
  const [soilThreshold, setSoilThreshold] = useState(80);
  const [riverMarginThreshold, setRiverMarginThreshold] = useState(0.8);
  const [treesCount, setTreesCount] = useState(100);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Manual Alert Modal/State
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0]?.id || '');
  const [alertSeverity, setAlertSeverity] = useState<'Watch' | 'Warning' | 'Emergency'>('Emergency');
  const [alertHeadline, setAlertHeadline] = useState('Flash Flood Surge Warning Issued for Catchment');
  const [alertAction, setAlertAction] = useState('Immediate evacuation to designated high-ground shelters required.');

  const handleSaveThresholds = () => {
    setStatusMessage('System thresholds and ML hyperparameters saved successfully.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleBroadcastAlert = () => {
    const reg = regions.find((r) => r.id === selectedRegionId);
    if (!reg) return;

    if (onBroadcastCustomAlert) {
      onBroadcastCustomAlert({
        regionId: reg.id,
        regionName: reg.name,
        severity: alertSeverity,
        headline: alertHeadline,
        message: `Admin issued ${alertSeverity} alert for ${reg.name} valley. Multi-source telemetry indicates severe runoff hazard.`,
        actionRequired: alertAction,
        affectedRivers: [reg.riverName],
        issuedAt: new Date().toLocaleTimeString(),
        expiresAt: 'Next 6 Hours',
      });
    }

    setStatusMessage(`Emergency alert broadcast transmitted to ${reg.name} district.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
              Disaster Management Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">System Admin & IoT Control Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Hardware sensor fleet diagnostics, calibration thresholds, ML inference hyperparameters, and manual broadcast overrides.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM UPTIME: 99.82%</span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid: Thresholds & Manual Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Automated Threshold Calibration (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Multi-Source Trigger Calibration</span>
            </h3>

            {/* Rain Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Precipitation Critical Threshold</span>
                <span className="font-mono font-bold text-cyan-300">{rainThreshold} mm/h</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={rainThreshold}
                onChange={(e) => setRainThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Trigger automatic early warning sirens if rainfall exceeds this rate.</span>
            </div>

            {/* Soil Saturation Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">NASA SMAP Soil Saturation Critical Trigger</span>
                <span className="font-mono font-bold text-emerald-300">{soilThreshold}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={soilThreshold}
                onChange={(e) => setSoilThreshold(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Zero-absorption boundary condition multiplier.</span>
            </div>

            {/* River Margin Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">River Danger Margin Clearance</span>
                <span className="font-mono font-bold text-blue-300">{riverMarginThreshold} m</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2.5}
                step={0.1}
                value={riverMarginThreshold}
                onChange={(e) => setRiverMarginThreshold(Number(e.target.value))}
                className="w-full accent-blue-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Proximity to danger mark before emergency sirens trip.</span>
            </div>

            {/* RF Trees Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Random Forest Ensemble Trees</span>
                <span className="font-mono font-bold text-purple-300">{treesCount} Estimators</span>
              </div>
              <input
                type="range"
                min={50}
                max={300}
                step={25}
                value={treesCount}
                onChange={(e) => setTreesCount(Number(e.target.value))}
                className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={handleSaveThresholds}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Apply Operational Thresholds</span>
            </button>
          </div>
        </div>

        {/* Right Column: Manual Emergency Broadcast Override (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Radio className="h-4 w-4 text-red-400" />
              <span>Manual Emergency Alert Broadcast Override</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Target Catchment Valley</label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Severity Tier</label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
                >
                  <option value="Watch">Yellow: Flash Flood Watch</option>
                  <option value="Warning">Orange: Flash Flood Warning</option>
                  <option value="Emergency">Red: FLASH FLOOD EMERGENCY</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Broadcast Headline</label>
                <input
                  type="text"
                  value={alertHeadline}
                  onChange={(e) => setAlertHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Mandated Evacuation Action</label>
                <textarea
                  rows={2}
                  value={alertAction}
                  onChange={(e) => setAlertAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <button
                onClick={handleBroadcastAlert}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Issue Public Cell-Broadcast & CAP Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IoT ESP32 Sensor Node Fleet Telemetry Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400" />
              <span>IoT Telemetry Sensor Fleet ({sensors.length} Nodes)</span>
            </h3>
            <span className="text-[11px] text-slate-400">Solar-powered ESP32 nodes transmitting LoRaWAN & 4G cellular</span>
          </div>
          <button className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" />
            <span>Ping All Nodes</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Node Name & ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Live Value</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Status</th>
                <th className="p-3">Battery</th>
                <th className="p-3">Signal (RSSI)</th>
                <th className="p-3">Last Ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    {s.name}
                    <div className="text-[10px] text-slate-500 font-mono">{s.hardwareModel}</div>
                  </td>
                  <td className="p-3 capitalize text-slate-400">{s.type}</td>
                  <td className="p-3 font-mono font-bold text-cyan-300">
                    {s.value} {s.unit}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {s.threshold} {s.unit}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === 'Critical'
                          ? 'bg-red-600 text-white animate-pulse'
                          : s.status === 'Warning'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-mono">{s.batteryPct}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Signal className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-mono">{s.signalDbm} dBm</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{s.lastPing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
