export const site = {
  name: "APEX",
  title: "Concept EV — Scroll Experience",
  tagline: "Scroll. The road responds.",
  email: "hello@apexconcept.studio",
  description:
    "APEX is a fictional electric grand tourer concept. This site exists as a portfolio piece to demonstrate a scroll-driven cinematic experience — a generative light-grid background that streams and reacts to scroll.",
  footer:
    "Concept project for portfolio use. The hero background is a generative canvas — a perspective light-grid, warm embers and a horizon glow rendered in real time.",
};

export type Chapter = {
  slug: string;
  label: string;
  kicker: string;
  title: string;
  body: string;
  quote: string;
  stats: { value: string; label: string }[];
  frameRange: [number, number];
};

// Frame ranges map 0–599 of the scroll sequence. Each chapter owns a slice of
// the drive and its content crossfades in/out as you scrub through it.
export const chapters: Chapter[] = [
  {
    slug: "ignition",
    label: "Ignition",
    kicker: "Chapter 01 — Ignition",
    title: "The city lights blur in the mirror.",
    body: "A dual-motor powertrain wakes with a single pedal press. No soundtrack, no drama — just torque, silently building. Launch mode holds both motors at the line, reading the surface beneath before you even lift your foot.",
    quote: "“Just press, and go.”",
    stats: [
      { value: "480 hp", label: "Rear axle" },
      { value: "800 Nm", label: "Instant torque" },
      { value: "AWD", label: "Dual motors" },
    ],
    frameRange: [0, 149],
  },
  {
    slug: "cruise",
    label: "Cruise",
    kicker: "Chapter 02 — Cruise",
    title: "Settling into the glide.",
    body: "A hundred and twenty, on rails. Laminated glass, active noise cancelling, and a ride that reads the road ahead before you do. Adaptive damping samples the surface two hundred times a second — long before a bump ever reaches the cabin.",
    quote: "“The quietest place to think at 120.”",
    stats: [
      { value: "120 km/h", label: "Hands-free cruise" },
      { value: "200 Hz", label: "Suspension sampling" },
      { value: "48 dB", label: "Cabin at speed" },
    ],
    frameRange: [150, 299],
  },
  {
    slug: "apex",
    label: "Apex",
    kicker: "Chapter 03 — Apex",
    title: "Full power, open road.",
    body: "Both motors, all five hundred kilowatts, one clean pass. The chassis stays flat, the tyres stay planted — and the silence stays. Torque is trimmed per wheel thirty times a second, so power is never wasted, only placed.",
    quote: "“Fast, and completely unbothered.”",
    stats: [
      { value: "3.1 s", label: "0–100 km/h" },
      { value: "500 kW", label: "Combined output" },
      { value: "260 km/h", label: "Top speed" },
    ],
    frameRange: [300, 449],
  },
  {
    slug: "arrival",
    label: "Arrival",
    kicker: "Chapter 04 — Arrival",
    title: "The drive never really ends.",
    body: "Six hundred and ten kilometres of range and a charge curve that catches up with you. Plug in for a coffee and come back to an extra four hundred kilometres on the clock. The journey becomes the destination.",
    quote: "“One stop, then the whole map is yours.”",
    stats: [
      { value: "610 km", label: "WLTP range" },
      { value: "270 kW", label: "Peak charge rate" },
      { value: "19 min", label: "10–80% charge" },
    ],
    frameRange: [450, 599],
  },
];

export type Spec = {
  label: string;
  value: string;
  note: string;
};

export const specs: Spec[] = [
  { label: "Powertrain", value: "Dual-motor AWD", note: "500 kW combined" },
  { label: "0–100 km/h", value: "3.1 s", note: "Launch mode" },
  { label: "Top speed", value: "260 km/h", note: "Electronically limited" },
  { label: "Range", value: "610 km", note: "WLTP, 100 kWh pack" },
  { label: "Charging", value: "270 kW", note: "10–80% in 19 min" },
  { label: "Weight", value: "2,040 kg", note: "Aluminium spaceframe" },
];

export type JournalEntry = {
  title: string;
  category: string;
  body: string;
};

export const journal: JournalEntry[] = [
  {
    title: "Designing the night",
    category: "Design",
    body: "Why the hero is a single unbroken night drive — light trails as narrative, speed as typography.",
  },
  {
    title: "600 frames, one scroll",
    category: "Engineering",
    body: "How the canvas sequence is preloaded, cached and scrubbed at 60fps without a video element.",
  },
  {
    title: "The 3.1 second question",
    category: "Engineering",
    body: "Tuning the scroll curve so launch feels fast on a trackpad — easing, thresholds, and scrub windows.",
  },
];

export const navLinks = [
  { href: "overview", label: "Overview" },
  { href: "specs", label: "Specs" },
  { href: "journal", label: "Journal" },
  { href: "contact", label: "Contact" },
];
