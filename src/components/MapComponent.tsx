import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Region, SensorNode, Shelter, RescueTeam, HazardZone } from '../types';
import { Layers, Eye, Shield, Radio, MapPin } from 'lucide-react';

interface MapComponentProps {
  regions: Region[];
  selectedRegionId?: string;
  onSelectRegion?: (regionId: string) => void;
  sensors?: SensorNode[];
  shelters?: Shelter[];
  rescueTeams?: RescueTeam[];
  hazardZones?: HazardZone[];
  height?: string;
  onNavigateToPredict?: (region: Region) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  sensors = [],
  shelters = [],
  rescueTeams = [],
  hazardZones = [],
  height = '500px',
  onNavigateToPredict,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    regions: L.LayerGroup;
    sensors: L.LayerGroup;
    shelters: L.LayerGroup;
    rescue: L.LayerGroup;
    hazards: L.LayerGroup;
  }>({
    regions: L.layerGroup(),
    sensors: L.layerGroup(),
    shelters: L.layerGroup(),
    rescue: L.layerGroup(),
    hazards: L.layerGroup(),
  });

  const [visibleLayers, setVisibleLayers] = useState({
    regions: true,
    hazards: true,
    sensors: true,
    shelters: true,
    rescue: true,
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Guard against re-initialization if container retained leaflet id
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    // Default center to northern hilly region (Uttarakhand/Himachal)
    const initialCenter: [number, number] = [30.64, 79.06];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 7,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark high-contrast topographic base layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add layer groups to map
    layerGroupsRef.current.regions.addTo(map);
    layerGroupsRef.current.hazards.addTo(map);
    layerGroupsRef.current.sensors.addTo(map);
    layerGroupsRef.current.shelters.addTo(map);
    layerGroupsRef.current.rescue.addTo(map);

    mapInstanceRef.current = map;

    // Handle responsive container resizing and tab switches
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Region Markers & Hazard Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous region markers
    layerGroupsRef.current.regions.clearLayers();

    regions.forEach((region) => {
      const isSelected = region.id === selectedRegionId;
      const riskColor =
        region.riskLevel === 'HIGH' ? '#ef4444' : region.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981';

      // Custom pulsing HTML marker
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer">
          ${
            region.riskLevel === 'HIGH'
              ? `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-60"></span>`
              : ''
          }
          <div style="background-color: ${riskColor};" class="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
            ${region.riskLevel === 'HIGH' ? '!' : region.riskLevel === 'MEDIUM' ? '▲' : '●'}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-region-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(region.coordinates, { icon: customIcon });

      const popupContent = `
        <div class="p-1 space-y-2 min-w-[200px] text-xs">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1">
            <span class="font-bold text-slate-100 text-sm">${region.name}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase" style="background-color: ${riskColor};">
              ${region.riskLevel} RISK
            </span>
          </div>
          <div class="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
            <div><span class="text-slate-400">Rainfall:</span> <b class="text-cyan-400 font-mono">${region.rainfall1h} mm/h</b></div>
            <div><span class="text-slate-400">Soil Sat:</span> <b class="text-emerald-400 font-mono">${region.soilMoisture}%</b></div>
            <div><span class="text-slate-400">Slope:</span> <b class="text-amber-400 font-mono">${region.averageSlope}°</b></div>
            <div><span class="text-slate-400">River:</span> <b class="text-blue-400 font-mono">${region.riverLevel}m</b></div>
          </div>
          <p class="text-[10px] text-slate-400 italic">${region.valleyOrBasin} (${region.mountainRange})</p>
          <div class="pt-1 flex gap-1">
            <button id="btn-focus-${region.id}" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1 px-2 rounded text-[10px] text-center">
              Inspect & Run ML
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-focus-${region.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectRegion) onSelectRegion(region.id);
            if (onNavigateToPredict) onNavigateToPredict(region);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectRegion) onSelectRegion(region.id);
      });

      layerGroupsRef.current.regions.addLayer(marker);
    });

    // Zoom to selected region if set
    if (selectedRegionId) {
      const selected = regions.find((r) => r.id === selectedRegionId);
      if (selected) {
        map.setView(selected.coordinates, 9, { animate: true });
      }
    }
  }, [regions, selectedRegionId]);

  // Update Hazard Zones Polygons
  useEffect(() => {
    layerGroupsRef.current.hazards.clearLayers();

    hazardZones.forEach((hz) => {
      const color = hz.riskLevel === 'HIGH' ? '#ef4444' : '#f59e0b';
      const polygon = L.polygon(hz.coordinates, {
        color: color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '4, 4',
      });

      polygon.bindPopup(`
        <div class="p-1 text-xs">
          <b class="text-red-400">${hz.name}</b>
          <p class="text-[11px] text-slate-300 mt-1">${hz.vulnerabilityReason}</p>
          <div class="text-[10px] text-slate-400 mt-1">Slope: ${hz.slopeDeg}° • Elevation: ${hz.elevationM}m</div>
        </div>
      `);

      layerGroupsRef.current.hazards.addLayer(polygon);
    });
  }, [hazardZones]);

  // Update Sensor Nodes
  useEffect(() => {
    layerGroupsRef.current.sensors.clearLayers();

    sensors.forEach((sensor) => {
      const isCritical = sensor.status === 'Critical';
      const markerHtml = `
        <div class="p-1 rounded-full ${
          isCritical ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
        } border border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold w-5 h-5" title="${sensor.name}">
          S
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'sensor-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([sensor.lat, sensor.lng], { icon });
      marker.bindPopup(`
        <div class="p-1 text-xs space-y-1">
          <div class="font-bold text-cyan-300">${sensor.name}</div>
          <div class="text-[11px] font-mono text-white bg-slate-800 p-1 rounded">
            Value: <span class="${isCritical ? 'text-red-400' : 'text-emerald-400'} font-bold">${sensor.value} ${sensor.unit}</span>
            (Threshold: ${sensor.threshold})
          </div>
          <div class="text-[10px] text-slate-400">
            Battery: ${sensor.batteryPct}% • ${sensor.hardwareModel}
          </div>
        </div>
      `);
      layerGroupsRef.current.sensors.addLayer(marker);
    });
  }, [sensors]);

  // Update Safe Shelters
  useEffect(() => {
    layerGroupsRef.current.shelters.clearLayers();

    shelters.forEach((sh) => {
      const markerHtml = `
        <div class="p-1 rounded-lg bg-emerald-600 border border-emerald-300 shadow-md flex items-center justify-center text-[10px] text-white font-black w-5 h-5" title="${sh.name}">
          H
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'shelter-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([sh.lat, sh.lng], { icon });
      marker.bindPopup(`
        <div class="p-1 text-xs space-y-1">
          <div class="font-bold text-emerald-300">${sh.name}</div>
          <div class="text-[11px] text-slate-300">
            Height above river: <b class="text-white">${sh.heightAboveRiverM}m</b> (${sh.elevationM}m DEM)
          </div>
          <div class="text-[11px] text-slate-300">
            Occupancy: <b class="text-white">${sh.currentOccupancy} / ${sh.capacity}</b> (${Math.round((sh.currentOccupancy / sh.capacity) * 100)}%)
          </div>
          <div class="text-[10px] text-slate-400">
            Contact: ${sh.contactPerson} (${sh.contactPhone})
          </div>
        </div>
      `);
      layerGroupsRef.current.shelters.addLayer(marker);
    });
  }, [shelters]);

  // Update Rescue Teams
  useEffect(() => {
    layerGroupsRef.current.rescue.clearLayers();

    rescueTeams.forEach((rt) => {
      const markerHtml = `
        <div class="p-1 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-[9px] text-slate-950 font-black w-6 h-6" title="${rt.callSign}">
          R
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'rescue-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([rt.lat, rt.lng], { icon });
      marker.bindPopup(`
        <div class="p-1 text-xs space-y-1">
          <div class="font-bold text-amber-400">${rt.callSign}: ${rt.unitName}</div>
          <div class="text-[11px] text-slate-200 font-semibold">Status: <span class="text-amber-300">${rt.status}</span></div>
          <div class="text-[10px] text-slate-400">Assigned Sector: ${rt.assignedSector}</div>
          <div class="text-[10px] text-slate-400">Commander: ${rt.commander} (${rt.contactPhone})</div>
        </div>
      `);
      layerGroupsRef.current.rescue.addLayer(marker);
    });
  }, [rescueTeams]);

  // Handle layer toggles
  const toggleLayer = (layerName: keyof typeof visibleLayers) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const willBeVisible = !visibleLayers[layerName];
    setVisibleLayers((prev) => ({ ...prev, [layerName]: willBeVisible }));

    const layerGroup = layerGroupsRef.current[layerName];
    if (willBeVisible) {
      layerGroup.addTo(map);
    } else {
      map.removeLayer(layerGroup);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Element Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Layer Controls Pill Bar */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-xl flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 font-bold text-slate-300 border-b border-slate-800 text-[11px]">
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>Terrain Layers</span>
        </div>

        <button
          onClick={() => toggleLayer('regions')}
          className={`px-2 py-1 rounded text-left flex items-center justify-between text-[11px] transition-colors ${
            visibleLayers.regions ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-red-400" />
            <span>Valleys & Basins</span>
          </span>
          <Eye className={`h-3 w-3 ${visibleLayers.regions ? 'text-cyan-400' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => toggleLayer('hazards')}
          className={`px-2 py-1 rounded text-left flex items-center justify-between text-[11px] transition-colors ${
            visibleLayers.hazards ? 'bg-red-500/20 text-red-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>Hazard Zones</span>
          </span>
          <Eye className={`h-3 w-3 ${visibleLayers.hazards ? 'text-red-400' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => toggleLayer('sensors')}
          className={`px-2 py-1 rounded text-left flex items-center justify-between text-[11px] transition-colors ${
            visibleLayers.sensors ? 'bg-blue-500/20 text-blue-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            <span>ESP32 Sensors ({sensors.length})</span>
          </span>
          <Eye className={`h-3 w-3 ${visibleLayers.sensors ? 'text-blue-400' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => toggleLayer('shelters')}
          className={`px-2 py-1 rounded text-left flex items-center justify-between text-[11px] transition-colors ${
            visibleLayers.shelters ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-emerald-400" />
            <span>Safe Shelters ({shelters.length})</span>
          </span>
          <Eye className={`h-3 w-3 ${visibleLayers.shelters ? 'text-emerald-400' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => toggleLayer('rescue')}
          className={`px-2 py-1 rounded text-left flex items-center justify-between text-[11px] transition-colors ${
            visibleLayers.rescue ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-amber-400" />
            <span>Rescue Units ({rescueTeams.length})</span>
          </span>
          <Eye className={`h-3 w-3 ${visibleLayers.rescue ? 'text-amber-400' : 'text-slate-600'}`} />
        </button>
      </div>

      {/* Map Legend at Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl flex items-center gap-4 text-[11px] text-slate-300">
        <span className="font-bold text-slate-400">Risk Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>High Risk (Evacuate)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span>Medium (Watch)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span>Low (Advisory)</span>
        </div>
      </div>
    </div>
  );
};
