import React, { useState } from 'react';
import {
  Radio,
  Users,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  Clock,
  Navigation,
  Compass,
  ArrowRight,
  AlertCircle,
  Truck,
  HeartPulse,
} from 'lucide-react';
import { RescueTeam, SOSRequest, Region } from '../types';

interface RescueDashboardPageProps {
  rescueTeams: RescueTeam[];
  sosRequests: SOSRequest[];
  regions: Region[];
  onUpdateSosStatus?: (id: string, newStatus: 'PENDING' | 'DISPATCHED' | 'RESCUED') => void;
}

export const RescueDashboardPage: React.FC<RescueDashboardPageProps> = ({
  rescueTeams,
  sosRequests: initialRequests,
  regions,
  onUpdateSosStatus,
}) => {
  const [requests, setRequests] = useState<SOSRequest[]>(initialRequests);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'DISPATCHED' | 'RESCUED'>('ALL');

  const handleStatusChange = async (id: string, newStatus: 'PENDING' | 'DISPATCHED' | 'RESCUED') => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );

    try {
      await fetch(`/api/sos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Failed to patch status on server, updated locally.');
    }

    if (onUpdateSosStatus) onUpdateSosStatus(id, newStatus);
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              Tactical Operations Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">NDRF & SDRF Rescue Dashboard</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time emergency distress dispatch, tactical field unit tracking, and flood evacuation routing.
          </p>
        </div>

        {/* Status Counter Chips */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold">
            {requests.filter((r) => r.status === 'PENDING').length} Pending SOS
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold">
            {requests.filter((r) => r.status === 'DISPATCHED').length} In Progress
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold">
            {requests.filter((r) => r.status === 'RESCUED').length} Safe
          </span>
        </div>
      </div>

      {/* Rescue Units Fleet Overview */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Truck className="h-4 w-4 text-amber-400" />
          <span>Deployed Search & Rescue Units</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rescueTeams.map((team) => (
            <div
              key={team.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400">{team.callSign}</span>
                  <h4 className="font-bold text-sm text-white">{team.unitName}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    team.status === 'On-Mission'
                      ? 'bg-amber-600 text-white animate-pulse'
                      : team.status === 'Deployed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-emerald-400'
                  }`}
                >
                  {team.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Commander:</span> <b className="text-white">{team.commander}</b>
                </div>
                <div>
                  <span className="text-slate-400">Sector:</span> {team.assignedSector}
                </div>
                <div>
                  <span className="text-slate-400">Strength:</span> {team.membersCount || (team as any).personnelCount || 24} Personnel
                </div>
              </div>

              {/* Equipment Inventory */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {(team.equipment || []).map((eq, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] text-slate-400 border border-slate-800">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distress Tickets Queue (Triage Table) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <span>Incoming Citizen Distress Signals</span>
            </h3>
            <span className="text-[11px] text-slate-400">Ordered by urgency and water level depth</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['ALL', 'PENDING', 'DISPATCHED', 'RESCUED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterStatus === st
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No distress tickets matching the selected filter.
            </div>
          ) : (
            filteredRequests.map((req) => {
              const coords = req.coordinates || [req.lat ?? 30.64, req.lng ?? 79.06];
              const regionTitle = req.regionName || req.region || 'Catchment Area';
              const locationDesc = req.locationDescription || req.addressOrLandmark || req.notes || 'Hilly basin location';
              const waterDepth = req.waterLevelMeters ?? req.waterLevelM ?? 0.8;
              const hasMed = req.medicalNeed ?? req.hasMedicalEmergency ?? false;
              const hasVuln = req.elderlyOrInfants ?? req.hasElderlyOrChildren ?? false;
              const isUrgent = req.urgency === 'CRITICAL' || req.urgency === 'URGENT' || hasMed;
              const isPending = req.status === 'PENDING' || req.status === 'Pending';
              const isDispatched = req.status === 'DISPATCHED' || req.status === 'Dispatched';
              const isRescued = req.status === 'RESCUED' || req.status === 'Rescued';

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isPending
                      ? 'bg-red-950/20 border-red-800/80 shadow-red-950/20'
                      : isDispatched
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  {/* Info Block */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isUrgent
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {req.urgency || (isUrgent ? 'CRITICAL' : 'MODERATE')}
                      </span>
                      <span className="font-bold text-sm text-white">{req.senderName}</span>
                      <span className="text-xs text-slate-400 font-mono">({req.phone})</span>
                      <span className="text-xs text-slate-500">• {req.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong className="text-cyan-300">{regionTitle}:</strong> {locationDesc}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>
                        Persons: <b className="text-white">{req.peopleCount}</b>
                      </span>
                      <span>
                        Water Depth: <b className="text-red-400 font-mono">{waterDepth} m</b>
                      </span>
                      {hasMed && (
                        <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 text-[10px] font-bold flex items-center gap-1">
                          <HeartPulse className="h-3 w-3" />
                          Medical Emergency
                        </span>
                      )}
                      {hasVuln && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 text-[10px] font-bold">
                          Elderly / Infants
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-slate-500">
                        GPS: {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                      </span>
                    </div>
                  </div>

                  {/* Tactical Dispatch Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isPending && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'DISPATCHED')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Dispatch Team</span>
                      </button>
                    )}

                    {isDispatched && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'RESCUED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark as Rescued</span>
                      </button>
                    )}

                    {isRescued && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Evacuated</span>
                      </span>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                      title="Open in GPS Map"
                    >
                      <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                    </a>

                    <a
                      href={`tel:${req.phone}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                      title="Call Citizen"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                    </a>
                  </div>
                </div>
              );
            })

          )}
        </div>
      </div>
    </div>
  );
};
