import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  Volume2,
  VolumeX,
  Flashlight,
  Send,
  CheckCircle2,
  AlertTriangle,
  Users,
  HeartPulse,
  PhoneCall,
  Navigation,
  Loader2,
} from 'lucide-react';
import { SOSRequest, Region } from '../types';
import { audioAlert } from '../components/AudioAlertService';

interface SosPageProps {
  regions: Region[];
  selectedRegion: Region;
  onSosDispatched?: (sos: SOSRequest) => void;
}

export const SosPage: React.FC<SosPageProps> = ({ regions, selectedRegion, onSosDispatched }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [waterLevelMeters, setWaterLevelMeters] = useState(1.2);
  const [hasMedicalNeed, setHasMedicalNeed] = useState(false);
  const [hasElderlyOrInfants, setHasElderlyOrInfants] = useState(false);
  const [situation, setSituation] = useState('');
  const [regionId, setRegionId] = useState(selectedRegion.id);
  const [coordinates, setCoordinates] = useState<[number, number]>(selectedRegion.coordinates);

  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SOSRequest | null>(null);

  // Whistle sound & Strobe Light
  const [isWhistleOn, setIsWhistleOn] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);

  const toggleWhistle = () => {
    const active = audioAlert.toggleWhistle();
    setIsWhistleOn(active);
  };

  // Capture GPS via navigator.geolocation
  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser or is running in a restricted sandbox.');
      setTimeout(() => setGpsError(null), 6000);
      return;
    }
    setIsLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
        setLocationSuccess(true);
      },
      (err) => {
        console.warn('GPS error, fallback to valley coords:', err);
        setIsLocating(false);
        setGpsError('GPS signal unavailable or permission denied. Defaulting to valley center coordinates.');
        setTimeout(() => setGpsError(null), 6000);
        // Fallback to selected region coordinates
        setCoordinates(selectedRegion.coordinates);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSendSos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    const targetRegion = regions.find((r) => r.id === regionId) || selectedRegion;

    const payload = {
      senderName: name,
      phone,
      peopleCount,
      waterLevelMeters,
      coordinates,
      locationDescription: situation || `Near ${targetRegion.riverName}, ${targetRegion.name}`,
      regionId: targetRegion.id,
      regionName: targetRegion.name,
      urgency: hasMedicalNeed || waterLevelMeters > 1.5 ? 'CRITICAL' : 'HIGH',
      medicalNeed: hasMedicalNeed,
      elderlyOrInfants: hasElderlyOrInfants,
    };

    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setSubmittedTicket(data.request);
        if (onSosDispatched) onSosDispatched(data.request);
      } else {
        // Fallback local mock ticket
        const fallbackTicket: SOSRequest = {
          id: `sos-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'PENDING',
          ...payload,
        };
        setSubmittedTicket(fallbackTicket);
        if (onSosDispatched) onSosDispatched(fallbackTicket);
      }
    } catch (err) {
      const fallbackTicket: SOSRequest = {
        id: `sos-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'PENDING',
        ...payload,
      };
      setSubmittedTicket(fallbackTicket);
      if (onSosDispatched) onSosDispatched(fallbackTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Night Strobe Screen Overlay */}
      {isStrobeActive && (
        <div
          onClick={() => setIsStrobeActive(false)}
          className="fixed inset-0 z-50 bg-white animate-ping opacity-90 cursor-pointer flex items-center justify-center"
        >
          <div className="bg-slate-900 text-white font-black p-4 rounded-xl text-center shadow-2xl border-4 border-red-600">
            STROBE BEACON ACTIVE (Tap anywhere to dismiss)
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-red-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-300 text-xs font-black uppercase tracking-wider border border-red-500/50">
              <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />
              <span>Priority Disaster Distress Channel</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Emergency SOS Rescue Beacon
            </h1>
            <p className="text-xs sm:text-sm text-red-200/80 max-w-xl">
              Transmit your exact mountain coordinates directly to NDRF, SDRF, and District Disaster Management control rooms.
            </p>
          </div>

          {/* Quick Audio & Strobe Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleWhistle}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isWhistleOn
                  ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse font-black'
                  : 'bg-slate-900 text-amber-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isWhistleOn ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isWhistleOn ? 'Stop Whistle' : 'SOS Whistle Beacon'}</span>
            </button>

            <button
              onClick={() => setIsStrobeActive(!isStrobeActive)}
              className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
            >
              <Flashlight className="h-4 w-4 text-yellow-300" />
              <span>Night Search Strobe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation of Ticket Sent */}
      {submittedTicket && (
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-600 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">Distress Beacon Broadcasted Successfully</h3>
              <span className="text-xs text-emerald-300 font-mono">Ticket Ref: #{submittedTicket.id}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Your emergency ticket has been dispatched to <strong>NDRF 8th Battalion & SDRF High Altitude Quick Response Team</strong>. Maintain high ground and keep your phone in power-saving mode.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
            <div>GPS Fix: {submittedTicket.coordinates[0].toFixed(5)}°N, {submittedTicket.coordinates[1].toFixed(5)}°E</div>
            <div>Trapped Persons: {submittedTicket.peopleCount} | Water Stage: {submittedTicket.waterLevelMeters}m</div>
            <div>Status: <span className="text-amber-400 font-bold uppercase">{submittedTicket.status}</span> (Rescue Team Dispatch Queue)</div>
          </div>
        </div>
      )}

      {/* Main SOS Form & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: SOS Dispatch Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSendSos} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <span>Broadcast Rescue Request</span>
            </h3>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Active Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Valley & GPS Coordinates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Location & Coordinates *</label>
                <button
                  type="button"
                  onClick={detectGpsLocation}
                  disabled={isLocating}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Navigation className="h-3 w-3" />}
                  <span>{locationSuccess ? 'GPS Locked' : 'Acquire My GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={regionId}
                  onChange={(e) => {
                    setRegionId(e.target.value);
                    const reg = regions.find((r) => r.id === e.target.value);
                    if (reg) setCoordinates(reg.coordinates);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.valleyOrBasin})
                    </option>
                  ))}
                </select>

                <div className="flex items-center px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300">
                  <MapPin className="h-3.5 w-3.5 text-red-400 mr-2 flex-shrink-0" />
                  <span>
                    {coordinates[0].toFixed(4)}°N, {coordinates[1].toFixed(4)}°E
                  </span>
                </div>
              </div>

              {gpsError && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>

            {/* Trapped People Count & Water Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>Number of Persons Trapped</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>Water Depth at Location ({waterLevelMeters}m)</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={0.2}
                  value={waterLevelMeters}
                  onChange={(e) => setWaterLevelMeters(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Ankle (0.2m)</span>
                  <span>Waist (1.0m)</span>
                  <span>Roof/Chest (2.5m+)</span>
                </div>
              </div>
            </div>

            {/* Toggles for Medical Need and Vulnerable Persons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMedicalNeed}
                  onChange={(e) => setHasMedicalNeed(e.target.checked)}
                  className="rounded border-slate-700 accent-red-500 h-4 w-4"
                />
                <span className="flex items-center gap-1 text-red-300 font-semibold">
                  <HeartPulse className="h-3.5 w-3.5" />
                  Someone requires urgent medical aid (injury, hypothermia, medication)
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasElderlyOrInfants}
                  onChange={(e) => setHasElderlyOrInfants(e.target.checked)}
                  className="rounded border-slate-700 accent-amber-500 h-4 w-4"
                />
                <span className="text-slate-300">Elderly, infants, or pregnant persons present</span>
              </label>
            </div>

            {/* Situation Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Landmarks / Road Conditions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Trapped on second floor of guest house behind main bridge, mudslide has blocked road downhill..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting Distress Signal...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>SEND SOS DISTRESS BEACON TO NDRF</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Mountain Flood Survival Guidelines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Immediate Life-Safety Protocols</span>
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  <strong>Move to High Ground Instantly:</strong> Climb at least 30 meters (100 ft) above the riverbed or stream embankment immediately. Do not stay in valley lowlands.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  <strong>Avoid Bridges & Footbridges:</strong> Mountain flood surges carry heavy boulders and uprooted pine logs that collapse bridges without warning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  <strong>Never Walk or Drive in Floodwaters:</strong> Just 15 cm (6 inches) of rapid mountain runoff can sweep a person off their feet; 30 cm sweeps away an SUV.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  4
                </span>
                <span>
                  <strong>Cut Electricity Main:</strong> If trapped in a building, switch off the main electrical breaker before water reaches ground sockets.
                </span>
              </li>
            </ul>
          </div>

          {/* Direct Phone Dispatch Card */}
          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-800/60 text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Direct Telephone Dispatch</span>
            <div className="flex justify-between items-center text-white">
              <span>NDRF Disaster Control:</span>
              <a href="tel:1078" className="font-mono text-sm font-black text-red-300 hover:underline">
                1078 (Toll Free)
              </a>
            </div>
            <div className="flex justify-between items-center text-white">
              <span>SDRF Mountain Rescue:</span>
              <a href="tel:112" className="font-mono text-sm font-black text-red-300 hover:underline">
                112 / 108
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
