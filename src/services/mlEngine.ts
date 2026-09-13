import {
  PredictionInput,
  PredictionResult,
  RiskLevel,
  FeatureContribution,
  LandCoverType,
} from '../types';

// Land cover runoff coefficient (C factor from Rational Hydrologic Method)
const LAND_COVER_FACTORS: Record<LandCoverType, { cFactor: number; name: string }> = {
  dense_forest: { cFactor: 0.22, name: 'Dense Forest (High Absorption)' },
  sparse_vegetation: { cFactor: 0.45, name: 'Sparse Vegetation (Moderate Infiltration)' },
  cultivated_slope: { cFactor: 0.60, name: 'Cultivated Terraces / Slopes' },
  barren_rock: { cFactor: 0.82, name: 'Barren Rock / Exposed Bedrock (Rapid Runoff)' },
  urban_settlement: { cFactor: 0.88, name: 'Hilly Settlement / Concrete (Impervious)' },
};

/**
 * Multi-Source Flash Flood ML Inference Engine
 * Simulates trained Random Forest ensemble & comparative XGBoost/LSTM models
 * calibrated with hydrological physics for steep topography.
 */
export function calculateFloodRisk(input: PredictionInput): PredictionResult {
  const {
    rainfall1h,
    rainfall3h,
    rainfall24h,
    soilMoisture,
    elevation,
    slope,
    riverLevel,
    riverDangerMark,
    distanceFromRiver,
    landCover,
    historicalFloodFreq,
    catchmentAreaKm2,
  } = input;

  const landCoverInfo = LAND_COVER_FACTORS[landCover] || LAND_COVER_FACTORS.dense_forest;

  // 1. Rainfall intensity sub-score (0 - 100)
  // Short-duration burst (1hr) is the critical flash flood trigger in mountains
  const burstScore = Math.min(100, (rainfall1h / 45) * 50 + (rainfall3h / 90) * 30 + (rainfall24h / 160) * 20);

  // 2. Soil moisture saturation sub-score (0 - 100)
  // High antecedent moisture eliminates infiltration capacity
  const soilSaturationScore = Math.max(0, Math.min(100, (soilMoisture - 20) * 1.25));

  // 3. Slope steepness sub-score (0 - 100)
  // Slopes > 25° accelerate overland flow velocities exponentially
  const slopeScore = Math.min(100, (slope / 45) * 100);

  // 4. River channel vulnerability (0 - 100)
  const riverMargin = riverDangerMark - riverLevel; // negative = breached
  let riverScore = 0;
  if (riverMargin <= 0) {
    riverScore = 100;
  } else {
    // Within 2m of danger is critical
    riverScore = Math.max(0, 100 - (riverMargin / 3) * 70);
  }

  // Distance buffer factor
  const proximityMultiplier = Math.max(0.3, Math.min(1.0, 1 - (distanceFromRiver / 1200)));

  // 5. Land cover runoff factor (0 - 100)
  const landCoverScore = landCoverInfo.cFactor * 100;

  // 6. Historical susceptibility (0 - 100)
  const historyScore = Math.min(100, (historicalFloodFreq / 6) * 100);

  // Core Multi-Source Synthetic Random Forest Ensemble Weights
  // W_rain: 0.30, W_soil: 0.22, W_slope: 0.18, W_river: 0.16, W_land: 0.08, W_hist: 0.06
  let rawScore =
    burstScore * 0.30 +
    soilSaturationScore * 0.22 +
    slopeScore * 0.18 +
    (riverScore * proximityMultiplier) * 0.16 +
    landCoverScore * 0.08 +
    historyScore * 0.06;

  // Critical Non-Linear Coupling Logic (As emphasized in requirements):
  // Heavy rain + Steep Slope + High Soil Moisture = Multiplicative flash catastrophe
  const isHeavyRain = rainfall1h >= 35 || rainfall3h >= 75;
  const isSteep = slope >= 28;
  const isSaturated = soilMoisture >= 75;
  const isLowMoisture = soilMoisture <= 40;
  const isGentle = slope <= 14;

  if (isHeavyRain && isSteep && isSaturated) {
    // Positive synergy trigger
    rawScore = Math.min(99, rawScore * 1.28 + 12);
  } else if (isHeavyRain && isLowMoisture && isGentle) {
    // Soil can absorb substantial precipitation and gentle slopes slow velocity
    rawScore = Math.max(15, rawScore * 0.72 - 8);
  }

  // Bound probability between 2% and 99%
  const floodProbability = Math.round(Math.max(2, Math.min(99, rawScore)));

  // Risk Classification Thresholds
  let riskLevel: RiskLevel = 'LOW';
  let warningCategory = 'Green Advisory (Normal Monitoring)';
  if (floodProbability >= 70) {
    riskLevel = 'HIGH';
    warningCategory = 'Red Alert: FLASH FLOOD EMERGENCY';
  } else if (floodProbability >= 40) {
    riskLevel = 'MEDIUM';
    warningCategory = 'Orange Alert: FLASH FLOOD WARNING';
  } else if (floodProbability >= 25) {
    warningCategory = 'Yellow Alert: FLASH FLOOD WATCH';
  }

  // Estimated Surge Time: in steep hilly terrain, time to peak = f(Slope, Catchment, Soil)
  // Steeper slopes & higher saturation shorten lead time significantly
  const leadTimeHours = Math.max(
    0.4,
    Number(((4.5 - (slope / 20) - (soilMoisture / 50) + (catchmentAreaKm2 / 80))).toFixed(1))
  );

  // Dynamic Feature Contributions Breakdown
  const featureImportance: FeatureContribution[] = [
    {
      feature: 'Rainfall Intensity (1h / 3h)',
      weight: 30,
      valueDisplay: `${rainfall1h} mm/hr (3h: ${rainfall3h} mm)`,
      impact: rainfall1h > 30 ? 'amplifying' : rainfall1h < 10 ? 'attenuating' : 'neutral',
      description: 'Short-duration cloudburst intensity drives rapid sheetwash.',
    },
    {
      feature: 'Soil Moisture Saturation',
      weight: 22,
      valueDisplay: `${soilMoisture}% SMAP Saturation`,
      impact: soilMoisture > 70 ? 'amplifying' : soilMoisture < 45 ? 'attenuating' : 'neutral',
      description: 'High antecedent moisture prevents water infiltration into hillside soil.',
    },
    {
      feature: 'Terrain Gradient & Slope',
      weight: 18,
      valueDisplay: `${slope}° Slope (${elevation}m DEM)`,
      impact: slope > 25 ? 'amplifying' : slope < 12 ? 'attenuating' : 'neutral',
      description: 'Steep hill slopes convert rainfall into high-velocity debris flows.',
    },
    {
      feature: 'River Stage & Channel Proximity',
      weight: 16,
      valueDisplay: `${riverLevel}m / Danger: ${riverDangerMark}m (${distanceFromRiver}m away)`,
      impact: riverLevel >= riverDangerMark - 0.5 ? 'amplifying' : 'neutral',
      description: 'Current water depth relative to bankfull discharge capacity.',
    },
    {
      feature: 'Land Use & Infiltration Cover',
      weight: 8,
      valueDisplay: landCoverInfo.name,
      impact: landCoverInfo.cFactor > 0.6 ? 'amplifying' : 'attenuating',
      description: 'Vegetation canopy reduces impact energy; rock or paved slopes accelerate runoff.',
    },
    {
      feature: 'Historical Valley Flood Frequency',
      weight: 6,
      valueDisplay: `${historicalFloodFreq} events in 20 yrs`,
      impact: historicalFloodFreq >= 3 ? 'amplifying' : 'neutral',
      description: 'Geomorphic funnel zones with repeat inundation records.',
    },
  ];

  // Model Comparisons (RF, XGBoost, LSTM)
  // XGBoost penalizes sudden peaks slightly faster; LSTM tracks progressive soil build-up
  const xgbProb = Math.min(99, Math.max(3, Math.round(floodProbability * (isSteep ? 1.05 : 0.96))));
  const lstmProb = Math.min(99, Math.max(4, Math.round(floodProbability * (isSaturated ? 1.08 : 0.94))));

  const getRisk = (prob: number): RiskLevel => (prob >= 70 ? 'HIGH' : prob >= 40 ? 'MEDIUM' : 'LOW');

  const modelComparisons = {
    rf: {
      probability: floodProbability,
      risk: riskLevel,
      confidence: 94.2,
    },
    xgboost: {
      probability: xgbProb,
      risk: getRisk(xgbProb),
      confidence: 95.8,
    },
    lstm: {
      probability: lstmProb,
      risk: getRisk(lstmProb),
      confidence: 91.6,
    },
  };

  // Extract Key Drivers
  const keyDrivers: string[] = [];
  if (rainfall1h >= 30) keyDrivers.push(`Cloudburst-level rainfall rate (${rainfall1h} mm/h)`);
  if (soilMoisture >= 75) keyDrivers.push(`High soil water saturation (${soilMoisture}%)`);
  if (slope >= 26) keyDrivers.push(`Steep drainage incline (${slope}°) inducing hyper-concentrated flow`);
  if (riverLevel >= riverDangerMark - 0.5) keyDrivers.push(`River stage nearing bankfull (${riverLevel}m)`);
  if (landCover === 'barren_rock' || landCover === 'urban_settlement') keyDrivers.push(`Impervious surface cover (${landCover.replace('_', ' ')})`);
  if (keyDrivers.length === 0) keyDrivers.push('Hydrologic indicators currently within safe thresholds.');

  // Recommended Actions
  const recommendedActions: string[] = [];
  if (riskLevel === 'HIGH') {
    recommendedActions.push('TRIGGER EVACUATION: Immediate evacuation of valley bottoms and stream banks to high ground.');
    recommendedActions.push('ACTIVATE SIRENS: Sound community early warning sirens and push localized cellular alerts.');
    recommendedActions.push('DEPLOY RESCUE: Put NDRF / SDRF hill rescue teams on immediate flood-standby with inflatable boats.');
    recommendedActions.push('SHUT DOWN BRIDGES: Close culverts, low bridges, and ghat roads prone to mud debris inundation.');
  } else if (riskLevel === 'MEDIUM') {
    recommendedActions.push('COMMENCE WATCH: Field hydrologists to monitor river gauge telemetry every 15 minutes.');
    recommendedActions.push('ALERT CITIZENS: Send SMS advisories to hill slope residents to prepare 72-hr emergency go-bags.');
    recommendedActions.push('INSPECT DRAINAGE: Clear debris blockages from mountain culverts and road spillways.');
    recommendedActions.push('IDENTIFY SHELTERS: Verify power backup and medical kits at designated elevated relief shelters.');
  } else {
    recommendedActions.push('ROUTINE TELEMETRY: Maintain standard automated IoT sensor ping intervals (30 mins).');
    recommendedActions.push('COMMUNITY AWARENESS: Educate tourists and pilgrims on "Turn Around Don\'t Drown" mountain protocol.');
    recommendedActions.push('WATERSHED HEALTH: Continue slope reforestation and check dam maintenance.');
  }

  return {
    floodProbability,
    riskLevel,
    warningCategory,
    estimatedSurgeTimeHours: leadTimeHours,
    runoffCoefficient: Number(landCoverInfo.cFactor.toFixed(2)),
    featureImportance,
    modelComparisons,
    keyDrivers,
    recommendedActions,
    calculatedAt: new Date().toLocaleTimeString(),
  };
}
