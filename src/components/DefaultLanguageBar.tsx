import React from 'react';
import { Globe, Check, Sparkles, MapPin, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

interface DefaultLanguageBarProps {
  className?: string;
  compact?: boolean;
}

export const DefaultLanguageBar: React.FC<DefaultLanguageBarProps> = ({
  className = '',
  compact = false,
}) => {
  const {
    language,
    setLanguage,
    isAutoState,
    setIsAutoState,
    activeStateName,
    detectedStateLanguage,
    supportedLanguages,
    notificationMessage,
    clearNotification,
    t,
  } = useLanguage();

  return (
    <div
      id="default-language-bar"
      className={`bg-slate-900/95 border-b border-slate-800/90 text-xs px-3 sm:px-6 py-2 transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Left side: Language Bar Label & Quick Selector */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold flex-shrink-0">
            <Globe className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            <span className="text-slate-300 font-bold text-[11px] sm:text-xs">
              {t('lang_bar_label')}
            </span>
          </div>

          {/* Quick Language Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {supportedLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`lang-btn-${lang.code}`}
                  onClick={() => setLanguage(lang.code, true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/20 ring-1 ring-cyan-400 scale-[1.02]'
                      : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80'
                  }`}
                  title={`${lang.name} (${lang.nativeName})`}
                >
                  <span className="tracking-wide">{lang.nativeName}</span>
                  <span className={`text-[10px] uppercase ${isSelected ? 'text-slate-900 font-black' : 'text-slate-400'}`}>
                    ({lang.name})
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3] text-slate-950" />}
                </button>
              );
            })}
          </div>

          {/* Auto by State Mode Switcher */}
          <button
            id="lang-auto-state-toggle"
            onClick={() => setIsAutoState(!isAutoState)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
              isAutoState
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 shadow-sm'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            title="Automatically switch language whenever you view or select a different state"
          >
            <Sparkles className={`h-3 w-3 ${isAutoState ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{t('lang_auto_state')}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                isAutoState ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isAutoState ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Right side: State Language Association Indicator & Notification */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeStateName && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
              <MapPin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-400 font-medium">State:</span>
              <span className="font-bold text-white">{activeStateName}</span>
              <span className="text-slate-500 font-mono">→</span>
              <span className="text-cyan-300 font-bold">
                {supportedLanguages.find((l) => l.code === detectedStateLanguage)?.nativeName || detectedStateLanguage}
              </span>
            </div>
          )}

          {notificationMessage && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-[11px] text-cyan-200 animate-fadeIn">
              <span className="font-semibold truncate max-w-[280px] sm:max-w-none">{notificationMessage}</span>
              <button
                onClick={clearNotification}
                className="p-0.5 hover:text-white rounded"
                title="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
