import { chapters } from "@/content/story";
import { StoryChapter } from "./StoryChapter";
import { StoryFooter } from "./StoryFooter";
import { StoryNavigation } from "./StoryNavigation";

export function StorySite() {
  return (
    <>
      <a className="skip-link" href="#before-the-system">Skip to the story</a>
      <StoryNavigation />
      <main id="content" className="story-document">
        {chapters.map((chapter, index) => (
          <StoryChapter key={chapter.id} chapter={chapter} projectEntry={index === 3} />
        ))}
      </main>
      <StoryFooter />
    </>
  );
}
