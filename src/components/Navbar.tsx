import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  AlertTriangle,
  MapPin,
  Activity,
  ShieldAlert,
  Radio,
  LifeBuoy,
  BarChart3,
  BookOpen,
  PhoneCall,
  Volume2,
  VolumeX,
  User,
  Menu,
  X,
  Compass,
  LogOut,
  Search,
} from 'lucide-react';
import { audioAlert } from './AudioAlertService';
import { UserRole, Region, SensorNode, Shelter, RescueTeam, HazardZone, AlertItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeAlertCount: number;
  isAuthenticated?: boolean;
  loggedInUser?: string | null;
  onLogout?: () => void;
  selectedRegion?: Region;
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

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onChangeRole,
  activeAlertCount,
  isAuthenticated = true,
  loggedInUser,
  onLogout,
  selectedRegion,
  onSelectPlaceAsActiveRegion,
}) => {
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const { t, language } = useLanguage();

  // Keyboard shortcut Ctrl+K or Cmd+K to navigate to search page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSelectTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTab]);

  const handleToggleSiren = () => {
    const newState = audioAlert.toggleSiren();
    setIsSirenOn(newState);
  };

  const navItems = [
    { id: 'home', label: t('nav_home'), icon: Activity },
    { id: 'imd-danger', label: 'IMD Hilly Danger', icon: ShieldAlert, highlight: true },
    { id: 'search', label: t('nav_search'), icon: Search },
    { id: 'map', label: t('nav_map'), icon: MapPin },
    { id: 'alerts', label: t('nav_alerts'), icon: AlertTriangle, badge: activeAlertCount },
    { id: 'weather', label: t('nav_weather'), icon: CloudRain },
    { id: 'shelters', label: t('nav_shelters'), icon: Compass },
    { id: 'rescue', label: t('nav_rescue'), icon: Radio },
    { id: 'analytics', label: t('nav_analytics'), icon: BarChart3 },
    { id: 'awareness', label: t('nav_awareness'), icon: BookOpen },
    { id: 'contacts', label: t('nav_contacts'), icon: PhoneCall },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    citizen: { title: t('role_citizen'), color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    hydrologist: { title: t('role_hydrologist'), color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    rescue: { title: t('role_rescue'), color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    admin: { title: t('role_admin'), color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Live Warning Ticker */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 px-4 py-1.5 text-xs text-red-100 flex items-center justify-between border-b border-red-800/60 overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-red-300">{t('live_advisory_label')}</span>
          <span className="font-medium truncate">
            {t('live_advisory_text')}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 pl-2">
          <button
            onClick={() => onSelectTab('alerts')}
            className="hover:underline text-red-200 hover:text-white font-semibold flex items-center gap-1"
          >
            <span>{t('view_all_alerts')} ({activeAlertCount})</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              onSelectTab('home');
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <CloudRain className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  FlashFlood<span className="text-cyan-400 font-extrabold">Predict</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  Hilly Regions
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Multi-Source Geo-Hydrologic Early Warning System</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isHighlighted = (item as any).highlight;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 relative ${
                    isActive
                      ? isHighlighted
                        ? 'bg-red-500/25 text-red-200 border border-red-500/60 shadow-sm shadow-red-500/20 font-bold'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : isHighlighted
                      ? 'text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-900/50 border border-red-800/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? (isHighlighted ? 'text-red-400' : 'text-cyan-400') : (isHighlighted ? 'text-red-400' : 'text-slate-400')}`} />
                  <span>{item.label}</span>
                  {isHighlighted && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  )}
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Active Region Pill */}
          {selectedRegion && (
            <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-400 text-[11px]">Region:</span>
              <span className="font-bold text-white max-w-[140px] truncate">{selectedRegion.name.split('(')[0]}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                  selectedRegion.riskLevel === 'HIGH'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : selectedRegion.riskLevel === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {selectedRegion.riskLevel}
              </span>
            </div>
          )}

          {/* Quick Search India Trigger */}
          <button
            onClick={() => onSelectTab('search')}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              currentTab === 'search'
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/60 font-bold shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80'
            }`}
            title="Search any place in India (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium">Search India</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden lg:inline">
              Ctrl+K
            </span>
          </button>

          {/* Action Hub (Siren, SOS, Role Selector) */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => onSelectTab('search')}
              className={`md:hidden p-2 rounded-lg text-xs font-semibold flex items-center transition-colors border ${
                currentTab === 'search'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border-slate-700'
              }`}
              title="Search any place in India"
            >
              <Search className="h-4 w-4" />
            </button>
            {/* Siren Test Button */}
            <button
              onClick={handleToggleSiren}
              title={isSirenOn ? 'Mute Warning Siren' : 'Test Audio Warning Siren'}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isSirenOn
                  ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              {isSirenOn ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
              <span className="hidden md:inline">{isSirenOn ? t('stop_siren') : t('test_siren')}</span>
            </button>

            {/* HIGH-PRIORITY RED SOS BUTTON */}
            <button
              onClick={() => onSelectTab('sos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-md ${
                currentTab === 'sos'
                  ? 'bg-red-500 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-slate-950'
                  : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-600/30'
              }`}
            >
              <ShieldAlert className="h-4 w-4 animate-bounce" />
              <span>{t('nav_sos')}</span>
            </button>

            {/* Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${roleLabels[userRole].color}`}
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{roleLabels[userRole].title}</span>
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Switch Perspective
                  </div>
                  {(['citizen', 'hydrologist', 'rescue', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        userRole === r ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{roleLabels[r].title}</span>
                      {userRole === r && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onSelectTab('user-dashboard');
                        setIsRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60"
                    >
                      My Safety Profile
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('login');
                        setIsRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60"
                    >
                      Switch / Log In
                    </button>
                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-1.5"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log Out to Gateway</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800 transition-colors"
                title="Log out and return to Opening Login Gateway"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isHighlighted = (item as any).highlight;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? isHighlighted
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50 font-bold'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : isHighlighted
                    ? 'text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isHighlighted ? 'text-red-400' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isHighlighted ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                    LIVE
                  </span>
                ) : item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onSelectTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white"
            >
              Admin IoT Control Center
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
