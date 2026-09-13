import React, { useState } from 'react';
import { MapComponent } from '../components/MapComponent';
import { Region, SensorNode, Shelter, RescueTeam, HazardZone } from '../types';
import {
  MapPin,
  Radio,
  Compass,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';

interface LiveMapPageProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  sensors: SensorNode[];
  shelters: Shelter[];
  rescueTeams: RescueTeam[];
  hazardZones: HazardZone[];
  onNavigateToPredict: (region: Region) => void;
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  sensors,
  shelters,
  rescueTeams,
  hazardZones,
  onNavigateToPredict,
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const activeSensorsInRegion = sensors.filter((s) => s.regionId === selectedRegion.id);
  const sheltersInRegion = shelters.filter((sh) => sh.regionId === selectedRegion.id);
  const rescueTeamsInRegion = rescueTeams.filter((rt) => rt.regionId === selectedRegion.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls & Regional Quick-Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
              GIS Hazard Layer
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Mountain Flood Risk Map</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time geospatial mapping of hill basins, IoT sensor clusters, flash hazard corridors, and emergency safezones.
          </p>
        </div>

        {/* Region Jump Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-semibold flex-shrink-0">Jump To:</span>
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                r.id === selectedRegion.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  r.riskLevel === 'HIGH' ? 'bg-red-500' : r.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <span>{r.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <MapComponent
            regions={regions}
            selectedRegionId={selectedRegion.id}
            onSelectRegion={(id) => {
              const reg = regions.find((r) => r.id === id);
              if (reg) onSelectRegion(reg);
            }}
            sensors={sensors}
            shelters={shelters}
            rescueTeams={rescueTeams}
            hazardZones={hazardZones}
            height="580px"
            onNavigateToPredict={onNavigateToPredict}
          />
        </div>

        {/* Right Sidebar: Active Telemetry in Selected Valley */}
        <div className="lg:col-span-3 space-y-4">
          {/* Valley Overview */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valley Focus</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedRegion.riskLevel === 'HIGH'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {selectedRegion.riskLevel}
              </span>
            </div>
            <h3 className="font-bold text-sm text-white">{selectedRegion.name}</h3>
            <p className="text-[11px] text-slate-400">{selectedRegion.valleyOrBasin}</p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Current River:</span>
                <span className="font-bold text-cyan-300">{selectedRegion.riverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">River Height:</span>
                <span className="font-mono text-white">
                  {selectedRegion.riverLevel}m / <span className="text-red-400">{selectedRegion.riverDangerMark}m</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Soil Saturation:</span>
                <span className="font-mono text-emerald-400">{selectedRegion.soilMoisture}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mean Slope:</span>
                <span className="font-mono text-amber-400">{selectedRegion.averageSlope}°</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToPredict(selectedRegion)}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Inspect IMD Danger Status</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* IoT Sensor Nodes List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 max-h-[280px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Radio className="h-3 w-3 text-cyan-400" />
                <span>Valley Sensors ({activeSensorsInRegion.length})</span>
              </span>
            </div>

            {activeSensorsInRegion.length === 0 ? (
              <p className="text-[11px] text-slate-500">No telemetry sensors deployed in this sector.</p>
            ) : (
              activeSensorsInRegion.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensorId(s.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedSensorId === s.id
                      ? 'bg-slate-800 border-cyan-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-[11px] truncate">{s.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        s.status === 'Critical' ? 'bg-red-600 text-white' : 'bg-slate-800 text-emerald-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span className="font-mono text-cyan-300 font-bold">
                      {s.value} {s.unit}
                    </span>
                    <span>Bat: {s.batteryPct}%</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Nearby Shelters in Valley */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-400" />
              <span>Designated Shelters ({sheltersInRegion.length})</span>
            </span>
            {sheltersInRegion.map((sh) => (
              <div key={sh.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
                <div className="font-bold text-emerald-300">{sh.name}</div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Height above river: <b className="text-white">{sh.heightAboveRiverM}m</b></span>
                  <span>Occupancy: {Math.round((sh.currentOccupancy / sh.capacity) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
