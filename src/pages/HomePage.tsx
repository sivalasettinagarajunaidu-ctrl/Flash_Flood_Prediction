import React, { useState } from 'react';
import {
  CloudRain,
  Mountain,
  Droplets,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Activity,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import { Region, RiskLevel, SensorNode, Shelter, RescueTeam, HazardZone, AlertItem } from '../types';
import { INDIA_PLACES_DATABASE, convertPlaceToRegion, generateAuxiliaryDataForPlace } from '../data/indiaRegionsData';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  onNavigate: (tab: string) => void;
  onSelectPlaceAsActiveRegion?: (
    region: Region,
    auxData: {
      sensors: SensorNode[];
      shelter: Shelter;
      rescueTeam: RescueTeam;
      hazardZone: HazardZone;
      alertItem: AlertItem;
    },
    targetTab?: string
  ) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  onNavigate,
  onSelectPlaceAsActiveRegion,
}) => {
  const [activeTabFlow, setActiveTabFlow] = useState<number>(1);
  const { t, updateActiveRegionState } = useLanguage();

  // Sync active region's state with auto language adaptation
  React.useEffect(() => {
    if (selectedRegion?.state) {
      updateActiveRegionState(selectedRegion.state);
    }
  }, [selectedRegion?.state, updateActiveRegionState]);

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            ⚠️ {t('risk_high')}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
            ⚠️ {t('risk_medium')}
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            ✓ {t('risk_low')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wider uppercase">
              <Activity className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Multi-Source Geo-Hydrologic Sentinel</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Flash Flood Prediction System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Hilly Regions</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Predicting sudden catastrophic flash floods in steep mountainous terrain by coupling multi-source telemetry:
              <strong className="text-cyan-300 font-semibold"> IMD Rainfall</strong>,
              <strong className="text-cyan-300 font-semibold"> NASA SMAP Soil Moisture</strong>,
              <strong className="text-cyan-300 font-semibold"> SRTM Digital Elevation/Slope</strong>, and
              <strong className="text-cyan-300 font-semibold"> River Stage Gauges</strong> into an ensemble machine-learning engine.
            </p>

            {/* Real IMD Live Danger Alert Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-red-900/60 to-amber-950/80 border-2 border-red-500/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-600/30 text-red-400 border border-red-500/40 mt-0.5">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-red-300 uppercase tracking-wider">
                      Real IMD Hilly Danger Telemetry & Predictions
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-bold text-white">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-red-100/90 font-medium mt-0.5">
                    Atmospheric radar data, satellite soil saturation, and surge predictions for endangered Indian mountain corridors (Kedarnath, Wayanad, Manali, Chamoli, Munnar, Teesta).
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('imd-danger')}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/40 transition-all"
              >
                <span>Explore Danger Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Search Bar for Any Place in India */}
            <div className="pt-2 max-w-xl">
              <div
                onClick={() => onNavigate('search')}
                className="group relative flex items-center cursor-pointer"
              >
                <div className="absolute left-4 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Search className="h-5 w-5" />
                </div>
                <div className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-slate-950/90 border-2 border-cyan-500/50 hover:border-cyan-400 text-slate-300 text-xs sm:text-sm font-medium shadow-lg shadow-cyan-500/10 flex items-center justify-between transition-all">
                  <span className="truncate">Search any place in India (Kedarnath, Manali, Wayanad...)</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                    Open Search Page
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Catchment Hotspots */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Popular Monitored Mountain Basins:</span>
                </div>
                <button
                  onClick={() => onNavigate('search')}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline text-[11px] font-semibold"
                >
                  View Full Directory →
                </button>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
                {[
                  { label: 'Kedarnath (UK)', place: INDIA_PLACES_DATABASE[0] },
                  { label: 'Manali (HP)', place: INDIA_PLACES_DATABASE[6] },
                  { label: 'Wayanad (KL)', place: INDIA_PLACES_DATABASE[14] },
                  { label: 'Munnar (KL)', place: INDIA_PLACES_DATABASE[15] },
                  { label: 'Gangtok (SK)', place: INDIA_PLACES_DATABASE[23] },
                  { label: 'Cherrapunji (ML)', place: INDIA_PLACES_DATABASE[26] },
                  { label: 'Shimla (HP)', place: INDIA_PLACES_DATABASE[7] },
                  { label: 'Darjeeling (WB)', place: INDIA_PLACES_DATABASE[30] },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onSelectPlaceAsActiveRegion) {
                        const reg = convertPlaceToRegion(item.place);
                        const aux = generateAuxiliaryDataForPlace(item.place);
                        onSelectPlaceAsActiveRegion(reg, aux);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedRegion.id === item.place.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => onNavigate('imd-danger')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform active:scale-95"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>IMD Danger Tracker</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>{t('hero_cta_map')}</span>
              </button>

              <button
                onClick={() => onNavigate('alerts')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span>{t('hero_cta_alerts')}</span>
              </button>

              <button
                onClick={() => onNavigate('sos')}
                className="px-5 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
              >
                <ShieldAlert className="h-4 w-4 animate-pulse" />
                <span>{t('nav_sos')}</span>
              </button>
            </div>
          </div>

          {/* Quick Regional Snapshot Card (Right Col) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-950/80 border border-slate-700/70 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Selected Basin</span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-cyan-400" />
                    {selectedRegion.name}
                  </h3>
                </div>
                {getRiskBadge(selectedRegion.riskLevel)}
              </div>

              {/* Multi-Source Metric Matrix */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>1h Rainfall</span>
                    <CloudRain className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-mono font-bold text-white">{selectedRegion.rainfall1h} mm/hr</div>
                  <span className="text-[10px] text-slate-400">24h Total: {selectedRegion.rainfall24h} mm</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Soil Moisture</span>
                    <Droplets className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-mono font-bold text-white">{selectedRegion.soilMoisture}%</div>
                  <span className="text-[10px] text-slate-400">NASA SMAP Saturation</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Terrain Slope</span>
                    <Mountain className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-mono font-bold text-white">{selectedRegion.averageSlope}°</div>
                  <span className="text-[10px] text-slate-400">Elevation: {selectedRegion.elevation}m</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>River Stage</span>
                    <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="text-xl font-mono font-bold text-white">{selectedRegion.riverLevel}m</div>
                  <span className="text-[10px] text-red-400">Danger: {selectedRegion.riverDangerMark}m</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Telemetry: {selectedRegion.lastUpdated}</span>
                </span>
                <button
                  onClick={() => onNavigate('map')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-xs"
                >
                  <span>View on Live Map</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Project Different: Multi-Source Coupling Demonstration */}
      <section className="rounded-2xl bg-slate-900/50 border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
            Key Architectural Insight
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white">Why "Multi-Source Data" is Crucial for Hilly Regions</h2>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-3xl">
          Unlike plains where rainfall volume is the primary metric, steep mountain valleys behave non-linearly.
          Rainfall alone is notoriously misleading. Consider these two contrasting hydrological scenarios:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scenario A: Catastrophic Coupling */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-red-300 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-400" />
                Scenario A: Catastrophic Multi-Source Flash Flood
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">
                HIGH RISK (89%)
              </span>
            </div>
            <div className="font-mono text-xs text-slate-200 bg-slate-950/80 p-2.5 rounded-lg space-y-1">
              <div className="text-red-300 font-bold">Heavy Rainfall (85 mm/h) + Steep Slope (34°) + High Soil Saturation (88%) + Valley History</div>
            </div>
            <p className="text-xs text-slate-400">
              Antecedent soil saturation leaves <strong>zero infiltration capacity</strong>. Gravity on steep slopes creates hyper-concentrated sheet flow, resulting in devastating mud & debris flash surges within 40 minutes.
            </p>
          </div>

          {/* Scenario B: Safe Infiltration */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Scenario B: High Infiltration Buffering
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                LOW RISK (26%)
              </span>
            </div>
            <div className="font-mono text-xs text-slate-200 bg-slate-950/80 p-2.5 rounded-lg space-y-1">
              <div className="text-emerald-300 font-bold">Heavy Rainfall (85 mm/h) + Gentle Slope (10°) + Dry Low Soil Moisture (28%) + Dense Forest</div>
            </div>
            <p className="text-xs text-slate-400">
              Despite identical heavy rainfall, the dry hillside soil absorbs the volume. Gentle incline slows overland velocity and forest canopy intercepts kinetic energy, averting a flash flood.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Interactive Flow Diagram */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">System Architecture & Pipeline</h2>
            <p className="text-xs text-slate-400">End-to-end data pipeline from satellite and IoT sensors to ML classification and community sirens.</p>
          </div>
          <button
            onClick={() => onNavigate('model')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Inspect Model Math & Trees</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          {/* Steps Breadcrumbs / Pills */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {[
              { num: 1, title: 'Multi-Source Data', desc: 'Rainfall, Soil, DEM, River' },
              { num: 2, title: 'Preprocessing', desc: 'Feature Engineering & Lag' },
              { num: 3, title: 'ML Prediction', desc: 'Random Forest Ensemble' },
              { num: 4, title: 'Classification', desc: 'Low, Medium, High' },
              { num: 5, title: 'Early Warning', desc: 'CAP Alerts & Sirens' },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setActiveTabFlow(step.num)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeTabFlow === step.num
                    ? 'bg-cyan-500/20 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      activeTabFlow === step.num ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="font-bold text-xs text-slate-200">{step.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 pl-7">{step.desc}</div>
              </button>
            ))}
          </div>

          {/* Detailed step explanation */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
            {activeTabFlow === 1 && (
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">Phase 1: Multi-Source Data Ingestion</h4>
                <p>
                  High-resolution satellite feeds (NASA SMAP Soil Moisture at 9km/1km downscaled, SRTM 30m Digital Elevation Model) combined with real-time IMD Doppler Weather Radar and on-ground solar IoT ESP32 tipping rain buckets and ultrasonic river radar stage gauges.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800">Rainfall (1h, 3h, 24h)</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Soil Moisture (%)</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Slope Gradient (°)</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">River Height (m)</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Land Cover C-Factor</span>
                </div>
              </div>
            )}
            {activeTabFlow === 2 && (
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">Phase 2: Data Preprocessing & Geotechnical Engineering</h4>
                <p>
                  Missing telemetry interpolation, outlier clipping for sensor noise, calculation of slope angle from DEM elevation grids using 3x3 Sobel kernel, calculation of Rational Runoff Coefficient (C-Factor), and antecedent precipitation index (API).
                </p>
              </div>
            )}
            {activeTabFlow === 3 && (
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">Phase 3: Machine Learning Prediction Models</h4>
                <p>
                  Trained Random Forest ensemble of 100 decision trees utilizing Gini impurity criteria to capture complex non-linear hydrologic relationships. Benchmarked alongside XGBoost (Gradient Boosted Trees) and LSTM recurrent neural networks for hydrograph curve projection.
                </p>
              </div>
            )}
            {activeTabFlow === 4 && (
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">Phase 4: Probabilistic Flood Risk Classification</h4>
                <p>
                  Probability calculation bounded between 0% and 100%. Mapped to standard 3-tier risk classification: <strong>LOW (&lt;40%)</strong>, <strong>MEDIUM (40% - 69%)</strong>, and <strong>HIGH (&ge;70%)</strong>, with estimated surge arrival lead times.
                </p>
              </div>
            )}
            {activeTabFlow === 5 && (
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">Phase 5: Automated Early Warning & Alert System</h4>
                <p>
                  Generation of Common Alerting Protocol (CAP) messages, dispatch of cell-broadcast SMS warnings, automatic triggering of valley audio sirens, and routing of search & rescue teams (NDRF/SDRF) to vulnerable coordinates.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Regional Catchment Selector Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Monitored Hilly Catchments</h2>
            <p className="text-xs text-slate-400">Select any valley to inspect live IoT sensor readings and terrain characteristics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region) => {
            const isSelected = region.id === selectedRegion.id;
            return (
              <div
                key={region.id}
                onClick={() => onSelectRegion(region)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white">{region.name}</h4>
                    <p className="text-[11px] text-slate-400">{region.state} • {region.mountainRange}</p>
                  </div>
                  {getRiskBadge(region.riskLevel)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/80 my-2">
                  <div>
                    <span className="text-[11px] text-slate-500">1h Rainfall:</span>
                    <div className="font-mono font-bold text-cyan-400">{region.rainfall1h} mm/h</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Soil Moisture:</span>
                    <div className="font-mono font-bold text-emerald-400">{region.soilMoisture}%</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Slope:</span>
                    <div className="font-mono font-bold text-amber-400">{region.averageSlope}°</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">River Level:</span>
                    <div className="font-mono font-bold text-blue-400">{region.riverLevel}m / {region.riverDangerMark}m</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">River: {region.riverName}</span>
                  <span className="text-cyan-400 font-semibold group flex items-center gap-1">
                    Select
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
