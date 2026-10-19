import { AboutSection } from "@/components/about-section";
import { OpenCanvas } from "@/components/open-canvas";
import { ScrollCue } from "@/components/scroll-cue";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WordsSection } from "@/components/words-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <OpenCanvas />
        <ScrollCue />
        <AboutSection />
        <WordsSection />
      </main>
      <SiteFooter />
    </>
  );
}
