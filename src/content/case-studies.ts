/* ------------------------------------------------------------------ *
 *  Short case studies, opened from a card on the canvas. Keyed by the
 *  work item's id (see work.ts). Keep each one brief: what it is, why it
 *  exists, how it works. Leave a field out to hide that part.
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
  stack?: string[];
  outcome?: string;
  links?: { label: string; href: string }[];
  gallery?: Media[]; // captioned by each item's alt
};

export const caseStudies: Record<string, CaseStudy> = {
  /* ── Key projects ─────────────────────────────────────────────── */

  "esp32-led-snake": {
    summary: "Snake on a 32×8 LED matrix, played from any phone over the ESP32's own WiFi.",
    status: "Working prototype",
    what: "A pocket arcade: the classic Snake game on a 256-LED matrix, controlled from a phone browser. No app, no router, one USB cable.",
    how: "The ESP32 runs its own WiFi access point and serves the controller page itself. A live WebSocket carries button presses in and score and game events back out. Game rules, display, controller and settings are separate modules, and a firmware power cap keeps 256 LEDs safe on USB power.",
    flow: ["Phone browser", "WiFi + WebSocket", "ESP32", "8×32 LED matrix"],
    stack: ["ESP32", "C++ / Arduino", "FastLED", "WebSockets", "HTML / JS controller"],
    outcome: "Attract screen, crash animation, walls or wrap-around, colour presets, phone-side sound and haptics, and settings that survive power-off.",
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/esp32-led-snake" }],
    gallery: [img(`${GITHUB}esp32-led-snake/main/hardware/wiring.svg`, "Wiring: ESP32, WS2812B matrix, capacitor and data resistor")],
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

  "heart-doll": {
    summary: "A doll whose heart glows when someone far away is there for you.",
    team: "KTH DM2601, group 11: Ellen, Max, Rama Krushna, Roxanne",
    status: "Course project · HT26",
    what: "A doll for pre-sleep rituals, made for people who have moved abroad for work or study. Its heart glows when someone far away is there for you.",
    why: "The course theme was pre-sleep rituals. We focused on people living away from home, working from literature, interviews, a persona and affinity analysis toward a direction and ideas.",
    how: "An ESP32 drives an RGB LED heart and two buttons, and serves a phone app of its own. The app, rebuilt in 3D with React Three Fiber, shows a glass heart that fills as the two people join. A separate web customiser lets you dress the doll: colours, hats, glasses, stickers and drawing.",
    flow: ["Buttons", "ESP32", "RGB heart", "Phone app (3D)"],
    stack: ["ESP32", "Arduino", "React", "React Three Fiber", "Vite", "GitHub Pages"],
    links: [
      { label: "Customiser", href: "https://rkdotxyz.github.io/DM2601/website/" },
      { label: "App demo", href: "https://rkdotxyz.github.io/DM2601/app/" },
      { label: "Research deck", href: "https://rkdotxyz.github.io/DM2601/presentation/" },
      { label: "Code", href: "https://github.com/rkdotxyz/DM2601" },
    ],
    gallery: [
      img(`${GITHUB}DM2601/main/presentation/images/persona.png`, "Persona from the research phase"),
      img(`${GITHUB}DM2601/main/prototype/hardware/wiring.svg`, "Wiring: ESP32, RGB LED and two buttons"),
    ],
  },

  /* ── Side projects ────────────────────────────────────────────── */

  "mystic-designs": {
    summary: "A newsletter documenting products that redefine how tangible interfaces work.",
    status: "Newsletter on Substack",
    what: "A curation of real-world tangible UI and interactions: products that redefine how tangible interfaces work, shared as a weekly dose of design inspiration.",
    links: [{ label: "Read", href: "https://www.mysticdesigns.xyz/" }],
  },

  keyscout: {
    summary: "A Figma plugin to search, filter and export the keys and IDs of components, styles and variables.",
    status: "Published on Figma Community",
    what: "KeyScout finds the keys and IDs of components, styles and variables in a Figma file, and exports them as JSON, CSV, TXT or TypeScript.",
    stack: ["Figma plugin API", "HTML", "JavaScript"],
    links: [
      { label: "Figma Community", href: "https://www.figma.com/community/plugin/1537879434431017434/keyscout" },
      { label: "Code", href: "https://github.com/rkdotxyz/keyscout-plugin" },
    ],
  },

  "pattern-creator": {
    summary: "A Figma plugin for discovering and using Blade's UI patterns.",
    what: "Built as part of Blade at Razorpay: a plugin that makes the system's UI patterns easy to find and use, covering dashboards, list views, detail views, creation views, modal templates and settings, for desktop and mobile.",
    stack: ["Figma plugin API", "Blade components", "Amplitude"],
    outcome: "Around 5 daily users and about 70% time saved, with usage tracked through Amplitude.",
    gallery: [
      img(`${GITHUB}pattern-creator-plugin-images/main/list_view_desktop.png`, "List view pattern, desktop"),
      img(`${GITHUB}pattern-creator-plugin-images/main/detail_view_desktop.png`, "Detail view pattern, desktop"),
      img(`${GITHUB}pattern-creator-plugin-images/main/detail_view_mobile.png`, "Detail view pattern, mobile"),
    ],
  },

  healthicons: {
    summary: "Free, open-source health icons, made with a team of volunteer designers.",
    role: "Volunteer designer",
    what: "An icon library for health projects: outline and filled icons in SVG and PNG, released into the public domain (CC0), so anyone can use, edit and republish them without credit.",
    links: [{ label: "Healthicons", href: "https://healthicons.org/" }],
  },

  stratosplash: {
    summary: "Gradients inspired by the sky.",
    what: "A curated collection of gradients captured from real skies, real moments and real places, gathered in one place to browse and use.",
    stack: ["Framer"],
    links: [{ label: "Visit", href: "https://stratosplash.framer.website/" }],
  },

  "scenic-seats": {
    summary: "Which side of the plane has the best view? Find out for any Indian domestic route.",
    what: "Enter a route and a departure time, and Scenic Seats tells you which side of the plane to sit on: for the sunrise, the sunset, or a notable view below such as mountains, coastlines or lakes.",
    how: "It covers 198 Indian domestic routes, each with three independent view types: sunrise, sunset and scenic.",
    links: [{ label: "Try it", href: "https://scenic-seats.vercel.app" }],
  },

  /* ── Explorations ─────────────────────────────────────────────── */

  "pen-plotter": {
    summary: "Pushing a pen plotter beyond pen and paper, one medium at a time.",
    status: "Ongoing since 2022",
    what: "A series of plots, each using a different medium in the plotter's pen holder: sketch pen, UV ink, an LED, a micro-tip pen, pencil, brush pen, calligraphy pen and gel pen.",
    why: "A pen plotter works well with a simple pen and paper. The question was what happens when you push it: what else can go in the pen holder, and what ideas can it bring to life?",
    how: "Artworks were generated in TouchDesigner, p5.js, a maze generator and QGIS, then plotted. The UV ink plot hides an easter egg that only shows under UV light. The LED was captured with long-exposure photography. The micro-tip plot is a contour map of the Himalayas over Sikkim from open elevation data. The pencil plot draws a grid over coins to fake an embossed effect, and the brush pen shows how the arm's weight changes stroke width when it is extended.",
    stack: ["Pen plotter", "TouchDesigner", "p5.js", "QGIS"],
    gallery: [
      img(`${FRAMER}t7oQyurKHBTpUxq6laEWOGwkCss.png`, "The series"),
      img(`${FRAMER}8Y9Eh4Wdv5yGccSigjK4NDnnwU.png`, "001 · Sketch pen"),
      img(`${FRAMER}ee2Cr1bKZQR2GdHNGomQbm2Y1c.png`, "002 · UV ink pen"),
      img(`${FRAMER}BO45dFu1JfXvb7JqxK210hmCJI.png`, "003 · LED light, long exposure"),
      img(`${FRAMER}mBfXsexqmaPm5y6sziwrbMZs88.png`, "004 · Micro-tip pen: Himalayan contours"),
      img(`${FRAMER}cpptd1uKslvqja42s2vGMTylXQ.png`, "005 · Pencil over coins"),
      img(`${FRAMER}lZYSoLpbj7VxLNOSYBIez4AyYRM.png`, "006 · Brush pen"),
      img(`${FRAMER}mJImn26HMmWYQNSkR3dZwPO1cU.png`, "007 · Calligraphy pen"),
      img(`${FRAMER}KmfnyPij19vTllpvNAohppOO0.png`, "008 · Gel pen ASCII art"),
    ],
  },

  "gesture-bloom": {
    summary: "Open your hand, and a paper flower opens with it.",
    status: "In progress",
    what: "A paper flower that mirrors your hand. A webcam watches how open your hand is, and a servo inside the flower opens or closes the petals to match.",
    how: "MediaPipe hand tracking runs in Chrome and turns the hand into a single openness value. The browser sends it over USB with Web Serial to an Arduino Uno, which drives an MG996R servo. The servo winds a thread that pulls the petals closed; unwinding lets them fall open.",
    flow: ["Webcam", "MediaPipe", "Web Serial", "Arduino Uno", "Servo", "Paper flower"],
    stack: ["MediaPipe", "JavaScript", "Web Serial", "Arduino", "MG996R servo", "Paper mechanism"],
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/gesture-bloom" }],
  },

  "sonic-signature": {
    summary: "Draw a shape or sign your name, and hear it.",
    what: "An interactive web app that turns drawings into sound. Draw on the canvas and your signature or shape becomes its own audio composition.",
    how: "Strokes are turned into sound in real time, with controls for the waveform and frequency.",
    stack: ["TypeScript"],
    links: [
      { label: "Try it", href: "https://sonic-signature.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/Sonic-Signature" },
    ],
  },

  "force-field": {
    summary: "A grid of circles that bends around your cursor.",
    what: "An interactive art tool: a grid of circles responds to the cursor, producing force-field patterns as you move.",
    how: "Attraction or repulsion, circle density and field strength can all be tuned live.",
    stack: ["TypeScript"],
    links: [
      { label: "Try it", href: "https://force-field-jade.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/Force-Field" },
    ],
  },

  "pixel-art-generator": {
    summary: "Turn any image into pixel art.",
    what: "A web tool that converts images into pixel art with retro-style effects.",
    how: "Adjustable pixel size and a choice of colour palettes, from the original colours to greyscale.",
    stack: ["TypeScript"],
    links: [
      { label: "Try it", href: "https://pixel-art-generator-lilac.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/Pixel-Art-Generator" },
    ],
  },

  "language-of-gen-z": {
    summary: "A fun, data-driven look at Gen Z's most-used slang and emojis.",
    what: "An interactive word cloud of popular Gen Z slang and emojis. Toggle between the two, and hover any word for its definition.",
    stack: ["D3.js", "JavaScript"],
    links: [
      { label: "Try it", href: "https://the-language-of-gen-z.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/the-language-of-gen-z" },
    ],
  },

  middventory: {
    summary: "A pixel-style map of every part in Middla Lab, and which drawer it lives in.",
    what: "An inventory of the lab's components in a pixel style, showing which drawer each part lives in.",
    how: "A static site in plain HTML, CSS and JavaScript; the parts list and drawer names live in one data file, so anyone can keep it up to date.",
    stack: ["HTML", "CSS", "JavaScript"],
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/middventory" }],
  },

  "motion-studio": {
    summary: "Short films rendered entirely from code.",
    what: "A setup for making motion pieces in code and rendering them to video.",
    how: "Every film is a pure function of time: seeking to a moment paints that exact frame, with seeded noise instead of randomness, so a Node script can step through the frames and encode them to H.264.",
    stack: ["JavaScript", "Node.js"],
  },

  "projection-ttt": {
    summary: "Tic-tac-toe, projected onto a surface and played with your hands.",
    status: "In progress",
    what: "A projected game of tic-tac-toe. The board is mapped onto a physical surface and moves are made by hand rather than with a mouse.",
    how: "Built up through separate tests for the webcam, hand tracking, mapping the projected grid and calibrating projector and camera together.",
    flow: ["Webcam", "Hand tracking", "Calibration", "Projected grid"],
  },

  "projection-mapping": {
    summary: "Visuals mapped onto physical objects.",
    status: "Experiment",
  },
  shader: {
    summary: "Colour and motion from a shader.",
    status: "Experiment",
  },
  "midi-controller": {
    summary: "Visuals played live with a MIDI controller.",
    status: "Experiment",
  },
  "generative-music": {
    summary: "Music generated from code.",
    status: "Experiment",
  },
  "light-painting": {
    summary: "Drawing with light.",
    status: "Experiment",
  },
  "audio-reactive": {
    summary: "Visuals that move with sound.",
    status: "Experiment",
  },
  typography: {
    summary: "Letterforms in motion.",
    status: "Experiment",
  },
};

// Shown for work that has no case study yet, so the layout can be reviewed.
export const placeholderCaseStudy: CaseStudy = {
  summary: "One line on what this is.",
  role: "Your role",
  team: "Who you worked with",
  status: "Year · status",
  what: "Two or three sentences on what the project is and who it is for.",
  why: "The problem, question or curiosity that started it.",
  how: "How it works: the build, the technology and the key decisions.",
  flow: ["Input", "Processing", "Output"],
  stack: ["Tool", "Tool", "Tool"],
  outcome: "What came of it: results, learnings, where it went next.",
};
