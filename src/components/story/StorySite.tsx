import { chapters } from "@/content/story";
import { StoryFooter } from "./StoryFooter";
import { IntegratedStoryArc } from "@/components/build-graph/IntegratedStoryArc";
import { StoryNavigation } from "./StoryNavigation";

export function StorySite() {
  return (
    <>
      <a className="skip-link" href="#before-the-system">Skip to the story</a>
      <StoryNavigation />
      <main id="content" className="story-document">
        <IntegratedStoryArc chapters={chapters} />
      </main>
      <StoryFooter />
    </>
  );
}
