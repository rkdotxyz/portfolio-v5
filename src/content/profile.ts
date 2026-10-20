/* ------------------------------------------------------------------ *
 *  About, toolkit, writing and speaking content.
 *  Sourced from the CV and ramakrushna.xyz (v4).
 * ------------------------------------------------------------------ */

export const about = {
  statement: "I build things that live between the digital and the physical.",
  body: [
    "LED matrices and microcontrollers, pen plotters and projectors, data art and the code that ties them together. Mostly, I’m figuring out how technology can feel less like a screen and more like something you hold, play with and share.",
  ],
  // Headline numbers, counted from the work on the canvas (work.ts and the
  // toolkit links in this file).
  stats: [
    { value: "50+", label: "builds and experiments since 2022" },
    { value: "20", label: "physical builds: LEDs, plotters, microcontrollers" },
    { value: "20", label: "creative-code pieces" },
    { value: "2", label: "installations shown in public" },
  ],
  facts: [
    { label: "Now", value: "MSc Interactive Media Technology, KTH Stockholm" },
    { label: "Before", value: "Senior Product Designer, Razorpay" },
    { label: "Based in", value: "Stockholm, Sweden" },
  ],
};

/* ------------------------------------------------------------------ *
 *  Toolkit, shown as a treemap (toolkit-treemap.tsx). `uses` lists the
 *  work ids (from work.ts) each tool was used for: a tool's area follows
 *  how many it has, and hovering it names them.
 * ------------------------------------------------------------------ */

export type Tool = { name: string; uses: string[] };
export type Discipline = { id: string; label: string; tools: Tool[] };

export const disciplines: Discipline[] = [
  {
    id: "design",
    label: "Design",
    tools: [
      { name: "Figma", uses: ["blade-design-system", "pattern-creator", "keyscout", "token-visualiser", "healthicons", "heart-doll"] },
      { name: "Design systems", uses: ["blade-design-system", "pattern-creator", "token-visualiser", "keyscout"] },
      { name: "Framer", uses: ["stratosplash", "framer-components", "site-hero", "project-explorer"] },
      { name: "Photography", uses: ["photo-td", "stratosplash", "lenscribe", "lightscape-plants", "lightscape-steal"] },
      { name: "Film & motion", uses: ["not-my-hometown", "claude-video", "oled-hej"] },
      { name: "Fusion (CAD)", uses: ["cad"] },
    ],
  },
  {
    id: "creative-code",
    label: "Creative code",
    tools: [
      {
        name: "TouchDesigner",
        uses: ["planet-under-pressure", "coral-dreams", "led-mapping", "live-camera-led", "audio-reactive", "conclave", "light-painting", "midi-controller", "photo-td", "pen-plotter"],
      },
      { name: "p5.js", uses: ["pen-plotter", "lightscape-plants", "lightscape-steal"] },
      { name: "GLSL shaders", uses: ["shader", "shader-bands"] },
      { name: "Three.js", uses: ["heart-doll"] },
      { name: "D3.js", uses: ["language-of-gen-z", "project-explorer"] },
      { name: "Mapbox & QGIS", uses: ["mapbox", "pen-plotter"] },
      { name: "MediaPipe", uses: ["gesture-bloom", "projection-ttt"] },
    ],
  },
  {
    id: "physical",
    label: "Physical computing",
    tools: [
      { name: "ESP32", uses: ["esp32-led-snake", "heart-doll"] },
      { name: "Arduino", uses: ["oled-art", "oled-hej", "gesture-bloom"] },
      { name: "LED matrices", uses: ["esp32-led-snake", "led-mapping", "live-camera-led", "audio-reactive", "led-matrix"] },
      { name: "Pen plotter", uses: ["pen-plotter", "ascii-plots", "light-plot", "uv-maze", "lightscape-plants", "lightscape-steal"] },
      { name: "Projectors", uses: ["projection-mapping", "projection-car", "projection-ttt"] },
      { name: "MIDI controllers", uses: ["midi-controller", "planet-under-pressure"] },
      { name: "Sewing & soldering", uses: ["heart-doll"] },
    ],
  },
  {
    id: "web",
    label: "Web",
    tools: [
      { name: "TypeScript", uses: ["force-field", "sonic-signature", "pixel-art-generator"] },
      { name: "React", uses: ["heart-doll", "framer-components"] },
      { name: "WebSockets", uses: ["esp32-led-snake", "heart-doll"] },
      { name: "Web Audio", uses: ["esp32-led-snake", "sonic-signature"] },
      { name: "HTML & JavaScript", uses: ["middventory", "language-of-gen-z", "esp32-led-snake"] },
      { name: "Vercel", uses: ["middventory", "sonic-signature", "force-field", "pixel-art-generator", "language-of-gen-z", "scenic-seats"] },
    ],
  },
  {
    id: "ai",
    label: "AI tooling",
    tools: [
      { name: "Claude", uses: ["claude-video", "esp32-led-snake"] },
      { name: "Gemini", uses: ["toefl-practice", "framer-components"] },
      { name: "Custom GPTs", uses: ["lenscribe"] },
      { name: "Figma plugin API", uses: ["keyscout", "pattern-creator"] },
      { name: "AI agents", uses: ["blade-design-system"] },
    ],
  },
];

// Areas not tried yet but on the list: a hub of its own, with nothing wired up yet.
export const exploring = ["Wearables", "E-textiles", "Haptics", "Spatial audio", "Kinetic sculpture", "ML for art"];

export const writing = [
  {
    title: "Behind the scenes of maintaining a design system component",
    date: "Oct 2025",
    where: "Razorpay Design",
    href: "https://medium.com/razorpay-design/behind-the-scenes-of-maintaining-a-design-system-component-08c0f077b7a4",
  },
  {
    title: "From real to digital: how UI components are inspired by real-world objects",
    date: "Mar 2025",
    where: "UX Planet",
    href: "https://uxplanet.org/from-real-to-digital-how-ui-components-are-inspired-from-real-world-objects-2159f38364ea",
  },
  {
    title: "Behind the scenes of animating a design system component",
    date: "Oct 2024",
    where: "Razorpay Design",
    href: "https://medium.com/razorpay-design/behind-the-scenes-of-animating-a-design-system-component-60b77290ba08",
  },
  {
    title: "If you can smart animate, you can animate",
    date: "Oct 2023",
    where: "UX Planet",
    href: "https://uxplanet.org/if-you-can-smart-animate-you-can-animate-c7f821dbcf73",
  },
  {
    title: "Behind the scenes of designing a design system component",
    date: "Aug 2023",
    where: "Razorpay Design",
    href: "https://medium.com/razorpay-design/behind-the-scenes-of-designing-a-design-system-component-7969636fabf4",
  },
  {
    title: "Learnings as a UX design intern at MakeMyTrip",
    date: "Dec 2021",
    where: "goMMT Design",
    href: "https://medium.com/gommtdesign/learnings-as-a-ux-design-intern-at-makemytrip-10627ea64094",
  },
  {
    title: "Building your portfolio in Notion",
    date: "Dec 2020",
    where: "UX Planet",
    href: "https://uxplanet.org/building-your-portfolio-in-notion-part-1-2222f31210eb",
  },
];

export const talks = [
  { title: "Design tools for data art", date: "Jun 2025", where: "VizChitra 2025" },
  { title: "Understanding design systems", date: "May 2024", where: "10k Designers" },
  { title: "Design systems for enterprise", date: "Apr 2024", where: "GeekyAnts" },
  { title: "Decoding design systems", date: "Mar 2024", where: "After Office Hours" },
  { title: "Motion design systems", date: "Oct 2023", where: "designMyx by Myntra" },
];
