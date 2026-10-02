import {
  Activity,
  Battery,
  BatteryCharging,
  Cable,
  ChartLine,
  CircuitBoard,
  Cpu,
  FlaskConical,
  Gauge,
  Grid3x3,
  Radar,
  Radio,
  Timer,
  Usb,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { LINKS } from './constants'

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
  tone?: 'primary' | 'info' | 'warn' | 'teal'
}

export const HOME_FEATURES: Feature[] = [
  { icon: Activity, title: 'Adaptive Sampling', description: 'Condition-aware sensing rate', tone: 'primary' },
  { icon: Wifi, title: 'MQTT Communication', description: 'Lightweight publish/subscribe', tone: 'info' },
  { icon: BatteryCharging, title: 'Energy Measurement', description: 'INA219 current & voltage', tone: 'warn' },
  { icon: Radar, title: 'Edge Detection', description: 'Change / anomaly detection', tone: 'teal' },
  { icon: FlaskConical, title: 'Experimental Evaluation', description: 'Baseline vs adaptive', tone: 'primary' },
]

export const WORKFLOW_STEPS = [
  'Physical Vibration',
  'MPU6050',
  'ESP32',
  'Adaptive Sampling',
  'MQTT',
  'Edge Processing',
  'Detection / Reconstruction',
  'Experimental Evaluation',
]

export interface ResearchMetric {
  icon: LucideIcon
  name: string
  definition: string
  why: string
  how: string
  formula?: string
}

export const RESEARCH_METRICS: ResearchMetric[] = [
  {
    icon: BatteryCharging,
    name: 'Energy Consumption',
    definition: 'Total electrical energy drawn by the sensing node during an experiment run.',
    why: 'Primary indicator of whether adaptive behaviour reduces the cost of sensing and communication.',
    how: 'Integrate INA219 voltage × current samples over the run duration, under equivalent experiment conditions.',
    formula: 'E = Σ (V · I · Δt)',
  },
  {
    icon: Radio,
    name: 'Packets Transmitted',
    definition: 'Number of MQTT messages published by the node during a run.',
    why: 'Directly reflects communication overhead and radio activity.',
    how: 'Count publish calls on the ESP32 and cross-check against broker-side message logs.',
    formula: 'Reduction = ((P_baseline − P_adaptive) / P_baseline) × 100',
  },
  {
    icon: Gauge,
    name: 'Bandwidth',
    definition: 'Payload bytes transmitted per unit time.',
    why: 'Determines network load when many nodes share the same broker or gateway.',
    how: 'Sum serialized payload sizes per window and divide by the window duration.',
    formula: 'B = Σ payload_bytes / T',
  },
  {
    icon: Radar,
    name: 'Detection Accuracy',
    definition: 'Agreement between detected vibration events and labelled ground-truth conditions.',
    why: 'Ensures savings do not come at the cost of missing abnormal conditions.',
    how: 'Label motor-driven abnormal intervals, then compute accuracy / precision / recall against detections.',
    formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
  },
  {
    icon: Timer,
    name: 'Detection Latency',
    definition: 'Time between onset of an abnormal condition and its detection at the edge.',
    why: 'Lower sampling or batching during stable periods can delay response to new events.',
    how: 'Timestamp vibration onset (motor trigger) and the corresponding detection event at the edge computer.',
    formula: 'L = t_detected − t_onset',
  },
  {
    icon: Battery,
    name: 'Battery Lifetime',
    definition: 'Operating time of the node on a given battery capacity.',
    why: 'Translates energy behaviour into a practical deployment-level outcome.',
    how: 'Run the 18650-powered node until cut-off, or extrapolate from measured average power with stated assumptions.',
    formula: 'T ≈ Capacity / P_avg',
  },
]

export const SAMPLING_STRATEGIES = [
  { id: 'fixed', label: 'Method 1', title: 'Fixed Sampling', icon: Timer, description: 'Constant rate regardless of condition. Primary baseline.', rate: '100 Hz continuously', adapts: false, color: 'border-muted-foreground/30 bg-muted/30' },
  { id: 'threshold', label: 'Method 2', title: 'Threshold-Based Adaptive', icon: Activity, description: 'Rate changes when signal crosses a threshold. Simple adaptive baseline.', rate: 'Low rate stable, high rate abnormal', adapts: true, color: 'border-primary/30 bg-primary/5' },
  { id: 'dsra', label: 'Method 3', title: 'Predictive / DSRA-PMLO', icon: Radar, description: 'Signal-driven sample selection using DSRA-PMLO algorithm. Proposed intelligent method.', rate: 'Determined by signal characteristics', adapts: true, color: 'border-teal/30 bg-teal/5' },
]

export type Requirement = 'Required' | 'Recommended' | 'Optional'

export interface HardwareItem {
  icon: LucideIcon
  name: string
  role: string
  requirement: Requirement
  docUrl?: string
  docLabel?: string
}

export const HARDWARE: HardwareItem[] = [
  { icon: Cpu, name: 'ESP32 DevKit', role: 'Main IoT edge node: sampling logic, Wi-Fi and MQTT publishing.', requirement: 'Required', docUrl: 'https://www.espressif.com/en/products/socs/esp32', docLabel: 'Espressif ESP32' },
  { icon: Activity, name: 'MPU6050 Accelerometer', role: 'Vibration / acceleration sensing over I²C.', requirement: 'Required', docUrl: 'https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/', docLabel: 'TDK InvenSense' },
  { icon: Zap, name: 'INA219 Current Sensor', role: 'Current and voltage measurement for energy evaluation.', requirement: 'Recommended', docUrl: 'https://www.ti.com/product/INA219', docLabel: 'Texas Instruments' },
  { icon: Waves, name: 'Vibration Motor', role: 'Controlled vibration source for normal / abnormal conditions.', requirement: 'Recommended' },
  { icon: BatteryCharging, name: '18650 Battery + Holder', role: 'Portable supply, useful for the battery-life experiment.', requirement: 'Optional' },
  { icon: Grid3x3, name: 'Breadboard', role: 'Solderless prototyping of the sensing circuit.', requirement: 'Required' },
  { icon: Cable, name: 'Jumper Wires', role: 'Connections between ESP32, sensors and motor driver.', requirement: 'Required' },
  { icon: Usb, name: 'USB Cable', role: 'Firmware upload, serial logging and bench power.', requirement: 'Required' },
]

export const WIRING = [
  { from: 'MPU6050 VCC', to: 'ESP32 3V3', note: 'Check your breakout board supply range' },
  { from: 'MPU6050 GND', to: 'ESP32 GND', note: 'Common ground' },
  { from: 'MPU6050 SDA', to: 'ESP32 GPIO21', note: 'Default ESP32 Arduino I²C SDA' },
  { from: 'MPU6050 SCL', to: 'ESP32 GPIO22', note: 'Default ESP32 Arduino I²C SCL' },
  { from: 'INA219 VIN+', to: 'Supply positive', note: 'In series with node' },
  { from: 'INA219 VIN-', to: 'Node VCC', note: 'Current measurement' },
  { from: 'INA219 SDA', to: 'ESP32 GPIO21', note: 'Shared I2C bus' },
  { from: 'INA219 SCL', to: 'ESP32 GPIO22', note: 'Shared I2C bus' },
  { from: 'Vibration Motor', to: 'GPIO via transistor driver', note: 'Do not drive a motor directly from a GPIO pin' },
]

export interface ImplSection {
  id: string
  number: string
  title: string
  purpose: string
  inputs: string
  process: string
  output: string
  language: string
  code: string
  notes: string[]
}

export const IMPLEMENTATION_SECTIONS: ImplSection[] = [
  {
    id: 'esp32-setup',
    number: '10.1',
    title: 'ESP32 Setup',
    purpose: 'Prepare the ESP32 toolchain and verify the board boots and logs over serial.',
    inputs: 'ESP32 DevKit, USB cable, Arduino IDE or ESP-IDF.',
    process: 'Install the ESP32 board package, select the board and port, upload a minimal sketch.',
    output: 'Board running firmware with serial output at 115200 baud.',
    language: 'C++ (Arduino)',
    code: `#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("ESP32 node booted");
}

void loop() {
  Serial.printf("uptime_ms=%lu\\n", millis());
  delay(1000);
}`,
    notes: ['Hold BOOT while uploading if the board does not enter flashing mode automatically.', 'Keep the serial baud rate consistent across all sketches.'],
  },
  {
    id: 'mpu6050-setup',
    number: '10.2',
    title: 'MPU6050 Setup',
    purpose: 'Initialise the accelerometer and confirm it responds on the I²C bus.',
    inputs: 'I²C connection (SDA, SCL), MPU6050 library.',
    process: 'Begin I²C, initialise the sensor, configure accelerometer range and filter bandwidth.',
    output: 'Sensor ready to return acceleration values (ax, ay, az).',
    language: 'C++ (Arduino)',
    code: `#include <Wire.h>
#include <Adafruit_MPU6050.h>

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  if (!mpu.begin()) {
    Serial.println("MPU6050 not found");
    while (true) delay(10);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.println("MPU6050 initialised");
}`,
    notes: ['Run an I²C scanner if the sensor is not detected.', 'Mount the sensor rigidly so it couples to the vibration source.'],
  },
  {
    id: 'ina219',
    number: '10.3',
    title: 'INA219 Energy Measurement',
    purpose: 'Measure bus voltage and current to estimate energy per experiment run.',
    inputs: 'INA219 in series with the node supply, shared I²C bus.',
    process: 'Read voltage and current periodically and integrate power over time.',
    output: 'Cumulative energy estimate (mJ) for the run.',
    language: 'C++ (Arduino)',
    code: `#include <Adafruit_INA219.h>

Adafruit_INA219 ina219;
double energy_mJ = 0;
unsigned long lastMs = 0;

void updateEnergy() {
  float v = ina219.getBusVoltage_V();
  float mA = ina219.getCurrent_mA();
  unsigned long now = millis();
  energy_mJ += v * mA * (now - lastMs) / 1000.0;
  lastMs = now;
}`,
    notes: ['Measuring the node with its own INA219 is approximate; an external measurement node is more rigorous.', 'Keep the measurement interval constant across baseline and adaptive runs.'],
  },
  {
    id: 'acquisition',
    number: '10.4',
    title: 'Sensor Data Acquisition',
    purpose: 'Read acceleration and compute a compact vibration feature.',
    inputs: 'Raw acceleration (ax, ay, az).',
    process: 'Remove gravity offset, compute magnitude and a rolling RMS over a small window.',
    output: 'Vibration level used by the sampling policy.',
    language: 'C++ (Arduino)',
    code: `const int WIN = 16;
float buf[WIN]; int idx = 0;

float readVibration() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  float mag = sqrt(a.acceleration.x * a.acceleration.x +
                   a.acceleration.y * a.acceleration.y +
                   a.acceleration.z * a.acceleration.z) - 9.81;
  buf[idx++ % WIN] = mag;
  float s = 0;
  for (int i = 0; i < WIN; i++) s += buf[i] * buf[i];
  return sqrt(s / WIN);
}`,
    notes: ['Calibrate the gravity offset while the platform is still.'],
  },
  {
    id: 'baseline',
    number: '10.5',
    title: 'Fixed-Rate Baseline',
    purpose: 'Provide the reference configuration that all adaptive variants are compared against.',
    inputs: 'Fixed sampling interval and fixed transmission interval.',
    process: 'Sample and publish at constant rates regardless of vibration conditions.',
    output: 'Baseline packets, energy and detection logs.',
    language: 'C++ (Arduino)',
    code: `const unsigned long SAMPLE_MS = 10;
const unsigned long TX_MS = 100;
unsigned long lastSample = 0, lastTx = 0;

void loop() {
  unsigned long now = millis();
  if (now - lastSample >= SAMPLE_MS) {
    lastSample = now;
    level = readVibration();
  }
  if (now - lastTx >= TX_MS) {
    lastTx = now;
    publishMQTT(level);
  }
}`,
    notes: ['Keep the baseline identical across repeated runs for a fair comparison.'],
  },
  {
    id: 'threshold',
    number: '10.6',
    title: 'Threshold-Based Adaptive Sampling',
    purpose: 'Change sampling interval according to the measured vibration level.',
    inputs: 'Vibration level, low/high thresholds, base interval.',
    process: 'Classify the condition and pick a sampling interval for that condition.',
    output: 'Dynamic sampling interval.',
    language: 'C++ (Arduino)',
    code: `unsigned long adaptiveSampling(float level) {
  if (level >= HIGH_TH) return BASE_MS / 10;   // abnormal
  if (level >= LOW_TH)  return BASE_MS / 3;    // moderate
  return BASE_MS;                              // stable
}`,
    notes: ['Add hysteresis to avoid rapid switching around the threshold.'],
  },
  {
    id: 'dsra-pmlo',
    number: '10.7',
    title: 'DSRA-PMLO Adaptive Sampling',
    purpose: 'Use the external DSRA-PMLO approach as the adaptive sampling / reconstruction foundation.',
    inputs: 'Signal stream, E and S parameters (see the DSRA-PMLO repository).',
    process: 'Select informative samples, reconstruct the signal, evaluate error and sampling reduction.',
    output: 'Selected samples, reconstructed signal, error and reduction metrics.',
    language: 'Python (edge)',
    code: `# Conceptual integration — see the DSRA-PMLO repository for the real API
samples = load_stream("vibration.csv")
selected = dsra_select(samples, E=E_PARAM, S=S_PARAM)
recon = reconstruct(selected, len(samples))
err = rmse(samples, recon)
reduction = 1 - len(selected) / len(samples)
print(err, reduction)`,
    notes: ['DSRA-PMLO is external research software and is credited to its authors.', 'The function names above are illustrative placeholders, not the library API.'],
  },
  {
    id: 'mqtt',
    number: '10.8',
    title: 'MQTT Communication',
    purpose: 'Publish vibration features to a broker for edge processing.',
    inputs: 'Wi-Fi credentials, broker host, topic.',
    process: 'Connect to Wi-Fi, connect to the broker, publish a compact JSON payload.',
    output: 'Messages on topic iot/vibration/node1.',
    language: 'C++ (Arduino)',
    code: `#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient net;
PubSubClient mqtt(net);

void publishMQTT(float level) {
  if (!mqtt.connected()) mqtt.connect("node1");
  char msg[64];
  snprintf(msg, sizeof(msg), "{\\"t\\":%lu,\\"v\\":%.3f}", millis(), level);
  mqtt.publish("iot/vibration/node1", msg);
}`,
    notes: ['Keep credentials out of the repository (use a separate secrets header).', 'Mosquitto can run locally as the broker.'],
  },
  {
    id: 'adaptive-tx',
    number: '10.9',
    title: 'Adaptive Transmission',
    purpose: 'Reduce radio activity during stable periods while sending abnormal events immediately.',
    inputs: 'System state, transmission interval.',
    process: 'Batch or skip publishes when stable; publish immediately when abnormal.',
    output: 'Condition-aware publish schedule.',
    language: 'C++ (Arduino)',
    code: `void adaptiveTransmit(State s, float level) {
  unsigned long now = millis();
  if (s == ABNORMAL) { publishMQTT(level); lastTx = now; return; }
  unsigned long interval = (s == MODERATE) ? TX_MS / 2 : TX_MS;
  if (now - lastTx >= interval) {
    publishMQTT(level);
    lastTx = now;
  }
}`,
    notes: ['Log skipped publishes so packet reduction can be verified.'],
  },
  {
    id: 'edge',
    number: '10.10',
    title: 'Edge Processing',
    purpose: 'Process incoming messages close to the device instead of in the cloud.',
    inputs: 'MQTT messages from the node.',
    process: 'Subscribe, buffer, compute features and run detection at a condition-dependent rate.',
    output: 'Processed features and detection events.',
    language: 'Python (edge)',
    code: `import json
import paho.mqtt.client as mqtt

def on_message(client, userdata, msg):
    data = json.loads(msg.payload)
    buffer.append(data["v"])
    if len(buffer) >= WINDOW:
        process_window(buffer[-WINDOW:])

client = mqtt.Client()
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("iot/vibration/#")
client.loop_forever()`,
    notes: ['Check the paho-mqtt version you install; the client constructor changed in v2.'],
  },
  {
    id: 'detection',
    number: '10.11',
    title: 'Detection',
    purpose: 'Identify abnormal vibration conditions from processed features.',
    inputs: 'Windowed vibration features.',
    process: 'Compare RMS against a calibrated threshold with a short confirmation window.',
    output: 'Detection flag and timestamp.',
    language: 'Python (edge)',
    code: `def detect(window, threshold, confirm=3):
    rms = (sum(x * x for x in window) / len(window)) ** 0.5
    state.hits = state.hits + 1 if rms > threshold else 0
    return state.hits >= confirm, rms`,
    notes: ['Calibrate thresholds from labelled stable recordings, not by guessing.'],
  },
  {
    id: 'logging',
    number: '10.12',
    title: 'Logging',
    purpose: 'Record every run in a consistent format for later analysis.',
    inputs: 'Samples, publishes, detections, energy values.',
    process: 'Append rows to a CSV file with the expected column names.',
    output: 'CSV compatible with the Results page importer.',
    language: 'Python (edge)',
    code: `import csv
COLS = ["timestamp", "vibration", "sampling_rate", "transmission_rate",
        "processing_rate", "packets_sent", "energy", "detection", "latency"]

writer = csv.DictWriter(open("run.csv", "w", newline=""), fieldnames=COLS)
writer.writeheader()

def log_row(row):
    writer.writerow(row)`,
    notes: ['Use the same column names so the website importer can read your results.'],
  },
  {
    id: 'experiment-data',
    number: '10.13',
    title: 'Experiment Data Collection',
    purpose: 'Run repeatable experiments for each configuration.',
    inputs: 'Configuration (baseline / adaptive variants), vibration schedule, duration.',
    process: 'Apply the same motor schedule to each configuration and repeat runs.',
    output: 'One CSV per run, per configuration.',
    language: 'Python (edge)',
    code: `CONFIGS = ["baseline", "threshold", "dsra_pmlo", "adaptive_tx", "full"]
SCHEDULE = [("stable", 60), ("moderate", 30), ("high", 30), ("stable", 60)]

for cfg in CONFIGS:
    for run in range(REPEATS):
        set_node_config(cfg)
        for condition, seconds in SCHEDULE:
            drive_motor(condition, seconds)
        save_run(f"{cfg}_run{run}.csv")`,
    notes: ['Report mean and spread across repeats rather than a single run.'],
  },
]

export const TYPING_DEMO_CODE = `// ESP32 → MPU6050 → adaptiveSampling() → publishMQTT()
#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_MPU6050.h>

void loop() {
  float level = readVibration();          // MPU6050
  State s = classify(level);              // stable / moderate / abnormal
  unsigned long dt = adaptiveSampling(level);
  adaptiveTransmit(s, level);             // publishMQTT()
  delay(dt);
}`

export interface Experiment {
  id: string
  label: string
  title: string
  objective: string
  variables: string
  procedure: string
  metrics: string
  expected: string
  dataSource: string
}

export const EXPERIMENTS: Experiment[] = [
  { id: 'A', label: 'A', title: 'Fixed-rate baseline', objective: 'Establish reference energy, packets and detection behaviour.', variables: 'Fixed sampling interval, fixed transmission interval.', procedure: 'Run the baseline firmware through the standard vibration schedule; repeat several times.', metrics: 'Energy, packets, bandwidth, detection accuracy, latency.', expected: 'Constant sampling and packet rates independent of vibration condition.', dataSource: 'ESP32 logs, broker logs, INA219 readings.' },
  { id: 'B', label: 'B', title: 'Threshold adaptive sampling', objective: 'Evaluate a simple threshold-based sampling policy.', variables: 'Low/high thresholds, base interval, hysteresis.', procedure: 'Apply the same schedule; compare against baseline runs.', metrics: 'Sampling rate profile, energy, detection accuracy.', expected: 'Lower sampling during stable periods; behaviour depends on threshold choice.', dataSource: 'ESP32 sampling logs, INA219.' },
  { id: 'C', label: 'C', title: 'DSRA-PMLO adaptive sampling', objective: 'Assess DSRA-PMLO based sample selection and reconstruction.', variables: 'E and S parameters.', procedure: 'Process recorded streams with DSRA-PMLO; measure reconstruction error and reduction.', metrics: 'Reconstruction error, sampling reduction, detection accuracy.', expected: 'A trade-off between reduction and reconstruction error controlled by parameters.', dataSource: 'Recorded vibration CSV + DSRA-PMLO output.' },
  { id: 'D', label: 'D', title: 'Adaptive transmission', objective: 'Measure communication savings of condition-aware publishing.', variables: 'Transmission interval, immediate-send rule.', procedure: 'Enable adaptive transmission with fixed sampling; then combine with adaptive sampling.', metrics: 'Packets, bandwidth, latency.', expected: 'Fewer packets during stable periods; abnormal events still sent promptly.', dataSource: 'Publish counters, broker logs.' },
  { id: 'E', label: 'E', title: 'Edge processing frequency', objective: 'Examine the effect of condition-dependent processing rate at the edge.', variables: 'Processing rate per state, window size.', procedure: 'Vary edge processing rate under identical input streams.', metrics: 'Edge CPU time, detection latency, accuracy.', expected: 'Lower processing load when stable, with possible latency impact.', dataSource: 'Edge computer logs.' },
  { id: 'F', label: 'F', title: 'Energy measurement', objective: 'Quantify node energy under each configuration.', variables: 'Configuration, run duration, supply.', procedure: 'Measure with INA219 under equivalent conditions; repeat runs.', metrics: 'Energy (mJ), average power.', expected: 'Energy differences depend on radio and sampling activity; to be measured.', dataSource: 'INA219 readings.' },
  { id: 'G', label: 'G', title: 'Detection accuracy', objective: 'Verify that adaptive operation preserves detection quality.', variables: 'Configuration, detection threshold.', procedure: 'Label abnormal intervals from the motor schedule; compare with detections.', metrics: 'Accuracy, precision, recall.', expected: 'Accuracy should remain close to baseline if thresholds are well calibrated.', dataSource: 'Edge detection log + ground-truth schedule.' },
  { id: 'H', label: 'H', title: 'Detection latency', objective: 'Measure delay between event onset and detection.', variables: 'Base interval, transmission interval, confirm window.', procedure: 'Trigger the motor at known times; record detection timestamps.', metrics: 'Latency distribution (median, worst-case).', expected: 'Latency may increase with longer stable-state intervals.', dataSource: 'Synchronised timestamps.' },
  { id: 'I', label: 'I', title: 'Parameter sensitivity', objective: 'Understand how parameters shift the trade-off.', variables: 'Sensitivity, base interval, transmission interval, threshold.', procedure: 'Sweep one parameter at a time while holding others fixed.', metrics: 'Packets, energy, accuracy, latency.', expected: 'Monotonic or near-monotonic trends; identify a reasonable operating point.', dataSource: 'Sweep runs (CSV).' },
  { id: 'J', label: 'J', title: 'Ablation study', objective: 'Attribute effects to individual adaptive mechanisms.', variables: 'Enabled mechanisms: sampling, transmission, processing.', procedure: 'Enable mechanisms incrementally and compare each configuration.', metrics: 'Energy, packets, bandwidth, accuracy, latency.', expected: 'Each mechanism contributes differently; contributions are to be measured.', dataSource: 'Per-configuration CSV runs.' },
]

export const MANUAL_CONTENTS = [
  'Project Overview', 'Objectives', 'Architecture', 'Hardware', 'Software', 'ESP32 Setup', 'Sensor Integration',
  'Adaptive Sampling', 'MQTT', 'Edge Processing', 'Energy Measurement', 'Experiments', 'Results', 'Reproducibility',
  'Research Contribution',
]

export interface Reference {
  title: string
  description: string
  url: string
}

export const REFERENCE_GROUPS: { group: string; icon: LucideIcon; items: Reference[] }[] = [
  { group: 'ESP32', icon: Cpu, items: [{ title: 'ESP-IDF Programming Guide', description: 'Official Espressif documentation for ESP32 development.', url: LINKS.espIdf }] },
  {
    group: 'Wokwi',
    icon: CircuitBoard,
    items: [
      { title: 'Wokwi ESP32 Simulator', description: 'Online ESP32 hardware simulation.', url: LINKS.wokwiEsp32 },
      { title: 'Wokwi ESP32 Guide', description: 'Documentation for simulating ESP32 projects.', url: LINKS.wokwiEsp32Docs },
      { title: 'Wokwi MPU6050', description: 'MPU6050 part reference in Wokwi.', url: LINKS.wokwiMpuDocs },
    ],
  },
  { group: 'Adaptive Sampling', icon: ChartLine, items: [{ title: 'DSRA-PMLO Adaptive Sampling', description: 'External research software for adaptive sampling (credited to its authors).', url: LINKS.dsra }] },
  { group: 'Project Repository', icon: FlaskConical, items: [{ title: 'Adaptive-IoT-Vibration-Monitor', description: 'Source code and implementation files for this project.', url: LINKS.repo }] },
  {
    group: 'MQTT',
    icon: Wifi,
    items: [
      { title: 'MQTT', description: 'The MQTT standard for IoT messaging.', url: LINKS.mqtt },
      { title: 'Eclipse Mosquitto', description: 'Open-source MQTT broker suitable for local experiments.', url: LINKS.mosquitto },
    ],
  },
  { group: 'ESP32 Development', icon: Cpu, items: [{ title: 'Arduino', description: 'Arduino platform and IDE used for ESP32 sketches.', url: LINKS.arduino }] },
]
