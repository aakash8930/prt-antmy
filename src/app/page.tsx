import { BlueprintCenterpiece } from "@/components/blueprint/BlueprintCenterpiece";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteSections } from "@/components/site/SiteSections";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <main id="main">
        <h1 className="visually-hidden">System Volume</h1>
        <BlueprintCenterpiece />
        <SiteNav />
        <SiteSections />
      </main>
      <SiteFooter />
    </>
  );
}
