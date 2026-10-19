import { OpenCanvas } from "@/components/open-canvas";
import { ScrollCue } from "@/components/scroll-cue";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <OpenCanvas />
        <ScrollCue />
      </main>
      <SiteFooter />
    </>
  );
}
