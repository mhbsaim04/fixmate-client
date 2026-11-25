"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Clock,
  Fan,
  Laptop,
  MapPin,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DevicePreset {
  id: string;
  name: string;
  icon: typeof Smartphone;
  category: string;
  turnaround: string;
  priceEstimate: string;
  modes: string[];
  issues: {
    name: string;
    description: string;
    time: string;
    steps: string[];
  }[];
}

const DEVICES: DevicePreset[] = [
  {
    id: "smartphone",
    name: "Smartphone",
    icon: Smartphone,
    category: "Smartphone",
    turnaround: "2 – 4 hours",
    priceEstimate: "৳ 800 – ৳ 3,500",
    modes: ["Shop Drop-off", "Home Visit"],
    issues: [
      {
        name: "Broken Screen / Display Flickering",
        description: "Cracked glass, black ink spots, or uncalibrated touch response.",
        time: "1 – 2 hours",
        steps: ["Diagnostic & frame check", "OEM display module fit", "Digitizer calibration & seal"],
      },
      {
        name: "Battery Degradation / Rapid Drain",
        description: "Phone dies at 20%, heats up during charging, or swollen battery back.",
        time: "45 mins",
        steps: ["Battery health tester scan", "Safe adhesive removal", "New cell & cycle test"],
      },
      {
        name: "Charging Port / Audio Mic Issue",
        description: "Loose charging cable, mic static, or liquid detection warning.",
        time: "1 – 3 hours",
        steps: ["Microscope port clean", "Sub-board soldering test", "Amp charging verification"],
      },
    ],
  },
  {
    id: "laptop",
    name: "Laptop & PC",
    icon: Laptop,
    category: "Laptop & PC",
    turnaround: "12 – 48 hours",
    priceEstimate: "৳ 1,200 – ৳ 6,500",
    modes: ["Home Visit", "Shop Drop-off"],
    issues: [
      {
        name: "No Power / Liquid Spill Damage",
        description: "Accidental coffee spill, power brick doesn't light, shorted motherboard.",
        time: "24 – 48 hours",
        steps: ["Ultrasonic motherboard bath", "IC & capacitor replacement", "24-hr stress test"],
      },
      {
        name: "Thermal Throttling & Fan Noise",
        description: "Laptop shuts down while gaming, fan sounds like a jet engine.",
        time: "2 – 4 hours",
        steps: ["Heatsink disassembly", "Thermal paste reapplication", "CPU thermal run benchmark"],
      },
      {
        name: "SSD / RAM Upgrade & OS Crash",
        description: "Sluggish performance, blue screen of death, storage full.",
        time: "2 – 6 hours",
        steps: ["Data backup clone", "High-speed NVMe install", "Fresh OS & driver validation"],
      },
    ],
  },
  {
    id: "ac",
    name: "Inverter AC",
    icon: Fan,
    category: "AC",
    turnaround: "Same-Day Service",
    priceEstimate: "৳ 1,500 – ৳ 4,500",
    modes: ["Home Visit Only"],
    issues: [
      {
        name: "AC Blowing Warm Air / Gas Leak",
        description: "Compressor turns on but indoor unit blows room temperature air.",
        time: "2 – 3 hours",
        steps: ["Nitrogen pressure leak test", "Copper flare seal fix", "R32/R410A gas refill"],
      },
      {
        name: "Deep Jet Cleaning & Bad Odor",
        description: "Dust clogging blower fan, water dripping inside room, mold smell.",
        time: "1.5 hours",
        steps: ["High-pressure wash shroud", "Blower drum de-greasing", "Drain line unclogging"],
      },
      {
        name: "PCB Error Code / Sensor Fault",
        description: "Display blinking E1/E6 error, outdoor unit refuses to trip.",
        time: "3 – 6 hours",
        steps: ["PCB multimeter diagnostics", "Inverter sensor module fix", "Voltage stabilizer check"],
      },
    ],
  },
  {
    id: "refrigerator",
    name: "Refrigerator",
    icon: Snowflake,
    category: "Refrigerator",
    turnaround: "Same-Day / 24 Hours",
    priceEstimate: "৳ 1,200 – ৳ 5,000",
    modes: ["Home Visit Only"],
    issues: [
      {
        name: "Freezer Works, Fridge Compartment Warm",
        description: "Ice builds up on back panel, lower shelves not cooling properly.",
        time: "2 – 4 hours",
        steps: ["Defrost heater check", "Bimetal thermostat test", "Evaporator fan replacement"],
      },
      {
        name: "Compressor Clicking / Not Starting",
        description: "Click sound every few minutes, food spoiling, high electricity bill.",
        time: "2 – 5 hours",
        steps: ["PTC starter relay test", "Capacitor swap", "Compressor winding diagnosis"],
      },
    ],
  },
  {
    id: "tv",
    name: "Smart LED TV",
    icon: Tv,
    category: "TV",
    turnaround: "24 – 72 hours",
    priceEstimate: "৳ 1,500 – ৳ 6,000",
    modes: ["Home Visit", "Shop Drop-off"],
    issues: [
      {
        name: "Sound OK, Black Screen (Backlight)",
        description: "Audio plays clearly, flashlight shows faint image on display.",
        time: "24 hours",
        steps: ["Disassemble LED diffusers", "Individual strip voltage test", "Full LED bar replacement"],
      },
      {
        name: "Vertical Lines / HDMI Board Fault",
        description: "Colored vertical lines or HDMI ports not recognizing streaming devices.",
        time: "24 – 48 hours",
        steps: ["T-Con board ribbon check", "Main motherboard IC rework", "Color balance verification"],
      },
    ],
  },
];

export function RepairEstimator() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("smartphone");
  const [selectedIssueIdx, setSelectedIssueIdx] = useState<number>(0);

  const currentDevice = DEVICES.find((d) => d.id === selectedDeviceId) ?? DEVICES[0];
  const currentIssue = currentDevice.issues[selectedIssueIdx] ?? currentDevice.issues[0];

  return (
    <section id="estimator-section" className="section-pad border-y bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-bold text-primary">
            <Calculator className="size-3.5" /> Interactive Experience Simulator
          </div>
          <h2 className="section-title mt-3">What does your repair journey look like?</h2>
          <p className="section-lead mx-auto">
            Select your device type and what&apos;s broken to preview the estimated timeline, procedures, and transparent
            pay-after-service guarantee.
          </p>
        </div>

        {/* Device selector tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {DEVICES.map((d) => {
            const Icon = d.icon;
            const isSelected = d.id === selectedDeviceId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setSelectedDeviceId(d.id);
                  setSelectedIssueIdx(0);
                }}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all sm:text-sm",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{d.name}</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Workbench Display */}
        <div className="mt-8 mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-lg">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_1.1fr] md:p-10">
            {/* Left Column: Issue Selection */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Step 1: Select Fault or Issue
              </p>
              <div className="mt-3 space-y-2.5">
                {currentDevice.issues.map((issue, idx) => {
                  const isActive = idx === selectedIssueIdx;
                  return (
                    <button
                      key={issue.name}
                      type="button"
                      onClick={() => setSelectedIssueIdx(idx)}
                      className={cn(
                        "w-full rounded-xl border p-3.5 text-left transition-all",
                        isActive
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/30",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className={cn("text-xs font-bold sm:text-sm", isActive ? "text-primary" : "text-foreground")}>
                          {issue.name}
                        </p>
                        <span className="text-[10px] font-semibold text-muted-foreground">{issue.time}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{issue.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Available Modes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentDevice.modes.map((mode) => (
                    <span
                      key={mode}
                      className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1 text-xs font-semibold text-foreground"
                    >
                      <MapPin className="size-3 text-primary" /> {mode}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Simulation Result & Procedure */}
            <div className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-background/80 p-5 sm:p-6 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentDevice.id}-${selectedIssueIdx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Turnaround</p>
                      <p className="flex items-center gap-1.5 font-display text-lg font-bold text-foreground">
                        <Clock className="size-4 text-primary" /> {currentIssue.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Typical Rate Range</p>
                      <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {currentDevice.priceEstimate}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      FixMate Procedure Breakdown
                    </p>
                    <ol className="mt-3 space-y-2.5">
                      {currentIssue.steps.map((st, i) => (
                        <li key={st} className="flex items-center gap-2.5 text-xs text-foreground">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {i + 1}
                          </span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="size-4" /> Zero Financial Risk
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Your technician only gets paid once this repair is verified working by you. No advance hostage fees.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 border-t pt-4">
                <Button asChild className="w-full rounded-xl">
                  <Link href={`/services?category=${encodeURIComponent(currentDevice.category)}`}>
                    Browse {currentDevice.name} Technicians <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
