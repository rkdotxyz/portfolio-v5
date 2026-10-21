/* ------------------------------------------------------------------ *
 *  Work shown on the open canvas.
 *
 *  `media` is the card's image or video:
 *    media: pic("/work/x/cad.jpg", "alt", 1.6)     // jpg, png, webp, gif, svg
 *    media: vid("/work/x/shader.mp4", "alt", 1)    // mp4/webm, plays muted on loop
 *  The last number is the media's width / height: cards take the shape of
 *  their media, so the canvas mixes square, tall and wide cards. Without it
 *  a card uses its category's default shape. Local files go in /public/work;
 *  remote URLs need their host listed in next.config.ts. Without `media`,
 *  the card shows a generative placeholder.
 *
 *  Key projects sit at fixed positions in the middle. Everything else is
 *  packed around them on four sides (see open-canvas.tsx and lib/pack.ts):
 *  video cards first, so they ring the key projects, then image cards, then
 *  cards without media, each group sorted by `interest` and dealt to the
 *  sides in turn so the highlights are spread evenly.
 *
 *  `id` is the key project's URL slug (/work/<id>) and the key for its case
 *  study in case-studies.ts.
 * ------------------------------------------------------------------ */

export type Category = "key-project" | "side-project" | "exploration";

// `youtube` media uses the video id as `src`. `aspect` (width / height) keeps
// an image at its original proportions where it is shown uncropped.
// `controls` shows a video with its sound and player controls instead of a
// silent loop, starting from `poster`.
export type Media = {
  type: "image" | "video" | "youtube";
  src: string;
  alt?: string;
  aspect?: number;
  controls?: boolean;
  poster?: string;
};

export type WorkItem = {
  id: string;
  category: Category;
  title: string;
  year?: string;
  media?: Media;
  // Key projects: the kinds of work, shown as label segments on their always-on frame.
  tags?: string[];
  // Side projects and explorations: a line or two shown in a callout on hover,
  // and what it was made with. (Key projects have a case study page instead.)
  about?: string;
  tools?: string[];
  // A live site or listing: clicking the card opens it in a new tab.
  url?: string;
  // Not finished yet: the card says so.
  wip?: boolean;
  // How eye-catching the media is: 1 = the most, 2 = solid, unset = plain
  // (screen recordings, documents). The canvas spreads each level evenly
  // around the key projects, so no side is all highlights or all plain.
  interest?: 1 | 2;
  // Key projects: world position on the canvas (top-left corner), in px.
  x?: number;
  y?: number;
  // Card width in world px. Defaults to one that suits the media's shape.
  w?: number;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  "key-project": "key project",
  "side-project": "side project",
  exploration: "exploration",
};

// Where existing media lives: the v4 (Framer) site and GitHub.
export const FRAMER = "https://framerusercontent.com/images/";
export const GITHUB = "https://raw.githubusercontent.com/rkdotxyz/";

export const img = (src: string, alt?: string): Media => ({ type: "image", src, alt });
export const pic = (src: string, alt: string, aspect?: number): Media => ({ type: "image", src, alt, aspect });
export const vid = (src: string, alt: string, aspect?: number): Media => ({ type: "video", src, alt, aspect });

const X = "/work/x/";

// Key project card width, in world px.
const KEY = 360;

// Default media shape (width / height) per category.
export const DEFAULT_ASPECT: Record<Category, number> = { "key-project": 16 / 10, "side-project": 4 / 3, exploration: 1 };

// The shape of a card's media: key projects keep one shape so the cluster
// stays a grid; everything else follows its media.
export const aspectOf = (item: WorkItem) =>
  item.category === "key-project" ? DEFAULT_ASPECT[item.category] : (item.media?.aspect ?? DEFAULT_ASPECT[item.category]);

// Wide media gets a wider card and tall media a narrower one, so cards hold
// roughly similar areas. Side projects run a little larger than explorations.
export function widthOf(item: WorkItem) {
  if (item.w) return item.w;
  if (item.category === "key-project") return KEY;
  const a = aspectOf(item);
  const base = a >= 2 ? 300 : a >= 1.5 ? 250 : a >= 1.15 ? 220 : a >= 0.95 ? 190 : a >= 0.75 ? 170 : 150;
  return base + (item.category === "side-project" ? 20 : 0);
}

export const work: WorkItem[] = [
  // Key projects: a 2×2 cluster at the centre of the canvas.
  {
    id: "esp32-led-snake",
    category: "key-project",
    title: "ESP32 LED Snake",
    year: "2026",
    tags: ["physical computing", "game", "embedded web"],
    media: { type: "video", src: "/work/esp32-led-snake/cover.mp4", alt: "Snake running on the curved LED matrix" },
    x: -KEY - 24,
    y: -300,
    w: KEY,
  },
  {
    id: "planet-under-pressure",
    category: "key-project",
    title: "Planet Under Pressure",
    year: "2025",
    tags: ["data art", "interactive installation"],
    media: {
      type: "video",
      src: "https://framerusercontent.com/assets/yit5o8m47SUwAemEkxiWGGDKiA.mp4",
      alt: "The planet changing as data parameters move",
      poster: "/work/planet/poster.jpg", // a still for share cards
    },
    x: 24,
    y: -300,
    w: KEY,
  },
  {
    id: "blade-design-system",
    category: "key-project",
    title: "Blade Design System",
    year: "2022–26",
    tags: ["design system", "figma plugins", "ai agents"],
    // A loop from the Blade launch video; the still stands in for share cards.
    media: {
      ...vid("/work/blade/cover.mp4", "Blade components, then its variable library, from the launch video"),
      poster: `${FRAMER}TlacyP4UHkDd8DiBZNtzn9YEeM.png`,
    },
    x: -KEY - 24,
    y: 20,
    w: KEY,
  },
  {
    id: "heart-doll",
    category: "key-project",
    title: "Heart Doll",
    year: "2026",
    tags: ["soft robotics", "electronics", "tangible"],
    media: {
      ...vid("/work/heart-doll/cover.mp4", "Rocky, the Heart Doll, with its heart pulsing red"),
      poster: "/work/heart-doll/glowing-heart.jpg",
    },
    x: 24,
    y: 20,
    w: KEY,
  },

  // Everything else, nearest the centre first.
  { id: "led-mapping", category: "exploration", title: "LED Mapping", year: "2025", about: "Visuals mapped onto a curved LED matrix, one colour wash at a time.", media: vid(`${X}led-mapping.mp4`, "Colour washing across a curved LED matrix", 540 / 720), interest: 1 },
  { id: "pattern-creator", category: "side-project", title: "Pattern Creator", about: "A Figma plugin, built for Blade at Razorpay, that makes the system's UI patterns easy to find and use. About 70% time saved.", tools: ["Figma plugin API", "Amplitude"], media: vid(`${X}pattern-creator.mp4`, "Generating a page from a UI pattern in Figma", 1310 / 1039) },
  { id: "conclave", category: "exploration", title: "Design Conclave Installation", year: "2025", about: "My first installation, built for the Razorpay Design Conclave: visitors on a big screen, glitched in real time.", media: vid(`${X}conclave.mp4`, "Visitors on a screen, glitching", 4 / 3), interest: 1 },
  { id: "pen-plotter", category: "exploration", title: "Pen Plotter Experiments", year: "2022–", about: "Pushing a pen plotter beyond pen and paper: UV ink, an LED, pencil, brush and calligraphy pens, one medium per plot.", tools: ["TouchDesigner", "p5.js", "QGIS"], media: vid(`${X}pen-plotter.mp4`, "The plotter drawing curves in blue and red", 0.8), interest: 1 },
  { id: "token-visualiser", category: "side-project", title: "Blade Token Visualiser", year: "2025", about: "A tool that maps Blade's global colour tokens to the semantic tokens that use them.", media: vid(`${X}token-visualiser.mp4`, "Lines linking global and semantic colour tokens", 720 / 524) },
  { id: "shader", category: "exploration", title: "Shader Art", year: "2025", about: "A kaleidoscopic shader, cycling through colours.", media: vid(`${X}shader.mp4`, "A kaleidoscopic shader cycling through colours", 1), interest: 1 },
  { id: "oled-art", category: "exploration", title: "OLED Generative Art", year: "2026", about: "Generative art on a 0.96-inch OLED screen, driven by an Arduino.", tools: ["Arduino"], media: vid(`${X}oled-art.mp4`, "Generative patterns on a tiny OLED on a breadboard", 16 / 9), interest: 2 },
  { id: "shader-bands", category: "exploration", title: "Shader", about: "Flowing bands of colour from a shader.", media: img(`${FRAMER}DO3mYijHrDZGuzgr1gna9uLGaHo.gif`, "Flowing shader colour bands"), interest: 2 },
  { id: "mystic-designs", category: "side-project", title: "Mystic Designs", about: "A newsletter curating real-world tangible UI: products that redefine how tangible interfaces work.", tools: ["Substack"], media: vid(`${X}mystic-designs-site.mp4`, "Scrolling the Mystic Designs archive", 4 / 3), url: "https://www.mysticdesigns.xyz" },
  { id: "audio-reactive", category: "exploration", title: "Audio Reactive", year: "2025", about: "LEDs that pulse and change colour with the music.", media: vid(`${X}audio-reactive.mp4`, "A red LED matrix with green bars jumping to sound", 16 / 9), interest: 1 },
  { id: "light-plot", category: "exploration", title: "Plots in Changing Light", year: "2025", about: "A two-colour plot that changes with the light: under blue light the blue lines vanish, under red the red ones do.", tools: ["Pen plotter"], media: pic(`${X}light-plot.jpg`, "The same plot under white, blue and red light", 1212 / 600), interest: 1 },
  { id: "projection-mapping", category: "exploration", title: "Projection Mapping", year: "2025–26", about: "Visuals projection-mapped onto physical objects, as a numbered series of experiments.", media: vid(`${X}projection-mapping.mp4`, "Colourful noise projected onto a book and boxes", 1), interest: 1 },
  { id: "coral-dreams", category: "exploration", title: "Coral Dreams", year: "2026", about: "Gesture-controlled artwork inspired by a trip to the Andaman Islands: your hands move through a 3D coral reef.", tools: ["TouchDesigner"], media: vid(`${X}coral-dreams.mp4`, "A 3D coral reef moving with hand gestures, with the webcam view in the corner", 720 / 406), interest: 1 },
  { id: "framer-components", category: "exploration", title: "Framer Components", year: "2025", about: "Concepts prototyped in Google AI Studio, rebuilt as custom Framer components: a photo turned into dots that scatter around the cursor.", tools: ["Google AI Studio", "Framer"], media: vid(`${X}framer-components.mp4`, "A portrait made of dots, scattering", 720 / 422), interest: 2 },
  { id: "live-camera-led", category: "exploration", title: "Live Camera × LEDs", year: "2025", about: "A live camera feed, reduced to a few pixels and mapped onto the LED matrix.", media: vid(`${X}live-camera-led.mp4`, "A silhouette in blue on a red LED matrix", 4 / 3), interest: 1 },
  { id: "healthicons", category: "side-project", title: "Healthicons", about: "Free, open-source health icons in the public domain, made with a team of volunteer designers.", media: pic("/work/healthicons.jpg", "The Healthicons library", 4 / 3), url: "https://healthicons.org" },
  { id: "uv-maze", category: "exploration", title: "UV Ink Maze", year: "2025", about: "A plotted maze in UV ink: plain on paper, glowing under UV light.", tools: ["Pen plotter"], media: pic(`${X}uv-maze.jpg`, "A circular maze, in daylight and under UV", 2 / 3), interest: 1 },
  { id: "force-field", category: "exploration", title: "Force Field", year: "2025", about: "A grid of circles that bends around your cursor, with live controls for attraction, density and strength.", tools: ["TypeScript"], media: vid(`${X}force-field.mp4`, "A dot grid warping around the cursor", 720 / 616), url: "https://force-field-jade.vercel.app", interest: 2 },
  { id: "project-explorer", category: "exploration", title: "Project Explorer", year: "2025", about: "Ways to show different kinds of projects for the v4 site: a treemap and a sunburst of design, code and art.", media: vid(`${X}project-explorer.mp4`, "A treemap of projects turning into a sunburst", 720 / 608) },
  { id: "keyscout", category: "side-project", title: "KeyScout", year: "2025", about: "A Figma plugin that finds the keys and IDs of components, styles and variables, and exports them as JSON, CSV, TXT or TypeScript.", tools: ["Figma plugin API", "JavaScript"], media: pic("/work/keyscout.jpg", "KeyScout on Figma Community", 4 / 3), url: "https://www.figma.com/community/plugin/1537879434431017434/keyscout" },
  { id: "projection-car", category: "exploration", title: "Projection on a Toy Car", year: "2026", about: "Projection mapping onto a toy car, from the numbered series of experiments.", media: vid(`${X}projection-car.mp4`, "Light projected onto a toy car in the dark", 720 / 328), interest: 2 },
  { id: "ascii-plots", category: "exploration", title: "ASCII Plots", year: "2025", about: "Images rebuilt from ASCII characters, then pen-plotted and framed.", tools: ["Pen plotter"], media: pic(`${X}ascii-plots.jpg`, "A framed green ASCII plot", 0.8), interest: 2 },
  { id: "stratosplash", category: "side-project", title: "Stratosplash", year: "2025", about: "Gradients captured from real skies, real moments and real places, collected in one place.", tools: ["Framer"], media: vid(`${X}stratosplash-site.mp4`, "Scrolling the Stratosplash gradients", 4 / 3), url: "https://stratosplash.framer.website" },
  { id: "midi-controller", category: "exploration", title: "MIDI Controller", year: "2025", about: "Visuals played live with a MIDI controller.", media: vid(`${X}midi-controller.mp4`, "Visuals changing as MIDI knobs turn", 720 / 552), interest: 2 },
  { id: "mapbox", category: "exploration", title: "Map Visualisations", year: "2026", about: "Simple map visualisations from open-source data, styled in Mapbox.", tools: ["Mapbox"], media: pic(`${X}mapbox.jpg`, "Points along India's coast on a dark map", 1), interest: 2 },
  { id: "toefl-practice", category: "side-project", title: "TOEFL Practice", year: "2025", about: "Built for a friend to practise TOEFL speaking and writing: Gemini writes the questions and evaluates the answers.", tools: ["Google AI Studio", "Gemini API"], media: vid(`${X}toefl-practice.mp4`, "A TOEFL practice question and its rubric", 16 / 9) },
  { id: "photo-td", category: "exploration", title: "Glitched Landscapes", year: "2025", about: "Landscape photos pulled apart into motion: photography mixed with real-time visuals.", media: vid(`${X}photo-td.mp4`, "A cloudscape smearing into streaks", 0.8), interest: 2 },
  { id: "sonic-signature", category: "exploration", title: "Sonic Signature", year: "2025", about: "Draw a shape or sign your name, and hear it as its own composition.", tools: ["TypeScript"], media: vid(`${X}sonic-signature.mp4`, "A smiling face drawn on the canvas", 720 / 606), url: "https://sonic-signature.vercel.app" },
  { id: "not-my-hometown", category: "exploration", title: "Not My Hometown", year: "2026", about: "Low-key filmmaking: a short film about finding your way around Stockholm.", media: vid(`${X}not-my-hometown.mp4`, "A hot air balloon over Stockholm, with a title", 2.4), interest: 2 },
  { id: "middventory", category: "side-project", title: "Middventory", year: "2026", about: "A pixel-style map of every part in Middla Lab, and which drawer it lives in.", tools: ["HTML", "CSS", "JavaScript"], media: pic("/work/middventory.jpg", "The Middventory parts grid", 4 / 3), url: "https://middventory-w9yd.vercel.app" },
  { id: "pixel-art-generator", category: "exploration", title: "Pixel Art Generator", year: "2025", about: "Turns any image into pixel art, with adjustable pixel size and colour palettes.", tools: ["TypeScript"], media: vid(`${X}pixel-art-generator.mp4`, "A mountain photo turning into pixels", 720 / 608), url: "https://pixel-art-generator-lilac.vercel.app", interest: 2 },
  { id: "oled-hej", category: "exploration", title: "Hej, KTH", year: "2026", about: "A small OLED screen on a breadboard, animated to say hej and announce a move to Stockholm for an MSc at KTH.", media: vid("/work/oled-hej.mp4", "An OLED screen saying Hej! and Masters in Interactive Media Technology at KTH", 16 / 9), interest: 2 },
  { id: "lightscape-plants", category: "exploration", title: "Lightscape: Plants", year: "2023", about: "Genuary 2023, day 9: a generative tree drawn in light by the plotter and caught as a long exposure.", tools: ["p5.js", "Pen plotter"], media: pic(`${X}lightscape-plants.jpg`, "A green tree drawn in light", 1), interest: 1 },
  { id: "data-art", category: "exploration", title: "Data Art Prints", year: "2026", about: "Abstract art from open datasets, printed as cards.", media: pic(`${X}data-art.jpg`, "A printed card with a network of points", 0.75), interest: 2 },
  { id: "lenscribe", category: "side-project", title: "Lenscribe", year: "2025", about: "A custom GPT that writes tags and descriptions for photos before they go on Unsplash.", tools: ["OpenAI GPTs"], media: vid(`${X}lenscribe.mp4`, "Lenscribe describing a photo", 720 / 542) },
  { id: "light-painting", category: "exploration", title: "Light Painting", year: "2025", about: "Drawing with light, traced live on screen.", media: vid(`${X}light-painting.mp4`, "A light trail drawn on screen", 1) },
  { id: "site-hero", category: "exploration", title: "v4 Hero", year: "2025", about: "A glitchy, browser-heavy hero made while building the v4 site.", media: vid(`${X}site-hero.mp4`, "Glitching RKDOTDESIGN letters", 2), interest: 2 },
  { id: "language-of-gen-z", category: "exploration", title: "Language of Gen Z", year: "2025", about: "An interactive word cloud of Gen Z slang and emojis. Hover any word for its meaning.", tools: ["D3.js"], media: vid(`${X}language-of-gen-z.mp4`, "A word cloud of Gen Z slang", 16 / 9), url: "https://the-language-of-gen-z.vercel.app" },
  { id: "claude-video", category: "exploration", title: "Video with Claude", year: "2026", about: "Early experiments generating video with Claude, from data pulled from my website and GitHub.", tools: ["Claude"], media: vid(`${X}claude-video.mp4`, "A generated slide about Blade, with gauges", 16 / 9) },
  { id: "led-matrix", category: "exploration", title: "LED Matrix", about: "An LED matrix lit up and driven from a laptop.", media: img(`${FRAMER}ddm6ikbkhswupc3CCIhiIEiTgHI.gif`, "An LED matrix lit up beside a laptop"), interest: 2 },
  { id: "lightscape-steal", category: "exploration", title: "Lightscape: Steal Like an Artist", year: "2023", about: "Genuary 2023, day 6: geometric shapes drawn in green light by the plotter, as a long exposure.", tools: ["p5.js", "Pen plotter"], media: pic(`${X}lightscape-steal-like-an-artist.jpg`, "Green triangles drawn in light", 1), interest: 1 },
  { id: "cad", category: "exploration", title: "CAD Basics", year: "2026", about: "Back to CAD basics in Fusion: a brick, a bottle and a paper clip.", tools: ["Fusion"], media: pic(`${X}cad.jpg`, "A brick modelled in Fusion", 1.6) },
  // ingo-MMT host app (MakeMyTrip internship): snippets from the v4 case study.
  { id: "ingo-mmt", category: "side-project", title: "ingo-MMT: How to Reach", year: "2021", about: "A flow for homestay hosts on the MakeMyTrip and Goibibo host app to add accurate directions to their property, from my internship at MakeMyTrip.", tools: ["Figma"], media: pic("/work/ingo/hero.jpg", "The How to Reach flow across several phone screens", 1000 / 454), url: "https://www.ramakrushna.xyz/selected-work/ingo-mmt-app", interest: 2 },
  { id: "ingo-mmt-directions", category: "side-project", title: "ingo-MMT: Adding Directions", year: "2021", about: "Hosts add each leg of the route, with mode of transport, timings and intermediary stops, and the app writes the description for guests.", tools: ["Figma"], media: pic("/work/ingo/directions.jpg", "Add Directions screens with intermediary steps", 1000 / 733), url: "https://www.ramakrushna.xyz/selected-work/ingo-mmt-app" },
  { id: "ingo-mmt-location", category: "side-project", title: "ingo-MMT: Manual Location", year: "2021", about: "Many homestays are remote, so hosts can pin a place on the map by hand when search can't find it.", tools: ["Figma"], media: pic("/work/ingo/manual-location.jpg", "Searching for and pinning an intermediary location on a map", 1000 / 615), url: "https://www.ramakrushna.xyz/selected-work/ingo-mmt-app" },
  { id: "generative-music", category: "exploration", title: "Generative Music", about: "Music generated from code.", media: img(`${FRAMER}ssF2EBws3Q9SoKkiiiNnqRDO3Zk.gif`, "Live-coded generative music") },
  { id: "scenic-seats", category: "side-project", title: "Scenic Seats", about: "Which side of the plane to sit on for the sunrise, the sunset or the view, across 198 Indian domestic routes.", media: pic(`${X}scenic-seats.jpg`, "The Scenic Seats route picker", 4 / 3), url: "https://scenic-seats.vercel.app" },
  { id: "typography", category: "exploration", title: "Typography", about: "Letterforms in motion.", media: img(`${FRAMER}PfMZ22AeOAugh6aFxtL0gmS4Xo.gif`, "Animated letterform"), interest: 2 },
  { id: "gesture-bloom", category: "exploration", title: "Gesture Bloom", year: "2026", about: "A paper flower that opens with your hand. MediaPipe tracks the hand in the browser; a servo pulls the petals.", tools: ["MediaPipe", "Web Serial", "Arduino"], wip: true },
  { id: "projection-ttt", category: "exploration", title: "Projection TTT", about: "Tic-tac-toe projected onto a surface and played with your hands, tracked by a webcam.", wip: true },
];
