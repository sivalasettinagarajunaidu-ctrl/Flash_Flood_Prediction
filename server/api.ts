import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { calculateFloodRisk } from '../src/services/mlEngine';
import { PredictionInput } from '../src/types';
import {
  REGIONS,
  SENSOR_NODES,
  ACTIVE_ALERTS,
  SHELTERS,
  RESCUE_TEAMS,
  HISTORICAL_FLOODS,
  INITIAL_SOS_QUEUE,
} from '../src/data/mockData';
import { getAllImdHillyDangerAssessments } from '../src/services/imdDangerService';

export const apiRouter = express.Router();
apiRouter.use(express.json());

// In-memory state for SOS tickets and dynamic alerts
let currentSosQueue = [...INITIAL_SOS_QUEUE];
let currentAlerts = [...ACTIVE_ALERTS];
let currentSensors = [...SENSOR_NODES];

// Lazy Gemini client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Prediction Endpoint
apiRouter.post('/predict', async (req: Request, res: Response) => {
  try {
    const input: PredictionInput = req.body;
    const result = calculateFloodRisk(input);

    // If requested, enrich with Gemini AI reasoning
    if (req.body.includeAiExplanation) {
      try {
        const ai = getGeminiClient();
        if (ai) {
          const prompt = `You are a Senior Hydrologist and Mountain Disaster Geotechnical Specialist.
Analyze this multi-source flash flood prediction for a hilly region:
- Rainfall 1-hour: ${input.rainfall1h} mm/hr
- Rainfall 3-hour: ${input.rainfall3h} mm
- Rainfall 24-hour: ${input.rainfall24h} mm
- Soil Moisture: ${input.soilMoisture}% saturation (SMAP satellite)
- Slope Angle: ${input.slope}° (DEM derived)
- Elevation: ${input.elevation} m
- River Water Stage: ${input.riverLevel} m (Danger mark: ${input.riverDangerMark} m)
- Distance to River: ${input.distanceFromRiver} m
- Land Cover: ${input.landCover}
- Historical Flood Frequency: ${input.historicalFloodFreq} events in 20 yrs
- Catchment Area: ${input.catchmentAreaKm2} km²

Calculated ML Flood Probability: ${result.floodProbability}% (${result.riskLevel} RISK)
Estimated Surge Arrival: ${result.estimatedSurgeTimeHours} hours

Provide a concise 3-paragraph professional hydrologic assessment:
1. Multi-Source Coupling Dynamics: Explain how rainfall intensity interacts specifically with soil saturation and mountain slope angle (highlighting why rainfall alone is insufficient).
2. Debris & Runoff Risk: Evaluate channel choking, hyper-concentrated sediment surge, and velocity.
3. Priority Emergency Recommendation: Actionable command directive for civil defense and local hill communities.`;

          const aiResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          if (aiResponse.text) {
            result.aiExplanation = aiResponse.text;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini explanation fallback:', geminiErr);
      }
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 2. Dedicated AI Geotechnical Reasoning
apiRouter.post('/ai-explain', async (req: Request, res: Response) => {
  const { input, result } = req.body;
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        source: 'heuristic-rule-engine',
        explanation: `Multi-source hydrologic coupling indicates that with ${input.rainfall1h} mm/hr burst intensity on a ${input.slope}° incline, the antecedent soil moisture of ${input.soilMoisture}% drastically suppresses pore infiltration. This accelerates overland sheet flow toward the ${input.riverLevel}m river stage. The estimated peak surge arrives in ~${result.estimatedSurgeTimeHours} hours. Immediate high-ground evacuation is recommended for low-lying gullies.`,
      });
    }

    const prompt = `Analyze this mountain flash flood scenario:
Rainfall 1h: ${input.rainfall1h}mm/hr | Soil Saturation: ${input.soilMoisture}% | Slope: ${input.slope}° | River Level: ${input.riverLevel}m vs ${input.riverDangerMark}m danger | Land Cover: ${input.landCover}.
ML Risk: ${result.riskLevel} (${result.floodProbability}% probability).
Provide a sharp, authoritative 150-word synthesis of the geotechnical triggers and life-safety evacuation guidance.`;

    const aiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      explanation: aiRes.text,
    });
  } catch (err: any) {
    res.json({
      success: true,
      source: 'fallback-engine',
      explanation: `Geotechnical analysis: The combination of steep slope (${input.slope}°) and high soil water saturation (${input.soilMoisture}%) eliminates infiltration buffering. High-velocity debris torrent potential is elevated along natural watercourses.`,
    });
  }
});

// 3. Regions Telemetry
apiRouter.get('/regions', (_req: Request, res: Response) => {
  res.json({ success: true, data: REGIONS, regions: REGIONS });
});

// 4. Sensors Telemetry
apiRouter.get('/sensors', (_req: Request, res: Response) => {
  res.json({ success: true, data: currentSensors, sensors: currentSensors });
});

// 5. Active Early Warning Alerts
apiRouter.get('/alerts', (_req: Request, res: Response) => {
  res.json({ success: true, data: currentAlerts, alerts: currentAlerts });
});

// Create new alert (Admin capability)
apiRouter.post('/alerts', (req: Request, res: Response) => {
  const newAlert = {
    id: `alert-${Date.now()}`,
    issuedAt: 'Just now',
    ...req.body,
  };
  currentAlerts.unshift(newAlert);
  res.json({ success: true, data: newAlert, alert: newAlert });
});

// 6. Shelters
apiRouter.get('/shelters', (_req: Request, res: Response) => {
  res.json({ success: true, data: SHELTERS, shelters: SHELTERS });
});

// 7. Rescue Teams
apiRouter.get('/rescue-teams', (_req: Request, res: Response) => {
  res.json({ success: true, data: RESCUE_TEAMS, rescueTeams: RESCUE_TEAMS });
});

// 8. Historical Flood Data
apiRouter.get('/historical', (_req: Request, res: Response) => {
  res.json({ success: true, data: HISTORICAL_FLOODS, historical: HISTORICAL_FLOODS });
});

// 9. SOS Distress System
apiRouter.get('/sos', (_req: Request, res: Response) => {
  res.json({ success: true, data: currentSosQueue, requests: currentSosQueue });
});

// 10. Real-Time IMD Hilly Areas Danger & Prediction Hub
apiRouter.get('/imd/hilly-danger', async (_req: Request, res: Response) => {
  try {
    const data = await getAllImdHillyDangerAssessments();
    res.json({
      success: true,
      data,
      places: data.places,
      summary: data.summary,
    });
  } catch (error: any) {
    console.error('Error computing IMD hilly danger:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve real-time IMD data',
      error: error.message,
    });
  }
});

// 11. AI Synthesis of IMD Danger Briefing for Emergency Command
apiRouter.post('/imd/briefing', async (req: Request, res: Response) => {
  try {
    const { topDangerPlaces, summary } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'imd-standard-sop',
        briefing: `NATIONAL IMD HILLY REGIONS SITREP:
${summary?.redAlertCount || 0} hilly sectors are currently under RED WARNING, with ${summary?.orangeAlertCount || 0} sectors on ORANGE ALERT. Saturated mountain slopes in the Himalayas and Western Ghats indicate accelerated overland storm runoff. Immediate evacuation directives are active for Mandakini, Beas, and Kabini upper gorges. All hill vehicular movement on vulnerable ghat routes should be suspended until hydrologic stages drop below warning marks.`,
      });
    }

    const placesSummary = (topDangerPlaces || [])
      .slice(0, 5)
      .map(
        (p: any) =>
          `- ${p.placeName} (${p.state}, ${p.mountainRange}): IMD Alert ${p.imdAlertLevel} | 24h Rain: ${p.telemetry.rainfall24hMm}mm | Rate: ${p.telemetry.currentRainRateMmH}mm/h | Soil: ${p.telemetry.soilMoisturePct}% | Slope: ${p.slope}° | Flood Probability: ${p.prediction.floodProbabilityPct}% | Surge ETA: ${p.prediction.surgeArrivalEtaHours}h`
      )
      .join('\n');

    const prompt = `You are the Lead Scientific Officer at the India Meteorological Department (IMD) Multi-Hazard Early Warning Division.
Analyze this real-time meteorological data for India's high-risk hilly areas:

SUMMARY:
- Monitored Hilly Zones: ${summary?.monitoredZonesCount}
- Critical RED ALERT Zones: ${summary?.redAlertCount}
- ORANGE ALERT Zones: ${summary?.orangeAlertCount}
- Average Mountain Soil Saturation: ${summary?.averageSoilSaturation}%
- Peak 24h Rainfall: ${summary?.highestRainfallPlace?.rainfall24h}mm at ${summary?.highestRainfallPlace?.name}

TOP DANGER HILLY ZONES:
${placesSummary}

Provide a concise, authoritative 3-part Emergency Command Situation Report (SITREP):
1. **Critical Hydrological Triggers**: Explain the coupled rainfall and soil pore pressure mechanisms placing these specific mountain ranges in danger.
2. **Flash Flood & Debris Torrent Predictions**: Detail expected surge timing, gorge funneling, and downstream impact zones.
3. **NDMA / SDMA Priority Directives**: Immediate tactical action points for District Magistrates, NDRF battalions, and hill tourism authorities.`;

    const aiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      briefing: aiRes.text,
    });
  } catch (error: any) {
    console.error('Gemini briefing error:', error);
    res.json({
      success: true,
      source: 'fallback-sop',
      briefing: `IMD GEOTECHNICAL ADVISORY: Saturated mountain soils combined with steep gradients (>30°) drastically impair drainage. Low-lying riverbeds in designated RED ALERT zones must be evacuated immediately.`,
    });
  }
});

apiRouter.post('/sos', (req: Request, res: Response) => {
  const newTicket = {
    id: `sos-${Date.now()}`,
    timestamp: 'Just now',
    status: 'Pending',
    ...req.body,
  };
  currentSosQueue.unshift(newTicket);
  res.json({ success: true, data: newTicket, request: newTicket });
});

apiRouter.patch('/sos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = currentSosQueue.find((t) => t.id === id);
  if (ticket) {
    ticket.status = status;
    res.json({ success: true, data: ticket, request: ticket });
  } else {
    res.status(404).json({ success: false, message: 'Ticket not found' });
  }
});

