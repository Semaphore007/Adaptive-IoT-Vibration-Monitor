import type { Metadata } from 'next'
import Image from 'next/image'
import { CodePreview } from '@/components/code-preview'
import { ImplementationExplorer } from '@/components/implementation-explorer'
import { Notice, PageHeader, Section, SectionHeading } from '@/components/primitives'
import { DataBadge } from '@/components/primitives'

export const metadata: Metadata = { title: 'Implementation' }

export default function ImplementationPage() {
  return (
    <>
      <PageHeader title="Implementation" tags={['Step-by-Step Guide', 'Code Examples', 'Adaptive Algorithms']} />
      <Section>
        <div className="mb-6">
          <Notice>Code samples are educational starting points. Calibrate thresholds, pins and intervals to your hardware before collecting data.</Notice>
        </div>
        <ImplementationExplorer />
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Algorithm" title="DSRA-PMLO Integration" />
        <div className="mb-6 p-4 rounded-lg bg-teal-900/20 border border-teal-500/30 text-teal-800 dark:text-teal-200">
          <strong>External Software Credit:</strong> DSRA-PMLO is external research software by Hatem Gabr et al. This project uses it as the adaptive sampling/reconstruction foundation. See: <a href="https://github.com/Hatemgab/DSRA-PMLO-Adaptive-Sampling" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-600 dark:hover:text-teal-300">https://github.com/Hatemgab/DSRA-PMLO-Adaptive-Sampling</a>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The edge node offloads the complexity of DSRA-PMLO parameter selection (E and S parameters) to the offline configuration phase, utilizing the core sampling strategies for intelligent condition-aware sampling.
        </p>
      </Section>

      <Section>
        <SectionHeading eyebrow="Architecture" title="Edge Processing Pipeline" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The following conceptual Python subscriber demonstrates how data is captured and processed at the edge, listening to the ESP32 node via MQTT:
        </p>
        <div className="bg-muted p-4 rounded-lg overflow-x-auto font-mono text-sm">
{`import paho.mqtt.client as mqtt
import json

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload)
    process_vibration_data(payload)
    # Apply detection logic and logging

client = mqtt.Client()
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("iot/vibration/#")
client.loop_forever()`}
        </div>
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Methodology" title="Measurement Protocol" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          To ensure repeatability across baseline and adaptive strategies, follow this protocol for each run:
        </p>
        <ol className="list-decimal list-inside text-muted-foreground space-y-2">
          <li>Initialize the edge MQTT subscriber and start the data logger.</li>
          <li>Power up the ESP32 node with the selected firmware configuration.</li>
          <li>Apply the standard mechanical schedule (e.g., 60s stable, 30s fault, 60s stable).</li>
          <li>Stop the logger and save the resulting CSV for analysis.</li>
          <li>Repeat 5 times per configuration to average out noise.</li>
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="Data" title="CSV Logger Format" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The logging pipeline expects data in the following standard CSV schema for the visualization tools to import correctly:
        </p>
        <pre className="rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
{`timestamp,vibration,sampling_rate,transmission_rate,processing_rate,packets_sent,energy,detection,latency
1678886400000,0.45,100,10,50,1,15.2,0,0
1678886401000,0.46,100,10,50,2,16.5,0,0`}
        </pre>
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Datasets" title="Data Files" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The project includes vibration datasets in the <code>src/dsra_pmlo/data/</code> directory:
        </p>
        <div className="flex flex-wrap gap-3">
          <DataBadge>motor_no_load.txt (normal motor, no load)</DataBadge>
          <DataBadge>motor_light_load_brb.txt (motor with broken rotor bar fault)</DataBadge>
          <DataBadge>motor_no_load_brb.txt (no-load broken rotor bar)</DataBadge>
          <DataBadge>downsampled_data_20000.txt (20k-sample downsampled reference)</DataBadge>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Python Visualization"
          title="Generate Matplotlib graphs from the repository data"
          description="These examples use the included motor vibration dataset and the DSRA-PMLO plotting workflow."
        />
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-lg border border-border bg-card">
            <Image
              src="/images/matplotlib-motor-signal.png"
              alt="Matplotlib line graph of the first 1,500 amplitude samples from the motor no-load dataset"
              width={1980}
              height={720}
              className="h-auto w-full"
            />
            <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              Generated with Matplotlib from <code>src/dsra_pmlo/data/motor_no_load.txt</code> (first 1,500 samples).
            </figcaption>
          </figure>
          <div className="space-y-3">
            <h3 className="font-semibold">Recreate the signal plot</h3>
            <CodePreview
              title="plot_motor_signal.py"
              language="Python"
              code={`from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

data_path = Path("src/dsra_pmlo/data/motor_no_load.txt")
frame = pd.read_csv(data_path, sep=r"\\s+")
signal = pd.to_numeric(frame["Amplitude"], errors="raise").to_numpy()
count = min(1500, len(signal))

fig, ax = plt.subplots(figsize=(11, 4))
ax.plot(range(count), signal[:count], color="#047857", linewidth=1)
ax.set(title="Motor vibration - no load",
       xlabel="Sample index", ylabel="Amplitude")
ax.grid(True, linestyle="--", alpha=0.35)
fig.tight_layout()
fig.savefig("motor-vibration.png", dpi=180, bbox_inches="tight")
plt.close(fig)`}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold">Generate a DSRA reconstruction plot</h3>
            <CodePreview
              title="evaluate_dsra.py"
              language="Python"
              code={`from dsra_pmlo.automated import DSRAAutomated

model = DSRAAutomated(
    filepath="src/dsra_pmlo/data/downsampled_data_20000.txt",
    target_col="Amplitude",
    similarity_threshold=3,
)
model.load_data(target_size=20000)
_, seeds = model.run_iterative_grid_search()
E, S, reduction, error, _ = model.optimize_and_reconstruct(seeds)
print(f"E={E:.3f}, S={S:.3f}, reduction={reduction:.1f}%, error={error:.3f}%")
model.evaluate_test_set(E=E, S=S, plot_path="dsra-reconstruction.png")`}
            />
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <h3 className="font-semibold text-foreground">Run it locally</h3>
            <p>
              From the repository root, install the project dependencies (including Matplotlib) and run the documented package entry point:
            </p>
            <CodePreview
              title="terminal"
              language="Shell"
              code={`py -m pip install -e .
py -m dsra_pmlo.use_case`}
            />
            <p>
              The DSRA workflow uses Matplotlib to show search and reconstruction figures. These Python plots are generated when you run the code locally; the image above is a saved Matplotlib output from the included motor dataset, not a browser simulation.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
