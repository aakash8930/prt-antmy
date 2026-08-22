import { chapters } from "@/content/story";
import { StoryChapter } from "./StoryChapter";
import { StoryFooter } from "./StoryFooter";
import { IntegratedStoryArc } from "@/components/build-graph/IntegratedStoryArc";
import { StoryNavigation } from "./StoryNavigation";

export function StorySite() {
  return (
    <>
      <a className="skip-link" href="#before-the-system">Skip to the story</a>
      <StoryNavigation />
      <main id="content" className="story-document">
        <IntegratedStoryArc chapters={chapters.slice(0, 7)} />
        {chapters.slice(7).map((chapter) => (
          <StoryChapter key={chapter.id} chapter={chapter} />
        ))}
      </main>
      <StoryFooter />
    </>
  );
}
