/* ------------------------------------------------------------------ *
 *  Case studies for the key projects, one page each at /work/<id>. Keyed
 *  by the work item's id (see work.ts). Side projects and explorations
 *  have no page; their `about` line in work.ts shows on hover instead.
 *  Leave a field out to hide that part.
 *
 *  Sources: the v4 site (ramakrushna.xyz), v3 (ramakrushna.webflow.io),
 *  the CV, GitHub READMEs and the projects' own sites. Only what those say.
 * ------------------------------------------------------------------ */

import { FRAMER, GITHUB, img, type Media } from "./work";

// A case study written as a sequence of blocks, reproduced in order (used
// where an existing write-up is carried over as is).
export type BodyBlock =
  | { kind: "heading"; text: string }
  | { kind: "subheading"; text: string }
  | { kind: "text"; text: string } // line breaks are kept
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "media"; media: Media; caption?: string } // caption shows under it
  | { kind: "pair"; media: [Media, Media]; caption?: string } // two side by side
  | { kind: "stats"; items: { value: string; label: string }[] } // a row of headline numbers
  | { kind: "steps"; items: string[] }; // a flow drawn as connected boxes

// A titled part of the story beyond what / why / how: text, a list, a flow
// and images, in that order.
export type Section = {
  title: string;
  text?: string;
  items?: string[];
  flow?: string[];
  media?: Media[]; // captioned by each item's alt; `aspect` keeps its proportions
};

export type CaseStudy = {
  summary: string; // one line under the title
  title?: string; // page title, when it differs from the card's
  subtitle?: string; // a line under the page title
  hero?: Media; // page hero, when it differs from the card's media
  body?: BodyBlock[]; // when set, the page shows this in place of what / why / how
  role?: string;
  team?: string;
  status?: string;
  what?: string;
  why?: string;
  how?: string;
  flow?: string[]; // the signal path, drawn as connected boxes
  sections?: Section[]; // shown after how it works, before the outcome
  stack?: string[];
  outcome?: string;
  links?: { label: string; href: string }[];
  gallery?: Media[]; // captioned by each item's alt
};

export const caseStudies: Record<string, CaseStudy> = {
  /* ── Key projects ─────────────────────────────────────────────── */

  // Written from the repo (github.com/rkdotxyz/esp32-led-snake: README,
  // docs/story, architecture, protocol, build log and gotchas), the build
  // video, and RK's answers on why, how AI was used and playtesting.
  "esp32-led-snake": {
    summary: "Snake on a 32×8 LED matrix, played from any phone over the ESP32's own WiFi.",
    title: "ESP32 LED Snake",
    subtitle: "Rebuilding a game everyone knows as a physical object, played from your phone",
    hero: { type: "video", src: "/work/esp32-led-snake/full.mp4", poster: "/work/esp32-led-snake/poster.jpg", controls: true, alt: "ESP32 LED Snake: from the Nokia original to the LED matrix" },
    role: "Solo: concept, electronics, firmware, controller app",
    status: "v2.1 · open source",
    stack: ["ESP32", "WS2812B matrix", "C++ / Arduino", "FastLED", "ESP Async WebServer", "WebSockets", "HTML / JS", "Web Audio"],
    links: [
      { label: "Code", href: "https://github.com/rkdotxyz/esp32-led-snake" },
      { label: "Build guide", href: "https://github.com/rkdotxyz/esp32-led-snake/tree/main/docs/guide" },
    ],
    body: [
      {
        kind: "stats",
        items: [
          { value: "256", label: "LEDs on one USB cable" },
          { value: "0", label: "apps to install" },
          { value: "10", label: "build phases, each tagged" },
          { value: "1", label: "weekend" },
        ],
      },

      { kind: "heading", text: "Why" },
      {
        kind: "text",
        text: "I came to an MSc in tangible interfaces from product design and frontend engineering. Screens and code were familiar; wires, power supplies and microcontrollers were not. I wanted a hands-on way in, and Snake was the perfect excuse: a game everyone already knows from their Nokia, so all the attention can go to the new form it takes.",
      },
      {
        kind: "text",
        text: "A first version worked, but I couldn't have explained half of why. So I rebuilt it from scratch with two goals: understand every part, and leave a repo someone else could rebuild from.",
      },
      { kind: "quote", text: "Old game, new form factor. A weekend of wiring, code and debugging, and Snake lives again on an LED matrix." },

      { kind: "heading", text: "The problem" },
      { kind: "text", text: "Putting Snake on a strip of LEDs sounds simple. Three constraints made it a design problem:" },
      {
        kind: "list",
        items: [
          "Control: no buttons, no app, no router. It had to work anywhere, including on university networks an ESP32 can't join.",
          "Power: 256 LEDs could draw around 15 A fully lit. One USB cable gives the whole board about 0.5 A.",
          "Feel: a game lives or dies on responsiveness. Two quick turns can't be lost, and animations can't stutter on a microcontroller.",
        ],
      },

      { kind: "heading", text: "How it works" },
      {
        kind: "text",
        text: "The ESP32 makes its own WiFi network and serves the controller page itself. Join ESP32-Snake, open snake.local, and your phone becomes the controller. A WebSocket stays open in both directions: turns go in, score, state and game events come back.",
      },
      { kind: "steps", items: ["Phone browser", "Own WiFi + WebSocket", "ESP32", "8×32 LED matrix"] },
      { kind: "media", media: { ...img("/work/esp32-led-snake/system.svg", "System diagram: phone, ESP32 modules and the matrix"), aspect: 1200 / 520 } },
      {
        kind: "text",
        text: "Inside, each module has one job. The rules know only a grid, a snake and a direction: no LEDs, no WiFi. A state machine moves between attract, play, pause, game over and score, and the display is the only code that touches the LEDs. Because the rules stayed separate, the phone controller, effects, colours and speed-up were all added later without touching the game itself.",
      },

      { kind: "heading", text: "Electronics" },
      {
        kind: "text",
        text: "An ESP32 DevKit drives a flexible WS2812B 8×32 matrix, bent into a curve on the desk. A 330 Ω resistor protects the data line and a 100 µF capacitor smooths the supply. Everything runs from one USB cable.",
      },
      { kind: "media", media: { ...img("/work/esp32-led-snake/wiring.svg", "Wiring: ESP32, WS2812B matrix, capacitor and data resistor"), aspect: 820 / 420 } },
      { kind: "subheading", text: "Designed around a power budget" },
      {
        kind: "text",
        text: "A firmware cap dims any frame that would draw more than 300 mA, and I tested it with every LED lit white before writing the game. The constraint shaped the look as much as the wiring: a few bright pixels on a dark board, never a lit screen.",
      },
      { kind: "subheading", text: "Mapping the grid" },
      {
        kind: "text",
        text: "The matrix is one long strip wired in a zigzag, down one column and up the next. A small function turns a column and row into the LED's number on the strip, checked by lighting the corners, diagonals and hand-typed positions against predictions.",
      },
      { kind: "media", media: { type: "video", src: "/work/esp32-led-snake/wiring.mp4", alt: "The ESP32 on the breadboard, wired to the matrix" }, caption: "The bring-up rig: ESP32, breadboard and the curved matrix" },

      { kind: "heading", text: "The controller app" },
      {
        kind: "text",
        text: "The controller is a single page served from the ESP32's flash. It had to be usable with a thumb in a dark room while your eyes are on the matrix, not the phone.",
      },
      { kind: "media", media: { ...img("/work/esp32-led-snake/app-screens.jpg", "The controller: ready, playing, game over and settings"), aspect: 1724 / 924 }, caption: "Ready, playing, game over and settings" },
      {
        kind: "list",
        items: [
          "Big d-pad, swipe anywhere (several turns in one drag), and arrow keys or W A S D on a laptop.",
          "The status line tells you what to do next: press any direction to start, paused, or why the game ended.",
          "Settings only open between games, enforced on the ESP32 too, because changing the rules mid-play felt wrong.",
          "The phone never assumes a setting changed: a swatch only lights up once the ESP32 confirms it, so two phones can't disagree.",
          "Sound is synthesised in the browser for start, eat and crash, and follows the phone's silent switch.",
        ],
      },
      {
        kind: "pair",
        media: [
          { type: "video", src: "/work/esp32-led-snake/controller.mp4", alt: "Steering from the phone's d-pad" },
          { type: "video", src: "/work/esp32-led-snake/colours.mp4", alt: "Picking the snake's colour on the phone" },
        ],
        caption: "Steering from the phone, and picking a colour that previews live on the matrix",
      },

      { kind: "heading", text: "On the matrix" },
      {
        kind: "text",
        text: "Several details only became obvious on the real LEDs, so most screens went through a round of changes after testing:",
      },
      {
        kind: "list",
        items: [
          "Attract screen: a demo snake zigzags across all 256 squares eating apples. A dim background glow came out; just the snake on a dark board looked cleaner.",
          "Crash: the snake flashes and crumbles from the tail, then the score counts up in a custom 5×6 font, centred, with leading zeros so the number holds still.",
          "Colours: a navy snake nearly disappeared, so every colour is normalised to full strength, with brightness set in one place.",
          "Effects: a pulsing head, a fading tail, glowing food and a sparkle on each bite. They looked choppy when the matrix only redrew as the snake moved, so drawing got its own 30 ms clock.",
          "Speed: the snake speeds up with each bite, from 250 ms a step down to 120 ms.",
        ],
      },
      { kind: "media", media: { type: "video", src: "/work/esp32-led-snake/score.mp4", alt: "The crash, then the score counting up" }, caption: "Crash, crumble, and the score counting up" },

      { kind: "heading", text: "Problems solved" },
      {
        kind: "list",
        items: [
          "The code ran, but nothing lit up. The breadboard's power rails were split in the middle, with the ESP32 and the matrix on different halves. Lesson: when the code says it works and the hardware disagrees, suspect power first.",
          "Two tasks, one queue. The web server runs in its own task, so a phone can add a turn while the game takes one out. The shared queue is guarded by a critical section.",
          "Late joiners heard old sounds. One-off events (start, eat, crash) are now sent separately from status, which is resent to every new phone.",
          "A file called network.h collided with the ESP32 core's Network.h, since macOS treats the names as the same file. It became web_control.",
          "Still open: iPhone Safari has no vibration API, and the known workaround didn't fire, so sound carries the feedback on iPhone.",
        ],
      },

      { kind: "heading", text: "Playtesting" },
      {
        kind: "text",
        text: "Friends and classmates played it, and loved it. A few things kept happening:",
      },
      {
        kind: "list",
        items: [
          "People got competitive fast, playing again and again to beat each other's scores.",
          "The surprise was the phone: scan, join, and it's a controller, with no app to install.",
          "It brought back memories of playing Snake on a Nokia.",
          "More than one person asked for two-player, which is now next on the list.",
        ],
      },

      { kind: "heading", text: "How it was built" },
      {
        kind: "text",
        text: "Ten phases, each adding one thing and ending with something visible on the matrix, each tagged in git, from blinking the onboard LED to sound and speed-up. Hardware came first, with tiny single-purpose test sketches. I used Claude as a tutor along the way, to understand concepts like power budgets, WebSockets and state machines, while I wired, wrote, tested and made the decisions. The repo doubles as a step-by-step guide, with the architecture, protocol, build log and gotchas.",
      },

      { kind: "heading", text: "What I learned" },
      {
        kind: "list",
        items: [
          "Hardware: power budgets decide more than wiring. A brownout means current, flicker usually means ground or data, total darkness usually means power never arrived.",
          "Software: state machines instead of flags, millis() instead of delay(), separate clocks for moving and drawing, and what happens when two tasks share data.",
          "Process: small steps with a visible check and a tag made every step safe to try, and writing the log while things were fresh made the documentation possible.",
        ],
      },

      { kind: "heading", text: "Next" },
      {
        kind: "text",
        text: "Two-player Snake with two phones, a saved high score, and a 3D-printed diffuser so each LED reads as a crisp square pixel. And the one that got away: making an iPhone buzz when the snake crashes.",
      },
    ],
  },

  // Carried over 1:1 from the v4 case study (ramakrushna.xyz/selected-work/planet-under-pressure).
  "planet-under-pressure": {
    summary: "An interactive data-art installation: turn eight knobs and watch a planet change.",
    title: "Planet Under Pressure - Designing Tools for Storytelling",
    subtitle: "Leveraging data to create interactive art installation for an immersive storytelling",
    body: [
      { kind: "heading", text: "Background" },
      {
        kind: "text",
        text: "As of today, understanding data requires some level of 'data-literacy'. And when we are connecting data with topics like environmental or societal causes, it becomes difficult for the mass audience to visualise it. This project was an attempt at making data accessible and interactive so that people can connect better with the environmental issues.",
      },
      { kind: "heading", text: "Problem Statement" },
      {
        kind: "text",
        text: "Whenever we talk of data we basically refer to graphs and charts. Now this works fine for a smaller audience but for a wider audience it is not accessible. Now, this combined with environmental factor like air pollution level or water pollution level is difficult to visualise through simple abstract charts. So the core problem statement here was:",
      },
      { kind: "quote", text: "How can we make data interactive and visual for everyone." },
      { kind: "media", media: { ...img(`${FRAMER}53L8zfJFtFYbUF0ozKwjI7pLkh4.png`), aspect: 567 / 186 } },
      { kind: "heading", text: "Target Users" },
      { kind: "text", text: "The interactive art installation had a broad range of audience including:" },
      { kind: "list", items: ["Designers", "Journalists", "Professors", "Students", "Artists"] },
      { kind: "media", media: { ...img(`${FRAMER}luX8tSEV5K466VrYqHIBNFOMDo.png`), aspect: 567 / 226 } },
      { kind: "heading", text: "The Creation Process" },
      { kind: "text", text: "The creation of the art installation involved various steps from start to end. The steps comprised of:" },
      {
        kind: "list",
        items: ["Identification of Effecting Parameters", "Data Curation", "Art Creation", "Data Mapping", "Final Showcase"],
      },
      { kind: "heading", text: "Identification of Effecting Parameters" },
      {
        kind: "text",
        text: "Various parameters were identified that effect the overall well being of the planet. Given that I was using a MIDI controller to make the installation interactive, I had a constraint of only using 8 parameters (since MIDI controller had 8 knobs). The 8 identified parameters were:",
      },
      {
        kind: "list",
        items: [
          "Air Quality Index",
          "Water Quality Index",
          "Sea Level Rise",
          "Ocean Temperature Anomaly",
          "Land Pollution Index",
          "Jet Stream Fluctuation",
          "Loss of Living Life",
          "Vegetation Loss",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}SMPx1FVSLO78nmGPfUkHYoRGTQ.png`), aspect: 567 / 310 } },
      { kind: "heading", text: "Data Curation" },
      {
        kind: "text",
        text: "Based on the identified parameters, data for all the 8 parameters were extracted from multiple open-source available data sources. Since the installation planned on showing how parameters effected the planet in a long term so based on the extracted data of last 100 years, a predictive data set was built for the next 100 years. So we had an overall data trend for 201 years.",
      },
      { kind: "media", media: { ...img(`${FRAMER}AyxkfEijZ7vhio7kMTAdedpBU.png`), aspect: 567 / 257 } },
      { kind: "heading", text: "Art Creation" },
      { kind: "text", text: "With some research and mood-boarding, I identified how the planet might look under various circumstances. For example:" },
      {
        kind: "list",
        items: [
          "Loss of vegetation would lead to making the planet look less green",
          "Rise in sea level would lead to lesser soil area and more water area",
        ],
      },
      {
        kind: "text",
        text: "Taking all of these references into account, I created the basic art setup in Touchdesigner. Here, values of multiple functions in Touchdesigner were kept configurable to make the art interactive.",
      },
      { kind: "media", media: { ...img(`${FRAMER}ALwoUvsXLC2suknfLrEyanqyyI.png`), aspect: 567 / 250 } },
      { kind: "media", media: { ...img(`${FRAMER}43Pe3pGYM3wFWtnaIODntJ6T24k.png`), aspect: 567 / 250 } },
      { kind: "heading", text: "Data Mapping" },
      {
        kind: "text",
        text: "The final step included mapping the values of functions with the parameters. In the MIDI controller, every parameter was assigned a specific knob. So now each of those knobs were mapped to different values. For example:",
      },
      {
        kind: "list",
        items: [
          "Rotating knob 1 would effect the blur radius, noise amplitude, and hue value",
          "Rotating knob 2 would effect only noise wave",
        ],
      },
      {
        kind: "text",
        text: "Once all the parameters were mapped, I also tested out so that there are no conflicting values tied to multiple knobs. This was essential as it could break the setup.",
      },
      { kind: "media", media: { ...img(`${FRAMER}tWa06kk1CHAXIaQIPDrOzt11qM8.png`), aspect: 567 / 250 } },
      { kind: "heading", text: "Final Outcome" },
      { kind: "text", text: "The final installation was setup and presented at VizChitra 2025 in an audience of over 50+ people." },
      { kind: "heading", text: "Impact" },
      {
        kind: "text",
        text: "With over 50+ people attending the session and interacting with the interactive art installation, it sparked 2 insights amongst the viewers:",
      },
      {
        kind: "list",
        items: [
          "Data is not merely graph and charts, there are more ways to visualise it",
          "A better way of making audience understand something is through interaction and visualisation, rather than just showing numbers on a paper",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}6NNj2VP7BETr1Q5KIFtub7Go.png`), aspect: 567 / 206 } },
      { kind: "media", media: { ...img(`${FRAMER}pklQGu6ZkJGpeoi9GYkDaKlsktQ.png`), aspect: 567 / 206 } },
      { kind: "media", media: { ...img(`${FRAMER}9hZjmA9PSrqvr1pNXGRN2JHzkWM.png`), aspect: 567 / 206 } },
    ],
  },

  // Carried over 1:1 from the v4 case study (ramakrushna.xyz/selected-work/blade-design-system).
  "blade-design-system": {
    summary: "The design system that powers Razorpay's products.",
    title: "Blade Design System - The DS that powers Razorpay",
    subtitle: "Building, maintaining and enhancing the design system that powers the products of Razorpay",
    hero: { type: "youtube", src: "GH3HA6xOFEw", alt: "Blade - Razorpay's Open-Source Design System" },
    links: [
      { label: "Docs", href: "https://blade.razorpay.com" },
      { label: "Code", href: "https://github.com/razorpay/blade" },
    ],
    body: [
      { kind: "heading", text: "Background" },
      {
        kind: "text",
        text: 'Razorpay is a "one stop money movement solution for businesses". It provides a range of products ranging from payments suite to banking suite, from loyalty program management platforms to physical POS device products. It helps processes online payments for online as well as offline businesses.',
      },
      { kind: "heading", text: "Problem Statement" },
      {
        kind: "text",
        text: "How do we drive consistency for our products while facilitating collaboration and making it easy to use for consumers.\n\nRazorpay has 6-8 different business verticals, and has over 100+ frontend engineers and 60+ designers. As the teams and products kept scaling up, three major challenges started to arise:\n\n1. Consistency:\nProducts started looking inconsistent, both from visual and interaction standpoint\n\n2. Collaboration:\nThere used to be lot of back and forth between designers and developers before shipping a product\n\n3. Ease of Use:\nDesigners and engineers were creating custom builds for their products which could have been a reusable pattern.",
      },
      { kind: "media", media: { ...img(`${FRAMER}Vxbt767WI8jN1FhOtoIzd4HAfN8.png`), aspect: 567 / 257 } },
      { kind: "heading", text: "Target Users" },
      {
        kind: "text",
        text: "Our first set of primary users were designers and developers inside the org and then the next set of users were the end users who were using Razorpay's products.\n\nWhat this meant was, while designing we had to keep in mind how using the system becomes easier for our primary set of user while keeping in mind that the visuals and interactions of the components should be easily usable by the secondary set of users.",
      },
      { kind: "heading", text: "Contributions as a Design Systems Designer" },
      {
        kind: "text",
        text: "Over the past 4 years, working as a designer with the design systems team, I have been able to build and contribute to the growth of design systems in various ways. Here is a list of the notable contributions that I have done:\n\n1. Shipping Components\n2. Defining Motion & Interaction of Components\n3. Defining Design Patterns\n4. Building a Data Viz. System\n5. Building Figma Plugins\n6. Expanding Icon Library\n7. DS Governance\n8. Providing DS Education\n9. Maintaining Figma Library\n10. Making Blade Open Source\n11. DS Evangelisation\n12. Contributing to Brand Refresh\n\nMore details about each of these and the impact created are below.",
      },

      { kind: "heading", text: "Shipping Components" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Designed 30+ components from scratch that are being used across 50+ products across Razorpay.",
          "Owned the end-to-end design of the component, including user research, API integration decisions, execution, stakeholder reviews, and final delivery.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Increased the overall component coverage of the design system by 40%.",
          "Saved around INR 50,00,000 ($60,000) and 2000+ hours (~ 1 quarter) by creating reusable design components.",
          "Drove systemic consistency and scalability in terms of visual aesthetics & interaction pattern.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}oKaAUodcn5F39ZluMsRmWBeYGc.png`), aspect: 567 / 257 } },
      { kind: "media", media: { ...img(`${FRAMER}poRReqcykEakRgpjcJG9p8r0w8.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Defining Motion & Interaction of Components" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Designed the interaction behaviour and motion of 32 components that are being used across 30+ products.",
          "Owned the end-to-end motion design flow of the components, including research, execution, reviews, and final delivery.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Integrated consistent motion in 75% of the components in the design system.",
          "Saved around INR 20,00,000 ($24,000) and 700+ hours (~ 1 month) by integrating consistent motion in the design components.",
          "Drove systemic consistency and scalability in terms of component behaviour & interaction pattern.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}RHAJhyhdozyQUrtx7EhDbILG85g.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Defining Design Patterns" },
      { kind: "subheading", text: "What I did?" },
      { kind: "list", items: ["Identified and added 4+ design patterns to the system that are using across various product flows."] },
      { kind: "subheading", text: "Impact Created" },
      { kind: "list", items: ["Drove systemic consistency and scalability by defining common reusable patterns."] },
      { kind: "media", media: { ...img(`${FRAMER}aU7H09Bs4AofrmI8utqQPqQsIKI.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Building Figma Plugins" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Built Pattern Creator Plugin for easier discovery and usage of UI patterns.",
          "Made enhancement to Table Creator Plugin to generate tables with realistic data.",
          "Added Amplitude instrumentation to track usage of plugins.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      { kind: "list", items: ["Easier discovery and adoption of UI patterns with being used by ~5 designers per week."] },
      // v4 embeds a YouTube video here (ll8kImJo07Y) that is private or removed,
      // so it can't play; add it back once it is public again.

      { kind: "heading", text: "Building a Data Viz. System" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Identified ~10 chart component use cases and built 4 of the most used data viz. components",
          "Defined the color logic and foundations for a scalable data visualisation system.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Built a unified data representation system being used in multiple products.",
          "Improved designer efficiency by 80% and developer efficiency by 90%",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}tbRUeYnPzuphE6iEr5TPw7iBFFw.png`), aspect: 567 / 257 } },
      { kind: "media", media: { ...img(`${FRAMER}O8QiRXMZZPIDoK7DZYS9ch3A.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Expanding Icon Library" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Defined design guidelines for designers to refer & contribute icons to Blade.",
          "Identified and added 28 system icons that are used/ requested frequently.",
          "Collaborated with communication designers to add 40+ product icons to the icon library.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Setup processes so that designers can contribute icons to the system.",
          "Scaled up the icon library to handle new products and use cases while maintaining consistency.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}CCcvPjeJoDEt4Vk6jMAHEplA.png`), aspect: 567 / 257 } },
      { kind: "media", media: { ...img(`${FRAMER}bfwT3QfgExwh3cenTWYJp9gHd0.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "DS Governance" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Owned up the deviation requests coming from consumers for various components.",
          "Reviewing and provided inputs on DS implementation in key projects across the organisation",
          "Resolving consumer queries and unblocked them.",
          "Conducted FGDs and brainstorming sessions with designers across teams to understand their pain points better.",
          "Participated and made meaningful additions to the team roadmap.",
          "Enabling others to contribute to the system by pairing up, providing inputs and reviewing the designs.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Drove systemic consistency across brand by validating & reviewing designs.",
          "Contributing to the team roadmap to make meaningful impact.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}kFoTGkyxKUynAJME7KaNcOdga4M.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Providing DS Education" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Teamed up with the Learning and Development team to create educational content on DS Onboarding for new joiners to the team.",
          "Conducted multiple workshops, KT sessions and office hours to educate designers on design system.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      { kind: "list", items: ["Scaled up DS to the org by educating consumers on using DS and Figma functionalities."] },
      { kind: "media", media: { ...img(`${FRAMER}9Ka7WrT871f3Crg0AOHJ9kCYHQ.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Maintaining Figma Library" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Integrated new Figma features and functionalities in the components to keep every component up to date.",
          "Ran internal plugins on a periodic basis to ensure the foundations in design and dev are in sync.",
          "Conducted regular hygiene checks across the DS file.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Led to an overall 70% reduction in total number of variants across 40+ components without compromising the functionalities of the components.",
          "Enhanced designer experience by making the components lighter.",
          "Enhanced developer experience by running plugins and generating code syntax for each foundation.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}7bzQSWdblEVnlzKjHpXXdm1wiPk.png`), aspect: 567 / 257 } },
      { kind: "media", media: { ...img(`${FRAMER}b4sCuuFce7UO8e4hFUeIm31nnoc.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "Making Blade Open Source" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Led the initiative to make Blade DS open source on Figma community.",
          "Upgraded the components, cleaned up and structured the DSL file to publish it on Figma community",
          "Created teaser video for public announcement of the launch.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Evangelising the design system outside the organisation.",
          "Sharing our learnings and building a holistic design systems community in India.",
          "The Figma community file received around 16k+ downloads.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}nbgKxTFgZ03Vzsv2n8GDlTQ0xP0.png`), aspect: 567 / 257 } },

      { kind: "heading", text: "DS Evangelisation" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Wrote a detailed article on the component design process that we follow to design components.",
          "Gave 4 external talks on various aspects of Blade Design System.",
          "Made Blade design open source, the community file is available in Figma community.",
          "Created branding elements and announcement videos to celebrate wins.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Led to global recognition of Blade DS and it being placed along with some mature design systems in the DS community.",
          "Evangelising the design system inside and outside the organisation.",
          "Sharing our learnings and building a holistic design systems community in India.",
        ],
      },

      { kind: "heading", text: "Contributing to Brand Refresh" },
      { kind: "subheading", text: "What I did?" },
      {
        kind: "list",
        items: [
          "Collaborated with brand designers and DS designers to test out the new foundation structure and later setting them up in Figma.",
          "Migrated 25+ components to the new revamped foundations.",
          "Paired up with designers from different pods enabling them to migrate the components to new foundations, by doing KT sessions and reviewing the components.",
          "Upgraded the documentation structure of components for easier consumption.",
        ],
      },
      { kind: "subheading", text: "Impact Created" },
      {
        kind: "list",
        items: [
          "Rigorous testing of foundations led to ensuring that the foundations work fine in different consumer products.",
          "Led to faster migration of components to new refreshed foundation, enabling products to use them faster.",
        ],
      },
      { kind: "media", media: { ...img(`${FRAMER}U8WuZRaivAZiMBv0wnBrAqjd8.png`), aspect: 567 / 257 } },
    ],
  },

  // Written from the DM2601 repo (README, prototype docs: story, architecture,
  // build log), the group's Figma workbook, the live app and customiser, and
  // RK's answers on his role, the duration and the final crit.
  "heart-doll": {
    summary: "A doll whose heart glows when someone far away is there for you.",
    subtitle: "A tangible way to stay close to home across time zones, at the end of the day",
    hero: { type: "video", src: "/work/heart-doll/hero.mp4", poster: "/work/heart-doll/glowing-heart.jpg", alt: "Rocky's heart pulsing on a desk" },
    role: "Research and ideation with the team; I built all the tech: electronics, firmware, phone app and customiser",
    team: "KTH DM2601, group 11: Ellen Bäck, Max Kjellgren, Rama Krushna Behera, Roxanne Kick",
    status: "Course project · 6 weeks · HT26",
    stack: ["ESP32", "Arduino", "ESP Async WebServer", "WebSockets", "React", "React Three Fiber", "Vite", "GitHub Pages"],
    links: [
      { label: "App demo", href: "https://rkdotxyz.github.io/DM2601/app/" },
      { label: "Customiser", href: "https://rkdotxyz.github.io/DM2601/website/" },
      { label: "Research deck", href: "https://rkdotxyz.github.io/DM2601/presentation/" },
      { label: "Code", href: "https://github.com/rkdotxyz/DM2601" },
    ],
    body: [
      {
        kind: "stats",
        items: [
          { value: "9", label: "interviews" },
          { value: "12", label: "papers reviewed" },
          { value: "5", label: "heart states" },
          { value: "6", label: "weeks, team of 4" },
        ],
      },

      { kind: "heading", text: "The brief" },
      {
        kind: "text",
        text: "The course theme was rituals: not habits or routines, but things done consciously, that carry meaning and feel wrong when skipped. We narrowed it to the pre-sleep rituals of people who have moved abroad for work or study, a group we could actually reach, and reframed the question from trouble sleeping to what helps someone wind down well.",
      },

      { kind: "heading", text: "Research" },
      {
        kind: "text",
        text: "We ran nine semi-structured interviews of 20 to 30 minutes with people who had moved abroad, five to study and four to work, covering their pre-sleep routine, what changed when they moved, and what they wished were different.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/participants.jpg", "Interview participants: why they moved, and from where to where"), aspect: 2436 / 795 } },
      {
        kind: "text",
        text: "A literature review of twelve papers, mapped against existing sleep technology, showed one pattern: most tools treat sleep as something to track and optimise. We wanted the ritual before sleep instead, with ambient, screen-free modalities.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/wb-literature-map.jpg", "Literature review: a map of sleep technologies"), aspect: 772 / 543 } },
      {
        kind: "text",
        text: "Affinity mapping clustered the interviews into eight themes. Filtering out purely functional habits left three that carried emotion: talking to people back home, winding down with a show, and heavy phone use that almost everyone felt guilty about.",
      },

      { kind: "heading", text: "The insight" },
      {
        kind: "text",
        text: "Our persona, Marie, 24, moved from Seoul to Stockholm for work. Talking her day through with her parents helps her settle, but Seoul is seven hours ahead: when she's ready to talk, they're asleep, and when they're free, she's busy. She types a long message instead, then scrolls in case they reply, and falls asleep without the conversation she needed.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/wb-persona.jpg", "Persona: Marie, 24, from Seoul, working in Stockholm"), aspect: 772 / 546 } },
      { kind: "quote", text: "How might we make it effortless to know when loved ones in different parts of the world are free to talk?" },

      { kind: "heading", text: "Ideation" },
      {
        kind: "text",
        text: "We started with a worst-possible-idea workshop. Creepy puppets on your bed that wake up and nag you to call home were a bad idea, but a puppet you touch stuck with us: something physical that connects you to home emotionally, rather than a globe that maps geography. Voting narrowed nine ideas to three (a puppet, a globe and constellation lights), and sketching and a moodboard to the puppet.",
      },
      {
        kind: "pair",
        media: [
          { ...img("/work/heart-doll/wb-worst-idea.jpg", "Worst possible idea workshop"), aspect: 772 / 539 },
          { ...img("/work/heart-doll/wb-voting.jpg", "Voting down to three ideas"), aspect: 772 / 544 },
        ],
        caption: "The worst-possible-idea workshop, and voting from nine ideas to three",
      },

      { kind: "heading", text: "Designing the doll" },
      {
        kind: "text",
        text: "Every part has a job. The heart is the light, and each foot is a button: heart for available, cross for not now. There are no arms, so there's nothing to misuse. Glowing eyes were dropped after feedback at the evaluation workshop that they felt scary; the goal was friendly and comforting.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/wb-design-puppet.jpg", "From first sketch and paper prototype to the sewn doll"), aspect: 772 / 546 } },
      { kind: "media", media: { ...img("/work/heart-doll/rocky.jpg", "Rocky: the heart light shows availability; the heart button sets you available, the cross not available"), aspect: 2385 / 1380 }, caption: "Meet Rocky. It doesn't replace a phone or a messaging app; it makes availability tangible." },

      { kind: "heading", text: "Two people, one heart" },
      {
        kind: "text",
        text: "One person has the doll by their bed; the other, far away, has a phone. Each person's availability is their own until they change it, and the heart shows both:",
      },
      {
        kind: "list",
        items: [
          "The doll person presses Heart: slow red breathing while they wait.",
          "The phone person taps their photo: a lub-dub heartbeat at 60%.",
          "Both are there: the same heartbeat at 100%. More of the same signal, not a different one.",
          "Cross means “not now”, not “go away”: the doll goes dark, but the other person stays available, and asking again clears it.",
          "Every press gets a white flash, and blue only ever means no phone is connected.",
        ],
      },
      { kind: "media", media: { ...img("/work/heart-doll/wb-scenario-phone.jpg", "Scenario: the person with the phone reaches out first"), aspect: 773 / 546 } },

      { kind: "heading", text: "The app" },
      {
        kind: "text",
        text: "The phone app is drawn from my own sketch: the doll at the top, your photo in a locket at the bottom, and a glass heart between them, joined by tubes. Each person's liquid flows down their tube and fills their half, so the heart is only ever full when you're both there. It fills from the bottom for you and drips in from the top for them, so the picture also says who arrived.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/app-3d-states.jpg", "Quiet for now, You're here, They're here for you, Together"), aspect: 1704 / 704 }, caption: "Quiet for now, You're here, They're here for you, Together" },
      {
        kind: "text",
        text: "The first version was flat; it worked, but didn't feel like something you'd keep by the bed. I rebuilt it in 3D with React Three Fiber, with one rule shaping the details: liquid always travels down a person's tube before it fills the heart, and drains back the same way, so the picture never shows something impossible. The liquid's surface stays level as the phone tilts.",
      },

      { kind: "heading", text: "Electronics and firmware" },
      {
        kind: "text",
        text: "An ESP32 inside the doll drives an RGB LED through three resistors and reads the two buttons. I tested every part on its own first, with four small sketches for colours, light patterns, buttons and WiFi, so the real firmware could be about behaviour only.",
      },
      {
        kind: "pair",
        media: [
          { ...img("/work/heart-doll/wb-electronics.jpg", "ESP32 as the brain, the LED as the heart, two buttons"), aspect: 773 / 546 },
          { ...img(`${GITHUB}DM2601/main/prototype/hardware/wiring.svg`, "Wiring: ESP32, RGB LED and two buttons"), aspect: 820 / 540 },
        ],
        caption: "The circuit: an ESP32, an RGB heart and two buttons",
      },
      {
        kind: "list",
        items: [
          "The doll is the single source of truth. The rules are one function that never touches the LED or the network, so the light and the app can never disagree.",
          "It makes its own WiFi: scan the QR sticker and the app opens by itself, like hotel WiFi. The 3D app is compiled into the firmware, about 490 KB.",
          "One phone at a time, because there's one person on the other side of the heart. A phone that walks away is dropped after a minute.",
          "Every light pattern is a function of time, so a heartbeat never blocks a button press. The heartbeat is two bell-shaped bumps, lub and dub.",
        ],
      },

      { kind: "heading", text: "Making it" },
      {
        kind: "text",
        text: "My teammates sewed the doll on a sewing machine; I soldered the circuit in the Middla lab at KTH, and we fitted everything inside and tested it against the app.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/making-of.jpg", "Sewing, soldering, and testing the app with the circuit"), aspect: 2295 / 1030 }, caption: "Sewing, soldering, and testing the app with the circuit" },

      { kind: "heading", text: "Problems solved" },
      {
        kind: "list",
        items: [
          "The heart glowed green. This LED's red and green legs were swapped from the usual order, so the pins are swapped in config instead of rewiring, with a red, green, blue check at every start-up to prove it.",
          "Cross used to end everything, so the doll person's “not right now” switched the other person off too. The rules were rewritten so each person's availability is their own.",
          "The university network was out of reach for an ESP32, so the doll stopped joining networks and started making one.",
          "A phone that switched WiFi off didn't always close its connection. The doll now pings quiet phones and lets go of ones that stop answering.",
        ],
      },

      { kind: "heading", text: "Make it yours" },
      {
        kind: "text",
        text: "A web customiser lets you dress the doll in 3D: fabric colours, hats, glasses, extras, stickers that follow the body's curve, drawing straight onto it, and eight little rooms to place it in. The heart glows with the same light as the real doll.",
      },
      { kind: "media", media: { ...img("/work/heart-doll/customiser.jpg", "The Heart Doll customiser"), aspect: 1280 / 800 } },

      { kind: "heading", text: "At the final crit" },
      {
        kind: "list",
        items: [
          "People liked that availability became something you can see and touch, instead of another app.",
          "The glass heart filling in the app landed especially well.",
          "The first question was distance: how it would work between actual countries, which is exactly what the next version is for.",
        ],
      },

      { kind: "heading", text: "Next" },
      {
        kind: "text",
        text: "A cloud relay so the phone works from anywhere, a heartbeat you can feel through a haptic motor, sound and a recorded goodnight, and moving the electronics fully into a soft, battery-powered doll.",
      },
    ],
  },
};
