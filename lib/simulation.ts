/**
 * Deterministic educational simulation of adaptive sensing.
 * All values are model outputs — never hardware measurements.
 *
 * Real experimental data (motor_no_load.txt, motor_light_load_brb.txt, etc.)
 * lives in src/dsra_pmlo/data/ and should be imported via the Results page CSV importer.
 */

export type VibrationMode = 'stable' | 'moderate' | 'high' | 'random'
export type SystemState = 'Stable' | 'Moderate' | 'Abnormal'
export type DataSource = 'DEMO' | 'REPLAY' | 'LIVE'

export interface SimParams {
  sensitivity: number    // 0..1 — scales how aggressively rate increases with vibration
  baseInterval: number   // ms — sampling interval in stable state
  txInterval: number     // ms — transmission interval in stable state
  threshold: number      // g  — RMS level at which state becomes Abnormal
}

export interface SimSample {
  t: number
  vibration: number        // raw acceleration magnitude (g)
  level: number            // windowed RMS (g)
  state: SystemState
  sampled: boolean
  samplingRate: number     // Hz — fs
  transmissionRate: number // /s — ft
  processingRate: number   // /s — fp
  packetsSent: number
  packetsAvoided: number
  baselinePackets: number
  detection: boolean
  groundTruth: boolean
  energyRelative: number   // adaptive / baseline  (1.0 = same as baseline)
  latency: number          // ms estimate
}

export const DEFAULT_PARAMS: SimParams = {
  sensitivity: 0.5,
  baseInterval: 200,
  txInterval: 1000,
  threshold: 0.6,
}

export const STEP_SECONDS = 0.05
export const BASELINE_SAMPLING_HZ = 100
export const BASELINE_TX_HZ = 10
export const BASELINE_PROCESSING_HZ = 10
export const ASSUMED_PAYLOAD_BYTES = 64

/** fs ≠ fp ≠ ft — three independently adaptable frequencies */
export const FREQ_DESCRIPTION = {
  fs: 'Sampling frequency — how often the sensor is read',
  fp: 'Processing frequency — how often the edge node analyses collected data',
  ft: 'Transmission frequency — how often data is published over MQTT',
} as const

const MODE_AMPLITUDE: Record<Exclude<VibrationMode, 'random'>, number> = {
  stable: 0.08,
  moderate: 0.5,
  high: 1.25,
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createSimulator(seed = 42) {
  let rand = mulberry32(seed)
  let step = 0
  let window: number[] = []
  let lastSampleT = -Infinity
  let lastTxT = -Infinity
  let packetsSent = 0
  let energyAdaptive = 0
  let energyBaseline = 0
  let randomSegment: Exclude<VibrationMode, 'random'> = 'stable'
  let abnormalSince: number | null = null

  function amplitudeFor(mode: VibrationMode) {
    if (mode !== 'random') return MODE_AMPLITUDE[mode]
    if (step % 60 === 0) {
      const r = rand()
      randomSegment = r < 0.45 ? 'stable' : r < 0.75 ? 'moderate' : 'high'
    }
    return MODE_AMPLITUDE[randomSegment]
  }

  function next(mode: VibrationMode, params: SimParams, externalVibration?: number): SimSample {
    const t = step * STEP_SECONDS
    const amp = amplitudeFor(mode)
    const noise = (rand() - 0.5) * 0.6
    const vibration =
      externalVibration ??
      amp * (Math.sin(2 * Math.PI * 1.6 * t) + 0.45 * Math.sin(2 * Math.PI * 4.3 * t) + noise)

    window.push(vibration)
    if (window.length > 10) window.shift()
    const level = Math.sqrt(window.reduce((s, v) => s + v * v, 0) / window.length)

    const state: SystemState =
      level >= params.threshold ? 'Abnormal' : level >= params.threshold * 0.45 ? 'Moderate' : 'Stable'

    // fs — sampling frequency (adaptive)
    const baseRate = 1000 / params.baseInterval
    const factor = state === 'Abnormal' ? 1 + 18 * params.sensitivity : state === 'Moderate' ? 1 + 5 * params.sensitivity : 1
    const samplingRate = Math.min(BASELINE_SAMPLING_HZ, +(baseRate * factor).toFixed(1))

    const sampled = t - lastSampleT >= 1 / samplingRate - 1e-9
    if (sampled) lastSampleT = t

    // ft — transmission frequency (adaptive)
    const txIntervalS =
      state === 'Abnormal' ? STEP_SECONDS : state === 'Moderate' ? params.txInterval / 2000 : params.txInterval / 1000
    const transmissionRate = +Math.min(BASELINE_TX_HZ * 2, 1 / txIntervalS).toFixed(2)
    if (t - lastTxT >= txIntervalS - 1e-9) {
      lastTxT = t
      packetsSent++
    }

    // fp — processing frequency (adaptive)
    const processingRate = state === 'Abnormal' ? BASELINE_PROCESSING_HZ : state === 'Moderate' ? 4 : 1

    const baselinePackets = Math.floor(t * BASELINE_TX_HZ) + 1

    // Relative energy model: E_adaptive / E_baseline
    // E proportional to: 0.35 (idle) + 0.35*(fs/fs_max) + 0.25*(ft/ft_max) + 0.05*(fp/fp_max)
    const adaptivePower =
      0.35 +
      0.35 * (samplingRate / BASELINE_SAMPLING_HZ) +
      0.25 * Math.min(1, transmissionRate / BASELINE_TX_HZ) +
      0.05 * (processingRate / BASELINE_PROCESSING_HZ)
    energyAdaptive += adaptivePower * STEP_SECONDS
    energyBaseline += 1 * STEP_SECONDS

    const groundTruth =
      amp >= MODE_AMPLITUDE.high * 0.9 ||
      (externalVibration !== undefined && Math.abs(vibration) > params.threshold * 1.4)
    const detection = state === 'Abnormal'
    if (detection && abnormalSince === null) abnormalSince = t
    if (!detection) abnormalSince = null
    const latency = Math.round(1000 / samplingRate + txIntervalS * 500)

    step++
    return {
      t: +t.toFixed(2),
      vibration: +vibration.toFixed(3),
      level: +level.toFixed(3),
      state,
      sampled,
      samplingRate,
      transmissionRate,
      processingRate,
      packetsSent,
      packetsAvoided: Math.max(0, baselinePackets - packetsSent),
      baselinePackets,
      detection,
      groundTruth,
      energyRelative: +(energyAdaptive / energyBaseline).toFixed(3),
      latency,
    }
  }

  function reset(newSeed = seed) {
    rand = mulberry32(newSeed)
    step = 0
    window = []
    lastSampleT = -Infinity
    lastTxT = -Infinity
    packetsSent = 0
    energyAdaptive = 0
    energyBaseline = 0
    randomSegment = 'stable'
    abnormalSince = null
  }

  return { next, reset }
}

/** Fixed scenario used for demo charts: stable → moderate → high → stable. */
export function demoScenarioMode(stepIndex: number): VibrationMode {
  const phase = stepIndex % 400
  if (phase < 100) return 'stable'
  if (phase < 180) return 'moderate'
  if (phase < 260) return 'high'
  return 'stable'
}

export function generateSeries(
  steps: number,
  params: SimParams = DEFAULT_PARAMS,
  modeAt: (i: number) => VibrationMode = demoScenarioMode,
  seed = 7,
) {
  const sim = createSimulator(seed)
  return Array.from({ length: steps }, (_, i) => sim.next(modeAt(i), params))
}

export function summarize(series: SimSample[]) {
  const last = series[series.length - 1]
  if (!last) return null
  const correct = series.filter((s) => s.detection === s.groundTruth).length
  return {
    packetsAdaptive: last.packetsSent,
    packetsBaseline: last.baselinePackets,
    packetReductionPct: ((last.baselinePackets - last.packetsSent) / last.baselinePackets) * 100,
    energyRelative: last.energyRelative,
    agreementPct: (correct / series.length) * 100,
    meanSamplingRate: series.reduce((s, x) => s + x.samplingRate, 0) / series.length,
    meanLatency: series.reduce((s, x) => s + x.latency, 0) / series.length,
  }
}

/**
 * Generate a lightweight replay series from raw amplitude values.
 * Used when a motor_*.txt dataset is loaded but only the vibration column exists.
 */
export function replayFromAmplitudes(
  amplitudes: number[],
  params: SimParams = DEFAULT_PARAMS,
  seed = 7,
): SimSample[] {
  const sim = createSimulator(seed)
  return amplitudes.map((v) => sim.next('stable', params, v))
}
