import React, { useState, useEffect, useMemo } from 'react';
import {
  CloudRain,
  ShieldAlert,
  AlertTriangle,
  Activity,
  RefreshCw,
  Search,
  Sliders,
  Mountain,
  TrendingUp,
  Droplets,
  ArrowUpRight,
  Radio,
  CheckCircle2,
  Zap,
  Compass,
  PhoneCall,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';
import {
  ImdDangerAssessment,
  ImdNationalHillySummary,
  getAllImdHillyDangerAssessments,
  classifyImdAlert,
  predictHillyDanger,
} from '../services/imdDangerService';
import { convertPlaceToRegion, generateAuxiliaryDataForPlace } from '../data/indiaRegionsData';
import { Region, SensorNode, Shelter, RescueTeam, HazardZone, AlertItem } from '../types';

interface ImdDangerPageProps {
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
  onNavigate?: (tab: string) => void;
}

export const ImdDangerPage: React.FC<ImdDangerPageProps> = ({
  onSelectPlaceAsActiveRegion,
  onNavigate,
}) => {
  const [assessments, setAssessments] = useState<ImdDangerAssessment[]>([]);
  const [summary, setSummary] = useState<ImdNationalHillySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('in-kedarnath');
  const [simulatedBurstMmH, setSimulatedBurstMmH] = useState<number>(0);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState<boolean>(false);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [syncTimestamp, setSyncTimestamp] = useState<string>('');

  // Fetch IMD Hilly Assessments
  const loadImdData = async (refresh: boolean = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // First try backend API endpoint
      const response = await fetch('/api/imd/hilly-danger');
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.places && json.places.length > 0) {
          setAssessments(json.places);
          setSummary(json.summary);
          setSyncTimestamp(json.summary?.lastUpdated || new Date().toLocaleTimeString('en-IN'));
          return;
        }
      }
      throw new Error('Fallback to direct telemetry');
    } catch (err) {
      // Direct client fallback
      try {
        const fallback = await getAllImdHillyDangerAssessments();
        setAssessments(fallback.places);
        setSummary(fallback.summary);
        setSyncTimestamp(fallback.summary.lastUpdated);
      } catch (fallbackErr) {
        console.error('Failed to load IMD data:', fallbackErr);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadImdData();
  }, []);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return assessments.filter((place) => {
      const matchesSearch =
        place.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.riverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.mountainRange.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedZone === 'DANGER_ONLY') {
        return place.imdAlertLevel === 'RED' || place.imdAlertLevel === 'ORANGE';
      }
      if (selectedZone !== 'ALL') {
        return place.zone === selectedZone;
      }
      return true;
    });
  }, [assessments, searchQuery, selectedZone]);

  // Selected area with active simulation adjustments
  const activeAssessment = useMemo(() => {
    const base =
      assessments.find((p) => p.id === selectedAreaId) || assessments[0] || null;
    if (!base) return null;

    if (simulatedBurstMmH === 0) return base;

    // Apply simulation burst to test cloudburst tipping points
    const simulatedTelemetry = {
      ...base.telemetry,
      currentRainRateMmH: Math.round((base.telemetry.currentRainRateMmH + simulatedBurstMmH) * 10) / 10,
      rainfall24hMm: Math.round((base.telemetry.rainfall24hMm + simulatedBurstMmH * 1.5) * 10) / 10,
      soilMoisturePct: Math.min(99, Math.round(base.telemetry.soilMoisturePct + simulatedBurstMmH * 0.2)),
    };

    const simulatedAlert = classifyImdAlert(
      simulatedTelemetry.currentRainRateMmH,
      simulatedTelemetry.rainfall24hMm,
      simulatedTelemetry.forecast48hMm,
      simulatedTelemetry.soilMoisturePct,
      base.slope
    );

    const simulatedPrediction = predictHillyDanger(base.rawPlace, simulatedTelemetry);

    return {
      ...base,
      telemetry: simulatedTelemetry,
      imdAlertLevel: simulatedAlert.level,
      imdCategoryText: simulatedAlert.category,
      imdActionDirective: simulatedAlert.directive,
      prediction: simulatedPrediction,
    };
  }, [assessments, selectedAreaId, simulatedBurstMmH]);

  // Handle setting as active region globally
  const handleActivatePlace = (placeItem: ImdDangerAssessment, targetTab?: string) => {
    if (onSelectPlaceAsActiveRegion) {
      const region = convertPlaceToRegion(placeItem.rawPlace);
      const auxData = generateAuxiliaryDataForPlace(placeItem.rawPlace);
      onSelectPlaceAsActiveRegion(region, auxData, targetTab);
    } else if (onNavigate && targetTab) {
      onNavigate(targetTab);
    }
  };

  // AI Situation Report Generation
  const handleGenerateBriefing = async () => {
    setIsGeneratingBriefing(true);
    setAiBriefing(null);
    try {
      const res = await fetch('/api/imd/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topDangerPlaces: assessments.filter(
            (p) => p.imdAlertLevel === 'RED' || p.imdAlertLevel === 'ORANGE'
          ),
          summary,
        }),
      });
      const data = await res.json();
      if (data.briefing) {
        setAiBriefing(data.briefing);
      }
    } catch (e) {
      setAiBriefing(
        'NATIONAL IMD SITREP: Mountain sectors in Uttarakhand and Western Ghats indicate accelerated runoff. Emergency teams on standby.'
      );
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'RED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600/30 text-red-300 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-1.5 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            RED WARNING (IMD ACTION)
          </span>
        );
      case 'ORANGE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            ORANGE ALERT (BE PREPARED)
          </span>
        );
      case 'YELLOW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            YELLOW WATCH (BE UPDATED)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            GREEN (NO WARNING)
          </span>
        );
    }
  };

  const getLandslideBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="text-red-400 font-black">CRITICAL DEBRIS RISK</span>;
      case 'HIGH':
        return <span className="text-amber-400 font-bold">HIGH SLOPE SLIP RISK</span>;
      case 'MODERATE':
        return <span className="text-yellow-300 font-medium">MODERATE SECTOR VULNERABILITY</span>;
      default:
        return <span className="text-emerald-400 font-medium">LOW STABILITY CONCERN</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Activity className="h-10 w-10 text-cyan-400 animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-white">Connecting to Real IMD India Hilly Stations Telemetry...</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Aggregating high-resolution meteorological models, radar rainfall assimilation, and satellite soil moisture across the Himalayas, Western Ghats, and Northeast hills.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="imd-danger-hub">
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black tracking-wide uppercase">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span>Real IMD Meteorological Telemetry & Mountain Danger Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hilly Areas in Danger & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400">Flash Flood Predictor</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official India Meteorological Department (IMD) warning classifications coupled with geotechnical slope stability, volumetric soil saturation, and rational runoff models across vulnerable Indian mountain corridors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sync: {syncTimestamp || 'Live'}</span>
            </div>

            <button
              onClick={() => loadImdData(true)}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/30"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Live IMD Feed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* National Summary Threat Metrics */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Monitored Mountain Zones</span>
            <div className="text-2xl font-black text-white flex items-center gap-1.5">
              <Mountain className="h-5 w-5 text-cyan-400" />
              <span>{summary.monitoredZonesCount}</span>
            </div>
            <span className="text-[10px] text-cyan-400">Himalayas, Ghats, NE Hills</span>
          </div>

          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-1">
            <span className="text-[11px] text-red-300 font-medium block">RED ALERT (Immediate Action)</span>
            <div className="text-2xl font-black text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
              <span>{summary.redAlertCount}</span>
            </div>
            <span className="text-[10px] text-red-300 font-mono">Extreme Flash Flood & Torrent Danger</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-1">
            <span className="text-[11px] text-amber-300 font-medium block">ORANGE ALERT (Be Prepared)</span>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <span>{summary.orangeAlertCount}</span>
            </div>
            <span className="text-[10px] text-amber-300/80">Very Heavy Rain & Slope Saturated</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Peak 24h Rain Recorded</span>
            <div className="text-2xl font-black text-sky-400 flex items-center gap-1.5">
              <CloudRain className="h-5 w-5 text-sky-400" />
              <span>{summary.highestRainfallPlace.rainfall24h} mm</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate block">
              {summary.highestRainfallPlace.name} ({summary.highestRainfallPlace.state})
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Avg Mountain Soil Saturation</span>
            <div className="text-2xl font-black text-purple-400 flex items-center gap-1.5">
              <Droplets className="h-5 w-5 text-purple-400" />
              <span>{summary.averageSoilSaturation}%</span>
            </div>
            <span className="text-[10px] text-purple-300">Pore Pressure Elevated</span>
          </div>
        </div>
      )}

      {/* Interactive Simulation & Test Suite */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">
              Interactive What-If Cloudburst Simulation Slider
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Simulate sudden cloudburst bursts (+{simulatedBurstMmH} mm/h) across the selected hill zone
          </span>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={simulatedBurstMmH}
            onChange={(e) => setSimulatedBurstMmH(Number(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono text-cyan-300 font-bold text-xs whitespace-nowrap min-w-[100px] text-center">
            +{simulatedBurstMmH} mm/h burst
          </div>
          {simulatedBurstMmH > 0 && (
            <button
              onClick={() => setSimulatedBurstMmH(0)}
              className="text-xs text-slate-400 hover:text-white underline whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Active Area Focused Deep Dive + List of Hilly Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Highlighted Endangered Hill Station (7 cols) */}
        {activeAssessment && (
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Top Row: Place Name & IMD Alert Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{activeAssessment.mountainRange}</span>
                    <span>•</span>
                    <span>{activeAssessment.state}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {activeAssessment.placeName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeAssessment.valleyOrBasin} ({activeAssessment.district} District)
                  </p>
                </div>
                <div>{getAlertBadge(activeAssessment.imdAlertLevel)}</div>
              </div>

              {/* IMD Official Action Directive */}
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  activeAssessment.imdAlertLevel === 'RED'
                    ? 'bg-red-950/40 border-red-500/50 text-red-200'
                    : activeAssessment.imdAlertLevel === 'ORANGE'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span>IMD Official Warning Directive:</span>
                </div>
                <p>{activeAssessment.imdActionDirective}</p>
              </div>

              {/* Real Atmospheric Telemetry Grid */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Live Meteorological & Hydrological Observations (IMD / Satellite)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Rainfall Rate (1-Hour)</span>
                    <span className="text-base font-black text-cyan-300">
                      {activeAssessment.telemetry.currentRainRateMmH} mm/h
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {activeAssessment.telemetry.currentRainRateMmH >= 30
                        ? 'Cloudburst Burst'
                        : activeAssessment.telemetry.currentRainRateMmH >= 15
                        ? 'Heavy Rain'
                        : 'Moderate'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">24h Cumulative Rain</span>
                    <span className="text-base font-black text-sky-400">
                      {activeAssessment.telemetry.rainfall24hMm} mm
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {activeAssessment.telemetry.rainfall24hMm >= 204.5
                        ? 'Extremely Heavy (>204mm)'
                        : activeAssessment.telemetry.rainfall24hMm >= 115.6
                        ? 'Very Heavy (>115mm)'
                        : 'Heavy Runoff'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Soil Saturation (SMAP)</span>
                    <span
                      className={`text-base font-black ${
                        activeAssessment.telemetry.soilMoisturePct >= 80
                          ? 'text-red-400'
                          : activeAssessment.telemetry.soilMoisturePct >= 65
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {activeAssessment.telemetry.soilMoisturePct}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Pore Water Pressure</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Terrain Slope Angle</span>
                    <span className="text-base font-black text-amber-300">
                      {activeAssessment.slope}° incline
                    </span>
                    <span className="text-[10px] text-slate-500 block">DEM Digital Elevation</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Elevation Above Sea</span>
                    <span className="text-base font-black text-purple-300">
                      {activeAssessment.elevation} m
                    </span>
                    <span className="text-[10px] text-slate-500 block">Mountain Altitude</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Atmospheric Condition</span>
                    <span className="text-xs font-bold text-slate-200 truncate block">
                      {activeAssessment.telemetry.weatherDescription}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {activeAssessment.telemetry.temperatureC}°C • {activeAssessment.telemetry.windSpeedKmh} km/h
                    </span>
                  </div>
                </div>
              </div>

              {/* Prediction Engine Output */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Multi-Source Flash Flood Risk Assessment
                    </span>
                  </div>
                  <span className="text-xs font-black text-cyan-300 font-mono">
                    {activeAssessment.prediction.floodProbabilityPct}% PROBABILITY
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activeAssessment.prediction.floodProbabilityPct >= 70
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : activeAssessment.prediction.floodProbabilityPct >= 40
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                    }`}
                    style={{ width: `${activeAssessment.prediction.floodProbabilityPct}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" /> Surge Arrival ETA:
                    </span>
                    <span className="font-bold text-white font-mono">
                      ~{activeAssessment.prediction.surgeArrivalEtaHours} hours
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Mountain className="h-3.5 w-3.5 text-amber-400" /> Slope Landslide Risk:
                    </span>
                    {getLandslideBadge(activeAssessment.prediction.landslideSusceptibility)}
                  </div>
                </div>

                {/* Primary Danger Drivers */}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <span className="font-bold text-slate-300 block">Identified Hazard Drivers:</span>
                  <ul className="space-y-1">
                    {activeAssessment.prediction.primaryDangerDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleActivatePlace(activeAssessment, 'home')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Compass className="h-4 w-4" />
                  <span>Set as Active Region Globally</span>
                </button>

                <button
                  onClick={() => handleActivatePlace(activeAssessment, 'map')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4 text-cyan-400" />
                  <span>View on Live GIS Risk Map</span>
                </button>

                <button
                  onClick={() => handleActivatePlace(activeAssessment, 'alerts')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>View Regional Disaster Bulletins</span>
                </button>

                <button
                  onClick={() => handleActivatePlace(activeAssessment, 'shelters')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4 text-emerald-400" />
                  <span>View Designated Safe Shelters</span>
                </button>
              </div>

              {/* Emergency Battalion Hotline */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Mountain Rescue Battalion:</span>
                  <span className="font-bold text-amber-300">{activeAssessment.rescueUnitName}</span>
                </div>
                <a
                  href="tel:112"
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="h-3 w-3" />
                  <span>Emergency 112 / NDRF</span>
                </a>
              </div>
            </div>

            {/* AI Command Briefing Generator */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-bold text-white">
                    Emergency Command Situation Report (Gemini 3.8 Flash)
                  </span>
                </div>
                <button
                  onClick={handleGenerateBriefing}
                  disabled={isGeneratingBriefing}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/30"
                >
                  <Zap className="h-3 w-3" />
                  <span>{isGeneratingBriefing ? 'Synthesizing...' : 'Generate AI SITREP'}</span>
                </button>
              </div>

              {aiBriefing ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-900/40 text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                  {aiBriefing}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Click 'Generate AI SITREP' to produce a real-time hydrologic command analysis synthesizing multi-station IMD rain data, pore pressures, and gorge funneling directives.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Right Column: Searchable & Filterable Hilly Areas Danger List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Ranked Hilly Areas Under IMD Watch</span>
            </h3>
            <span className="text-xs text-slate-400">{filteredPlaces.length} locations</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hilly area, river, or state (e.g., Kedarnath, Wayanad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Zone Filters */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedZone === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              All Hills
            </button>
            <button
              onClick={() => setSelectedZone('DANGER_ONLY')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedZone === 'DANGER_ONLY'
                  ? 'bg-red-600 text-white font-bold border-red-500'
                  : 'bg-slate-900 text-red-300 border-red-900/50 hover:bg-slate-800'
              }`}
            >
              🔴 Red & Orange Only
            </button>
            <button
              onClick={() => setSelectedZone('Himalayan North')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedZone === 'Himalayan North'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Himalayas
            </button>
            <button
              onClick={() => setSelectedZone('Western Ghats')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedZone === 'Western Ghats'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Western Ghats
            </button>
            <button
              onClick={() => setSelectedZone('Northeast Hills')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedZone === 'Northeast Hills'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Northeast
            </button>
          </div>

          {/* Scrollable list of danger places */}
          <div className="space-y-3 max-h-[850px] overflow-y-auto pr-1">
            {filteredPlaces.map((place) => {
              const isSelected = place.id === selectedAreaId;
              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedAreaId(place.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-lg'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>{place.mountainRange}</span>
                        <span>•</span>
                        <span>{place.state}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {place.placeName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {place.riverName} • {place.elevation}m alt • {place.slope}° slope
                      </p>
                    </div>
                    <div>{getAlertBadge(place.imdAlertLevel)}</div>
                  </div>

                  {/* Micro telemetry chips */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[10px]">
                    <div>
                      <span className="text-slate-500 block">Rain 24h:</span>
                      <span className="font-bold text-sky-300 font-mono">
                        {place.telemetry.rainfall24hMm} mm
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Soil Sat:</span>
                      <span
                        className={`font-bold font-mono ${
                          place.telemetry.soilMoisturePct >= 80 ? 'text-red-400' : 'text-amber-300'
                        }`}
                      >
                        {place.telemetry.soilMoisturePct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Flood Risk:</span>
                      <span className="font-bold text-cyan-300 font-mono">
                        {place.prediction.floodProbabilityPct}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Surge ETA: ~{place.prediction.surgeArrivalEtaHours}h</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      Click to inspect <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredPlaces.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/40 border border-slate-800">
                No hilly locations matching '{searchQuery}' in the selected zone.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
