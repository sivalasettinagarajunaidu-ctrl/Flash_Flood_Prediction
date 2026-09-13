import React, { useState, useEffect, useRef } from 'react';
import {
  CloudRain,
  Droplets,
  Wind,
  Gauge,
  TrendingUp,
  Compass,
  Zap,
  Radio,
  Clock,
  Eye,
} from 'lucide-react';
import { Region } from '../types';

interface WeatherDashboardPageProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export const WeatherDashboardPage: React.FC<WeatherDashboardPageProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
}) => {
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  // Doppler Radar Sweep Animation on Canvas
  useEffect(() => {
    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      const canvas = radarCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) - 10;

      // Clear dark background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Draw concentric range rings (10km, 25km, 50km)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Simulated rain cell reflectivity blips (dBZ) based on region rainfall
      const intensity = selectedRegion.rainfall1h;
      const blipCount = intensity > 40 ? 12 : 5;

      ctx.save();
      for (let i = 0; i < blipCount; i++) {
        const offsetAngle = (i * 0.52) + 0.8;
        const dist = ((i * 17) % (radius * 0.75)) + 20;
        const bx = cx + Math.cos(offsetAngle) * dist;
        const by = cy + Math.sin(offsetAngle) * dist;

        const blipRadius = 8 + (intensity > 40 ? 12 : 5);
        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, blipRadius);

        if (intensity > 50) {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // Red (Cloudburst >55 dBZ)
          gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)'); // Amber
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else if (intensity > 20) {
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.7)'); // Amber (Moderate rain)
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.6)'); // Cyan (Light rain)
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bx, by, blipRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw rotating radar sweep line & beam sector
      angle = (angle + 0.03) % (Math.PI * 2);
      setRadarSweepAngle(angle);

      // Radar sweep sector
      ctx.save();
      const sweepGrad = ctx.createConicGradient(angle - Math.PI / 2, cx, cy);
      sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      sweepGrad.addColorStop(0.1, 'rgba(6, 182, 212, 0.05)');
      sweepGrad.addColorStop(0.2, 'rgba(6, 182, 212, 0)');
      sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sweep leading line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedRegion]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Regional Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
              Doppler & In-Situ Feeds
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Weather & Rainfall Telemetry Dashboard</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Precipitation rate, Doppler radar cloudburst reflectivity, NASA SMAP soil moisture, and river hydrograph tracking.
          </p>
        </div>

        {/* Catchment Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">Valley:</label>
          <select
            value={selectedRegion.id}
            onChange={(e) => {
              const reg = regions.find((r) => r.id === e.target.value);
              if (reg) onSelectRegion(reg);
            }}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-cyan-400 outline-none"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.rainfall1h} mm/h)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Rainfall Metrics & Doppler Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hydrologic Gauges (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3-Column Precipitation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1h Rainfall */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>1-Hour Rate</span>
                <CloudRain className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-300">
                {selectedRegion.rainfall1h} <span className="text-xs font-normal text-slate-400">mm/h</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {selectedRegion.rainfall1h > 50 ? (
                  <span className="text-red-400 font-bold">Cloudburst Intensity</span>
                ) : selectedRegion.rainfall1h > 20 ? (
                  <span className="text-amber-400 font-bold">Heavy Downpour</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Moderate / Light</span>
                )}
              </div>
            </div>

            {/* 3h Rainfall */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>3-Hour Accumulation</span>
                <Droplets className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                {selectedRegion.rainfall3h} <span className="text-xs font-normal text-slate-400">mm</span>
              </div>
              <div className="text-[11px] text-slate-400">Continuous Surcharge</div>
            </div>

            {/* 24h Rainfall */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>24-Hour Cumulative</span>
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                {selectedRegion.rainfall24h} <span className="text-xs font-normal text-slate-400">mm</span>
              </div>
              <div className="text-[11px] text-slate-400">Historical comparison: High</div>
            </div>
          </div>

          {/* River Hydrograph & Stage Gauge */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span>{selectedRegion.riverName} Hydrograph Stage</span>
                </h3>
                <span className="text-[11px] text-slate-400">Ultrasonic Gauge Node #RG-301</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                  selectedRegion.riverLevel >= selectedRegion.riverDangerMark
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-800 text-cyan-300'
                }`}
              >
                {selectedRegion.riverLevel} m / {selectedRegion.riverDangerMark} m
              </span>
            </div>

            {/* Visual River Gauge Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Riverbed (0m)</span>
                <span>Warning ({selectedRegion.riverDangerMark - 0.5}m)</span>
                <span className="text-red-400 font-bold">Danger Mark ({selectedRegion.riverDangerMark}m)</span>
              </div>
              <div className="relative w-full bg-slate-950 h-5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    selectedRegion.riverLevel >= selectedRegion.riverDangerMark
                      ? 'bg-gradient-to-r from-amber-500 to-red-600'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                  }`}
                  style={{
                    width: `${Math.min(100, (selectedRegion.riverLevel / (selectedRegion.riverDangerMark + 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300">
              {selectedRegion.riverLevel >= selectedRegion.riverDangerMark ? (
                <span className="text-red-400 font-bold">
                  DANGER: River stage has breached embankment capacity. High velocity flood surge active in narrow gorge sections.
                </span>
              ) : (
                <span className="text-slate-400">
                  River water stage is currently {(selectedRegion.riverDangerMark - selectedRegion.riverLevel).toFixed(1)}m below the critical danger threshold.
                </span>
              )}
            </p>
          </div>

          {/* NASA SMAP Soil Saturation & Topographic Slope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                NASA SMAP Soil Saturation
              </span>
              <div className="text-3xl font-mono font-black text-emerald-300">
                {selectedRegion.soilMoisture}%
              </div>
              <p className="text-xs text-slate-400">
                {selectedRegion.soilMoisture > 80
                  ? 'Critical Saturation: Subsurface pore pressure maxed out; zero buffering.'
                  : 'Moderate moisture level; retaining partial absorption capacity.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                SRTM DEM Slope Gradient
              </span>
              <div className="text-3xl font-mono font-black text-amber-300">
                {selectedRegion.averageSlope}°
              </div>
              <p className="text-xs text-slate-400">
                Mean elevation {selectedRegion.elevation}m above sea level with rapid gravitational runoff vector.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Doppler Weather Radar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Doppler Weather Radar (IMD)</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>SWEEP LIVE</span>
              </span>
            </div>

            {/* Radar Canvas */}
            <div className="flex justify-center my-2">
              <canvas
                ref={radarCanvasRef}
                width={320}
                height={320}
                className="rounded-full border-2 border-slate-800 shadow-2xl shadow-cyan-950/50 max-w-full"
              />
            </div>

            {/* Radar dBZ Reflectivity Scale */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15 dBZ (Drizzle)</span>
                <span>35 dBZ (Rain)</span>
                <span>55+ dBZ (Cloudburst)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 via-amber-500 to-red-600" />
              <div className="text-[10px] text-slate-400 text-center pt-1">
                Radial beam sweep over {selectedRegion.name} gorge corridor (50 km radius)
              </div>
            </div>
          </div>

          {/* Micro-Climate Atmospheric Indicators */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Wind className="h-3.5 w-3.5 text-cyan-400" />
                <span>Valley Gust Velocity:</span>
              </span>
              <span className="font-mono font-bold text-white">38 km/h NW</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Gauge className="h-3.5 w-3.5 text-purple-400" />
                <span>Barometric Pressure:</span>
              </span>
              <span className="font-mono font-bold text-white">1004.2 hPa (Falling)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Atmospheric Instability (CAPE):</span>
              </span>
              <span className="font-mono font-bold text-amber-300">1850 J/kg (High)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
