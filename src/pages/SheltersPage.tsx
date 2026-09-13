import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Users,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Navigation,
  ArrowUpRight,
  Sun,
  Droplets,
  HeartPulse,
  Radio,
} from 'lucide-react';
import { Shelter, Region } from '../types';

interface SheltersPageProps {
  shelters: Shelter[];
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export const SheltersPage: React.FC<SheltersPageProps> = ({
  shelters,
  regions,
  selectedRegion,
  onSelectRegion,
}) => {
  const [filterRegionId, setFilterRegionId] = useState<string>('all');
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState<boolean>(false);

  const filteredShelters = shelters.filter((sh) => {
    if (filterRegionId !== 'all' && sh.regionId !== filterRegionId) return false;
    if (filterOnlyAvailable && sh.currentOccupancy >= sh.capacity) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              High-Ground Vetted Havens
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Emergency Shelters & Safezones</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Geotechnically certified safezones perched safely above flash flood floodplains and landslide runout paths.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterRegionId}
            onChange={(e) => setFilterRegionId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-400 outline-none"
          >
            <option value="all">All Mountain Regions ({shelters.length})</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <input
              type="checkbox"
              checked={filterOnlyAvailable}
              onChange={(e) => setFilterOnlyAvailable(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Show Only with Vacancy</span>
          </label>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShelters.map((sh) => {
          const occupancyRate = Math.round((sh.currentOccupancy / sh.capacity) * 100);
          const isFull = occupancyRate >= 100;
          return (
            <div
              key={sh.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {sh.regionName}
                    </span>
                    <h3 className="font-bold text-base text-white">{sh.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isFull
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isFull ? 'FULL' : `${sh.capacity - sh.currentOccupancy} BEDS OPEN`}
                  </span>
                </div>

                {/* Elevation Safety Callout */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Height Above Riverbed:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    +{sh.heightAboveRiverM} m ({sh.elevationM}m DEM)
                  </span>
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Occupancy:</span>
                    </span>
                    <span className="font-mono text-white">
                      {sh.currentOccupancy} / {sh.capacity} ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyRate > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancyRate)}%` }}
                    />
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Infrastructure & Relief Supplies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(sh.amenities || []).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300 flex items-center gap-1"
                      >
                        <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact and Navigation Action */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Manager: {sh.contactPerson}</span>
                  <a
                    href={`tel:${sh.contactPhone}`}
                    className="text-cyan-400 font-mono hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="h-3 w-3" />
                    <span>{sh.contactPhone}</span>
                  </a>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${sh.lat},${sh.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Get GPS Directions to Shelter</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
