"use client";

import { useEffect, useRef, useState } from "react";
import { chapters, quickLinks } from "@/content/story";

export function StoryNavigation() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  useEffect(() => {
    const handleChapterChange = (event: Event) => {
      setActiveChapter((event as CustomEvent<string>).detail);
    };
    window.addEventListener("story:chapter-change", handleChapterChange);
    return () => window.removeEventListener("story:chapter-change", handleChapterChange);
  }, []);

  const closeMobileMenu = (chapterId: string) => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
    requestAnimationFrame(() => {
      document.getElementById(`${chapterId}-title`)?.focus({ preventScroll: true });
    });
  };

  return (
    <header className="story-nav">
      <nav className="story-nav-inner" aria-label="Portfolio navigation">
        <a className="story-nav-brand" href="#what-i-build-now" aria-label="Aakash Singh, back to top">
          <span>AS</span>
          <small>BUILD LOG / 00–09</small>
        </a>

        <ul className="story-nav-quick" aria-label="Quick links">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="story-nav-chapters" aria-label="Chapter index">
          <span className="story-nav-label">Chapters</span>
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-label={`${chapter.number}, ${chapter.title}`}
                  aria-current={activeChapter === chapter.id ? "step" : undefined}
                >
                  {chapter.number}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <details ref={mobileMenuRef} className="story-nav-menu">
          <summary>Chapters</summary>
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={activeChapter === chapter.id ? "step" : undefined}
                  onClick={() => closeMobileMenu(chapter.id)}
                >
                  <span>{chapter.number}</span>
                  {chapter.navLabel}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </nav>
    </header>
  );
}
