import { OpenCanvas } from "@/components/open-canvas";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <OpenCanvas />
      </main>
    </>
  );
}
