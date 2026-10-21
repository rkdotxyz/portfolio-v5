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
  | { kind: "media"; media: Media };

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

  // From the repo: github.com/rkdotxyz/esp32-led-snake (README and docs/).
  "esp32-led-snake": {
    summary: "Snake on a 32×8 LED matrix, played from any phone over the ESP32's own WiFi.",
    role: "Solo: hardware, firmware, controller and docs",
    hero: { type: "video", src: "/work/esp32-led-snake/full.mp4", poster: "/work/esp32-led-snake/poster.jpg", controls: true, alt: "ESP32 LED Snake: from the Nokia original to the LED matrix" },
    status: "v2.1 · open source",
    what: "A pocket arcade: Snake on a 256-LED matrix, played from a phone browser. Join the ESP32's own WiFi, open snake.local, and the phone becomes the controller. No app, no router, one USB cable.",
    why: "A first version worked, but it never felt finished, and I couldn't have explained half of why it worked. Starting an MSc in Interactive Media Technology at KTH, coming from design and frontend engineering, I rebuilt it from scratch with one goal: understand every part, and leave a repo someone else could rebuild from.",
    how: "Ten phases, each adding one thing and ending with something visible on the matrix, each tagged in git. Hardware came first, with tiny test sketches: light one pixel, walk a dot through all 256 LEDs, map the matrix's serpentine wiring, stress-test the power. Then the game. The ESP32 runs its own WiFi access point, serves the controller page from flash, and keeps a WebSocket open to every phone: presses go in, score and game events come back. The rules module knows only a grid, a snake and a direction, so the controller, effects, colours and speed-up were all added later without touching it.",
    flow: ["Phone browser", "WiFi + WebSocket", "ESP32", "8×32 LED matrix"],
    sections: [
      {
        title: "The phone is the controller",
        text: "Instead of buttons, the ESP32 hosts its own WiFi network and serves the controller: a d-pad, swipes, pause, restart and settings. There's no app to install and no router, so it works anywhere, including on university networks an ESP32 can't easily join. Between games, the snake and food colours can be picked from presets or any colour, previewed live on the matrix.",
        media: [
          { type: "video", src: "/work/esp32-led-snake/controller.mp4", alt: "Steering from the phone's d-pad" },
          { type: "video", src: "/work/esp32-led-snake/colours.mp4", alt: "Picking the snake's colour on the phone" },
        ],
      },
      {
        title: "Designed around a power budget",
        text: "One USB cable gives the whole board roughly 500 mA; the matrix could draw 15 A fully lit. A firmware cap dims any frame that would draw more than 300 mA, and the look follows from it: a few bright pixels on a dark board, never a lit screen. The constraint shaped the design, not just the wiring.",
      },
      {
        title: "Designing the details",
        text: "Several changes only became obvious on the real matrix.",
        items: [
          "The attract screen first lit every LED faintly behind the demo snake. Just the snake and apples on a dark board looked much cleaner.",
          "The score uses a custom 5×6 font, centred with the top and bottom rows free, and counts up with leading zeros (00, 01 … 12) so the number stays steady.",
          "A navy snake nearly disappeared, so colours are normalised to full strength, with brightness set in one place.",
          "Effects looked choppy when the matrix only redrew as the snake moved. Drawing now runs on its own 30 ms clock, separate from movement.",
          "Switching walls and wrap-around mid-game felt wrong, so settings only open between games.",
          "The phone never assumes a setting changed: a swatch only lights up once the ESP32 confirms it, so two phones can't disagree.",
        ],
        media: [{ type: "video", src: "/work/esp32-led-snake/score.mp4", alt: "The crash, then the score counting up" }],
      },
      {
        title: "Problems solved",
        items: [
          "The code ran, but nothing lit up. The breadboard's power rails were split in the middle, with the ESP32 and the matrix on different halves. When the code says it works and the hardware disagrees, suspect power first.",
          "The web server runs in its own background task, so a phone can add a direction while the game loop takes one out. The shared queue is guarded by a critical section.",
          "A module called network.h collided with the ESP32 core's Network.h, since macOS treats the two names as the same file. It became web_control.",
          "Still open: Safari has no vibration API, so on an iPhone, sound carries the feedback.",
        ],
        media: [{ type: "video", src: "/work/esp32-led-snake/wiring.mp4", alt: "The ESP32 on the breadboard, wired to the matrix" }],
      },
    ],
    stack: ["ESP32", "WS2812B matrix", "C++ / Arduino", "FastLED", "ESP Async WebServer", "WebSockets", "Web Audio"],
    outcome: "v2.1: attract screen, crash animation and score, walls or wrap-around, custom snake and food colours, a pulsing head, fading tail and eat sparkle, phone sounds, a snake that speeds up as it grows, and settings that survive power-off. Documented as a ten-phase build guide, with the architecture, protocol and build log. Next: a saved high score, a 3D-printed diffuser, and two-player Snake.",
    links: [
      { label: "Code", href: "https://github.com/rkdotxyz/esp32-led-snake" },
      { label: "Build guide", href: "https://github.com/rkdotxyz/esp32-led-snake/tree/main/docs/guide" },
    ],
    gallery: [{ ...img(`${GITHUB}esp32-led-snake/main/hardware/wiring.svg`, "Wiring: ESP32, WS2812B matrix, capacitor and data resistor"), aspect: 820 / 420 }],
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
    // Not in the v4 write-up: photos from showing it at VizChitra 2025.
    gallery: [
      { ...img("/work/x/planet-vizchitra-setup.jpg", "The installation set up at VizChitra 2025"), aspect: 1 },
      { ...img("/work/x/planet-vizchitra-controls.jpg", "The control panel: a MIDI controller mapped to the planet's parameters"), aspect: 1 },
      { ...img("/work/x/planet-vizchitra-schedule.jpg", "The talk at VizChitra 2025: Planet Under Pressure, Designing Tools for Environmental Storytelling"), aspect: 1 },
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

  // From the repo (github.com/rkdotxyz/DM2601) and the group's Figma workbook.
  "heart-doll": {
    summary: "A doll whose heart glows when someone far away is there for you.",
    hero: { type: "video", src: "/work/heart-doll/hero.mp4", poster: "/work/heart-doll/glowing-heart.jpg", alt: "Rocky's heart pulsing on a desk" },
    team: "KTH DM2601, group 11: Ellen Bäck, Max Kjellgren, Rama Krushna Behera, Roxanne Kick",
    status: "Course project · HT26",
    what: "Rocky, a soft doll by the bed for people who have moved abroad. It isn't designed to replace a phone or a messaging app. It makes availability tangible: its heart glows when someone far away is free, and a button in each foot answers back, heart for available and cross for not now. A quiet sense of presence across distance.",
    why: "The course theme was rituals. We focused on the pre-sleep rituals of people who have moved abroad for work or study, and on one tension in them: wanting to share your day with family in another time zone, who are asleep by the time you're free.",
    sections: [
      {
        title: "Research",
        text: "Nine semi-structured interviews with people who had moved abroad, five to study and four to work. A literature review of twelve papers and a map of sleep technology showed that most tools treat sleep as something to track and optimise; we wanted the ritual before sleep, with ambient, screen-free modalities. An affinity diagram turned the interviews into a persona, Marie, 24, who moved from Seoul to Stockholm for work, and a question: how might we help people stay connected with family across time zones as part of their bedtime routine?",
        media: [
          { ...img("/work/heart-doll/participants.jpg", "Interview participants: why they moved, and from where to where"), aspect: 2436 / 795 },
        ],
      },
      {
        title: "From ideas to a doll",
        text: "Ideation started with a worst-possible-idea workshop. Creepy puppets on your bed that wake up and nag you to call home were a bad idea, but a puppet you touch turned out to be a good one: something physical that connects you to home emotionally, rather than a globe that maps geography. After voting it down to a puppet, a globe and constellation lights, we sketched, built paper prototypes and took them to an evaluation workshop. The doll only has parts with a job: a heart that lights, and a button in each leg. No arms, so nothing to misuse. Glowing eyes were dropped after feedback that they felt scary.",
        media: [{ ...img("/work/heart-doll/evolution.jpg", "The first sewn doll, and Rocky"), aspect: 1245 / 555 }],
      },
      {
        title: "Meet Rocky",
        text: "We sewed the doll on a sewing machine, soldered the circuit (ESP32, buttons and LED) in the Middla lab at KTH, and fitted everything inside.",
        media: [
          { ...img("/work/heart-doll/rocky.jpg", "Rocky: the heart light shows availability; the heart button sets you available, the cross not available"), aspect: 2385 / 1380 },
          { ...img("/work/heart-doll/making-of.jpg", "Sewing, soldering, and testing the app with the circuit"), aspect: 2295 / 1030 },
        ],
      },
      {
        title: "Two people, one heart",
        text: "Each person's availability is their own until they change it, and the heart shows both.",
        items: [
          "The doll person presses Heart: slow red breathing while they wait.",
          "The phone person taps their photo: a lub-dub heartbeat at 60%.",
          "Both are there: the same heartbeat at 100%. More of the same signal, not a different one.",
          "Cross means “not now”, not “go away”: the doll goes dark, but the other person stays available.",
          "Every press gets a white flash, and blue only ever means no phone is connected.",
        ],
      },
      {
        title: "The app",
        text: "A glass heart, joined by tubes to the doll at the top and your photo at the bottom. Each person's liquid flows down their tube and fills their half, so the heart is only full when you're both there. Built in 3D with React Three Fiber, with a liquid surface that stays level as the phone tilts.",
        media: [{ ...img("/work/heart-doll/app-states.jpg", "Quiet for now, You're here, They're here for you, Together"), aspect: 2355 / 1095 }],
      },
      {
        title: "How it works",
        text: "An ESP32 inside the doll drives an RGB LED and reads the two buttons. It makes its own WiFi network: scan the QR sticker, and the app, compressed into the firmware, opens by itself like hotel WiFi. The rules are one function, nextState(), that never touches the LED or the network, and the doll is the single source of truth, so the light and the app can't disagree. Every light pattern is a function of time, so a heartbeat never blocks a button press.",
        flow: ["Heart + Cross buttons", "ESP32", "RGB heart", "WiFi + WebSocket", "3D phone app"],
        media: [{ ...img(`${GITHUB}DM2601/main/prototype/hardware/wiring.svg`, "Wiring: ESP32, RGB LED and two buttons"), aspect: 820 / 540 }],
      },
    ],
    stack: ["ESP32", "Arduino", "ESP Async WebServer", "React", "React Three Fiber", "Vite"],
    outcome: "A working prototype in a sewn doll, a 3D phone app with a simulated doll for demos, and a web customiser to dress the doll. Next on the roadmap: a heartbeat you can feel, sound and a recorded goodnight, and a cloud relay so it works between countries.",
    links: [
      { label: "App demo", href: "https://rkdotxyz.github.io/DM2601/app/" },
      { label: "Customiser", href: "https://rkdotxyz.github.io/DM2601/website/" },
      { label: "Research deck", href: "https://rkdotxyz.github.io/DM2601/presentation/" },
      { label: "Code", href: "https://github.com/rkdotxyz/DM2601" },
    ],
  },
};
