import React, { useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  Mountain,
  Volume2,
  ShieldAlert,
} from 'lucide-react';

export const AwarenessPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    water: true,
    food: true,
    firstaid: false,
    torch: true,
    whistle: true,
    radio: false,
    powerbank: true,
    documents: false,
  });

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            Public Life-Safety & Resilience
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Mountain Flash Flood Awareness & Preparedness Guide
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Recognize early geological precursors, master evacuation protocols, and prepare your 72-hour mountain survival go-bag.
        </p>
      </div>

      {/* Warning Precursors in Mountain Terrains */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-4 shadow-xl">
        <h2 className="font-bold text-base text-white flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span>Recognizing Precursor Signals in Hilly Regions</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Flash floods in steep valleys frequently trigger within 20 to 60 minutes of upstream cloudbursts. Always watch for these natural indicators:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Sudden Discoloration of River Water
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              If a crystal-clear mountain stream abruptly turns muddy chocolate brown with floating debris and pine needles, an upstream dam burst or mud torrent is speeding downriver.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Audible Roaring or Rumbling Sound
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              A deep acoustic rumble resembling low-flying aircraft or a runaway freight train indicates hydraulic debris flow rolling boulders down the canyon. Evacuate perpendicular to slope immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Sudden Drop or Cessation of Streamflow
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              If water in a fast river suddenly recedes or drops drastically during heavy rain, a temporary debris dam has formed upstream. It will breach catastrophically within minutes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Tension Cracks on Hillside Slopes
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Fresh horizontal soil fractures or newly tilted electricity poles indicate saturated slope instability. The hillside can liquefy into a fast-moving mudslide.
            </p>
          </div>
        </div>
      </div>

      {/* DO's and DON'Ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DOs */}
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/60 space-y-3">
          <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>CRITICAL DO's: Immediate Actions</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Seek High Ground Instantly:</strong> Move vertically upwards on the ridge, away from any drainage gulley or mountain stream.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Listen to Battery Radio:</strong> Keep tuned to local disaster frequencies or offline cell-broadcast alerts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Cut Utilities:</strong> Turn off gas cylinders and trip the electrical circuit breaker before floodwaters enter.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Signal Rescuers:</strong> Use an acoustic whistle or reflective mirror/flashlight if trapped.</span>
            </li>
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-800/60 space-y-3">
          <h3 className="font-bold text-sm text-red-300 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span>DEADLY DON'Ts: Avoid at All Costs</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span><strong>DO NOT Cross Low Bridges:</strong> Mountain flash floods regularly dislodge bridge piers with floating logs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span><strong>DO NOT Walk in Moving Water:</strong> 15 cm of fast mountain water will knock down an adult.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span><strong>DO NOT Drive Through Runoff:</strong> Floating vehicles flip easily in rocky gorge channels.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span><strong>DO NOT Camp in Dry Stream Beds:</strong> These natural funnels become roaring torrents during upstream cloudbursts.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive 72-Hour Mountain Survival Go-Bag Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white">72-Hour Mountain Survival Go-Bag</h3>
          </div>
          <span className="text-xs text-slate-400">Pack in a waterproof dry-sack</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'water', label: 'Purification Tablets / 3L Water', desc: 'Water supply is contaminated' },
            { id: 'food', label: 'High-Calorie Trail Bars', desc: 'Non-perishable nut bars' },
            { id: 'firstaid', label: 'First Aid Kit & Bandages', desc: 'Antiseptic, splints, tourniquet' },
            { id: 'torch', label: 'High-Lumen Torch & Batteries', desc: 'Night signaling capability' },
            { id: 'whistle', label: 'Emergency Pea-less Whistle', desc: 'Travels 1.5km across valleys' },
            { id: 'radio', label: 'Hand-Crank Weather Radio', desc: 'AM/FM civil defense broadcast' },
            { id: 'powerbank', label: 'Charged Solar Power Bank', desc: 'For emergency SOS mobile beacon' },
            { id: 'documents', label: 'Laminated ID & Cash', desc: 'Aadhaar, medical prescriptions' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                checkedItems[item.id]
                  ? 'bg-emerald-950/30 border-emerald-600 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs text-white">
                <input
                  type="checkbox"
                  checked={checkedItems[item.id]}
                  onChange={() => {}}
                  className="rounded accent-emerald-500 h-3.5 w-3.5"
                />
                <span>{item.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 pl-5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
