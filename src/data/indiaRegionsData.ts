import { Region, SensorNode, Shelter, RescueTeam, HazardZone, AlertItem, LandCoverType, PredictionInput } from '../types';
import { calculateFloodRisk } from '../services/mlEngine';

export interface IndiaPlaceItem {
  id: string;
  name: string;
  placeName: string;
  valleyOrBasin: string;
  district: string;
  state: string;
  mountainRange: string;
  zone: 'Himalayan North' | 'Western Ghats' | 'Northeast Hills' | 'Eastern Ghats & Central';
  coordinates: [number, number]; // [lat, lng]
  elevation: number; // meters
  averageSlope: number; // degrees
  riverName: string;
  riverLevel: number;
  riverDangerMark: number;
  rainfall1h: number;
  rainfall24h: number;
  soilMoisture: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  evacuationStatus: 'Normal' | 'Advisory' | 'Evacuate Low-lying' | 'Immediate High-ground';
  catchmentAreaKm2: number;
  landCover: LandCoverType;
  nearestShelterName: string;
  rescueUnitName: string;
  popularTags: string[];
}

export const INDIA_PLACES_DATABASE: IndiaPlaceItem[] = [
  // --- HIMALAYAN NORTH: UTTARAKHAND ---
  {
    id: 'in-kedarnath',
    name: 'Mandakini Valley (Kedarnath - Rudraprayag)',
    placeName: 'Kedarnath',
    valleyOrBasin: 'Kedarnath - Gaurikund Gorge',
    district: 'Rudraprayag',
    state: 'Uttarakhand',
    mountainRange: 'Garhwal Himalayas',
    zone: 'Himalayan North',
    coordinates: [30.73, 79.06],
    elevation: 3583,
    averageSlope: 36,
    riverName: 'Mandakini River',
    riverLevel: 6.8,
    riverDangerMark: 7.0,
    rainfall1h: 44,
    rainfall24h: 195,
    soilMoisture: 86,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 125,
    landCover: 'barren_rock',
    nearestShelterName: 'Govt Higher Secondary Elevated School Camp',
    rescueUnitName: '8th Battalion NDRF Mountain Rapid Action Team',
    popularTags: ['kedarnath', 'rudraprayag', 'mandakini', 'gaurikund', 'sonprayag', 'char dham'],
  },
  {
    id: 'in-chamoli',
    name: 'Alaknanda Valley (Joshimath - Chamoli)',
    placeName: 'Chamoli / Joshimath',
    valleyOrBasin: 'Upper Alaknanda & Dhauliganga Gorge',
    district: 'Chamoli',
    state: 'Uttarakhand',
    mountainRange: 'Garhwal Himalayas',
    zone: 'Himalayan North',
    coordinates: [30.55, 79.56],
    elevation: 1890,
    averageSlope: 34,
    riverName: 'Alaknanda River',
    riverLevel: 5.9,
    riverDangerMark: 6.5,
    rainfall1h: 32,
    rainfall24h: 140,
    soilMoisture: 78,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 310,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Joshimath ITBP Emergency High Ground Camp',
    rescueUnitName: 'SDRF Uttarakhand Rapid Mountain Unit 4',
    popularTags: ['chamoli', 'joshimath', 'badrinath', 'alaknanda', 'dhauliganga', 'tapovan', 'raini'],
  },
  {
    id: 'in-uttarkashi',
    name: 'Bhagirathi Valley (Uttarkashi - Harshil)',
    placeName: 'Uttarkashi',
    valleyOrBasin: 'Bhagirathi Gorge & Assi Ganga Confluence',
    district: 'Uttarkashi',
    state: 'Uttarakhand',
    mountainRange: 'Garhwal Himalayas',
    zone: 'Himalayan North',
    coordinates: [30.72, 78.44],
    elevation: 1158,
    averageSlope: 30,
    riverName: 'Bhagirathi River',
    riverLevel: 4.8,
    riverDangerMark: 6.0,
    rainfall1h: 22,
    rainfall24h: 95,
    soilMoisture: 64,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 420,
    landCover: 'dense_forest',
    nearestShelterName: 'Uttarkashi District Sports Arena Upper Ground',
    rescueUnitName: 'Uttarakhand Disaster Response Contingent Alpha',
    popularTags: ['uttarkashi', 'bhagirathi', 'harshil', 'gangotri', 'maneri', 'bhatwari'],
  },
  {
    id: 'in-rishikesh',
    name: 'Upper Ganga Gorge (Rishikesh - Shivpuri)',
    placeName: 'Rishikesh',
    valleyOrBasin: 'Foothills Ganga Defile & Song River',
    district: 'Dehradun / Tehri',
    state: 'Uttarakhand',
    mountainRange: 'Shivalik Foothills',
    zone: 'Himalayan North',
    coordinates: [30.08, 78.26],
    elevation: 372,
    averageSlope: 18,
    riverName: 'Ganga River',
    riverLevel: 338.2,
    riverDangerMark: 340.5,
    rainfall1h: 18,
    rainfall24h: 75,
    soilMoisture: 58,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 850,
    landCover: 'urban_settlement',
    nearestShelterName: 'Muni Ki Reti Elevated Flood Relief Center',
    rescueUnitName: 'NDRF Regional Response Centre Rishikesh',
    popularTags: ['rishikesh', 'haridwar', 'shivpuri', 'laxman jhula', 'ganga', 'byasi'],
  },
  {
    id: 'in-nainital',
    name: 'Kumaon Lakes Basin (Nainital - Almora Slopes)',
    placeName: 'Nainital',
    valleyOrBasin: 'Naini Catchment & Gaula River Watershed',
    district: 'Nainital',
    state: 'Uttarakhand',
    mountainRange: 'Kumaon Himalayas',
    zone: 'Himalayan North',
    coordinates: [29.38, 79.46],
    elevation: 2084,
    averageSlope: 32,
    riverName: 'Gaula River Headwaters',
    riverLevel: 3.2,
    riverDangerMark: 4.5,
    rainfall1h: 26,
    rainfall24h: 115,
    soilMoisture: 72,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 160,
    landCover: 'dense_forest',
    nearestShelterName: 'Sherwood Ridge Community Center',
    rescueUnitName: 'Kumaon SDRF Mountain Rescue Team',
    popularTags: ['nainital', 'almora', 'bhimtal', 'kathgodam', 'gaula', 'kumaon'],
  },
  {
    id: 'in-pithoragarh',
    name: 'Kali-Gori River Basin (Dharchula - Munsiyari)',
    placeName: 'Pithoragarh',
    valleyOrBasin: 'Gori Ganga - Kali River Valley',
    district: 'Pithoragarh',
    state: 'Uttarakhand',
    mountainRange: 'Kumaon Himalayas',
    zone: 'Himalayan North',
    coordinates: [29.58, 80.21],
    elevation: 1627,
    averageSlope: 35,
    riverName: 'Kali River',
    riverLevel: 7.2,
    riverDangerMark: 8.0,
    rainfall1h: 30,
    rainfall24h: 135,
    soilMoisture: 76,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 340,
    landCover: 'barren_rock',
    nearestShelterName: 'Munsiyari Tehsil High Ground Camp',
    rescueUnitName: 'ITBP & SDRF Kali Gorge Unit',
    popularTags: ['pithoragarh', 'dharchula', 'munsiyari', 'kali river', 'goriganga'],
  },

  // --- HIMALAYAN NORTH: HIMACHAL PRADESH ---
  {
    id: 'in-kullu-manali',
    name: 'Upper Beas River Valley (Kullu - Manali Gorge)',
    placeName: 'Manali / Kullu',
    valleyOrBasin: 'Kullu - Manali Gorge & Solang Nullah',
    district: 'Kullu',
    state: 'Himachal Pradesh',
    mountainRange: 'Pir Panjal / Western Himalayas',
    zone: 'Himalayan North',
    coordinates: [32.24, 77.19],
    elevation: 2050,
    averageSlope: 29,
    riverName: 'Beas River',
    riverLevel: 4.6,
    riverDangerMark: 5.5,
    rainfall1h: 28,
    rainfall24h: 125,
    soilMoisture: 74,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 280,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Kullu District Sports Complex Upper Plateau',
    rescueUnitName: '14th Battalion NDRF Himachal Task Force',
    popularTags: ['manali', 'kullu', 'beas river', 'solang', 'rohtang', 'kasol', 'parvati valley'],
  },
  {
    id: 'in-shimla',
    name: 'Shimla Giri & Sutlej Basin (Rampur - Kumarsain)',
    placeName: 'Shimla',
    valleyOrBasin: 'Upper Giri River & Sutlej Catchment',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    mountainRange: 'Dhauladhar / Shivalik',
    zone: 'Himalayan North',
    coordinates: [31.10, 77.17],
    elevation: 2206,
    averageSlope: 27,
    riverName: 'Giri River Tributaries',
    riverLevel: 3.4,
    riverDangerMark: 4.8,
    rainfall1h: 19,
    rainfall24h: 88,
    soilMoisture: 62,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 320,
    landCover: 'dense_forest',
    nearestShelterName: 'Ridge High Ground Multipurpose Hall',
    rescueUnitName: 'Himachal Pradesh SDRF Station Shimla',
    popularTags: ['shimla', 'rampur', 'kufri', 'narkanda', 'sutlej', 'giri river'],
  },
  {
    id: 'in-dharamsala',
    name: 'Kangra Valley & Dhauladhar Slopes (Dharamsala - Palampur)',
    placeName: 'Dharamsala',
    valleyOrBasin: 'Bhagsu Nullah & Baner Khad Watershed',
    district: 'Kangra',
    state: 'Himachal Pradesh',
    mountainRange: 'Dhauladhar Range',
    zone: 'Himalayan North',
    coordinates: [32.22, 76.32],
    elevation: 1457,
    averageSlope: 33,
    riverName: 'Baner Khad River',
    riverLevel: 4.1,
    riverDangerMark: 5.0,
    rainfall1h: 36,
    rainfall24h: 160,
    soilMoisture: 80,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 190,
    landCover: 'cultivated_slope',
    nearestShelterName: 'McLeod Ganj Community High Ground Center',
    rescueUnitName: 'NDRF Task Unit Dharamsala',
    popularTags: ['dharamsala', 'mcleodganj', 'kangra', 'palampur', 'dhauladhar', 'bhagsu'],
  },
  {
    id: 'in-mandi',
    name: 'Mandi Suketi Basin (Pandoh Dam - Beas Gorge)',
    placeName: 'Mandi',
    valleyOrBasin: 'Beas River - Suketi Khad Confluence',
    district: 'Mandi',
    state: 'Himachal Pradesh',
    mountainRange: 'Middle Himalayas',
    zone: 'Himalayan North',
    coordinates: [31.70, 76.93],
    elevation: 760,
    averageSlope: 26,
    riverName: 'Beas River',
    riverLevel: 6.2,
    riverDangerMark: 7.0,
    rainfall1h: 25,
    rainfall24h: 110,
    soilMoisture: 70,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 450,
    landCover: 'urban_settlement',
    nearestShelterName: 'Paddal Ground Relief Camp Mandi',
    rescueUnitName: 'SDRF Himachal Quick Deployment Team',
    popularTags: ['mandi', 'pandoh dam', 'suketi khad', 'aut tunnel', 'beas'],
  },
  {
    id: 'in-kinnaur',
    name: 'Kinnaur Baspa Gorge (Sangla - Kalpa)',
    placeName: 'Kinnaur / Sangla',
    valleyOrBasin: 'Baspa River & Sutlej Canyon',
    district: 'Kinnaur',
    state: 'Himachal Pradesh',
    mountainRange: 'Zanskar / Greater Himalayas',
    zone: 'Himalayan North',
    coordinates: [31.54, 78.27],
    elevation: 2670,
    averageSlope: 38,
    riverName: 'Baspa River',
    riverLevel: 5.1,
    riverDangerMark: 5.8,
    rainfall1h: 31,
    rainfall24h: 130,
    soilMoisture: 73,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 240,
    landCover: 'barren_rock',
    nearestShelterName: 'Reckong Peo ITBP High Ground Complex',
    rescueUnitName: 'ITBP High Altitude Mountain Rescue Wing',
    popularTags: ['kinnaur', 'sangla', 'kalpa', 'reckong peo', 'baspa', 'spiti'],
  },

  // --- HIMALAYAN NORTH: JAMMU & KASHMIR / LADAKH ---
  {
    id: 'in-srinagar',
    name: 'Jhelum River Basin (Srinagar - Anantnag Flood Plain)',
    placeName: 'Srinagar',
    valleyOrBasin: 'Kashmir Valley & Jhelum Spill Channel',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    mountainRange: 'Pir Panjal / Zabarwan Range',
    zone: 'Himalayan North',
    coordinates: [34.08, 74.80],
    elevation: 1585,
    averageSlope: 14,
    riverName: 'Jhelum River',
    riverLevel: 19.4,
    riverDangerMark: 21.0,
    rainfall1h: 16,
    rainfall24h: 70,
    soilMoisture: 65,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 1200,
    landCover: 'urban_settlement',
    nearestShelterName: 'Amar Singh College Elevated Grounds',
    rescueUnitName: 'NDRF 13th Battalion Srinagar Unit',
    popularTags: ['srinagar', 'jhelum', 'anantnag', 'baramulla', 'dal lake', 'kashmir'],
  },
  {
    id: 'in-leh',
    name: 'Indus Valley (Leh - Choglamsar Flash Flood Plain)',
    placeName: 'Leh',
    valleyOrBasin: 'Upper Indus & Khardung Nullah Basin',
    district: 'Leh',
    state: 'Ladakh',
    mountainRange: 'Ladakh Range / Trans-Himalayas',
    zone: 'Himalayan North',
    coordinates: [34.15, 77.58],
    elevation: 3500,
    averageSlope: 28,
    riverName: 'Indus River',
    riverLevel: 3.1,
    riverDangerMark: 4.5,
    rainfall1h: 12,
    rainfall24h: 38,
    soilMoisture: 45,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 500,
    landCover: 'barren_rock',
    nearestShelterName: 'Choglamsar Disaster High Ridge Pavilion',
    rescueUnitName: 'Ladakh Scouts & UT Disaster Response Team',
    popularTags: ['leh', 'ladakh', 'indus', 'choglamsar', 'nubra', 'pangong'],
  },
  {
    id: 'in-doda',
    name: 'Chenab Gorge (Doda - Kishtwar Valley)',
    placeName: 'Doda / Kishtwar',
    valleyOrBasin: 'Chenab River Deep Canyon & Marusudar Basin',
    district: 'Doda',
    state: 'Jammu & Kashmir',
    mountainRange: 'Pir Panjal Range',
    zone: 'Himalayan North',
    coordinates: [33.14, 75.54],
    elevation: 1107,
    averageSlope: 35,
    riverName: 'Chenab River',
    riverLevel: 8.4,
    riverDangerMark: 9.2,
    rainfall1h: 27,
    rainfall24h: 118,
    soilMoisture: 75,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 600,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Doda Govt Degree College Elevated Campus',
    rescueUnitName: 'SDRF Jammu & Kashmir Alpine Unit',
    popularTags: ['doda', 'kishtwar', 'chenab', 'ramban', 'batote'],
  },

  // --- WESTERN GHATS: KERALA ---
  {
    id: 'in-wayanad',
    name: 'Wayanad Chaliyar Basin (Meppadi - Chooralmala)',
    placeName: 'Wayanad',
    valleyOrBasin: 'Meppadi - Chooralmala - Mundakkai Basin',
    district: 'Wayanad',
    state: 'Kerala',
    mountainRange: 'Western Ghats',
    zone: 'Western Ghats',
    coordinates: [11.52, 76.13],
    elevation: 940,
    averageSlope: 32,
    riverName: 'Chaliyar Tributaries & Iruvanjippuzha',
    riverLevel: 6.1,
    riverDangerMark: 6.2,
    rainfall1h: 46,
    rainfall24h: 230,
    soilMoisture: 91,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 180,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Meppadi Elevated Community Hall & Relief Camp',
    rescueUnitName: '4th Battalion NDRF Arakkonam deployed in Wayanad',
    popularTags: ['wayanad', 'meppadi', 'chooralmala', 'mundakkai', 'chaliyar', 'kalpetta', 'vythiri'],
  },
  {
    id: 'in-munnar',
    name: 'Idukki Muthirapuzha Basin (Munnar - Devikulam)',
    placeName: 'Munnar',
    valleyOrBasin: 'Muthirapuzha & Nallathanni River Confluence',
    district: 'Idukki',
    state: 'Kerala',
    mountainRange: 'Cardamom Hills / Western Ghats',
    zone: 'Western Ghats',
    coordinates: [10.08, 77.06],
    elevation: 1532,
    averageSlope: 31,
    riverName: 'Muthirapuzha River',
    riverLevel: 4.9,
    riverDangerMark: 5.2,
    rainfall1h: 39,
    rainfall24h: 180,
    soilMoisture: 88,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 210,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Munnar Tea Board High Ridge Auditorium',
    rescueUnitName: 'Kerala Fire & Rescue High Altitude Squad Idukki',
    popularTags: ['munnar', 'idukki', 'devikulam', 'pettimudi', 'periyar', 'muthirapuzha'],
  },
  {
    id: 'in-idukki-dam',
    name: 'Periyar River Gorge (Idukki Dam - Cheruthoni Basin)',
    placeName: 'Idukki Dam',
    valleyOrBasin: 'Periyar Catchment & Cheruthoni Spillway',
    district: 'Idukki',
    state: 'Kerala',
    mountainRange: 'Western Ghats',
    zone: 'Western Ghats',
    coordinates: [9.84, 76.97],
    elevation: 720,
    averageSlope: 30,
    riverName: 'Periyar River',
    riverLevel: 2398.5,
    riverDangerMark: 2403.0,
    rainfall1h: 29,
    rainfall24h: 135,
    soilMoisture: 79,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 650,
    landCover: 'dense_forest',
    nearestShelterName: 'Cheruthoni St. George High Ground Center',
    rescueUnitName: 'Kerala SDRF & KSEB Dam Safety Taskforce',
    popularTags: ['idukki dam', 'cheruthoni', 'periyar', 'kattappana', 'painavu'],
  },

  // --- WESTERN GHATS: TAMIL NADU ---
  {
    id: 'in-nilgiris',
    name: 'Nilgiris Coonoor Drainage (Coonoor - Ooty Kallar)',
    placeName: 'Coonoor / Ooty',
    valleyOrBasin: 'Coonoor River & Kallar Stream Basin',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    mountainRange: 'Nilgiri Hills',
    zone: 'Western Ghats',
    coordinates: [11.35, 76.79],
    elevation: 1850,
    averageSlope: 24,
    riverName: 'Kallar River',
    riverLevel: 2.1,
    riverDangerMark: 4.2,
    rainfall1h: 9,
    rainfall24h: 38,
    soilMoisture: 48,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 175,
    landCover: 'dense_forest',
    nearestShelterName: 'Coonoor Tea Board High Ground Complex',
    rescueUnitName: 'Tamil Nadu Fire & Rescue Mountain Squad Nilgiris',
    popularTags: ['nilgiris', 'coonoor', 'ooty', 'udhagamandalam', 'kotagiri', 'kallar'],
  },
  {
    id: 'in-kodaikanal',
    name: 'Palani Hills Watershed (Kodaikanal - Gundar Valley)',
    placeName: 'Kodaikanal',
    valleyOrBasin: 'Gundar Falls & Vaigai Catchment',
    district: 'Dindigul',
    state: 'Tamil Nadu',
    mountainRange: 'Palani Hills / Western Ghats',
    zone: 'Western Ghats',
    coordinates: [10.23, 77.48],
    elevation: 2133,
    averageSlope: 26,
    riverName: 'Gundar Stream',
    riverLevel: 2.6,
    riverDangerMark: 4.0,
    rainfall1h: 14,
    rainfall24h: 62,
    soilMoisture: 52,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 140,
    landCover: 'dense_forest',
    nearestShelterName: 'Kodaikanal Municipal Hill Pavilion',
    rescueUnitName: 'Dindigul District Disaster Response Team',
    popularTags: ['kodaikanal', 'palani hills', 'dindigul', 'vaigai', 'gundar'],
  },

  // --- WESTERN GHATS: KARNATAKA ---
  {
    id: 'in-coorg',
    name: 'Cauvery Headwaters (Coorg / Kodagu - Madikeri)',
    placeName: 'Coorg (Madikeri)',
    valleyOrBasin: 'Upper Cauvery & Harangi River Basin',
    district: 'Kodagu',
    state: 'Karnataka',
    mountainRange: 'Brahmagiri / Western Ghats',
    zone: 'Western Ghats',
    coordinates: [12.42, 75.73],
    elevation: 1150,
    averageSlope: 27,
    riverName: 'Cauvery River',
    riverLevel: 4.2,
    riverDangerMark: 5.5,
    rainfall1h: 24,
    rainfall24h: 105,
    soilMoisture: 69,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 380,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Madikeri General Thimayya Stadium Camp',
    rescueUnitName: 'Karnataka State Disaster Response Force Kodagu Team',
    popularTags: ['coorg', 'kodagu', 'madikeri', 'cauvery', 'talacauvery', 'kushalnagar', 'harangi'],
  },
  {
    id: 'in-agumbe',
    name: 'Agumbe Rain Corridor (Tirthahalli - Sita River)',
    placeName: 'Agumbe',
    valleyOrBasin: 'Sita River Watershed & Ghat Escarpment',
    district: 'Shivamogga',
    state: 'Karnataka',
    mountainRange: 'Central Western Ghats',
    zone: 'Western Ghats',
    coordinates: [13.50, 75.09],
    elevation: 826,
    averageSlope: 30,
    riverName: 'Sita River',
    riverLevel: 5.2,
    riverDangerMark: 5.8,
    rainfall1h: 38,
    rainfall24h: 175,
    soilMoisture: 84,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 130,
    landCover: 'dense_forest',
    nearestShelterName: 'Agumbe Higher Primary School High Ground',
    rescueUnitName: 'Shivamogga Emergency Quick Response Team',
    popularTags: ['agumbe', 'shivamogga', 'shimoga', 'sita river', 'tirthahalli', 'cherrapunji of south'],
  },

  // --- WESTERN GHATS: MAHARASHTRA ---
  {
    id: 'in-mahabaleshwar',
    name: 'Krishna Headwaters (Mahabaleshwar - Panchgani)',
    placeName: 'Mahabaleshwar',
    valleyOrBasin: 'Krishna River & Koyna Catchment',
    district: 'Satara',
    state: 'Maharashtra',
    mountainRange: 'Sahyadri / Western Ghats',
    zone: 'Western Ghats',
    coordinates: [17.92, 73.65],
    elevation: 1353,
    averageSlope: 28,
    riverName: 'Krishna River Headwaters',
    riverLevel: 3.8,
    riverDangerMark: 4.8,
    rainfall1h: 28,
    rainfall24h: 130,
    soilMoisture: 72,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 260,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Panchgani Elevated Community Town Hall',
    rescueUnitName: 'Maharashtra SDRF Satara Division',
    popularTags: ['mahabaleshwar', 'panchgani', 'satara', 'krishna river', 'koyna', 'wai'],
  },
  {
    id: 'in-lonavala',
    name: 'Sahyadri Ghat Escarpment (Lonavala - Khandala)',
    placeName: 'Lonavala',
    valleyOrBasin: 'Indrayani River & Amba River Gorge',
    district: 'Pune',
    state: 'Maharashtra',
    mountainRange: 'Sahyadri / Bhor Ghat',
    zone: 'Western Ghats',
    coordinates: [18.75, 73.40],
    elevation: 624,
    averageSlope: 29,
    riverName: 'Indrayani River',
    riverLevel: 3.5,
    riverDangerMark: 4.5,
    rainfall1h: 22,
    rainfall24h: 98,
    soilMoisture: 66,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 210,
    landCover: 'urban_settlement',
    nearestShelterName: 'Lonavala Municipal High Ground Camp',
    rescueUnitName: 'Pune District Flood Rescue Team',
    popularTags: ['lonavala', 'khandala', 'pune', 'bhor ghat', 'bhushi dam', 'indrayani'],
  },

  // --- NORTHEAST INDIA: SIKKIM ---
  {
    id: 'in-teesta',
    name: 'Teesta River Basin (Mangan - Chungthang - Gangtok)',
    placeName: 'Gangtok / Mangan',
    valleyOrBasin: 'Teesta River Gorge & Lachen-Lachung Confluence',
    district: 'North Sikkim / Gangtok',
    state: 'Sikkim',
    mountainRange: 'Eastern Himalayas',
    zone: 'Northeast Hills',
    coordinates: [27.51, 88.53],
    elevation: 1620,
    averageSlope: 37,
    riverName: 'Teesta River',
    riverLevel: 8.4,
    riverDangerMark: 9.5,
    rainfall1h: 31,
    rainfall24h: 145,
    soilMoisture: 79,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 480,
    landCover: 'barren_rock',
    nearestShelterName: 'Mangan Administrative High Ground Complex',
    rescueUnitName: 'NDRF 2nd Battalion Mountain Wing Sikkim',
    popularTags: ['gangtok', 'sikkim', 'mangan', 'chungthang', 'teesta', 'lachen', 'lachung', 'singtam'],
  },

  // --- NORTHEAST INDIA: ASSAM ---
  {
    id: 'in-guwahati',
    name: 'Brahmaputra Valley (Guwahati - Kamrup Foothills)',
    placeName: 'Guwahati',
    valleyOrBasin: 'Brahmaputra Flood Plain & Bharalu Stream',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    mountainRange: 'Assam Valley & Meghalaya Foothills',
    zone: 'Northeast Hills',
    coordinates: [26.14, 91.73],
    elevation: 55,
    averageSlope: 16,
    riverName: 'Brahmaputra River',
    riverLevel: 49.8,
    riverDangerMark: 50.5,
    rainfall1h: 34,
    rainfall24h: 150,
    soilMoisture: 82,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 1800,
    landCover: 'urban_settlement',
    nearestShelterName: 'Khanapara Elevated Administrative Ground',
    rescueUnitName: '1st Battalion NDRF Patgaon Guwahati',
    popularTags: ['guwahati', 'assam', 'brahmaputra', 'kamrup', 'dispur', 'bharalu', 'jalukbari'],
  },
  {
    id: 'in-silchar',
    name: 'Barak River Basin (Silchar - Cachar Hills)',
    placeName: 'Silchar',
    valleyOrBasin: 'Barak River Basin & Bethukandi Dyke Area',
    district: 'Cachar',
    state: 'Assam',
    mountainRange: 'Barail Range / Southern Assam',
    zone: 'Northeast Hills',
    coordinates: [24.83, 92.77],
    elevation: 25,
    averageSlope: 15,
    riverName: 'Barak River',
    riverLevel: 19.9,
    riverDangerMark: 19.83,
    rainfall1h: 40,
    rainfall24h: 190,
    soilMoisture: 89,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 720,
    landCover: 'urban_settlement',
    nearestShelterName: 'Silchar Circuit House High Ground Campus',
    rescueUnitName: 'NDRF & Assam SDRF Cachar Water Team',
    popularTags: ['silchar', 'cachar', 'barak valley', 'barak river', 'khalibari', 'karimganj'],
  },

  // --- NORTHEAST INDIA: MEGHALAYA ---
  {
    id: 'in-cherrapunji',
    name: 'Meghalaya High Rainfall Plateau (Cherrapunji / Sohra)',
    placeName: 'Cherrapunji (Sohra)',
    valleyOrBasin: 'Sohra Escarpment & Shella River Gorges',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    mountainRange: 'Khasi Hills',
    zone: 'Northeast Hills',
    coordinates: [25.29, 91.73],
    elevation: 1430,
    averageSlope: 35,
    riverName: 'Shella & Wahrew Rivers',
    riverLevel: 6.8,
    riverDangerMark: 7.2,
    rainfall1h: 52,
    rainfall24h: 280,
    soilMoisture: 93,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 195,
    landCover: 'barren_rock',
    nearestShelterName: 'Sohra Ramakrishna Mission Elevated Complex',
    rescueUnitName: 'Meghalaya State Disaster Response Force Khasi Unit',
    popularTags: ['cherrapunji', 'sohra', 'shillong', 'mawsynram', 'khasi hills', 'meghalaya', 'nohkalikai'],
  },
  {
    id: 'in-shillong',
    name: 'East Khasi Hills Basin (Shillong - Umshyrpi Valley)',
    placeName: 'Shillong',
    valleyOrBasin: 'Umshyrpi & Wahumkhrah Watershed',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    mountainRange: 'Khasi Hills',
    zone: 'Northeast Hills',
    coordinates: [25.57, 91.88],
    elevation: 1525,
    averageSlope: 22,
    riverName: 'Umshyrpi River',
    riverLevel: 3.2,
    riverDangerMark: 4.5,
    rainfall1h: 21,
    rainfall24h: 92,
    soilMoisture: 68,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 110,
    landCover: 'urban_settlement',
    nearestShelterName: 'Polo Ground Elevated Indoor Stadium',
    rescueUnitName: 'Meghalaya SDRF Headquarters Shillong',
    popularTags: ['shillong', 'khasi hills', 'umiam', 'elephanta falls', 'meghalaya'],
  },

  // --- NORTHEAST INDIA: ARUNACHAL PRADESH ---
  {
    id: 'in-tawang',
    name: 'Kameng Basin (Tawang - Dirang Valley)',
    placeName: 'Tawang',
    valleyOrBasin: 'Tawang Chu & Kameng River Valley',
    district: 'Tawang',
    state: 'Arunachal Pradesh',
    mountainRange: 'Eastern Himalayas',
    zone: 'Northeast Hills',
    coordinates: [27.58, 91.86],
    elevation: 3048,
    averageSlope: 36,
    riverName: 'Tawang Chu River',
    riverLevel: 5.1,
    riverDangerMark: 6.0,
    rainfall1h: 26,
    rainfall24h: 120,
    soilMoisture: 72,
    riskLevel: 'MEDIUM',
    evacuationStatus: 'Advisory',
    catchmentAreaKm2: 290,
    landCover: 'barren_rock',
    nearestShelterName: 'Tawang Monastery Upper Ridge Camp',
    rescueUnitName: 'Indian Army & Arunachal Disaster Team',
    popularTags: ['tawang', 'arunachal', 'kameng', 'dirang', 'bomdila', 'sela pass'],
  },
  {
    id: 'in-pasighat',
    name: 'Siang River Basin (Pasighat - Upper Siang)',
    placeName: 'Pasighat',
    valleyOrBasin: 'Siang River (Tsangpo) Himalayan Defile',
    district: 'East Siang',
    state: 'Arunachal Pradesh',
    mountainRange: 'Eastern Himalayas',
    zone: 'Northeast Hills',
    coordinates: [28.06, 95.32],
    elevation: 153,
    averageSlope: 25,
    riverName: 'Siang River',
    riverLevel: 153.2,
    riverDangerMark: 154.0,
    rainfall1h: 38,
    rainfall24h: 170,
    soilMoisture: 84,
    riskLevel: 'HIGH',
    evacuationStatus: 'Immediate High-ground',
    catchmentAreaKm2: 1100,
    landCover: 'dense_forest',
    nearestShelterName: 'Pasighat General Field Elevated High Ground',
    rescueUnitName: '12th Battalion NDRF Itanagar Unit',
    popularTags: ['pasighat', 'siang', 'arunachal', 'tsangpo', 'brahmaputra headwaters', 'yingkiong'],
  },

  // --- EASTERN GHATS & CENTRAL: WEST BENGAL ---
  {
    id: 'in-darjeeling',
    name: 'Darjeeling Slopes (Darjeeling - Kalimpong Rangeet Basin)',
    placeName: 'Darjeeling / Kalimpong',
    valleyOrBasin: 'Great Rangeet & Teesta Confluence',
    district: 'Darjeeling',
    state: 'West Bengal',
    mountainRange: 'Sub-Himalayan West Bengal',
    zone: 'Eastern Ghats & Central',
    coordinates: [27.04, 88.26],
    elevation: 2042,
    averageSlope: 34,
    riverName: 'Great Rangeet River',
    riverLevel: 5.6,
    riverDangerMark: 6.4,
    rainfall1h: 33,
    rainfall24h: 155,
    soilMoisture: 81,
    riskLevel: 'HIGH',
    evacuationStatus: 'Evacuate Low-lying',
    catchmentAreaKm2: 240,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Darjeeling Gymnasium Hilltop Pavilion',
    rescueUnitName: 'West Bengal Disaster Management Brigade Darjeeling',
    popularTags: ['darjeeling', 'kalimpong', 'kurseong', 'mirik', 'teesta', 'rangeet', 'west bengal'],
  },

  // --- EASTERN GHATS: ANDHRA PRADESH / ODISHA ---
  {
    id: 'in-araku',
    name: 'Araku Valley Basin (Araku - Gosthani Catchment)',
    placeName: 'Araku Valley',
    valleyOrBasin: 'Gosthani River & Chaparai Cascades Basin',
    district: 'Alluri Sitharama Raju',
    state: 'Andhra Pradesh',
    mountainRange: 'Eastern Ghats',
    zone: 'Eastern Ghats & Central',
    coordinates: [18.33, 82.87],
    elevation: 911,
    averageSlope: 23,
    riverName: 'Gosthani River',
    riverLevel: 3.1,
    riverDangerMark: 4.5,
    rainfall1h: 15,
    rainfall24h: 68,
    soilMoisture: 54,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 190,
    landCover: 'cultivated_slope',
    nearestShelterName: 'Araku Tribal High School Elevated Dormitory',
    rescueUnitName: 'AP SDRF Visakhapatnam Foothills Battalion',
    popularTags: ['araku', 'araku valley', 'andhra pradesh', 'visakhapatnam', 'vizag', 'gosthani', 'eastern ghats'],
  },
  {
    id: 'in-koraput',
    name: 'Koraput Plateau (Rayagada - Nagavali Basin)',
    placeName: 'Koraput / Rayagada',
    valleyOrBasin: 'Nagavali & Kolab River Watershed',
    district: 'Koraput',
    state: 'Odisha',
    mountainRange: 'Eastern Ghats / Deomali',
    zone: 'Eastern Ghats & Central',
    coordinates: [18.81, 82.71],
    elevation: 870,
    averageSlope: 25,
    riverName: 'Kolab River',
    riverLevel: 4.4,
    riverDangerMark: 5.6,
    rainfall1h: 20,
    rainfall24h: 88,
    soilMoisture: 63,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 310,
    landCover: 'dense_forest',
    nearestShelterName: 'Koraput Stadium Safe Haven Camp',
    rescueUnitName: 'ODRAF (Odisha Disaster Rapid Action Force)',
    popularTags: ['koraput', 'rayagada', 'odisha', 'nagavali', 'kolab', 'deomali'],
  },

  // --- CENTRAL INDIA / RAJASTHAN ---
  {
    id: 'in-pachmarhi',
    name: 'Satpura Hills Catchment (Pachmarhi - Denwa Basin)',
    placeName: 'Pachmarhi',
    valleyOrBasin: 'Denwa River & Bada Mahadev Gorges',
    district: 'Narmadapuram (Hoshangabad)',
    state: 'Madhya Pradesh',
    mountainRange: 'Satpura Range',
    zone: 'Eastern Ghats & Central',
    coordinates: [22.46, 78.43],
    elevation: 1067,
    averageSlope: 25,
    riverName: 'Denwa River',
    riverLevel: 3.6,
    riverDangerMark: 5.0,
    rainfall1h: 18,
    rainfall24h: 82,
    soilMoisture: 60,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 220,
    landCover: 'dense_forest',
    nearestShelterName: 'Pachmarhi Cantonment High Ground Hall',
    rescueUnitName: 'Madhya Pradesh SDRF Narmada Division',
    popularTags: ['pachmarhi', 'satpura', 'madhya pradesh', 'denwa', 'narmadapuram'],
  },
  {
    id: 'in-mount-abu',
    name: 'Aravalli Escarpment (Mount Abu - Nakki Basin)',
    placeName: 'Mount Abu',
    valleyOrBasin: 'West Banas River Watershed',
    district: 'Sirohi',
    state: 'Rajasthan',
    mountainRange: 'Aravalli Range',
    zone: 'Eastern Ghats & Central',
    coordinates: [24.59, 72.71],
    elevation: 1220,
    averageSlope: 24,
    riverName: 'West Banas Tributaries',
    riverLevel: 2.8,
    riverDangerMark: 4.2,
    rainfall1h: 12,
    rainfall24h: 55,
    soilMoisture: 46,
    riskLevel: 'LOW',
    evacuationStatus: 'Normal',
    catchmentAreaKm2: 110,
    landCover: 'sparse_vegetation',
    nearestShelterName: 'Mount Abu Municipal High Ridge Center',
    rescueUnitName: 'Rajasthan SDRF Mount Abu Unit',
    popularTags: ['mount abu', 'aravalli', 'sirohi', 'rajasthan', 'nakki lake'],
  },
];

/**
 * Searches the curated Indian place database.
 * If no direct curated match is found, creates a realistic dynamic place model for any Indian location.
 */
export function searchIndiaPlaces(rawQuery: string): IndiaPlaceItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return INDIA_PLACES_DATABASE.slice(0, 8);

  const matched = INDIA_PLACES_DATABASE.filter((item) => {
    return (
      item.placeName.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.valleyOrBasin.toLowerCase().includes(query) ||
      item.state.toLowerCase().includes(query) ||
      item.district.toLowerCase().includes(query) ||
      item.riverName.toLowerCase().includes(query) ||
      item.mountainRange.toLowerCase().includes(query) ||
      item.popularTags.some((tag) => tag.includes(query))
    );
  });

  // If match found, return matches
  if (matched.length > 0) {
    return matched;
  }

  // If query is at least 2 characters and doesn't match pre-stored items, generate a synthesized Indian location
  const dynamicItem = generateDynamicIndiaPlace(rawQuery);
  return [dynamicItem, ...INDIA_PLACES_DATABASE.slice(0, 4)];
}

/**
 * Deterministically generates a realistic Indian region for ANY queried place name
 */
export function generateDynamicIndiaPlace(placeName: string): IndiaPlaceItem {
  const cleanName = placeName.trim();
  const lower = cleanName.toLowerCase();
  const hash = Array.from(cleanName).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Guess zone & state based on common keywords
  let zone: IndiaPlaceItem['zone'] = 'Himalayan North';
  let state = 'Uttarakhand';
  let mountainRange = 'Northern Himalayas';
  let baseElevation = 1800;
  let baseSlope = 28;
  let river = `${cleanName} Khad River`;

  if (lower.includes('kerala') || lower.includes('wayanad') || lower.includes('idukki') || lower.includes('kochi')) {
    zone = 'Western Ghats';
    state = 'Kerala';
    mountainRange = 'Western Ghats';
    baseElevation = 980;
    river = `${cleanName} Puzha River`;
  } else if (lower.includes('tamil') || lower.includes('ooty') || lower.includes('coonoor')) {
    zone = 'Western Ghats';
    state = 'Tamil Nadu';
    mountainRange = 'Nilgiri Hills';
    baseElevation = 1750;
  } else if (lower.includes('karnataka') || lower.includes('coorg') || lower.includes('chikmagalur')) {
    zone = 'Western Ghats';
    state = 'Karnataka';
    mountainRange = 'Western Ghats';
    baseElevation = 1100;
  } else if (lower.includes('himachal') || lower.includes('manali') || lower.includes('shimla') || lower.includes('kullu')) {
    zone = 'Himalayan North';
    state = 'Himachal Pradesh';
    mountainRange = 'Pir Panjal Range';
    baseElevation = 2100;
  } else if (lower.includes('kashmir') || lower.includes('ladakh') || lower.includes('srinagar')) {
    zone = 'Himalayan North';
    state = 'Jammu & Kashmir';
    mountainRange = 'Zanskar / Pir Panjal';
    baseElevation = 1900;
  } else if (lower.includes('assam') || lower.includes('sikkim') || lower.includes('meghalaya') || lower.includes('guwahati') || lower.includes('shillong')) {
    zone = 'Northeast Hills';
    state = 'Assam';
    mountainRange = 'Eastern Himalayas';
    baseElevation = 600;
  } else if (lower.includes('maharashtra') || lower.includes('pune') || lower.includes('mumbai') || lower.includes('lonavala')) {
    zone = 'Western Ghats';
    state = 'Maharashtra';
    mountainRange = 'Sahyadri Range';
    baseElevation = 750;
  }

  // Derive coordinates roughly centered in India or mountain belts
  const lat = 20.0 + (hash % 1200) / 100; // ~20.0 to 32.0 (India lat)
  const lng = 74.0 + ((hash * 3) % 1800) / 100; // ~74.0 to 92.0 (India lng)

  const rainfall1h = 15 + (hash % 35); // 15 - 50 mm/hr
  const rainfall24h = rainfall1h * 4 + 40;
  const soilMoisture = 50 + (hash % 45); // 50 - 95%
  const averageSlope = Math.max(16, Math.min(42, baseSlope + (hash % 15) - 7));
  const elevation = Math.max(300, baseElevation + (hash % 600) - 300);

  const dangerMark = 5.0 + (hash % 30) / 10;
  const riverLevel = dangerMark - 0.2 - ((hash % 15) / 10);

  let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  let evacuationStatus: Region['evacuationStatus'] = 'Advisory';

  if (rainfall1h > 35 || soilMoisture > 82 || riverLevel >= dangerMark - 0.4) {
    riskLevel = 'HIGH';
    evacuationStatus = 'Immediate High-ground';
  } else if (rainfall1h < 20 && soilMoisture < 65) {
    riskLevel = 'LOW';
    evacuationStatus = 'Normal';
  }

  return {
    id: `in-${lower.replace(/[^a-z0-9]/g, '-') || 'custom'}-${hash % 10000}`,
    name: `${cleanName} Catchment & Valley`,
    placeName: cleanName,
    valleyOrBasin: `${cleanName} River Basin & Drainage`,
    district: cleanName,
    state,
    mountainRange,
    zone,
    coordinates: [Number(lat.toFixed(2)), Number(lng.toFixed(2))],
    elevation,
    averageSlope,
    riverName: river,
    riverLevel: Number(riverLevel.toFixed(1)),
    riverDangerMark: Number(dangerMark.toFixed(1)),
    rainfall1h,
    rainfall24h,
    soilMoisture,
    riskLevel,
    evacuationStatus,
    catchmentAreaKm2: 120 + (hash % 300),
    landCover: averageSlope > 30 ? 'barren_rock' : 'cultivated_slope',
    nearestShelterName: `${cleanName} District High Ground Community Camp`,
    rescueUnitName: `NDRF & SDRF Sector Response Team for ${cleanName}`,
    popularTags: [lower, cleanName.toLowerCase(), state.toLowerCase(), mountainRange.toLowerCase()],
  };
}

/**
 * Converts an IndiaPlaceItem into a full Region object compatible with the existing application state
 */
export function convertPlaceToRegion(place: IndiaPlaceItem): Region {
  return {
    id: place.id,
    name: place.name,
    valleyOrBasin: place.valleyOrBasin,
    state: place.state,
    mountainRange: place.mountainRange,
    coordinates: place.coordinates,
    riskLevel: place.riskLevel,
    rainfall1h: place.rainfall1h,
    rainfall24h: place.rainfall24h,
    soilMoisture: place.soilMoisture,
    averageSlope: place.averageSlope,
    elevation: place.elevation,
    riverName: place.riverName,
    riverLevel: place.riverLevel,
    riverDangerMark: place.riverDangerMark,
    evacuationStatus: place.evacuationStatus,
    lastUpdated: 'Live Active Telemetry',
  };
}

/**
 * Computes full multi-source ML flash flood prediction for a place
 */
export function predictFlashFloodForPlace(place: IndiaPlaceItem) {
  const input: PredictionInput = {
    rainfall1h: place.rainfall1h,
    rainfall3h: Math.round(place.rainfall1h * 2.2),
    rainfall24h: place.rainfall24h,
    soilMoisture: place.soilMoisture,
    elevation: place.elevation,
    slope: place.averageSlope,
    riverLevel: place.riverLevel,
    riverDangerMark: place.riverDangerMark,
    distanceFromRiver: Math.max(50, 400 - place.averageSlope * 8),
    landCover: place.landCover,
    historicalFloodFreq: place.riskLevel === 'HIGH' ? 4 : place.riskLevel === 'MEDIUM' ? 2 : 1,
    catchmentAreaKm2: place.catchmentAreaKm2,
  };

  const result = calculateFloodRisk(input);
  return { input, result };
}

/**
 * Generates auxiliary sensors, shelters, rescue team, hazard zones, and alert items for this region
 */
export function generateAuxiliaryDataForPlace(place: IndiaPlaceItem) {
  const [lat, lng] = place.coordinates;

  const sensor1: SensorNode = {
    id: `ESP32-RAIN-${place.id.slice(-6).toUpperCase()}`,
    name: `${place.placeName} High Ridge Rain Gauge Node`,
    regionId: place.id,
    type: 'rainfall_tipping',
    lat: Number((lat + 0.008).toFixed(4)),
    lng: Number((lng - 0.006).toFixed(4)),
    value: place.rainfall1h,
    unit: 'mm/hr',
    threshold: 25.0,
    batteryPct: 94,
    signalQuality: 'Excellent',
    status: place.rainfall1h >= 30 ? 'Critical' : place.rainfall1h >= 20 ? 'Warning' : 'Normal',
    hardwareModel: 'ESP32-S3 IoT LoRa 868MHz + Davis Tipping Collector',
    lastPing: '1 min ago',
  };

  const sensor2: SensorNode = {
    id: `ESP32-STAGE-${place.id.slice(-6).toUpperCase()}`,
    name: `${place.riverName} Ultrasonic Radar Stage Gauge`,
    regionId: place.id,
    type: 'ultrasonic_water_level',
    lat: Number((lat - 0.005).toFixed(4)),
    lng: Number((lng + 0.007).toFixed(4)),
    value: place.riverLevel,
    unit: 'meters',
    threshold: place.riverDangerMark - 0.5,
    batteryPct: 89,
    signalQuality: 'Good',
    status: place.riverLevel >= place.riverDangerMark ? 'Critical' : place.riverLevel >= place.riverDangerMark - 0.8 ? 'Warning' : 'Normal',
    hardwareModel: 'ESP32-C3 Radar River Stage Gauge + Solar MPPT',
    lastPing: '2 mins ago',
  };

  const sensor3: SensorNode = {
    id: `ESP32-SOIL-${place.id.slice(-6).toUpperCase()}`,
    name: `${place.placeName} Valley Soil Moisture Array`,
    regionId: place.id,
    type: 'capacitive_soil',
    lat: Number((lat + 0.012).toFixed(4)),
    lng: Number((lng + 0.003).toFixed(4)),
    value: place.soilMoisture,
    unit: '% saturation',
    threshold: 75.0,
    batteryPct: 96,
    signalQuality: 'Excellent',
    status: place.soilMoisture >= 80 ? 'Critical' : place.soilMoisture >= 65 ? 'Warning' : 'Normal',
    hardwareModel: 'Campbell TDR Soil Probe + Deep Sleep LoRaWAN',
    lastPing: '3 mins ago',
  };

  const shelter: Shelter = {
    id: `sh-${place.id}`,
    name: place.nearestShelterName,
    regionId: place.id,
    regionName: place.name,
    lat: Number((lat + 0.015).toFixed(4)),
    lng: Number((lng + 0.012).toFixed(4)),
    capacity: 500,
    currentOccupancy: place.riskLevel === 'HIGH' ? 280 : place.riskLevel === 'MEDIUM' ? 80 : 25,
    elevationM: place.elevation + 120,
    heightAboveRiverM: 145,
    contactPerson: 'Disaster Relief Officer In-Charge',
    contactPhone: '+91 94120 78421',
    amenities: ['Emergency Solar Microgrid', 'Purified RO Water', 'First Aid Medical Kit', 'Satellite Telephony'],
    status: place.riskLevel === 'HIGH' ? 'Open' : 'Open',
  };

  const rescueTeam: RescueTeam = {
    id: `rt-${place.id}`,
    callSign: `NDRF-${place.id.slice(-4).toUpperCase()}`,
    unitName: place.rescueUnitName,
    regionId: place.id,
    regionName: place.name,
    membersCount: 32,
    status: place.riskLevel === 'HIGH' ? 'Deploying Boats' : place.riskLevel === 'MEDIUM' ? 'En Route' : 'Standby',
    lat: Number((lat - 0.008).toFixed(4)),
    lng: Number((lng - 0.004).toFixed(4)),
    commander: 'Deputy Commandant Regional Battalion',
    contactPhone: '+91 94111 55902',
    equipment: ['4x Inflatable IRBs', 'Thermal Night Drones', 'High-Angle Rope Rescue Sets', 'Satellite PTT Comm'],
    assignedSector: `${place.placeName} River Corridor & Low-Lying Habitations`,
    lastUpdated: '3 mins ago',
  };

  const hazardZone: HazardZone = {
    id: `hz-${place.id}`,
    regionId: place.id,
    name: `${place.placeName} High Runoff & Flash Flood Corridor`,
    coordinates: [
      [Number((lat + 0.02).toFixed(4)), Number((lng - 0.02).toFixed(4))],
      [Number((lat + 0.02).toFixed(4)), Number((lng + 0.02).toFixed(4))],
      [Number((lat - 0.02).toFixed(4)), Number((lng + 0.02).toFixed(4))],
      [Number((lat - 0.02).toFixed(4)), Number((lng - 0.02).toFixed(4))],
    ],
    riskLevel: place.riskLevel,
    elevationM: place.elevation,
    slopeDeg: place.averageSlope,
    vulnerabilityReason: `Steep ${place.averageSlope}° slope, high runoff rate into ${place.riverName}.`,
  };

  const alertItem: AlertItem = {
    id: `alert-${place.id}`,
    regionId: place.id,
    regionName: place.name,
    severity: place.riskLevel === 'HIGH' ? 'Emergency' : place.riskLevel === 'MEDIUM' ? 'Watch' : 'Advisory',
    headline: `${place.riskLevel === 'HIGH' ? 'RED ALERT: FLASH FLOOD EMERGENCY' : place.riskLevel === 'MEDIUM' ? 'ORANGE ALERT: RAPID RUNOFF WATCH' : 'GREEN ADVISORY: NORMAL SURVEILLANCE'} - ${place.placeName.toUpperCase()}`,
    message: `Multi-source telemetry at ${place.placeName}: Rainfall intensity is ${place.rainfall1h} mm/hr, Antecedent soil moisture is ${place.soilMoisture}%, and ${place.riverName} stage is ${place.riverLevel}m (Danger mark: ${place.riverDangerMark}m).`,
    issuedAt: '5 mins ago',
    expiresAt: 'In 4 hours',
    affectedRivers: [place.riverName],
    actionRequired: place.evacuationStatus === 'Immediate High-ground' ? `Evacuate riverbank low-lying areas immediately to ${place.nearestShelterName}.` : 'Maintain active VHF radio watch and monitor stream water marks.',
    active: true,
  };

  return {
    sensors: [sensor1, sensor2, sensor3],
    shelter,
    rescueTeam,
    hazardZone,
    alertItem,
  };
}
