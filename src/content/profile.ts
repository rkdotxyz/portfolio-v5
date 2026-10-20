/* ------------------------------------------------------------------ *
 *  About, toolkit, exploring, writing and speaking content.
 *  Sourced from the CV and ramakrushna.xyz (v4).
 * ------------------------------------------------------------------ */

export const about = {
  statement:
    "I’m a creative technologist driven by human-centred design and a curiosity for how technology shapes experiences.",
  body: "My work sits at the intersection of design, code and art. I craft products, systems, installations and tools that make design workflows smoother, everyday experiences simpler, and push at the edges of new-media art.",
  facts: [
    { label: "Now", value: "M.S. Interactive Media Technology, KTH Stockholm" },
    { label: "Before", value: "Senior Product Designer, Razorpay" },
    { label: "Based in", value: "Stockholm, Sweden" },
  ],
};

export type ToolGroup = { id: string; label: string; tools: string[] };

export const toolGroups: ToolGroup[] = [
  {
    id: "design",
    label: "Design",
    tools: [
      "Figma",
      "Framer",
      "Webflow",
      "Illustrator",
      "Photoshop",
      "After Effects",
      "Lightroom",
      "Design systems",
      "Motion design",
      "Prototyping",
      "Typography",
    ],
  },
  {
    id: "creative-code",
    label: "Creative code",
    tools: [
      "TouchDesigner",
      "p5.js",
      "Processing",
      "Three.js",
      "GLSL shaders",
      "MediaPipe",
      "Projection mapping",
      "Audio reactive",
      "Generative music",
      "Data art",
    ],
  },
  {
    id: "physical",
    label: "Physical computing",
    tools: ["Arduino", "ESP32", "Raspberry Pi", "Sensors", "LED strips", "MIDI controllers", "Pen plotter", "Light painting"],
  },
  {
    id: "web",
    label: "Web",
    tools: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Git & GitHub", "Vercel"],
  },
  {
    id: "ai",
    label: "AI tooling",
    tools: [
      "Claude",
      "Claude Code",
      "Codex",
      "ChatGPT",
      "Cursor",
      "ElevenLabs",
      "Midjourney",
      "Runway",
      "MCP servers",
      "AI agents",
      "Figma plugins",
    ],
  },
];

// Areas not tried yet but on the list. Shown in the toolkit as targets not yet acquired.
export const exploring = [
  "Wearable design",
  "E-textiles",
  "Robotics",
  "Lighting design",
  "Kinetic sculpture",
  "Spatial computing",
  "Spatial audio",
  "Haptics",
  "Immersive installations",
  "ML for art",
];

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
