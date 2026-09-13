import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  X,
  TrendingUp,
  AlertTriangle,
  Compass,
  Radio,
  CloudRain,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Droplets,
  Layers,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Navigation,
  ChevronRight,
  Activity,
  Sliders,
  Filter,
} from 'lucide-react';
import {
  IndiaPlaceItem,
  INDIA_PLACES_DATABASE,
  searchIndiaPlaces,
  convertPlaceToRegion,
  predictFlashFloodForPlace,
  generateAuxiliaryDataForPlace,
} from '../data/indiaRegionsData';
import { Region, SensorNode, Shelter, RescueTeam, HazardZone, AlertItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface IndiaSearchBarProps {
  selectedRegion?: Region;
  onSelectPlaceAsActiveRegion: (
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
  onNavigateTab?: (tab: string) => void;
  variant?: 'navbar' | 'hero' | 'compact';
  className?: string;
}

export const IndiaSearchBar: React.FC<IndiaSearchBarProps> = ({
  selectedRegion,
  onSelectPlaceAsActiveRegion,
  onNavigateTab,
  variant = 'navbar',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [activePreviewPlace, setActivePreviewPlace] = useState<IndiaPlaceItem | null>(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [slideActiveTab, setSlideActiveTab] = useState<'overview' | 'hydrology' | 'shelters' | 'rescue' | 'actions'>('overview');
  const [slideSearchQuery, setSlideSearchQuery] = useState('');
  const [showSlideSearchDropdown, setShowSlideSearchDropdown] = useState(false);

  const { updateActiveRegionState } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const slideSearchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowPredictionModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter results
  const allResults = searchIndiaPlaces(query);
  const filteredResults =
    selectedZone === 'All'
      ? allResults
      : allResults.filter((item) => item.zone.toLowerCase().includes(selectedZone.toLowerCase()));

  const handlePlaceClick = (place: IndiaPlaceItem) => {
    setActivePreviewPlace(place);
    setShowPredictionModal(true);
    setIsOpen(false);
  };

  const handleQuickActivate = (place: IndiaPlaceItem, targetTab?: string) => {
    const region = convertPlaceToRegion(place);
    const aux = generateAuxiliaryDataForPlace(place);
    if (place.state) {
      updateActiveRegionState(place.state);
    }
    onSelectPlaceAsActiveRegion(region, aux, targetTab);
    setShowPredictionModal(false);
    setIsOpen(false);
    if (targetTab && onNavigateTab) {
      onNavigateTab(targetTab);
    }
  };

  const zones = ['All', 'Himalayan North', 'Western Ghats', 'Northeast Hills', 'Eastern & Central'];

  const handleSwitchPreviewPlace = (place: IndiaPlaceItem) => {
    setActivePreviewPlace(place);
    setShowSlideSearchDropdown(false);
    setSlideSearchQuery('');
  };

  const slideSearchResults = searchIndiaPlaces(slideSearchQuery);

  const hotPlaces: { label: string; place: IndiaPlaceItem }[] = [
    { label: 'Kedarnath (UK)', place: INDIA_PLACES_DATABASE[0] },
    { label: 'Manali (HP)', place: INDIA_PLACES_DATABASE[6] },
    { label: 'Wayanad (KL)', place: INDIA_PLACES_DATABASE[14] },
    { label: 'Munnar (KL)', place: INDIA_PLACES_DATABASE[15] },
    { label: 'Gangtok (SK)', place: INDIA_PLACES_DATABASE[23] },
    { label: 'Cherrapunji (ML)', place: INDIA_PLACES_DATABASE[26] },
    { label: 'Shimla (HP)', place: INDIA_PLACES_DATABASE[7] },
    { label: 'Darjeeling (WB)', place: INDIA_PLACES_DATABASE[30] },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-400 bg-red-950/60 border-red-800/80';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Bar Input */}
      <div
        className={`relative flex items-center transition-all ${
          variant === 'hero'
            ? 'w-full max-w-2xl bg-slate-900/90 hover:bg-slate-900 border-2 border-cyan-500/40 hover:border-cyan-400 rounded-2xl shadow-xl shadow-cyan-950/40 p-2 sm:p-2.5'
            : 'w-full sm:w-80 md:w-96 bg-slate-900/95 hover:bg-slate-900 border border-slate-700 hover:border-cyan-500/60 rounded-xl shadow-md'
        }`}
      >
        <div className="pl-3 pr-2 text-cyan-400 flex items-center pointer-events-none">
          <Search className={`${variant === 'hero' ? 'h-5 w-5' : 'h-4 w-4'} animate-pulse`} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            variant === 'hero'
              ? 'Search any place in India (e.g., Kedarnath, Manali, Wayanad, Munnar, Gangtok, Shimla...)'
              : 'Search any place in India...'
          }
          className={`w-full bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none ${
            variant === 'hero' ? 'text-sm sm:text-base py-1' : 'text-xs sm:text-sm py-1.5'
          }`}
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 mr-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="pr-2.5 flex items-center gap-1.5">
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-inner">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Autocomplete & Instant Search Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[480px] flex flex-col w-[320px] sm:w-[460px] md:w-[540px]">
          {/* Top Filter Chips */}
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedZone === zone
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap pl-2">
              {filteredResults.length} places found
            </span>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto divide-y divide-slate-800/60 p-1.5 space-y-1">
            {filteredResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-slate-300">No pre-indexed locations found</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Type any custom Indian town or river basin name to run instant algorithmic flash flood prediction.
                </p>
              </div>
            ) : (
              filteredResults.map((place) => {
                const isCurrent = selectedRegion?.id === place.id;
                return (
                  <div
                    key={place.id}
                    onClick={() => handlePlaceClick(place)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 group ${
                      isCurrent
                        ? 'bg-cyan-950/40 border border-cyan-600/40'
                        : 'hover:bg-slate-800/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                          place.riskLevel === 'HIGH'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : place.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {place.placeName}
                          </span>
                          <span className="text-xs text-slate-400">
                            • {place.district}, {place.state}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500 text-slate-950">
                              CURRENT ACTIVE
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                          {place.valleyOrBasin}
                        </p>

                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <CloudRain className="h-3 w-3 text-cyan-400" />
                            <span>Rain: <b className="text-slate-200">{place.rainfall1h} mm/h</b></span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-emerald-400" />
                            <span>Soil: <b className="text-slate-200">{place.soilMoisture}%</b></span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3 text-blue-400" />
                            <span>{place.riverName} ({place.riverLevel}m)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${getRiskColor(
                          place.riskLevel
                        )}`}
                      >
                        {place.riskLevel} RISK
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickActivate(place);
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-200 font-semibold flex items-center gap-1 mt-1 opacity-90 group-hover:opacity-100 hover:underline"
                        title="Set as website active region"
                      >
                        <span>Activate</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Help Footer */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full multi-source hydrologic prediction across all Indian mountain basins</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">Press ESC to dismiss</span>
          </div>
        </div>
      )}

      {/* REGIONAL PREDICTION & ALL FUNCTIONALITIES ANSWER SLIDE */}
      {showPredictionModal && activePreviewPlace && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop for side mode - click to close */}
          <div
            onClick={() => {
              setShowPredictionModal(false);
              setIsFullScreen(false);
            }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            title="Click to close answer slide"
          />

          {/* Slide-over Drawer / Fullscreen Answer Slide */}
          <div
            className={`relative z-[101] bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
              isFullScreen
                ? 'w-full inset-0 border-l-0'
                : 'w-full sm:w-[580px] md:w-[700px] lg:w-[820px] xl:w-[920px]'
            }`}
          >
            {(() => {
              const { input, result } = predictFlashFloodForPlace(activePreviewPlace);
              const isCurrent = selectedRegion?.id === activePreviewPlace.id;

              return (
                <>
                  {/* Slide Top Header */}
                  <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase border flex items-center gap-1.5 ${getRiskColor(
                              activePreviewPlace.riskLevel
                            )}`}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>{result.riskLevel} RISK ANSWER SLIDE</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300 font-mono">
                            DEM Alt: {activePreviewPlace.elevation}m
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300 font-mono">
                            Slope: {activePreviewPlace.averageSlope}°
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-slate-950">
                              ACTIVE APP REGION
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                          {activePreviewPlace.name}
                        </h2>
                        <p className="text-xs text-slate-400 truncate">
                          {activePreviewPlace.valleyOrBasin} • {activePreviewPlace.mountainRange} • {activePreviewPlace.district}, {activePreviewPlace.state}
                        </p>
                      </div>

                      {/* Header Controls: Full Screen Toggle & Close */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setIsFullScreen(!isFullScreen)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                            isFullScreen
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                          title={isFullScreen ? 'Switch to side slide view' : 'Expand answer slide to full screen'}
                        >
                          {isFullScreen ? (
                            <>
                              <Minimize2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Side Slide</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Full Screen</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setShowPredictionModal(false);
                            setIsFullScreen(false);
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                          title="Close answer slide (Esc)"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* SEPARATE DEDICATED SEARCH BAR INSIDE THE SLIDE */}
                    <div className="pt-1 space-y-2">
                      <div className="relative">
                        <div className="relative flex items-center bg-slate-900 border border-slate-700 hover:border-cyan-500/60 rounded-xl focus-within:border-cyan-400 transition-all">
                          <div className="pl-3 pr-2 text-cyan-400 flex items-center pointer-events-none">
                            <Search className="h-4 w-4" />
                          </div>
                          <input
                            ref={slideSearchInputRef}
                            type="text"
                            value={slideSearchQuery}
                            onChange={(e) => {
                              setSlideSearchQuery(e.target.value);
                              setShowSlideSearchDropdown(true);
                            }}
                            onFocus={() => setShowSlideSearchDropdown(true)}
                            placeholder="Search another Indian place to switch this answer slide..."
                            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-xs sm:text-sm py-2 focus:outline-none"
                          />
                          {slideSearchQuery && (
                            <button
                              onClick={() => {
                                setSlideSearchQuery('');
                                setShowSlideSearchDropdown(false);
                              }}
                              className="p-1 text-slate-400 hover:text-white rounded-lg mr-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Slide Quick Search Autocomplete Dropdown */}
                        {showSlideSearchDropdown && slideSearchQuery && (
                          <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/98 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800/80">
                            {slideSearchResults.length === 0 ? (
                              <div className="p-3 text-xs text-slate-400 text-center">
                                No locations found matching "{slideSearchQuery}"
                              </div>
                            ) : (
                              slideSearchResults.slice(0, 8).map((place) => (
                                <div
                                  key={place.id}
                                  onClick={() => handleSwitchPreviewPlace(place)}
                                  className="p-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                                    <div>
                                      <span className="font-bold text-white">{place.name}</span>
                                      <span className="text-[11px] text-slate-400 ml-1.5">
                                        • {place.district}, {place.state}
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                      place.riskLevel === 'HIGH'
                                        ? 'bg-red-500/20 text-red-300'
                                        : place.riskLevel === 'MEDIUM'
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : 'bg-emerald-500/20 text-emerald-300'
                                    }`}
                                  >
                                    {place.riskLevel}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* Hot Places Pill Shortcuts for Instant Switching */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                        <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap">Quick Hotspots:</span>
                        {hotPlaces.map((hp) => (
                          <button
                            key={hp.place.id}
                            onClick={() => handleSwitchPreviewPlace(hp.place)}
                            className={`px-2 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 ${
                              activePreviewPlace.id === hp.place.id
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                hp.place.riskLevel === 'HIGH'
                                  ? 'bg-red-400'
                                  : hp.place.riskLevel === 'MEDIUM'
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                            />
                            <span>{hp.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slide Navigation Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 pt-2 text-xs">
                      {[
                        { id: 'overview', label: 'All Overview' },
                        { id: 'hydrology', label: 'Hydrologic Couplings' },
                        { id: 'shelters', label: 'Safe Shelters' },
                        { id: 'rescue', label: 'NDRF Rescue Unit' },
                        { id: 'actions', label: 'Emergency SOPs' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSlideActiveTab(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                            slideActiveTab === tab.id
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slide Scrollable Body */}
                  <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Primary Prediction Stats Banner */}
                    {(slideActiveTab === 'overview' || slideActiveTab === 'hydrology') && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Flood Probability</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
                            {result.floodProbability}%
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Multi-source ensemble ML</p>
                        </div>

                        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            <span>Surge Arrival Time</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                            {Math.round(result.estimatedSurgeTimeHours * 60)}m
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Valley runoff delay</p>
                        </div>

                        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                            <span>Rainfall Rate</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-blue-300 font-mono">
                            {activePreviewPlace.rainfall1h}
                            <span className="text-xs font-normal text-slate-400 ml-1">mm/h</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">24h sum: {activePreviewPlace.rainfall24h}mm</p>
                        </div>

                        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <Droplets className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Soil Saturation</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                            {activePreviewPlace.soilMoisture}%
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">NASA SMAP moisture</p>
                        </div>
                      </div>
                    )}

                    {/* Hydrological Warning & Directives */}
                    {(slideActiveTab === 'overview' || slideActiveTab === 'actions') && (
                      <div
                        className={`p-4 rounded-2xl border ${
                          activePreviewPlace.riskLevel === 'HIGH'
                            ? 'bg-red-950/30 border-red-900/60 text-red-200'
                            : activePreviewPlace.riskLevel === 'MEDIUM'
                            ? 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                            : 'bg-emerald-950/30 border-emerald-900/60 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert className="h-4 w-4" />
                            <span>Official Evacuation Directive: {activePreviewPlace.evacuationStatus}</span>
                          </span>
                          <span className="text-[11px] font-mono opacity-80">Category: {result.warningCategory}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">
                          {activePreviewPlace.riskLevel === 'HIGH'
                            ? `Steep ${activePreviewPlace.averageSlope}° terrain combined with ${activePreviewPlace.rainfall1h} mm/hr cloudburst triggers immediate debris flow risk into ${activePreviewPlace.riverName}. Vacate valley beds within 300m immediately.`
                            : activePreviewPlace.riskLevel === 'MEDIUM'
                            ? `Sustained rainfall on saturated mountain soil indicates moderate runoff surge into ${activePreviewPlace.riverName}. Low-lying camps and riverside roads should prepare for precautionary relocation.`
                            : `Current hydro-meteorological indices at ${activePreviewPlace.placeName} remain within stable parameters. River level is safely below danger threshold.`}
                        </p>
                      </div>
                    )}

                    {/* Regional Assets: Shelters & Rescue Units */}
                    {(slideActiveTab === 'overview' || slideActiveTab === 'shelters' || slideActiveTab === 'rescue') && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nearest Safe Shelter */}
                        {(slideActiveTab === 'overview' || slideActiveTab === 'shelters') && (
                          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                <Compass className="h-4 w-4" />
                                <span>Designated Safe Shelter</span>
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold">
                                High Ground Safezone
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white">{activePreviewPlace.nearestShelterName}</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                              <div>
                                <span className="text-slate-500">Perched:</span>{' '}
                                <b className="text-white">+145m above river</b>
                              </div>
                              <div>
                                <span className="text-slate-500">Capacity:</span> <b className="text-white">500 persons</b>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Equipped with Solar Microgrid, Purified Water & First Aid Trauma kit.
                            </p>
                          </div>
                        )}

                        {/* Assigned NDRF / SDRF Unit */}
                        {(slideActiveTab === 'overview' || slideActiveTab === 'rescue') && (
                          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                                <Radio className="h-4 w-4" />
                                <span>Rescue & Disaster Battalion</span>
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 font-bold">
                                Active Ready
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white">{activePreviewPlace.rescueUnitName}</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                              <div>
                                <span className="text-slate-500">Command:</span> <b className="text-white">32 Specialists</b>
                              </div>
                              <div>
                                <span className="text-slate-500">Gear:</span> <b className="text-white">IRB Boats & Drones</b>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Equipped with high-angle rope sets, satellite PTT, and inflatable swift-water rescue craft.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sensor Telemetry Nodes in this Region */}
                    {(slideActiveTab === 'overview' || slideActiveTab === 'hydrology') && (
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-cyan-400" />
                            <span>Multi-Source Field Sensor Nodes ({activePreviewPlace.placeName})</span>
                          </span>
                          <span className="text-[11px] text-cyan-400 font-mono">Mesh Status: Connected</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Tipping Bucket Rain Gauge</div>
                            <div className="font-mono font-bold text-sm text-cyan-300 mt-0.5">
                              {activePreviewPlace.rainfall1h} mm/hr
                            </div>
                            <div className="text-[10px] text-emerald-400 mt-0.5">ESP32-S3 LoRa • Battery 94%</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Radar River Stage Sensor</div>
                            <div className="font-mono font-bold text-sm text-blue-300 mt-0.5">
                              {activePreviewPlace.riverLevel}m / Danger: {activePreviewPlace.riverDangerMark}m
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{activePreviewPlace.riverName}</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Capacitive Soil Probe</div>
                            <div className="font-mono font-bold text-sm text-emerald-300 mt-0.5">
                              {activePreviewPlace.soilMoisture}% saturation
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Subsurface TDR probe</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slide Bottom Action Bar: Trigger All App Functionalities */}
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace, 'imd-danger')}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
                        title="Open IMD Danger & Regional Risk Assessment"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span>IMD Danger Status</span>
                      </button>

                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center justify-center gap-2 transition-all"
                        title="Set this location as the active region across the entire application"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Activate Globally</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace, 'map')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        title="Open in interactive GIS flood risk map"
                      >
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Live Map</span>
                      </button>

                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace, 'weather')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        title="Doppler radar and rainfall forecast"
                      >
                        <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                        <span>Radar</span>
                      </button>

                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace, 'shelters')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        title="Safe shelters and evacuation routes"
                      >
                        <Compass className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Shelters</span>
                      </button>

                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace, 'rescue')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        title="NDRF rescue unit operations"
                      >
                        <Radio className="h-3.5 w-3.5 text-amber-400" />
                        <span>Rescue</span>
                      </button>

                      <button
                        onClick={() => handleQuickActivate(activePreviewPlace, 'sos')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-colors"
                        title="Send SOS emergency distress alert"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>SOS</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
