import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LiveMapPage } from './pages/LiveMapPage';
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { WeatherDashboardPage } from './pages/WeatherDashboardPage';
import { SosPage } from './pages/SosPage';
import { SheltersPage } from './pages/SheltersPage';
import { RescueDashboardPage } from './pages/RescueDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AwarenessPage } from './pages/AwarenessPage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { ImdDangerPage } from './pages/ImdDangerPage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DefaultLanguageBar } from './components/DefaultLanguageBar';

import {
  Region,
  SensorNode,
  Shelter,
  RescueTeam,
  HazardZone,
  AlertItem,
  SOSRequest,
  UserRole,
} from './types';

import {
  mockRegions,
  mockSensors,
  mockShelters,
  mockRescueTeams,
  mockHazardZones,
  mockAlerts,
  mockSosRequests,
} from './data/mockData';

function MainDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>('Citizen Resident');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const { updateActiveRegionState } = useLanguage();

  // Application Data States
  const [regions, setRegions] = useState<Region[]>(mockRegions);
  const [selectedRegion, setSelectedRegion] = useState<Region>(mockRegions[0]);
  const [sensors, setSensors] = useState<SensorNode[]>(mockSensors);
  const [shelters, setShelters] = useState<Shelter[]>(mockShelters);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(mockRescueTeams);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>(mockHazardZones);
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(mockSosRequests);

  // Sync state language whenever selected region changes
  useEffect(() => {
    if (selectedRegion?.state) {
      updateActiveRegionState(selectedRegion.state);
    }
  }, [selectedRegion?.state, updateActiveRegionState]);

  // Fetch initial telemetry from server if available
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const [regionsRes, sensorsRes, alertsRes, sosRes] = await Promise.allSettled([
          fetch('/api/regions').then((r) => r.json()),
          fetch('/api/sensors').then((r) => r.json()),
          fetch('/api/alerts').then((r) => r.json()),
          fetch('/api/sos').then((r) => r.json()),
        ]);

        if (regionsRes.status === 'fulfilled') {
          const rList = regionsRes.value?.regions || regionsRes.value?.data;
          if (Array.isArray(rList) && rList.length > 0) {
            setRegions(rList);
            setSelectedRegion(rList[0]);
          }
        }
        if (sensorsRes.status === 'fulfilled') {
          const sList = sensorsRes.value?.sensors || sensorsRes.value?.data;
          if (Array.isArray(sList)) setSensors(sList);
        }
        if (alertsRes.status === 'fulfilled') {
          const aList = alertsRes.value?.alerts || alertsRes.value?.data;
          if (Array.isArray(aList)) setAlerts(aList);
        }
        if (sosRes.status === 'fulfilled') {
          const sosList = sosRes.value?.requests || sosRes.value?.data;
          if (Array.isArray(sosList)) setSosRequests(sosList);
        }

      } catch (err) {
        console.warn('Backend API initialized with preloaded local datasets.');
      }
    };

    fetchServerData();
  }, []);

  // Handlers
  const handleSelectRegion = (region: Region) => {
    setSelectedRegion(region);
    if (region.state) {
      updateActiveRegionState(region.state);
    }
  };

  const handleSelectPlaceAsActiveRegion = (
    newRegion: Region,
    auxData?: {
      sensors: SensorNode[];
      shelter: Shelter;
      rescueTeam: RescueTeam;
      hazardZone: HazardZone;
      alertItem: AlertItem;
    },
    targetTab?: string
  ) => {
    // 1. Ensure region is registered in regions array
    setRegions((prev) => {
      const exists = prev.some((r) => r.id === newRegion.id);
      if (exists) {
        return prev.map((r) => (r.id === newRegion.id ? newRegion : r));
      }
      return [newRegion, ...prev];
    });

    // 2. Set as active region for all website functionalities
    setSelectedRegion(newRegion);
    if (newRegion.state) {
      updateActiveRegionState(newRegion.state);
    }

    // 3. Register auxiliary data (sensors, shelters, rescue units, hazards, alerts)
    if (auxData) {
      if (auxData.sensors && auxData.sensors.length > 0) {
        setSensors((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newItems = auxData.sensors.filter((s) => !existingIds.has(s.id));
          return [...newItems, ...prev];
        });
      }

      if (auxData.shelter) {
        setShelters((prev) => {
          if (prev.some((sh) => sh.id === auxData.shelter.id)) return prev;
          return [auxData.shelter, ...prev];
        });
      }

      if (auxData.rescueTeam) {
        setRescueTeams((prev) => {
          if (prev.some((rt) => rt.id === auxData.rescueTeam.id)) return prev;
          return [auxData.rescueTeam, ...prev];
        });
      }

      if (auxData.hazardZone) {
        setHazardZones((prev) => {
          if (prev.some((hz) => hz.id === auxData.hazardZone.id)) return prev;
          return [auxData.hazardZone, ...prev];
        });
      }

      if (auxData.alertItem) {
        setAlerts((prev) => {
          if (prev.some((a) => a.id === auxData.alertItem.id)) return prev;
          return [auxData.alertItem, ...prev];
        });
      }
    }

    // 4. Optionally navigate to requested view tab
    if (targetTab) {
      setCurrentTab(targetTab);
    }
  };

  const handleNavigateToPredict = (region: Region) => {
    setSelectedRegion(region);
    setCurrentTab('imd-danger');
  };

  const handleSosDispatched = (newSos: SOSRequest) => {
    setSosRequests((prev) => [newSos, ...prev]);
  };

  const handleBroadcastCustomAlert = (alertDraft: Partial<AlertItem>) => {
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      regionId: alertDraft.regionId || selectedRegion.id,
      regionName: alertDraft.regionName || selectedRegion.name,
      severity: alertDraft.severity || 'Emergency',
      headline: alertDraft.headline || 'Flash Flood Emergency Warning',
      message: alertDraft.message || 'Severe cloudburst triggered rapid river inundation.',
      actionRequired: alertDraft.actionRequired || 'Mandatory high-ground evacuation.',
      affectedRivers: alertDraft.affectedRivers || [selectedRegion.riverName],
      issuedAt: alertDraft.issuedAt || new Date().toLocaleTimeString(),
      expiresAt: alertDraft.expiresAt || 'Next 6 Hours',
      active: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleUpdateSosStatus = (id: string, newStatus: 'PENDING' | 'DISPATCHED' | 'RESCUED') => {
    setSosRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleLoginSuccess = (role: UserRole, username?: string) => {
    setUserRole(role);
    setLoggedInUser(username || 'Authorized Officer');
    setIsAuthenticated(true);
    if (role === 'admin') setCurrentTab('admin');
    else if (role === 'rescue') setCurrentTab('rescue');
    else if (role === 'hydrologist') setCurrentTab('imd-danger');
    else setCurrentTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setCurrentTab('home');
  };

  // 1. Initial Website Opening View or Switch / Log In (Exact Design Matching Photo)
  if (!isAuthenticated || currentTab === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Main Authenticated Application
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Universal Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        onChangeRole={setUserRole}
        activeAlertCount={alerts.length}
        isAuthenticated={isAuthenticated}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
        selectedRegion={selectedRegion}
        onSelectPlaceAsActiveRegion={handleSelectPlaceAsActiveRegion}
      />

      {/* Default Language Bar (Tamil, English, Hindi, Telugu with State Auto-Detection) */}
      <DefaultLanguageBar />

      {/* Main Dynamic View Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        {currentTab === 'home' && (
          <HomePage
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            onNavigate={setCurrentTab}
            onSelectPlaceAsActiveRegion={handleSelectPlaceAsActiveRegion}
          />
        )}

        {currentTab === 'imd-danger' && (
          <ImdDangerPage
            onSelectPlaceAsActiveRegion={handleSelectPlaceAsActiveRegion}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'search' && (
          <SearchPage
            selectedRegion={selectedRegion}
            regions={regions}
            onSelectPlaceAsActiveRegion={handleSelectPlaceAsActiveRegion}
            onNavigate={setCurrentTab}
            initialQuery={searchQuery}
          />
        )}

        {currentTab === 'map' && (
          <LiveMapPage
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            sensors={sensors}
            shelters={shelters}
            rescueTeams={rescueTeams}
            hazardZones={hazardZones}
            onNavigateToPredict={handleNavigateToPredict}
          />
        )}

        {currentTab === 'alerts' && (
          <EarlyWarningPage
            alerts={alerts}
            regions={regions}
            onBroadcastAlert={handleBroadcastCustomAlert}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherDashboardPage
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
          />
        )}

        {currentTab === 'sos' && (
          <SosPage
            regions={regions}
            selectedRegion={selectedRegion}
            onSosDispatched={handleSosDispatched}
          />
        )}

        {currentTab === 'shelters' && (
          <SheltersPage
            shelters={shelters}
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
          />
        )}

        {currentTab === 'rescue' && (
          <RescueDashboardPage
            rescueTeams={rescueTeams}
            sosRequests={sosRequests}
            regions={regions}
            onUpdateSosStatus={handleUpdateSosStatus}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage
            sensors={sensors}
            regions={regions}
            onBroadcastCustomAlert={handleBroadcastCustomAlert}
          />
        )}

        {currentTab === 'analytics' && <AnalyticsPage />}

        {currentTab === 'awareness' && <AwarenessPage />}

        {currentTab === 'contacts' && <EmergencyContactsPage />}

        {currentTab === 'user-dashboard' && (
          <UserDashboardPage
            selectedRegion={selectedRegion}
            shelters={shelters}
            onNavigate={setCurrentTab}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onSelectTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainDashboard />
    </LanguageProvider>
  );
}

