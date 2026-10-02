import {
  Activity,
  ChartLine,
  Cpu,
  Gauge,
  Network,
  Radar,
  Radio,
  Server,
  Timer,
  Waves,
  Wifi,
  Zap,
  Layers,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArchNode {
  icon: LucideIcon
  label: string
  sub: string
}

interface Layer {
  name: string
  role: string
  tone: 'primary' | 'info' | 'teal'
  nodes: ArchNode[]
}

const LAYERS: Layer[] = [
  {
    name: 'Device Layer',
    role: 'Sensing & Acquisition',
    tone: 'primary',
    nodes: [
      { icon: Waves, label: 'Vibration Source', sub: 'Motor' },
      { icon: Activity, label: 'MPU6050', sub: 'Accelerometer' },
      { icon: Cpu, label: 'ESP32', sub: 'IoT node' },
      { icon: Zap, label: 'INA219', sub: 'Current sensor' },
    ],
  },
  {
    name: 'Communication Layer',
    role: 'Transmission',
    tone: 'info',
    nodes: [
      { icon: Wifi, label: 'Wi-Fi', sub: 'Link' },
      { icon: Radio, label: 'MQTT', sub: 'Broker' },
      { icon: Network, label: 'Packets', sub: 'Count' },
      { icon: Timer, label: 'Latency', sub: 'Delay' },
      { icon: Gauge, label: 'Bandwidth', sub: 'Bytes/s' },
    ],
  },
  {
    name: 'Edge Intelligence Layer',
    role: 'Processing & Analysis',
    tone: 'teal',
    nodes: [
      { icon: Layers, label: 'Adaptive Sampling', sub: 'Policy' },
      { icon: Server, label: 'Reconstruction', sub: 'DSRA-PMLO' },
      { icon: Radar, label: 'Detection', sub: 'Change / anomaly' },
      { icon: ChartLine, label: 'Metrics', sub: 'Experiments' },
    ],
  },
]

const TONE = {
  primary: { head: 'bg-secondary text-primary', icon: 'text-primary', border: 'border-primary/30' },
  info: { head: 'bg-info/10 text-info', icon: 'text-info', border: 'border-info/30' },
  teal: { head: 'bg-teal/10 text-teal', icon: 'text-teal', border: 'border-teal/30' },
}

function Connector() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-8 w-px bg-primary/40 lg:mx-0 lg:h-px lg:w-10 lg:self-center">
      <span className="flow-dot-y absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary lg:hidden" />
      <span className="flow-dot-x absolute top-1/2 hidden size-2 -translate-y-1/2 rounded-full bg-primary lg:block" />
    </div>
  )
}

export function ArchitectureFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch" role="group" aria-label="Three-layer system architecture">
      {LAYERS.map((layer, i) => (
        <div key={layer.name} className="flex flex-col lg:flex-1 lg:flex-row">
          <div className={cn('flex-1 overflow-hidden rounded-lg border bg-card', TONE[layer.tone].border)}>
            <div className={cn('px-4 py-2.5 text-center', TONE[layer.tone].head)}>
              <h3 className="text-sm font-semibold">{layer.name}</h3>
              <p className="text-xs opacity-80">{layer.role}</p>
            </div>
            <ul className={cn('grid gap-2 p-3', compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-2')}>
              {layer.nodes.slice(0, compact ? 4 : undefined).map((n) => (
                <li key={n.label} className="flex flex-col items-center gap-1 rounded-md border border-border bg-background/50 px-2 py-3 text-center">
                  <n.icon className={cn('size-6', TONE[layer.tone].icon)} aria-hidden="true" />
                  <span className="text-xs font-semibold leading-tight">{n.label}</span>
                  <span className="text-[11px] leading-tight text-muted-foreground">{n.sub}</span>
                </li>
              ))}
            </ul>
          </div>
          {i < LAYERS.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  )
}
