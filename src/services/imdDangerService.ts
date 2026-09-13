import { INDIA_PLACES_DATABASE, IndiaPlaceItem } from '../data/indiaRegionsData';
import { LandCoverType } from '../types';

export type ImdAlertLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
export type LandslideRiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface LiveMeteoTelemetry {
  currentRainRateMmH: number;
  rainfall24hMm: number;
  forecast48hMm: number;
  precipitationProbabilityPct: number;
  soilMoisturePct: number;
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  weatherCode: number;
  weatherDescription: string;
  timestamp: string;
  isRealTimeLive: boolean;
}

export interface ImdDangerAssessment {
  id: string;
  name: string;
  placeName: string;
  district: string;
  state: string;
  zone: 'Himalayan North' | 'Western Ghats' | 'Northeast Hills' | 'Eastern Ghats & Central';
  mountainRange: string;
  valleyOrBasin: string;
  elevation: number;
  slope: number;
  riverName: string;
  coordinates: [number, number];
  telemetry: LiveMeteoTelemetry;
  imdAlertLevel: ImdAlertLevel;
  imdCategoryText: string;
  imdActionDirective: string;
  prediction: {
    floodProbabilityPct: number;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    surgeArrivalEtaHours: number;
    landslideSusceptibility: LandslideRiskLevel;
    debrisTorrentRisk: boolean;
    primaryDangerDrivers: string[];
    evacuationAdvice: string;
  };
  shelterName: string;
  rescueUnitName: string;
  rawPlace: IndiaPlaceItem;
}

export interface ImdNationalHillySummary {
  monitoredZonesCount: number;
  redAlertCount: number;
  orangeAlertCount: number;
  yellowWatchCount: number;
  greenCount: number;
  highestRainfallPlace: { name: string; rainfall24h: number; state: string };
  averageSoilSaturation: number;
  lastUpdated: string;
  isLiveFeed: boolean;
}

// Weather Code descriptions mapping (WMO code to IMD meteorological terms)
function getImdWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 63) return 'Moderate Continuous Rain';
  if (code === 65) return 'Heavy Monsoon Rain';
  if (code === 66 || code === 67) return 'Freezing Rain / Sleet';
  if (code >= 71 && code <= 75) return 'Himalayan Snowfall';
  if (code >= 80 && code <= 82) return 'Intense Rain Showers';
  if (code === 85 || code === 86) return 'Heavy Snow Showers';
  if (code === 95) return 'Severe Thunderstorm with Lightning';
  if (code >= 96 && code <= 99) return 'Thunderstorm with Severe Hail & Squall';
  return 'Cloudy with Mountain Mist';
}

/**
 * Classifies the official IMD Alert color and warning category based on
 * official IMD precipitation classification criteria combined with
 * antecedent rainfall and soil pore pressure.
 */
export function classifyImdAlert(
  currentRainRate: number,
  rainfall24h: number,
  forecast48h: number,
  soilMoisture: number,
  slope: number
): {
  level: ImdAlertLevel;
  category: string;
  directive: string;
} {
  // IMD Standard Rainfall Thresholds:
  // - Extremely Heavy: > 204.4 mm / 24h or > 50 mm / 1h (Cloudburst)
  // - Very Heavy: 115.6 - 204.4 mm / 24h
  // - Heavy: 64.5 - 115.5 mm / 24h
  // - Moderate: 15.6 - 64.4 mm / 24h
  const isExtremelyHeavy = rainfall24h >= 204.5 || currentRainRate >= 45;
  const isVeryHeavy = rainfall24h >= 115.6 || currentRainRate >= 22;
  const isHeavy = rainfall24h >= 64.5 || currentRainRate >= 10;
  const highSoilSaturation = soilMoisture >= 80;
  const steepSlope = slope >= 30;

  // RED ALERT: Extreme hazard imminent
  if (
    isExtremelyHeavy ||
    (isVeryHeavy && highSoilSaturation && steepSlope) ||
    (currentRainRate >= 35 && highSoilSaturation)
  ) {
    return {
      level: 'RED',
      category: 'Extremely Heavy Rainfall / Cloudburst Hazard (RED WARNING)',
      directive:
        'TAKE ACTION: High risk of catastrophic flash floods, hyper-concentrated debris torrents, and slope failures. Halt hill road vehicular traffic. Evacuate low-lying riverbanks immediately.',
    };
  }

  // ORANGE ALERT: High hazard, be prepared
  if (
    isVeryHeavy ||
    (isHeavy && highSoilSaturation && steepSlope) ||
    (forecast48h >= 100 && highSoilSaturation)
  ) {
    return {
      level: 'ORANGE',
      category: 'Very Heavy Rainfall Warning (ORANGE ALERT)',
      directive:
        'BE PREPARED: Elevated flash flood threat and multiple landslide risks on saturated cuts. Move to higher ground shelters, avoid water crossings, keep emergency kits accessible.',
    };
  }

  // YELLOW ALERT: Watch & monitor
  if (isHeavy || highSoilSaturation || currentRainRate >= 8) {
    return {
      level: 'YELLOW',
      category: 'Heavy Rainfall Watch (YELLOW WATCH)',
      directive:
        'BE UPDATED: High runoff and localized waterlogging in valley bottoms. Monitor local river stage telemetry and heed police mountain pass advisories.',
    };
  }

  // GREEN: Normal
  return {
    level: 'GREEN',
    category: 'Normal / Light Showers (GREEN - ALL CLEAR)',
    directive:
      'NO ADVERSE WARNING: Baseline hydrologic conditions within safe capacity. Regular vigilance along river courses.',
  };
}

/**
 * Evaluates flash flood probability, surge arrival time, and geotechnical
 * landslide susceptibility for an Indian hilly area.
 */
export function predictHillyDanger(
  place: IndiaPlaceItem,
  telemetry: LiveMeteoTelemetry
): {
  floodProbabilityPct: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  surgeArrivalEtaHours: number;
  landslideSusceptibility: LandslideRiskLevel;
  debrisTorrentRisk: boolean;
  primaryDangerDrivers: string[];
  evacuationAdvice: string;
} {
  const rainBurst = telemetry.currentRainRateMmH;
  const rain24h = telemetry.rainfall24hMm;
  const soilMoisture = telemetry.soilMoisturePct;
  const slope = place.averageSlope;
  const elevation = place.elevation;

  // 1. Flash Flood Probability ML Formula
  // Weighted components: Burst Rain (35%), Antecedent Rain (25%), Soil Saturation (20%), Slope Energy (15%), Elevation/Catchment (5%)
  const burstFactor = Math.min(100, (rainBurst / 40) * 100);
  const antecedentFactor = Math.min(100, (rain24h / 180) * 100);
  const soilFactor = Math.min(100, Math.max(0, (soilMoisture - 30) * 1.43));
  const slopeFactor = Math.min(100, (slope / 45) * 100);

  const rawScore =
    burstFactor * 0.35 +
    antecedentFactor * 0.25 +
    soilFactor * 0.2 +
    slopeFactor * 0.15 +
    (place.riverLevel / place.riverDangerMark) * 5;

  const floodProbabilityPct = Math.min(99, Math.max(8, Math.round(rawScore)));

  // Risk Level
  let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (floodProbabilityPct >= 68) riskLevel = 'HIGH';
  else if (floodProbabilityPct >= 38) riskLevel = 'MEDIUM';

  // 2. Surge Arrival ETA (hours)
  // Steeper slopes + high rain velocity mean shorter lag times
  let lagHours = Math.max(
    0.8,
    Number((5.5 - (slope / 45) * 2.2 - (rainBurst / 50) * 1.5 - (soilMoisture / 100) * 1.0).toFixed(1))
  );
  if (lagHours < 0.8) lagHours = 0.8;

  // 3. Landslide & Debris Torrent Susceptibility
  // Landslides occur when soil saturation exceeds 75% on slopes > 26°
  let landslideSusceptibility: LandslideRiskLevel = 'LOW';
  let debrisTorrentRisk = false;

  if (soilMoisture >= 80 && slope >= 30) {
    landslideSusceptibility = 'CRITICAL';
    debrisTorrentRisk = true;
  } else if (soilMoisture >= 70 && slope >= 24) {
    landslideSusceptibility = 'HIGH';
    debrisTorrentRisk = rainBurst >= 20;
  } else if (soilMoisture >= 55 && slope >= 18) {
    landslideSusceptibility = 'MODERATE';
  }

  // 4. Primary Danger Drivers Identification
  const primaryDangerDrivers: string[] = [];
  if (rainBurst >= 30) {
    primaryDangerDrivers.push(`Cloudburst-intensity rainfall burst (${rainBurst} mm/h) overloading natural storm gullies`);
  } else if (rainBurst >= 15) {
    primaryDangerDrivers.push(`Moderate to heavy continuous rainfall intensity (${rainBurst} mm/h)`);
  }

  if (soilMoisture >= 80) {
    primaryDangerDrivers.push(`Severe soil pore water saturation (${soilMoisture}%) causing liquefaction risk along slope faces`);
  } else if (soilMoisture >= 65) {
    primaryDangerDrivers.push(`Elevated ground moisture (${soilMoisture}%) reducing slope shear strength`);
  }

  if (slope >= 32) {
    primaryDangerDrivers.push(`Hyper-steep terrain incline (${slope}°) generating torrential gravitational kinetic energy`);
  }

  if (place.riverLevel >= place.riverDangerMark * 0.9) {
    primaryDangerDrivers.push(`${place.riverName} flowing near danger threshold (${place.riverLevel}m vs ${place.riverDangerMark}m)`);
  }

  if (primaryDangerDrivers.length === 0) {
    primaryDangerDrivers.push('Hydrologic indicators currently within baseline seasonal absorption limits');
  }

  // 5. Evacuation Advice
  let evacuationAdvice = 'Normal vigilance. Maintain wireless communication links.';
  if (riskLevel === 'HIGH' || landslideSusceptibility === 'CRITICAL') {
    evacuationAdvice = `CRITICAL ACTION: Immediately vacate river banks and talus slope footings. Relocate to ${place.nearestShelterName}.`;
  } else if (riskLevel === 'MEDIUM' || landslideSusceptibility === 'HIGH') {
    evacuationAdvice = `ADVISORY: Avoid non-essential travel along the ${place.valleyOrBasin} corridor. Inspect hillside retaining walls.`;
  }

  return {
    floodProbabilityPct,
    riskLevel,
    surgeArrivalEtaHours: lagHours,
    landslideSusceptibility,
    debrisTorrentRisk,
    primaryDangerDrivers,
    evacuationAdvice,
  };
}

// In-memory cache for live weather telemetry to avoid excessive network overhead
const telemetryCache = new Map<string, { data: LiveMeteoTelemetry; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

/**
 * Fetches real live atmospheric data for coordinates via Open-Meteo API
 * with instant fallback to calibrated realistic telemetry.
 */
export async function fetchLiveMeteoForCoordinates(
  lat: number,
  lng: number,
  fallbackDefaults: { rainfall1h: number; rainfall24h: number; soilMoisture: number }
): Promise<LiveMeteoTelemetry> {
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = telemetryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&hourly=precipitation,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm&daily=precipitation_sum,precipitation_probability_max&past_days=1&forecast_days=2&timezone=Asia%2FKolkata`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const json = await res.json();
    const current = json.current || {};
    const daily = json.daily || {};
    const hourly = json.hourly || {};

    // 24h past precipitation sum
    let rain24h = fallbackDefaults.rainfall24h;
    if (daily.precipitation_sum && daily.precipitation_sum.length > 0) {
      // Past day + today sum
      const pastDay = daily.precipitation_sum[0] || 0;
      const today = daily.precipitation_sum[1] || 0;
      rain24h = Math.round((pastDay + today) * 10) / 10;
    }

    // 48h forecast
    let forecast48h = 0;
    if (daily.precipitation_sum && daily.precipitation_sum.length >= 3) {
      forecast48h = Math.round((daily.precipitation_sum[1] + daily.precipitation_sum[2]) * 10) / 10;
    } else {
      forecast48h = Math.round(rain24h * 0.85);
    }

    // Precipitation probability max
    const precipProb = daily.precipitation_probability_max?.[1] ?? 65;

    // Soil moisture conversion from volumetric (m3/m3) to percentage saturation (typical field capacity is ~0.35-0.45 m3/m3)
    let soilMoisturePct = fallbackDefaults.soilMoisture;
    if (hourly.soil_moisture_0_to_1cm && hourly.soil_moisture_0_to_1cm.length > 0) {
      const latestSoil = hourly.soil_moisture_0_to_1cm[hourly.soil_moisture_0_to_1cm.length - 1];
      if (typeof latestSoil === 'number' && latestSoil > 0) {
        // Porosity of Himalayan/Ghats mountain soils typically 0.45; saturation = volumetric / 0.45 * 100
        soilMoisturePct = Math.min(99, Math.max(15, Math.round((latestSoil / 0.42) * 100)));
      }
    }

    const currentRain = typeof current.precipitation === 'number' ? current.precipitation : fallbackDefaults.rainfall1h;
    const weatherCode = current.weather_code ?? 2;

    const liveData: LiveMeteoTelemetry = {
      currentRainRateMmH: Math.round(currentRain * 10) / 10,
      rainfall24hMm: Math.max(rain24h, currentRain),
      forecast48hMm: forecast48h,
      precipitationProbabilityPct: precipProb,
      soilMoisturePct,
      temperatureC: current.temperature_2m ?? 18.5,
      relativeHumidityPct: current.relative_humidity_2m ?? 78,
      windSpeedKmh: current.wind_speed_10m ?? 12,
      weatherCode,
      weatherDescription: getImdWeatherDescription(weatherCode),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isRealTimeLive: true,
    };

    telemetryCache.set(cacheKey, { data: liveData, timestamp: Date.now() });
    return liveData;
  } catch (err) {
    // Graceful fallback to rich baseline
    const fallback: LiveMeteoTelemetry = {
      currentRainRateMmH: fallbackDefaults.rainfall1h,
      rainfall24hMm: fallbackDefaults.rainfall24h,
      forecast48hMm: Math.round(fallbackDefaults.rainfall24h * 0.9),
      precipitationProbabilityPct: fallbackDefaults.rainfall1h > 15 ? 90 : 60,
      soilMoisturePct: fallbackDefaults.soilMoisture,
      temperatureC: 19.2,
      relativeHumidityPct: 82,
      windSpeedKmh: 14,
      weatherCode: fallbackDefaults.rainfall1h > 30 ? 95 : fallbackDefaults.rainfall1h > 10 ? 65 : 3,
      weatherDescription: getImdWeatherDescription(fallbackDefaults.rainfall1h > 30 ? 95 : 65),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isRealTimeLive: false,
    };
    return fallback;
  }
}

/**
 * Assesses all Indian hilly areas against real-time IMD data and produces
 * a danger-ranked list of hilly places in India with flood and landslide predictions.
 */
export async function getAllImdHillyDangerAssessments(): Promise<{
  places: ImdDangerAssessment[];
  summary: ImdNationalHillySummary;
}> {
  // Process places concurrently in batches of 5 to respect API rate limits
  const places = INDIA_PLACES_DATABASE;
  const assessments: ImdDangerAssessment[] = [];

  for (let i = 0; i < places.length; i += 5) {
    const chunk = places.slice(i, i + 5);
    const chunkResults = await Promise.all(
      chunk.map(async (place) => {
        const telemetry = await fetchLiveMeteoForCoordinates(
          place.coordinates[0],
          place.coordinates[1],
          {
            rainfall1h: place.rainfall1h,
            rainfall24h: place.rainfall24h,
            soilMoisture: place.soilMoisture,
          }
        );

        const alertInfo = classifyImdAlert(
          telemetry.currentRainRateMmH,
          telemetry.rainfall24hMm,
          telemetry.forecast48hMm,
          telemetry.soilMoisturePct,
          place.averageSlope
        );

        const prediction = predictHillyDanger(place, telemetry);

        const assessment: ImdDangerAssessment = {
          id: place.id,
          name: place.name,
          placeName: place.placeName,
          district: place.district,
          state: place.state,
          zone: place.zone,
          mountainRange: place.mountainRange,
          valleyOrBasin: place.valleyOrBasin,
          elevation: place.elevation,
          slope: place.averageSlope,
          riverName: place.riverName,
          coordinates: place.coordinates,
          telemetry,
          imdAlertLevel: alertInfo.level,
          imdCategoryText: alertInfo.category,
          imdActionDirective: alertInfo.directive,
          prediction,
          shelterName: place.nearestShelterName,
          rescueUnitName: place.rescueUnitName,
          rawPlace: place,
        };

        return assessment;
      })
    );
    assessments.push(...chunkResults);
  }

  // Sort by IMD Danger level priority: RED > ORANGE > YELLOW > GREEN, then by flood probability descending
  const priorityOrder: Record<ImdAlertLevel, number> = {
    RED: 4,
    ORANGE: 3,
    YELLOW: 2,
    GREEN: 1,
  };

  assessments.sort((a, b) => {
    const pDiff = priorityOrder[b.imdAlertLevel] - priorityOrder[a.imdAlertLevel];
    if (pDiff !== 0) return pDiff;
    return b.prediction.floodProbabilityPct - a.prediction.floodProbabilityPct;
  });

  // Calculate National Summary KPIs
  let redCount = 0;
  let orangeCount = 0;
  let yellowCount = 0;
  let greenCount = 0;
  let highestRain = { name: 'Kedarnath', rainfall24h: 0, state: 'Uttarakhand' };
  let totalMoisture = 0;

  assessments.forEach((item) => {
    if (item.imdAlertLevel === 'RED') redCount++;
    else if (item.imdAlertLevel === 'ORANGE') orangeCount++;
    else if (item.imdAlertLevel === 'YELLOW') yellowCount++;
    else greenCount++;

    if (item.telemetry.rainfall24hMm > highestRain.rainfall24h) {
      highestRain = {
        name: item.placeName,
        rainfall24h: item.telemetry.rainfall24hMm,
        state: item.state,
      };
    }
    totalMoisture += item.telemetry.soilMoisturePct;
  });

  const summary: ImdNationalHillySummary = {
    monitoredZonesCount: assessments.length,
    redAlertCount: redCount,
    orangeAlertCount: orangeCount,
    yellowWatchCount: yellowCount,
    greenCount,
    highestRainfallPlace: highestRain,
    averageSoilSaturation: Math.round(totalMoisture / (assessments.length || 1)),
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isLiveFeed: assessments.some((a) => a.telemetry.isRealTimeLive),
  };

  return {
    places: assessments,
    summary,
  };
}
