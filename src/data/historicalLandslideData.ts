export interface AnnualLandslideRecord {
  year: number;
  totalIncidents: number;
  majorEvents: number;
  moderateEvents: number;
  minorSlips: number;
  extremeRainDays: number;
  meanMonsoonRainfallMm: number;
  westernHimalayas: number;
  easternHimalayas: number;
  westernGhats: number;
  casualties: number;
  roadBlockDays: number;
  notableDisaster: string;
  keyTrigger: string;
}

export interface MonthlyLandslideDistribution {
  month: string;
  incidentsPct: number;
  avgRainfallMm: number;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Extreme';
}

export interface LandslideTriggerFactor {
  name: string;
  percentage: number;
  color: string;
  description: string;
}

export const HISTORICAL_LANDSLIDE_10_YEARS: AnnualLandslideRecord[] = [
  {
    year: 2015,
    totalIncidents: 1840,
    majorEvents: 94,
    moderateEvents: 460,
    minorSlips: 1286,
    extremeRainDays: 24,
    meanMonsoonRainfallMm: 1140,
    westernHimalayas: 810,
    easternHimalayas: 640,
    westernGhats: 390,
    casualties: 112,
    roadBlockDays: 48,
    notableDisaster: 'Mirik & Kalimpong Slope Failures (Darjeeling)',
    keyTrigger: 'Continuous 3-day cyclonic precipitation exceeding 350mm'
  },
  {
    year: 2016,
    totalIncidents: 1980,
    majorEvents: 108,
    moderateEvents: 512,
    minorSlips: 1360,
    extremeRainDays: 28,
    meanMonsoonRainfallMm: 1210,
    westernHimalayas: 920,
    easternHimalayas: 680,
    westernGhats: 380,
    casualties: 98,
    roadBlockDays: 52,
    notableDisaster: 'Arunachal Papum Pare Mudflow',
    keyTrigger: 'Cloudburst along foothill boundary faults'
  },
  {
    year: 2017,
    totalIncidents: 2210,
    majorEvents: 135,
    moderateEvents: 610,
    minorSlips: 1465,
    extremeRainDays: 33,
    meanMonsoonRainfallMm: 1285,
    westernHimalayas: 1040,
    easternHimalayas: 740,
    westernGhats: 430,
    casualties: 165,
    roadBlockDays: 64,
    notableDisaster: 'Kotrupi Massive Mudflow (Mandi, HP)',
    keyTrigger: 'NH-154 hillside collapse swept two HRTC buses (46 dead)'
  },
  {
    year: 2018,
    totalIncidents: 3150,
    majorEvents: 240,
    moderateEvents: 890,
    minorSlips: 2020,
    extremeRainDays: 46,
    meanMonsoonRainfallMm: 1510,
    westernHimalayas: 1190,
    easternHimalayas: 720,
    westernGhats: 1240,
    casualties: 485,
    roadBlockDays: 92,
    notableDisaster: 'Kerala Great Deluge & Idukki-Wayanad Slope Slips',
    keyTrigger: 'Record 2,346mm monsoon precipitation saturating laterite regolith'
  },
  {
    year: 2019,
    totalIncidents: 2890,
    majorEvents: 195,
    moderateEvents: 780,
    minorSlips: 1915,
    extremeRainDays: 41,
    meanMonsoonRainfallMm: 1420,
    westernHimalayas: 1210,
    easternHimalayas: 690,
    westernGhats: 990,
    casualties: 280,
    roadBlockDays: 81,
    notableDisaster: 'Kavalappara (Malappuram) & Puthumala Debris Avalanches',
    keyTrigger: '380mm in 24 hours inducing soil liquefaction on 28° slopes'
  },
  {
    year: 2020,
    totalIncidents: 2640,
    majorEvents: 168,
    moderateEvents: 720,
    minorSlips: 1752,
    extremeRainDays: 36,
    meanMonsoonRainfallMm: 1340,
    westernHimalayas: 1180,
    easternHimalayas: 810,
    westernGhats: 650,
    casualties: 195,
    roadBlockDays: 73,
    notableDisaster: 'Pettimudi Tea Plantation Debris Flow (Munnar)',
    keyTrigger: 'Steep escarpment failure cascading 1.5km into estate quarters'
  },
  {
    year: 2021,
    totalIncidents: 3420,
    majorEvents: 265,
    moderateEvents: 940,
    minorSlips: 2215,
    extremeRainDays: 52,
    meanMonsoonRainfallMm: 1490,
    westernHimalayas: 1850,
    easternHimalayas: 790,
    westernGhats: 780,
    casualties: 340,
    roadBlockDays: 104,
    notableDisaster: 'Chamoli Ronti Peak Rock-Ice Avalanche & Batseri Boulder Slide',
    keyTrigger: 'Glacial hanging wall cleavage triggering 27 million m³ rockfall'
  },
  {
    year: 2022,
    totalIncidents: 3180,
    majorEvents: 215,
    moderateEvents: 870,
    minorSlips: 2095,
    extremeRainDays: 45,
    meanMonsoonRainfallMm: 1390,
    westernHimalayas: 1540,
    easternHimalayas: 990,
    westernGhats: 650,
    casualties: 220,
    roadBlockDays: 89,
    notableDisaster: 'Tupul Railway Camp Debris Disaster (Noney, Manipur)',
    keyTrigger: 'Ijei River course damming after sudden slope liquefaction'
  },
  {
    year: 2023,
    totalIncidents: 4620,
    majorEvents: 395,
    moderateEvents: 1380,
    minorSlips: 2845,
    extremeRainDays: 68,
    meanMonsoonRainfallMm: 1680,
    westernHimalayas: 2680,
    easternHimalayas: 1120,
    westernGhats: 820,
    casualties: 512,
    roadBlockDays: 138,
    notableDisaster: 'Himachal Monsoon Catastrophe (Shimla Summer Hill, Mandi, Kullu)',
    keyTrigger: 'Western Disturbance interaction with Arabian Sea monsoonal surge'
  },
  {
    year: 2024,
    totalIncidents: 4280,
    majorEvents: 345,
    moderateEvents: 1220,
    minorSlips: 2715,
    extremeRainDays: 61,
    meanMonsoonRainfallMm: 1590,
    westernHimalayas: 2090,
    easternHimalayas: 960,
    westernGhats: 1230,
    casualties: 460,
    roadBlockDays: 122,
    notableDisaster: 'Wayanad Meppadi-Chooralmala Catastrophic Slips & Shirur NH-66 Slide',
    keyTrigger: '572mm in 48h triggered high-altitude slope failure traveling 8km downstream'
  }
];

export const MONTHLY_LANDSLIDE_PATTERNS: MonthlyLandslideDistribution[] = [
  { month: 'Jan', incidentsPct: 1.2, avgRainfallMm: 38, riskCategory: 'Low' },
  { month: 'Feb', incidentsPct: 1.8, avgRainfallMm: 45, riskCategory: 'Low' },
  { month: 'Mar', incidentsPct: 2.5, avgRainfallMm: 62, riskCategory: 'Low' },
  { month: 'Apr', incidentsPct: 3.8, avgRainfallMm: 85, riskCategory: 'Moderate' },
  { month: 'May', incidentsPct: 5.4, avgRainfallMm: 130, riskCategory: 'Moderate' },
  { month: 'Jun', incidentsPct: 14.6, avgRainfallMm: 290, riskCategory: 'High' },
  { month: 'Jul', incidentsPct: 34.2, avgRainfallMm: 480, riskCategory: 'Extreme' },
  { month: 'Aug', incidentsPct: 26.8, avgRainfallMm: 410, riskCategory: 'Extreme' },
  { month: 'Sep', incidentsPct: 6.9, avgRainfallMm: 195, riskCategory: 'High' },
  { month: 'Oct', incidentsPct: 1.9, avgRainfallMm: 72, riskCategory: 'Moderate' },
  { month: 'Nov', incidentsPct: 0.5, avgRainfallMm: 28, riskCategory: 'Low' },
  { month: 'Dec', incidentsPct: 0.4, avgRainfallMm: 18, riskCategory: 'Low' }
];

export const LANDSLIDE_TRIGGER_FACTORS: LandslideTriggerFactor[] = [
  {
    name: 'Cloudburst & Short-duration Torrential Rain',
    percentage: 54,
    color: '#06b6d4', // cyan-500
    description: 'High intensity rainfall (>50mm/hr) generating positive pore-water pressure along shear slip planes.'
  },
  {
    name: 'Prolonged Antecedent Soil Saturation',
    percentage: 24,
    color: '#3b82f6', // blue-500
    description: '7-14 day continuous rainfall reducing soil cohesion (effective shear strength approaching zero).'
  },
  {
    name: 'Toe Erosion & Anthropogenic Road Cutting',
    percentage: 14,
    color: '#f59e0b', // amber-500
    description: 'Steep road widening without retaining gabions removing lateral slope support.'
  },
  {
    name: 'Seismicity & Neo-Tectonic Fault Slippage',
    percentage: 8,
    color: '#ef4444', // red-500
    description: 'Crustal adjustment in Main Central Thrust (MCT) and Main Boundary Thrust (MBT) zones.'
  }
];

export const REGIONAL_INVENTORY_STATS = {
  total10YearIncidents: 30200,
  westernHimalayasPct: 48.7,
  easternHimalayasPct: 27.2,
  westernGhatsPct: 24.1,
  highestYear: 2023,
  tenYearIncreasePct: 132.6,
  sourceAgency: 'Geological Survey of India (GSI) & National Remote Sensing Centre (NRSC) NLSM'
};
