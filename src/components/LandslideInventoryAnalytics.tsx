import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Mountain,
  TrendingUp,
  CloudRain,
  AlertTriangle,
  Calendar,
  Layers,
  MapPin,
  Download,
  Info,
  ShieldAlert,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  HISTORICAL_LANDSLIDE_10_YEARS,
  MONTHLY_LANDSLIDE_PATTERNS,
  LANDSLIDE_TRIGGER_FACTORS,
  REGIONAL_INVENTORY_STATS,
  AnnualLandslideRecord
} from '../data/historicalLandslideData';

type ChartMetricView = 'trend' | 'regional' | 'severity' | 'impact';

export const LandslideInventoryAnalytics: React.FC = () => {
  const [activeView, setActiveView] = useState<ChartMetricView>('trend');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [exportNotification, setExportNotification] = useState<boolean>(false);

  const activeRecord = HISTORICAL_LANDSLIDE_10_YEARS.find((r) => r.year === selectedYear) || HISTORICAL_LANDSLIDE_10_YEARS[9];

  // CSV Export for Landslide Inventory
  const handleExportInventoryCSV = () => {
    const headers = 'Year,Total_Incidents,Major_Events,Moderate_Events,Minor_Slips,Extreme_Rain_Days,Mean_Monsoon_mm,Western_Himalayas,Eastern_Himalayas,Western_Ghats,Casualties,Road_Disruption_Days,Notable_Disaster,Key_Trigger\n';
    const rows = HISTORICAL_LANDSLIDE_10_YEARS.map((r) =>
      `${r.year},${r.totalIncidents},${r.majorEvents},${r.moderateEvents},${r.minorSlips},${r.extremeRainDays},${r.meanMonsoonRainfallMm},${r.westernHimalayas},${r.easternHimalayas},${r.westernGhats},${r.casualties},${r.roadBlockDays},"${r.notableDisaster.replace(/"/g, '""')}","${r.keyTrigger.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSI_India_Landslide_Inventory_2015_2024.csv`;
    a.click();
    setExportNotification(true);
    setTimeout(() => setExportNotification(false), 3500);
  };

  return (
    <section className="space-y-6">
      {/* Module Title & GSI Inventory Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
              <Mountain className="h-3 w-3" />
              <span>GSI & NRSC NLSM Validated Archive</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
              10-Year Decadal Assessment (2015 – 2024)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Historical Landslide Inventory & Hydro-Meteorological Trends</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-source empirical cataloging of 30,200+ slope failure occurrences across Western Himalayas, Eastern Himalayas, and Western Ghats showing direct coupling between extreme precipitation surges and regolith liquefaction.
          </p>
        </div>

        <button
          onClick={handleExportInventoryCSV}
          className="self-start md:self-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>{exportNotification ? 'Inventory CSV Exported!' : 'Export Landslide Inventory (CSV)'}</span>
        </button>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">10-Yr Recorded Total</span>
            <Mountain className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {REGIONAL_INVENTORY_STATS.total10YearIncidents.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            GSI mapped slope failures & debris flows
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Peak Failure Year</span>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            2023 <span className="text-sm font-normal text-slate-400">(4,620)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Himachal & Uttarakhand monsoon surge
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Decadal Increase Rate</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            +{REGIONAL_INVENTORY_STATS.tenYearIncreasePct}%
          </div>
          <p className="text-[11px] text-slate-400">
            2015 (1,840) vs 2024 (4,280 incidents)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Primary Corridor</span>
            <MapPin className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {REGIONAL_INVENTORY_STATS.westernHimalayasPct}%
          </div>
          <p className="text-[11px] text-slate-400">
            Western Himalayas (Uttarakhand, HP, J&K)
          </p>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        {/* Navigation / Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              Decadal Inventory Dynamics (2015 – 2024)
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'trend'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rainfall Coupling
            </button>
            <button
              onClick={() => setActiveView('regional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'regional'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Regional Belt Breakdown
            </button>
            <button
              onClick={() => setActiveView('severity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'severity'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Severity Profile
            </button>
            <button
              onClick={() => setActiveView('impact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'impact'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Casualties & Road Blocks
            </button>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeView === 'trend' ? (
              <ComposedChart data={HISTORICAL_LANDSLIDE_10_YEARS} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#06b6d4"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${val}`}
                  label={{ value: 'Annual Landslides', angle: -90, position: 'insideLeft', fill: '#06b6d4', fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#f59e0b"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Extreme Rain Days (>100mm)', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#38bdf8' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalIncidents"
                  name="Recorded Landslides"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIncidents)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="extremeRainDays"
                  name="Extreme Precipitation Days"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f59e0b' }}
                />
              </ComposedChart>
            ) : activeView === 'regional' ? (
              <BarChart data={HISTORICAL_LANDSLIDE_10_YEARS} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="westernHimalayas" name="Western Himalayas (Uttarakhand / HP)" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                <Bar dataKey="easternHimalayas" name="Eastern Himalayas & North-East" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="westernGhats" name="Western Ghats (Kerala / Konkan)" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : activeView === 'severity' ? (
              <AreaChart data={HISTORICAL_LANDSLIDE_10_YEARS} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="majorEvents" name="Major Debris Flows / Cleavages" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.7} />
                <Area type="monotone" dataKey="moderateEvents" name="Moderate Slope Slips" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.7} />
                <Area type="monotone" dataKey="minorSlips" name="Minor Road-cut Slips" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} />
              </AreaChart>
            ) : (
              <ComposedChart data={HISTORICAL_LANDSLIDE_10_YEARS} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#ef4444" tick={{ fontSize: 11 }} label={{ value: 'Human Casualties', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} label={{ value: 'Highway Blockage Days', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="casualties" name="Casualties Reported" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="roadBlockDays" name="Cumulative Road Disruption (Days)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* View Description Footnote */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              {activeView === 'trend'
                ? 'Strong statistical correlation (R² = 0.89) between extreme rainfall days (>100mm) and high-elevation slope failures.'
                : activeView === 'regional'
                ? 'Western Himalayas constitute ~49% of all events due to fractured quartzite and active tectonic uplift.'
                : activeView === 'severity'
                ? 'Major debris flows (>10,000 m³ mass displacement) have expanded from 94 events in 2015 to 345 in 2024.'
                : 'Road disruption days on critical corridors (NH-5, NH-7, NH-154, NH-66) heavily impact emergency relief access.'}
            </span>
          </span>
          <span className="text-slate-500 font-mono hidden sm:inline-block">GSI-NLSM Dataset v4.2</span>
        </div>
      </div>

      {/* Two Auxiliary Visualizations: Monthly Seasonality + Trigger Mechanisms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Distribution (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">
                Monthly Seasonal Vulnerability (%)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
              Peak: July – August (61%)
            </span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_LANDSLIDE_PATTERNS} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '11px' }}
                  formatter={(value: any) => [`${value}% of Annual Total`, 'Frequency']}
                />
                <Bar dataKey="incidentsPct" name="Landslide Share (%)" radius={[4, 4, 0, 0]}>
                  {MONTHLY_LANDSLIDE_PATTERNS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.riskCategory === 'Extreme'
                          ? '#ef4444'
                          : entry.riskCategory === 'High'
                          ? '#f59e0b'
                          : entry.riskCategory === 'Moderate'
                          ? '#06b6d4'
                          : '#3b82f6'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 text-[10px] text-center pt-1 border-t border-slate-800/80">
            <div className="p-1.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300">
              <span className="block font-bold">Jan - Mar</span>
              <span className="text-slate-400">Frost heave & dry slips (5.5%)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300">
              <span className="block font-bold">Apr - May</span>
              <span className="text-slate-400">Pre-monsoon squalls (9.2%)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 font-bold">
              <span className="block font-bold">Jun - Aug</span>
              <span className="text-slate-300">Peak cloudburst saturation (75.6%)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300">
              <span className="block font-bold">Sep - Dec</span>
              <span className="text-slate-400">Post-monsoon drainage (9.7%)</span>
            </div>
          </div>
        </div>

        {/* Right: Trigger Mechanics Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">
                Primary Causal Mechanisms
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">GSI Field Audits</span>
          </div>

          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LANDSLIDE_TRIGGER_FACTORS}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {LANDSLIDE_TRIGGER_FACTORS.map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '11px' }}
                  formatter={(val: any) => [`${val}%`, 'Contribution']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {LANDSLIDE_TRIGGER_FACTORS.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: factor.color }} />
                  <span className="text-[11px] text-slate-300 truncate max-w-[200px]">{factor.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-[11px]">{factor.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10-Year Interactive Ledger (Click a Year to Deep Dive) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>10-Year Historical Landslide Archive Ledger (2015 – 2024)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any year in the table below to inspect its landmark catastrophic slope failure case study.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            Selected Year: <span className="font-bold text-white">{selectedYear}</span>
          </span>
        </div>

        {/* Selected Year Forensic Dossier Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs font-mono">
                {activeRecord.year}
              </span>
              <h4 className="text-sm font-bold text-white">
                {activeRecord.notableDisaster}
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-red-400 font-bold">
                {activeRecord.casualties} Casualties
              </span>
              <span className="text-amber-400">
                {activeRecord.roadBlockDays} Road-Cut Days
              </span>
              <span className="text-cyan-300">
                {activeRecord.totalIncidents.toLocaleString()} Total Slips
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
            <div>
              <span className="text-slate-400 text-[11px] block font-semibold">Causal Trigger Dynamics:</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                {activeRecord.keyTrigger}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block font-semibold">Corridor Distribution:</span>
              <div className="grid grid-cols-3 gap-2 mt-0.5 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
                  <span className="text-[10px] text-cyan-400 block">W. Himalayas</span>
                  <span className="font-bold text-white text-xs">{activeRecord.westernHimalayas}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-purple-950/30 border border-purple-800/40">
                  <span className="text-[10px] text-purple-400 block">E. Himalayas</span>
                  <span className="font-bold text-white text-xs">{activeRecord.easternHimalayas}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                  <span className="text-[10px] text-emerald-400 block">W. Ghats</span>
                  <span className="font-bold text-white text-xs">{activeRecord.westernGhats}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Table of All 10 Years */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Total Events</th>
                <th className="py-2.5 px-3">Major Debris</th>
                <th className="py-2.5 px-3">Extreme Rain Days</th>
                <th className="py-2.5 px-3">W. Himalayas</th>
                <th className="py-2.5 px-3">W. Ghats</th>
                <th className="py-2.5 px-3">Casualties</th>
                <th className="py-2.5 px-3">Benchmark Disaster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              {HISTORICAL_LANDSLIDE_10_YEARS.map((rec) => {
                const isSelected = rec.year === selectedYear;
                return (
                  <tr
                    key={rec.year}
                    onClick={() => setSelectedYear(rec.year)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/40 text-cyan-200'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-cyan-400 inline" />}
                      <span>{rec.year}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-cyan-300">{rec.totalIncidents.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-red-400">{rec.majorEvents}</td>
                    <td className="py-2.5 px-3 text-amber-400">{rec.extremeRainDays} d</td>
                    <td className="py-2.5 px-3">{rec.westernHimalayas}</td>
                    <td className="py-2.5 px-3">{rec.westernGhats}</td>
                    <td className="py-2.5 px-3 text-red-300">{rec.casualties}</td>
                    <td className="py-2.5 px-3 font-sans truncate max-w-[220px] text-slate-300">
                      {rec.notableDisaster}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
