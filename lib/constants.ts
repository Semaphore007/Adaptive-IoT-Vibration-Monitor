export const PROJECT = {
  name: 'Adaptive-IoT-Vibration-Monitor Simulation',
  shortName: 'Adaptive-IoT-Vibration-Monitor',
  subtitle: 'Energy-Aware Adaptive IoT Sensing Using Edge Intelligence',
  author: 'Siddharth Gautam',
  researchQuestion:
    'How much energy and communication overhead can be reduced without significantly affecting detection accuracy?',
} as const

export const PROJECT_REPO_URL = 'https://github.com/Semaphore007/Adaptive-IoT-Vibration-Monitor'
export const PROJECT_MANUAL_URL =
  'https://drive.google.com/file/d/1m2YuzMkDOtoEJBHBtxtWl6lkm46ouEu_/view?usp=sharing'

const manualId = PROJECT_MANUAL_URL.match(/\/d\/([^/]+)/)?.[1]
export const PROJECT_MANUAL_PREVIEW_URL = manualId
  ? `https://drive.google.com/file/d/${manualId}/preview`
  : PROJECT_MANUAL_URL
export const PROJECT_MANUAL_DOWNLOAD_URL = manualId
  ? `https://drive.google.com/uc?export=download&id=${manualId}`
  : PROJECT_MANUAL_URL

export const LINKS = {
  repo: PROJECT_REPO_URL,
  manual: PROJECT_MANUAL_URL,
  wokwiEsp32: 'https://wokwi.com/esp32',
  wokwiMpuExample: 'https://wokwi.com/projects/386337192793719809',
  wokwiEsp32Docs: 'https://docs.wokwi.com/guides/esp32',
  wokwiMpuDocs: 'https://docs.wokwi.com/parts/wokwi-mpu6050',
  espIdf: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/',
  dsra: 'https://github.com/Hatemgab/DSRA-PMLO-Adaptive-Sampling',
  mqtt: 'https://mqtt.org/',
  mosquitto: 'https://mosquitto.org/',
  arduino: 'https://www.arduino.cc/',
  github: 'https://github.com/Semaphore007',
  linkedin: 'https://www.linkedin.com/in/siddharth-gautam-883539238/',
  telegram: 'https://t.me/TheOutlier_2003',
} as const

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/overview', label: 'Overview' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/implementation', label: 'Implementation' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/results', label: 'Results' },
  { href: '/manual', label: 'Manual' },
  { href: '/references', label: 'References' },
  { href: '/contact', label: 'Contact' },
] as const
