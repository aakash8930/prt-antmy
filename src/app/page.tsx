import { BlueprintCenterpiece } from "@/components/blueprint/BlueprintCenterpiece";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteSections } from "@/components/site/SiteSections";

export default function Home() {
  return (
    <main>
      <BlueprintCenterpiece />
      <SiteNav />
      <SiteSections />
    </main>
  );
}
