import React from 'react';
import { CloudRain, ShieldCheck, PhoneCall, Database, Cpu, Globe2 } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: System Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <CloudRain className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-slate-200">
                Flash Flood Prediction System
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Advanced multi-source AI early warning platform explicitly built for steep mountain catchments.
              Coupling precipitation intensity, soil moisture saturation, digital elevation slope, and river stage telemetry.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Real-time Sentinel AI Engine Active</span>
            </div>
          </div>

          {/* Col 2: Multi-Source Data Pipeline */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Source Feeds</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center justify-between">
                <span>Rainfall Cloudburst:</span>
                <span className="text-slate-300 font-mono">IMD Doppler / NASA GPM</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Terrain Gradient & DEM:</span>
                <span className="text-slate-300 font-mono">NASA SRTM 30m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Soil Moisture Saturation:</span>
                <span className="text-slate-300 font-mono">NASA SMAP L4</span>
              </li>
              <li className="flex items-center justify-between">
                <span>River Discharge Stage:</span>
                <span className="text-slate-300 font-mono">CWC / IoT ESP32 Radar</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Rapid Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Emergency Modules</span>
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button onClick={() => onSelectTab('home')} className="text-left font-bold text-cyan-300 hover:text-cyan-200 transition-colors">
                Home Overview
              </button>
              <button onClick={() => onSelectTab('imd-danger')} className="text-left hover:text-cyan-300 transition-colors">
                IMD Hilly Danger
              </button>
              <button onClick={() => onSelectTab('map')} className="text-left hover:text-cyan-300 transition-colors">
                Live Hazard Map
              </button>
              <button onClick={() => onSelectTab('alerts')} className="text-left hover:text-cyan-300 transition-colors">
                Early Warnings
              </button>
              <button onClick={() => onSelectTab('sos')} className="text-left text-red-400 font-bold hover:underline">
                SOS Distress Center
              </button>
              <button onClick={() => onSelectTab('shelters')} className="text-left hover:text-cyan-300 transition-colors">
                Safe Relief Shelters
              </button>
              <button onClick={() => onSelectTab('rescue')} className="text-left hover:text-cyan-300 transition-colors">
                NDRF Command Board
              </button>
              <button onClick={() => onSelectTab('awareness')} className="text-left hover:text-cyan-300 transition-colors">
                Survival Guidelines
              </button>
            </div>
          </div>

          {/* Col 4: 24x7 Helplines */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-red-400" />
              <span>24x7 Mountain SOS</span>
            </h4>
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/50 space-y-1 text-[11px]">
              <div className="flex justify-between items-center text-red-200">
                <span className="font-bold">National Disaster Hotline:</span>
                <span className="font-mono text-xs font-black text-white bg-red-800 px-1.5 py-0.5 rounded">1078</span>
              </div>
              <div className="flex justify-between items-center text-red-200">
                <span className="font-bold">Mountain Ambulance:</span>
                <span className="font-mono text-xs font-black text-white bg-red-800 px-1.5 py-0.5 rounded">108</span>
              </div>
              <p className="text-[10px] text-red-300/80 pt-1">
                Toll-free emergency dispatch coordinating NDRF, SDRF, and district operation control rooms.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Flash Flood Prediction System for Hilly Regions. Machine Learning & Multi-Source Telemetry.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-cyan-400" />
              <span>Random Forest & XGBoost Ensemble</span>
            </span>
            <span>•</span>
            <span>Gemini AI Geotechnical Grounding</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
