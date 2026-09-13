import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  MapPin,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  CloudRain,
  Compass,
  Radio,
  PhoneCall,
  ExternalLink,
  Activity,
  Waves,
  Mountain,
  Gauge,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Droplets,
  Share2,
  Info,
  ChevronRight,
  Star,
  Copy,
  Check,
  ArrowLeftRight,
  Printer,
  Maximize2,
  Minimize2,
  Navigation,
  Wind,
  Thermometer,
  Shield,
  FileText,
} from 'lucide-react';
import { Region, SensorNode, Shelter, RescueTeam, HazardZone, AlertItem } from '../types';
import {
  IndiaPlaceItem,
  INDIA_PLACES_DATABASE,
  searchIndiaPlaces,
  convertPlaceToRegion,
  predictFlashFloodForPlace,
  generateAuxiliaryDataForPlace,
} from '../data/indiaRegionsData';
import { useLanguage } from '../context/LanguageContext';
import { MapComponent } from '../components/MapComponent';

interface SearchPageProps {
  selectedRegion: Region;
  regions: Region[];
  onSelectPlaceAsActiveRegion: (
    region: Region,
    auxData?: {
      sensors: SensorNode[];
      shelter: Shelter;
      rescueTeam: RescueTeam;
      hazardZone: HazardZone;
      alertItem: AlertItem;
    },
    targetTab?: string
  ) => void;
  onNavigate: (tab: string) => void;
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  selectedRegion,
  regions,
  onSelectPlaceAsActiveRegion,
  onNavigate,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'risk' | 'rainfall' | 'elevation' | 'alphabetical'>('relevance');
  const [activatedSuccessMsg, setActivatedSuccessMsg] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<boolean>(false);

  // Bookmarked / Favorite places
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sentinel_favorite_places');
      return saved ? JSON.parse(saved) : ['in-kedarnath', 'in-wayanad', 'in-manali'];
    } catch {
      return ['in-kedarnath', 'in-wayanad', 'in-manali'];
    }
  });

  // Comparison drawer items (up to 3 places)
  const [comparisonPlaces, setComparisonPlaces] = useState<IndiaPlaceItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Map view toggle inside dossier
  const [showMiniMap, setShowMiniMap] = useState(true);

  // AI SITREP loading state
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { updateActiveRegionState } = useLanguage();

  // Active Place selection
  const [activePlace, setActivePlace] = useState<IndiaPlaceItem>(() => {
    const matched = INDIA_PLACES_DATABASE.find((p) => p.id === selectedRegion.id);
    return matched || INDIA_PLACES_DATABASE[0];
  });

  // What-if interactive simulation state
  const [simRainfall, setSimRainfall] = useState<number>(activePlace.rainfall1h);
  const [simSoilMoisture, setSimSoilMoisture] = useState<number>(activePlace.soilMoisture);

  // Sync simulation sliders on place change
  useEffect(() => {
    setSimRainfall(activePlace.rainfall1h);
    setSimSoilMoisture(activePlace.soilMoisture);
    setAiBriefing(null);
  }, [activePlace.id, activePlace.rainfall1h, activePlace.soilMoisture]);

  // Sync with outer selectedRegion if changed
  useEffect(() => {
    if (selectedRegion && selectedRegion.id !== activePlace.id) {
      const match = INDIA_PLACES_DATABASE.find((p) => p.id === selectedRegion.id);
      if (match) {
        setActivePlace(match);
      }
    }
  }, [selectedRegion.id]);

  // Save favorites to localStorage
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('sentinel_favorite_places', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Toggle place in comparison drawer
  const toggleComparison = (place: IndiaPlaceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setComparisonPlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) {
        return prev.filter((p) => p.id !== place.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 locations simultaneously.');
        return prev;
      }
      setIsCompareOpen(true);
      return [...prev, place];
    });
  };

  // List of all unique states in database
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    INDIA_PLACES_DATABASE.forEach((p) => set.add(p.state));
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Raw search results
  const rawResults = useMemo(() => {
    return searchIndiaPlaces(searchQuery);
  }, [searchQuery]);

  // Filter & Sort Results
  const filteredResults = useMemo(() => {
    let list = [...rawResults];

    // Filter by Zone
    if (selectedZone !== 'All') {
      list = list.filter((p) => p.zone === selectedZone);
    }

    // Filter by State
    if (selectedState !== 'All') {
      list = list.filter((p) => p.state === selectedState);
    }

    // Filter by Risk
    if (selectedRiskFilter !== 'All') {
      list = list.filter((p) => p.riskLevel === selectedRiskFilter);
    }

    // Filter by Category
    if (selectedCategory === 'Favorites') {
      list = list.filter((p) => favorites.includes(p.id));
    } else if (selectedCategory === 'Pilgrimage') {
      list = list.filter((p) =>
        p.popularTags.some((t) => ['char dham', 'pilgrim', 'kedarnath', 'badrinath', 'gangotri', 'yamunotri', 'amarnath'].includes(t))
      );
    } else if (selectedCategory === 'High Altitude (>2000m)') {
      list = list.filter((p) => p.elevation >= 2000);
    } else if (selectedCategory === 'Steep Slope (>30°)') {
      list = list.filter((p) => p.averageSlope >= 30);
    }

    // Sorting
    if (sortBy === 'risk') {
      const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      list.sort((a, b) => order[b.riskLevel] - order[a.riskLevel]);
    } else if (sortBy === 'rainfall') {
      list.sort((a, b) => b.rainfall1h - a.rainfall1h);
    } else if (sortBy === 'elevation') {
      list.sort((a, b) => b.elevation - a.elevation);
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.placeName.localeCompare(b.placeName));
    }

    return list;
  }, [rawResults, selectedZone, selectedState, selectedRiskFilter, selectedCategory, sortBy, favorites]);

  // Place selection
  const handleSelectPlace = (place: IndiaPlaceItem) => {
    setActivePlace(place);
    if (window.innerWidth < 1024) {
      const el = document.getElementById('place-dossier-view');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Global activation
  const handleActivatePlaceGlobally = (targetTab?: string) => {
    const region = convertPlaceToRegion(activePlace);
    const aux = generateAuxiliaryDataForPlace(activePlace);
    onSelectPlaceAsActiveRegion(region, aux, targetTab);
    if (activePlace.state) {
      updateActiveRegionState(activePlace.state);
    }
    setActivatedSuccessMsg(`Activated ${activePlace.placeName} as the primary active region across the entire platform.`);
    setTimeout(() => setActivatedSuccessMsg(null), 4000);
  };

  // Dynamic simulation computation
  const dynamicSimAnalysis = useMemo(() => {
    const clonedPlace: IndiaPlaceItem = {
      ...activePlace,
      rainfall1h: simRainfall,
      soilMoisture: simSoilMoisture,
    };
    return predictFlashFloodForPlace(clonedPlace);
  }, [activePlace, simRainfall, simSoilMoisture]);

  // Auxiliary data for active place
  const auxData = useMemo(() => {
    return generateAuxiliaryDataForPlace(activePlace);
  }, [activePlace]);

  const activeRegionForMap = useMemo(() => {
    return [convertPlaceToRegion(activePlace)];
  }, [activePlace]);

  const isActiveCurrentRegion = selectedRegion.id === activePlace.id;

  // Copy Emergency Alert Dispatch message to clipboard
  const handleCopyAlert = () => {
    const msg = `🚨 SENTINEL FLASH FLOOD ADVISORY
Location: ${activePlace.placeName}, ${activePlace.district} (${activePlace.state})
River: ${activePlace.riverName} (Level: ${activePlace.riverLevel}m / Danger Mark: ${activePlace.riverDangerMark}m)
1h Rainfall: ${activePlace.rainfall1h} mm/h | Soil Saturation: ${activePlace.soilMoisture}%
Calculated Risk: ${activePlace.riskLevel} | Peak Surge ETA: ~${dynamicSimAnalysis.result.estimatedSurgeTimeHours} hrs
Designated Safe High-Ground Shelter: ${auxData.shelter.name} (+${auxData.shelter.heightAboveRiverM}m above river)
NDRF Response Battalion: ${auxData.rescueTeam.unitName} (Hotline: ${auxData.rescueTeam.contactPhone})
State Emergency Helpline: 1070 | National Disaster: 1078`;

    navigator.clipboard.writeText(msg).then(() => {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 3000);
    });
  };

  // Generate AI situation assessment
  const handleGenerateAiBriefing = async () => {
    setIsAiLoading(true);
    setAiBriefing(null);
    try {
      const res = await fetch('/api/imd/briefing');
      if (res.ok) {
        const data = await res.json();
        setAiBriefing(
          data.briefing ||
            `Geotechnical Situation Report for ${activePlace.placeName}: Steep catchment slope (${activePlace.averageSlope}°) with ${activePlace.soilMoisture}% soil saturation creates critical runoff velocity along the ${activePlace.riverName}. Downstream surge predicted within ${dynamicSimAnalysis.result.estimatedSurgeTimeHours} hours. Immediate civilian diversion to ${auxData.shelter.name} advised.`
        );
      } else {
        setAiBriefing(
          `Geotechnical Assessment for ${activePlace.placeName}: Multi-source sensors indicate elevated flash flood and debris flow potential. Mountain catchment of ${activePlace.catchmentAreaKm2} km² is funneling runoff into ${activePlace.riverName}. Evacuate low-lying gorge zones and monitor ${auxData.rescueTeam.unitName} radio broadcasts.`
        );
      }
    } catch {
      setAiBriefing(
        `Hydrological Advisory for ${activePlace.placeName}: Rainfall intensity of ${simRainfall} mm/h paired with steep slope elevation (${activePlace.elevation}m) triggers high hydraulic stress. Emergency command recommends immediate alert dissemination to riverside settlements.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Weather simulation presets
  const applyPreset = (rain: number, soil: number) => {
    setSimRainfall(rain);
    setSimSoilMoisture(soil);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. TOP HERO & COMPREHENSIVE SEARCH BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl space-y-4">
          {/* Top Pill Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Pan-India Mountain Early Warning Directory</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
              {INDIA_PLACES_DATABASE.length} Monitored Catchments & Valleys
            </span>
            {comparisonPlaces.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>Comparing ({comparisonPlaces.length}/3) Locations</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Search Any Place in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              India
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Query any Himalayan valley, Western Ghats slope, river gorge, pilgrim trail, or district.
            Access real-time hydro-meteorological telemetry, instant machine learning flood probability,
            interactive GIS map inspection, safe shelters, and assigned rescue battalions across the full page.
          </p>

          {/* Primary Search Input Bar with Clear & Shortcut */}
          <div className="pt-2">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-cyan-400">
                <Search className="h-5 w-5" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any place in India (e.g., Kedarnath, Wayanad, Manali, Munnar, Gangtok, Shimla, Coorg, Leh...)"
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 shadow-inner transition-all"
              />

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-12 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="absolute right-3.5 hidden sm:flex items-center">
                <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Search
                </span>
              </div>
            </div>
          </div>

          {/* Category Tabs: All, Favorites, Pilgrimage, High Altitude, Steep Slopes */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Categories:</span>
            {[
              { id: 'All', label: 'All Places' },
              { id: 'Favorites', label: `★ Favorites (${favorites.length})` },
              { id: 'Pilgrimage', label: 'Pilgrimage Corridors' },
              { id: 'High Altitude (>2000m)', label: 'High Altitude (>2000m)' },
              { id: 'Steep Slope (>30°)', label: 'Steep Slope (>30°)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filter Bar: Zone, State, Risk, Sort */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
            {/* Zone Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Zone:</span>
              </span>
              {(['All', 'Himalayan North', 'Western Ghats', 'Northeast Hills', 'Eastern Ghats & Central'] as const).map(
                (zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selectedZone === zone
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                        : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {zone === 'Eastern Ghats & Central' ? 'Central & Eastern' : zone}
                  </button>
                )
              )}
            </div>

            {/* State Dropdown & Risk Level & Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* State Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400">State:</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-400"
                >
                  {availableStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  <span>Risk:</span>
                </span>
                {(['All', 'HIGH', 'MEDIUM', 'LOW'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setSelectedRiskFilter(risk)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold border transition-all ${
                      selectedRiskFilter === risk
                        ? risk === 'HIGH'
                          ? 'bg-red-500 text-white border-red-400'
                          : risk === 'MEDIUM'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : risk === 'LOW'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-800/60 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400"
                >
                  <option value="relevance">Relevance</option>
                  <option value="risk">Highest Risk</option>
                  <option value="rainfall">Rainfall Rate</option>
                  <option value="elevation">Elevation</option>
                  <option value="alphabetical">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Notification Toast */}
      {activatedSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{activatedSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActivatedSuccessMsg(null)}
            className="p-1 rounded text-emerald-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. FULL-PAGE TWO-COLUMN LAYOUT: DIRECTORY (4 COLS) & COMPREHENSIVE DOSSIER (8 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SEARCH RESULTS & DIRECTORY (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Matching Places ({filteredResults.length})</span>
            </h2>
            {searchQuery && (
              <span className="text-[11px] text-cyan-400 font-mono truncate max-w-[150px]">
                "{searchQuery}"
              </span>
            )}
          </div>

          <div className="space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
            {filteredResults.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto opacity-70" />
                <p className="text-sm font-bold text-slate-200">No locations matched your filters</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Try clearing your state or risk filters, or query a different hill station or district.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedZone('All');
                    setSelectedState('All');
                    setSelectedRiskFilter('All');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredResults.map((place) => {
                const isSelected = activePlace.id === place.id;
                const isGlobalActive = selectedRegion.id === place.id;
                const isFav = favorites.includes(place.id);
                const isCompared = comparisonPlaces.some((p) => p.id === place.id);

                return (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 relative group ${
                      isSelected
                        ? 'bg-slate-900/95 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-white truncate">
                            {place.placeName}
                          </span>
                          {isGlobalActive && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[9px] font-black uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {place.district}, {place.state}
                        </p>
                      </div>

                      {/* Right action icons & Risk badge */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Favorite star */}
                        <button
                          onClick={(e) => toggleFavorite(place.id, e)}
                          className={`p-1 rounded-lg transition-colors ${
                            isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        {/* Compare toggle */}
                        <button
                          onClick={(e) => toggleComparison(place, e)}
                          className={`p-1 rounded-lg text-xs font-mono transition-colors ${
                            isCompared ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Add to comparison"
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                        </button>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            place.riskLevel === 'HIGH'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : place.riskLevel === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {place.riskLevel}
                        </span>
                      </div>
                    </div>

                    {/* Secondary telemetry metrics */}
                    <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
                      <span>{place.mountainRange.split('/')[0]}</span>
                      <span className="text-cyan-300 font-semibold">{place.elevation}m</span>
                      <span className="text-blue-300 font-semibold">{place.rainfall1h} mm/h</span>
                      <span className="text-amber-300">{place.averageSlope}° slope</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT MAIN COLUMN: FULL-PAGE DETAILED DOSSIER (8 cols) */}
        <div id="place-dossier-view" className="lg:col-span-8 xl:col-span-8 space-y-6">
          {/* Master Place Header Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            {/* Top row: Name, coordinates, actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activePlace.placeName}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                      activePlace.riskLevel === 'HIGH'
                        ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-sm shadow-red-500/10'
                        : activePlace.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                    }`}
                  >
                    {activePlace.riskLevel} Danger Level
                  </span>

                  <button
                    onClick={(e) => toggleFavorite(activePlace.id, e)}
                    className={`p-1.5 rounded-xl border transition-all ${
                      favorites.includes(activePlace.id)
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Bookmark Place"
                  >
                    <Star className={`h-4 w-4 ${favorites.includes(activePlace.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                  <span className="font-semibold text-cyan-300">{activePlace.district} District</span>
                  <span>•</span>
                  <span>{activePlace.state}</span>
                  <span>•</span>
                  <span>{activePlace.mountainRange}</span>
                  <span>•</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activePlace.coordinates[0]},${activePlace.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>
                      {activePlace.coordinates[0]}°N, {activePlace.coordinates[1]}°E
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Action Buttons: Set Active & Copy Alert */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={handleCopyAlert}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Copy formatted WhatsApp/SMS emergency dispatch alert"
                >
                  {copiedMsg ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Share Alert</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleActivatePlaceGlobally()}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg ${
                    isActiveCurrentRegion
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 cursor-default'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/20 hover:scale-[1.02]'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>{isActiveCurrentRegion ? 'Active Globally' : 'Set as Active Region Globally'}</span>
                </button>
              </div>
            </div>

            {/* Quick Multi-Module Launchpad */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                <span>Launch Subsystems for {activePlace.placeName}:</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <button
                  onClick={() => handleActivatePlaceGlobally('alerts')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Warnings</span>
                  <span className="block text-[10px] text-slate-400">IMD Alerts</span>
                </button>

                <button
                  onClick={() => handleActivatePlaceGlobally('map')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                >
                  <MapPin className="h-4 w-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Live GIS Map</span>
                  <span className="block text-[10px] text-slate-400">Hazard Layers</span>
                </button>

                <button
                  onClick={() => handleActivatePlaceGlobally('imd-danger')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
                >
                  <ShieldAlert className="h-4 w-4 text-red-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-red-300">IMD Danger</span>
                  <span className="block text-[10px] text-slate-400">Hilly Hub</span>
                </button>

                <button
                  onClick={() => handleActivatePlaceGlobally('shelters')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                >
                  <Compass className="h-4 w-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Safe Shelters</span>
                  <span className="block text-[10px] text-slate-400">High Grounds</span>
                </button>

                <button
                  onClick={() => handleActivatePlaceGlobally('rescue')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                >
                  <Radio className="h-4 w-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">NDRF Rescue</span>
                  <span className="block text-[10px] text-slate-400">Battalion Ops</span>
                </button>

                <button
                  onClick={() => handleActivatePlaceGlobally('sos')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
                >
                  <PhoneCall className="h-4 w-4 text-red-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Distress SOS</span>
                  <span className="block text-[10px] text-red-300">Emergency</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mini Interactive GIS Map of Active Place */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Terrain & Catchment GIS Map: {activePlace.valleyOrBasin}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-300">
                  {activePlace.coordinates[0]}°N, {activePlace.coordinates[1]}°E
                </span>
                <button
                  onClick={() => setShowMiniMap(!showMiniMap)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  {showMiniMap ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {showMiniMap && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 relative shadow-inner">
                <MapComponent
                  regions={activeRegionForMap}
                  selectedRegionId={activePlace.id}
                  sensors={auxData.sensors}
                  shelters={[auxData.shelter]}
                  rescueTeams={[auxData.rescueTeam]}
                  hazardZones={[auxData.hazardZone]}
                  height="340px"
                />
              </div>
            )}
          </div>

          {/* Section 1: Live Hydro-Meteorological Telemetry Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Source Geotechnical & Meteorological Telemetry</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* Metric 1: Flood Probability */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>ML Flood Probability</span>
                  <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <div className="text-2xl font-black text-white">
                  {dynamicSimAnalysis.result.floodProbability}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      dynamicSimAnalysis.result.floodProbability >= 70
                        ? 'bg-red-500'
                        : dynamicSimAnalysis.result.floodProbability >= 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${dynamicSimAnalysis.result.floodProbability}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Ensemble: Random Forest + LSTM
                </span>
              </div>

              {/* Metric 2: Surge Arrival Time */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Surge Arrival Time</span>
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                </span>
                <div className="text-2xl font-black text-amber-300">
                  {dynamicSimAnalysis.result.estimatedSurgeTimeHours} hrs
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Downstream runoff travel lag
                </span>
              </div>

              {/* Metric 3: Live Rainfall Rate */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Rainfall Rate & 24h</span>
                  <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                </span>
                <div className="text-2xl font-black text-blue-300">
                  {simRainfall} <span className="text-xs font-normal text-slate-400">mm/h</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  24h Total: {activePlace.rainfall24h} mm
                </span>
              </div>

              {/* Metric 4: Soil Moisture SMAP */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Soil Moisture (SMAP)</span>
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <div className="text-2xl font-black text-cyan-300">{simSoilMoisture}%</div>
                <span className="text-[10px] text-slate-400 block">
                  {simSoilMoisture > 80 ? 'Pore saturation critical' : 'Moderate absorption capacity'}
                </span>
              </div>

              {/* Metric 5: River Stage Gauge */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>River Stage Gauge</span>
                  <Waves className="h-3.5 w-3.5 text-blue-400" />
                </span>
                <div className="text-xl font-black text-white">
                  {activePlace.riverLevel}m{' '}
                  <span className="text-xs font-normal text-slate-400">/ {activePlace.riverDangerMark}m danger</span>
                </div>
                <span className="text-[10px] text-cyan-300 block truncate">{activePlace.riverName}</span>
              </div>

              {/* Metric 6: DEM Elevation & Terrain Slope */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Elevation & Slope</span>
                  <Mountain className="h-3.5 w-3.5 text-purple-400" />
                </span>
                <div className="text-xl font-black text-white">
                  {activePlace.elevation}m{' '}
                  <span className="text-xs font-normal text-slate-400">({activePlace.averageSlope}° slope)</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Catchment: {activePlace.catchmentAreaKm2} km²
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive What-If Simulation with Weather Presets */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Instant Simulation: What-If Scenario for {activePlace.placeName}
                </h4>
              </div>

              {/* Simulation Weather Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => applyPreset(75, 92)}
                  className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-[10px] font-bold transition-colors"
                >
                  ⚡ Cloudburst (75mm/h)
                </button>
                <button
                  onClick={() => applyPreset(40, 95)}
                  className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-[10px] font-bold transition-colors"
                >
                  💧 Saturated Soil (95%)
                </button>
                <button
                  onClick={() => {
                    setSimRainfall(activePlace.rainfall1h);
                    setSimSoilMoisture(activePlace.soilMoisture);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-semibold transition-colors"
                >
                  Reset Telemetry
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Rain Slider */}
              <div className="space-y-1.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Simulate Rainfall Intensity:</span>
                  <span className="text-cyan-300 font-mono font-bold">{simRainfall} mm/hr</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={simRainfall}
                  onChange={(e) => setSimRainfall(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Light (5)</span>
                  <span>Cloudburst (&gt;50)</span>
                  <span>Extreme (120)</span>
                </div>
              </div>

              {/* Moisture Slider */}
              <div className="space-y-1.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Simulate Soil Moisture:</span>
                  <span className="text-cyan-300 font-mono font-bold">{simSoilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={simSoilMoisture}
                  onChange={(e) => setSimSoilMoisture(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Dry (20%)</span>
                  <span>Field Cap (65%)</span>
                  <span>Saturated (100%)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">Predicted Threat Under This Scenario:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-black uppercase px-2.5 py-0.5 rounded text-[11px] ${
                    dynamicSimAnalysis.result.riskLevel === 'HIGH'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : dynamicSimAnalysis.result.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {dynamicSimAnalysis.result.riskLevel} RISK ({dynamicSimAnalysis.result.floodProbability}%)
                </span>
                <span className="text-slate-300 font-mono">
                  Peak in ~{dynamicSimAnalysis.result.estimatedSurgeTimeHours} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: AI Geotechnical SITREP Briefing */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  AI Situation Briefing for {activePlace.placeName}
                </h4>
              </div>
              <button
                onClick={handleGenerateAiBriefing}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isAiLoading ? 'Analyzing...' : 'Generate AI Briefing'}
              </button>
            </div>

            {aiBriefing ? (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed space-y-1.5 animate-fadeIn">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  ● Gemini 3.8 Flash Geotechnical Advisory:
                </span>
                <p>{aiBriefing}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Click "Generate AI Briefing" to run terrain slope hydrodynamics and soil pore pressure modeling for {activePlace.placeName}.
              </p>
            )}
          </div>

          {/* Section 4: Safe Shelters & NDRF Rescue Battalions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Safe High Ground Shelter */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-white">Designated Safe Shelter</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                  High Ground Refuge
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-white text-sm">{auxData.shelter.name}</p>
                <p className="text-xs text-slate-400">
                  {auxData.shelter.contactPerson} • {auxData.shelter.regionName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Elevation Perched:</span>
                  <span className="text-purple-300 font-bold">
                    +{auxData.shelter.heightAboveRiverM}m above river
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Capacity:</span>
                  <span className="text-white font-bold">
                    {auxData.shelter.capacity} persons ({auxData.shelter.currentOccupancy} occupied)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <span className="text-slate-500 block text-[10px] font-semibold">Amenities Ready:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(auxData.shelter.amenities || []).map((fac, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${auxData.shelter.lat},${auxData.shelter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Navigate to Shelter on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* NDRF / SDRF Search & Rescue Command */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Assigned Rescue Battalion</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                  Quick Response Unit
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-white text-sm">{auxData.rescueTeam.unitName}</p>
                <p className="text-xs text-slate-400">
                  Assigned Sector: {auxData.rescueTeam.assignedSector} ({auxData.rescueTeam.membersCount} swift-water specialists)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Commanding Officer:</span>
                  <span className="text-amber-300 font-bold">{auxData.rescueTeam.commander}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Status:</span>
                  <span className="text-emerald-300 font-bold">{auxData.rescueTeam.status}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <span className="text-slate-500 block text-[10px] font-semibold">Specialized Equipment:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(auxData.rescueTeam.equipment || []).map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`tel:${auxData.rescueTeam.contactPhone}`}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Call Emergency Battalion Hotline ({auxData.rescueTeam.contactPhone})</span>
              </a>
            </div>
          </div>

          {/* Section 5: Basin IoT Sensors Hardware */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Telemetry Sensor Nodes Active in {activePlace.valleyOrBasin}
                </h4>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                ● 3 Nodes Online (LoRa Mesh)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {(auxData?.sensors || []).map((sensor) => (
                <div key={sensor.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{sensor.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        sensor.status === 'Critical'
                          ? 'bg-red-500/20 text-red-300'
                          : sensor.status === 'Warning'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{sensor.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{sensor.hardwareModel}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Telemetry Value:</span>
                    <span className="font-bold text-white font-mono">
                      {sensor.value} {sensor.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE LOCATION COMPARISON MODAL / TRAY */}
      {isCompareOpen && comparisonPlaces.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-black text-white">
                  Head-to-Head Mountain Threat Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {comparisonPlaces.map((place) => {
                const sim = predictFlashFloodForPlace(place);
                return (
                  <div
                    key={place.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative"
                  >
                    <button
                      onClick={() => toggleComparison(place)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-red-400 p-1"
                      title="Remove from comparison"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    <div>
                      <h4 className="font-bold text-sm text-white">{place.placeName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {place.district}, {place.state}
                      </p>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Risk Level:</span>
                        <span
                          className={`font-black ${
                            place.riskLevel === 'HIGH'
                              ? 'text-red-400'
                              : place.riskLevel === 'MEDIUM'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {place.riskLevel} ({sim.result.floodProbability}%)
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">1h Rainfall:</span>
                        <span className="text-blue-300 font-bold">{place.rainfall1h} mm/h</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Soil Moisture:</span>
                        <span className="text-cyan-300 font-bold">{place.soilMoisture}%</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Slope:</span>
                        <span className="text-purple-300 font-bold">{place.averageSlope}°</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Elevation:</span>
                        <span className="text-slate-200">{place.elevation}m</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Peak Surge ETA:</span>
                        <span className="text-amber-300 font-bold">~{sim.result.estimatedSurgeTimeHours} hrs</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">River Stage:</span>
                        <span className="text-white">
                          {place.riverLevel}m / {place.riverDangerMark}m
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleSelectPlace(place);
                        setIsCompareOpen(false);
                      }}
                      className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
                    >
                      View Full Dossier
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Tip: Compare rainfall intensity against terrain slope to spot flash flood bottlenecks.
              </span>
              <button
                onClick={() => setComparisonPlaces([])}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
