import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  FileSpreadsheet,
  Layers,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { HistoricalFlood } from '../types';
import { mockHistoricalFloods } from '../data/mockData';
import { LandslideInventoryAnalytics } from '../components/LandslideInventoryAnalytics';

export const AnalyticsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalFlood>(mockHistoricalFloods[0]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    const headers = 'ID,Date,Name,Region,State,Rainfall24h_mm,PeakDischarge_m3s,SoilSaturation_pct,Casualties\n';
    const rows = mockHistoricalFloods
      .map(
        (f) =>
          `"${f.id}","${f.date}","${f.name}","${f.region}","${f.state}",${f.rainfallMm24h},${f.peakDischargeCumecs},${f.estimatedSoilSaturationPct},${f.casualties}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flash_flood_historical_telemetry_${Date.now()}.csv`;
    a.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
              Paleo-Hydrology & Machine Calibration
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics & Historical Flood Archive</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Empirical multi-source telemetry from major Himalayan and Western Ghats flash flood disasters used for model training.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>{downloadSuccess ? 'Downloaded CSV!' : 'Export Historical Floods (CSV)'}</span>
        </button>
      </div>

      {/* 10-Year Historical Landslide Inventory Visualizations (Recharts) */}
      <LandslideInventoryAnalytics />

      {/* Historical Disasters Table & Deep Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Historical Disasters List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>Benchmark Mountain Flash Flood Events</span>
          </h3>

          <div className="space-y-3">
            {mockHistoricalFloods.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedEvent.id === event.id
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{event.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {event.region} • {event.date}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                    {event.casualties} Casualties
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Rainfall (24h):</span>
                    <span className="font-mono font-bold text-cyan-300">{event.rainfallMm24h} mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Peak Discharge:</span>
                    <span className="font-mono font-bold text-blue-300">{event.peakDischargeCumecs} m³/s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Antecedent Soil Sat.:</span>
                    <span className="font-mono font-bold text-emerald-300">{event.estimatedSoilSaturationPct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Event Telemetry Deep-Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Forensic Case Study</span>
              <h3 className="text-lg font-bold text-white">{selectedEvent.name}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {selectedEvent.region} ({selectedEvent.date})
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <span className="font-bold text-slate-400 block uppercase text-[10px]">Causal Hydrologic Mechanism:</span>
              <p className="leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                {selectedEvent.summary}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 block uppercase text-[10px]">Contributing Geological Factors:</span>
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-800/60 space-y-1">
                {selectedEvent.keyFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Insight */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 text-slate-400">
              <div className="font-bold text-cyan-300">Machine Learning Lesson:</div>
              <p className="text-[11px] leading-relaxed">
                Soil saturation at {selectedEvent.estimatedSoilSaturationPct}% on a {selectedEvent.slopeAngleDeg}° slope meant that even without record-breaking cloudbursts, the steep mountain runoff converted immediately into high-energy debris flow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recurrence Return Periods (5-yr to 100-yr flood levels) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          <span>Mountain Catchment Return Period Curves (Gumbel Extreme Value Distribution)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">5-Year Event</span>
            <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">42 mm/h</span>
            <span className="text-[10px] text-slate-500">Runoff: 320 m³/s</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">10-Year Event</span>
            <span className="text-lg font-mono font-bold text-cyan-400 mt-1 block">58 mm/h</span>
            <span className="text-[10px] text-slate-500">Runoff: 580 m³/s</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">25-Year Event</span>
            <span className="text-lg font-mono font-bold text-amber-400 mt-1 block">74 mm/h</span>
            <span className="text-[10px] text-slate-500">Runoff: 1,150 m³/s</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">50-Year Event</span>
            <span className="text-lg font-mono font-bold text-orange-400 mt-1 block">92 mm/h</span>
            <span className="text-[10px] text-slate-500">Runoff: 2,400 m³/s</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">100-Year Event</span>
            <span className="text-lg font-mono font-bold text-red-400 mt-1 block">115+ mm/h</span>
            <span className="text-[10px] text-slate-500">Runoff: 4,800+ m³/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
