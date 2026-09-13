export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AlertSeverity = 'Advisory' | 'Watch' | 'Warning' | 'Emergency';

export type UserRole = 'citizen' | 'hydrologist' | 'rescue' | 'admin';

export type LandCoverType =
  | 'dense_forest'
  | 'sparse_vegetation'
  | 'barren_rock'
  | 'cultivated_slope'
  | 'urban_settlement';

export interface PredictionInput {
  rainfall1h: number; // mm
  rainfall3h: number; // mm
  rainfall24h: number; // mm
  soilMoisture: number; // % saturation
  elevation: number; // meters DEM
  slope: number; // degrees
  riverLevel: number; // meters
  riverDangerMark: number; // meters
  distanceFromRiver: number; // meters
  landCover: LandCoverType;
  historicalFloodFreq: number; // count in past 20 years
  catchmentAreaKm2: number;
}

export interface FeatureContribution {
  feature: string;
  weight: number;
  valueDisplay: string;
  impact: 'amplifying' | 'attenuating' | 'neutral';
  description: string;
}

export interface ModelComparison {
  rf: { probability: number; risk: RiskLevel; confidence: number };
  xgboost: { probability: number; risk: RiskLevel; confidence: number };
  lstm: { probability: number; risk: RiskLevel; confidence: number };
}

export interface PredictionResult {
  floodProbability: number; // 0 - 100
  riskLevel: RiskLevel;
  warningCategory: string;
  estimatedSurgeTimeHours: number;
  runoffCoefficient: number;
  featureImportance: FeatureContribution[];
  modelComparisons: ModelComparison;
  keyDrivers: string[];
  recommendedActions: string[];
  aiExplanation?: string;
  calculatedAt: string;
}

export interface Region {
  id: string;
  name: string;
  valleyOrBasin: string;
  state: string;
  mountainRange: string;
  coordinates: [number, number]; // [lat, lng]
  riskLevel: RiskLevel;
  rainfall1h: number;
  rainfall24h: number;
  soilMoisture: number;
  averageSlope: number;
  elevation: number;
  riverName: string;
  riverLevel: number;
  riverDangerMark: number;
  evacuationStatus: 'Normal' | 'Advisory' | 'Evacuate Low-lying' | 'Immediate High-ground';
  lastUpdated: string;
}

export interface SensorNode {
  id: string;
  name: string;
  regionId: string;
  type: 'rainfall_tipping' | 'ultrasonic_water_level' | 'capacitive_soil' | 'aws_station';
  lat: number;
  lng: number;
  value: number;
  unit: string;
  threshold: number;
  batteryPct: number;
  signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Offline';
  status: 'Normal' | 'Warning' | 'Critical';
  hardwareModel: string; // e.g. "ESP32-S3 IoT LoRa Node"
  lastPing: string;
}

export interface HazardZone {
  id: string;
  regionId: string;
  name: string;
  coordinates: [number, number][];
  riskLevel: RiskLevel;
  elevationM: number;
  slopeDeg: number;
  vulnerabilityReason: string;
}

export interface Shelter {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  elevationM: number;
  heightAboveRiverM: number;
  contactPerson: string;
  contactPhone: string;
  amenities: string[];
  status: 'Open' | 'Near Capacity' | 'Full';
}

export interface RescueTeam {
  id: string;
  callSign: string;
  unitName: string;
  regionId: string;
  regionName: string;
  membersCount: number;
  status: 'Standby' | 'En Route' | 'Deploying Boats' | 'Evacuating';
  lat: number;
  lng: number;
  commander: string;
  contactPhone: string;
  equipment: string[];
  assignedSector: string;
  lastUpdated: string;
}

export interface SOSRequest {
  id: string;
  senderName: string;
  phone: string;
  lat?: number;
  lng?: number;
  coordinates?: [number, number];
  region?: string;
  regionId?: string;
  regionName?: string;
  locationDescription?: string;
  addressOrLandmark?: string;
  peopleCount: number;
  waterLevelM?: number;
  waterLevelMeters?: number;
  hasMedicalEmergency?: boolean;
  medicalNeed?: boolean;
  hasElderlyOrChildren?: boolean;
  elderlyOrInfants?: boolean;
  urgency?: 'MODERATE' | 'URGENT' | 'CRITICAL' | string;
  status: 'Pending' | 'Dispatched' | 'Rescued' | 'PENDING' | 'DISPATCHED' | 'RESCUED';
  timestamp: string;
  notes?: string;
}


export interface HistoricalFlood {
  id: string;
  name: string;
  year: number;
  date: string;
  region: string;
  state: string;
  rainfallMm24h: number;
  peakDischargeCumecs: number;
  estimatedSoilSaturationPct: number;
  slopeAngleDeg: number;
  casualties: number;
  summary: string;
  keyFactors: string[];
}

export interface AlertItem {
  id: string;
  regionId: string;
  regionName: string;
  severity: AlertSeverity;
  headline: string;
  message: string;
  issuedAt: string;
  expiresAt: string;
  affectedRivers: string[];
  actionRequired: string;
  active?: boolean;
}

