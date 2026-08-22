export type VisualState =
  | "current-system"
  | "first-tools"
  | "spotify-assets"
  | "bellybasket-system"
  | "client-constraints"
  | "cravecart-rebuild"
  | "genko-learning"
  | "ai-judgment"
  | "quantx-pipeline"
  | "build-loop";

export type ChapterLayout =
  | "hero"
  | "editorial"
  | "diagram"
  | "record"
  | "inspection"
  | "process"
  | "finale";

export type StoryLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type StoryChapter = {
  number: string;
  id: string;
  navLabel: string;
  title: string;
  message: string;
  paragraphs: string[];
  evidenceLabel: string;
  evidence: string[];
  visualState: VisualState;
  visualTitle: string;
  visualDescription: string;
  layout: ChapterLayout;
  quote?: string;
  status?: string;
  links?: StoryLink[];
};

export const thesis =
  "I started by making things work. I became a developer by learning what it takes to make the whole system work.";

export const chapters: StoryChapter[] = [
  {
    number: "00",
    id: "what-i-build-now",
    navLabel: "Now",
    title: "What I build now",
    message:
      "I research, design, build, debug, and deliver software across interfaces, backends, APIs, data, automation, and experimental ML systems.",
    paragraphs: [thesis],
    evidenceLabel: "Current evidence",
    evidence: [
      "Multi-interface delivery systems",
      "Client software and business integrations",
      "GENKŌ — usable foundation, continuing development",
      "QuantX — unfinished ML experiment",
      "Founding Engineer at Duforge",
    ],
    visualState: "current-system",
    visualTitle: "A connected software system",
    visualDescription:
      "A simplified present-day system connects an interface to an API, service, and data layer.",
    layout: "hero",
    quote: "The first version had no backend. Start there.",
  },
  {
    number: "01",
    id: "before-the-system",
    navLabel: "Beginning",
    title: "Before the system",
    message: "I did not begin with a technical master plan. I began with curiosity.",
    paragraphs: [
      "I started programming after entering the BA Programme in Computer Science and History at Maharaja Agrasen College, University of Delhi. Before that, I did not really know what coding was.",
      "Movies showing hackers and Python scripts made me want to understand what was happening. Someone I met told me to begin with HTML, CSS, and JavaScript. That person is now the founder of Duforge.",
      "With those first tools, I made a Todo app, Tic-Tac-Toe, and basic websites. They were small, but they changed programming from something I had watched into something I could do.",
    ],
    evidenceLabel: "First tools and builds",
    evidence: ["HTML", "CSS", "JavaScript", "Todo app", "Tic-Tac-Toe", "Basic websites"],
    visualState: "first-tools",
    visualTitle: "The first programming world",
    visualDescription:
      "HTML, CSS, and JavaScript feed a small browser frame containing the earliest experiments.",
    layout: "editorial",
  },
  {
    number: "02",
    id: "spotify-clone",
    navLabel: "First build",
    title: "It worked. That was enough then.",
    message:
      "The first project I was genuinely proud of worked—even though I did not yet understand the architecture it was missing.",
    paragraphs: [
      "It was a Spotify clone. I placed the music directly inside the project's frontend asset folder, rendered and played it from the interface, and hosted the project on Vercel.",
      "I did not understand backend architecture yet. The content and the frontend build were coupled together, but the player worked. At that stage, making it work was the achievement. I learned later why the same idea needed a different system around it.",
    ],
    evidenceLabel: "Implementation record",
    evidence: [
      "Frontend music player",
      "Music stored in the project asset folder",
      "Hosted on Vercel",
      "Backend architecture not yet understood",
    ],
    visualState: "spotify-assets",
    visualTitle: "A working player with a visible limit",
    visualDescription:
      "The browser reads music directly from a bundled asset folder; no API, service, or data layer exists yet.",
    layout: "inspection",
    status: "Working implementation · limited architecture",
  },
  {
    number: "03",
    id: "first-real-system",
    navLabel: "BellyBasket",
    title: "The first real system",
    message:
      "BellyBasket was the first project that made me think: I can actually build a system.",
    paragraphs: [
      "By my second year, I had learned more of the foundation: Python, databases, C++, and other computer-science concepts. My friends and I decided to start doing development work.",
      "Around November–December 2024, we began BellyBasket, our first Freelancer project—a platform similar in scope to Blinkit. The work covered a backend, frontend, admin interface, Razorpay integration, location fetching, maps, and live tracking.",
      "We delivered it in approximately six months. For the first time, success depended on several parts agreeing with one another rather than one interface working by itself.",
    ],
    evidenceLabel: "System responsibilities",
    evidence: [
      "Backend",
      "Frontend",
      "Admin",
      "Razorpay",
      "Location fetching",
      "Maps",
      "Live tracking",
      "Approximately six months",
    ],
    visualState: "bellybasket-system",
    visualTitle: "The application becomes a system",
    visualDescription:
      "Frontend and admin surfaces share a backend while payment, location, maps, and live tracking cross system boundaries.",
    layout: "diagram",
    quote: "I can actually build a system.",
  },
  {
    number: "04",
    id: "client-work",
    navLabel: "Client work",
    title: "When “working” had a client",
    message:
      "Personal projects let me define what done meant. Client work required understanding what someone else actually needed and delivering within real constraints.",
    paragraphs: [
      "BellyBasket became the beginning of a professional progression that overlaps with my work at Duforge. I do not treat Freelancer work and Duforge as two separate histories; they are part of the same move from personal experimentation to professional engineering.",
      "The work moved through BellyBasket, UltraCoreWood, Makhana Health King, PhonePe Autopay, SAP HANA business automation, and a preschool management platform. Each brought a different kind of requirement: product presentation, commerce, payments, business-system integration, or role-based software.",
      "I currently represent my role as Founding Engineer at Duforge. Duforge operates as a sole proprietorship with its founder as proprietor; I am not its founder, co-founder, owner, or partner.",
    ],
    evidenceLabel: "Professional work progression",
    evidence: [
      "BellyBasket",
      "UltraCoreWood",
      "Makhana Health King",
      "PhonePe Autopay",
      "SAP HANA business automation",
      "Preschool management platform",
    ],
    visualState: "client-constraints",
    visualTitle: "Requirements enter the workbench",
    visualDescription:
      "Different client requirements pass through one engineering process instead of becoming isolated project cards.",
    layout: "record",
    status: "Founding Engineer · Duforge · 2024 — Present",
  },
  {
    number: "05",
    id: "rebuilding-model",
    navLabel: "CraveCart",
    title: "Rebuilding the model",
    message:
      "CraveCart changed the question from ‘Can we build the application?’ to ‘How should the whole system work?’",
    paragraphs: [
      "DapiGO was originally built with Flutter and PHP/Laravel. Our initial work involved fixing bugs in the existing product. After handing it to the client, we decided to rebuild it around React, Node.js, and React Native.",
      "The rebuilt system became CraveCart. Customer, admin, partner, and rider each have a separate surface, but all four depend on the same backend.",
      "The difficult part was not simply creating four interfaces. It was making different roles and flows work together correctly through one shared system. This was a transition from building an application to thinking about architecture.",
    ],
    evidenceLabel: "Rebuild record",
    evidence: [
      "DapiGO — Flutter + PHP/Laravel",
      "Initial work — bug fixing",
      "CraveCart — React + Node.js + React Native",
      "Customer · Admin · Partner · Rider",
      "One shared backend",
      "Source repository is private",
    ],
    visualState: "cravecart-rebuild",
    visualTitle: "Inherited system to shared architecture",
    visualDescription:
      "A legacy application is inspected, then four role-specific surfaces are organized around one shared backend.",
    layout: "inspection",
    links: [
      {
        label: "Visit CraveCart",
        href: "https://cravecart.duforge.tech/",
        external: true,
      },
    ],
  },
  {
    number: "06",
    id: "building-genko",
    navLabel: "GENKŌ",
    title: "Building the tool I wanted",
    message:
      "I wanted to learn Japanese, could not find a free platform suited to what I wanted, and decided to build my own.",
    paragraphs: [
      "GENKŌ combines courses, writing, listening, quizzes, AI interaction, and a connected learning flow. It began with a personal problem rather than a technology I wanted to showcase.",
      "The project is now usable for the basics, but it still needs significant work. Its current state is a usable foundation—not a finished product and not a claim that every technical or reliability problem has been solved.",
      "It also reflects how I build today: research the problem, create a working path, inspect what is weak, and continue from evidence rather than waiting until I know everything in advance.",
    ],
    evidenceLabel: "Learning system",
    evidence: [
      "Courses",
      "Writing",
      "Listening",
      "Quizzes",
      "AI interaction",
      "Connected learning flow",
    ],
    visualState: "genko-learning",
    visualTitle: "A learning loop, still being developed",
    visualDescription:
      "Courses, practice, listening, writing, quizzes, and AI form a learner loop with an explicitly unfinished frontier.",
    layout: "diagram",
    status: "Usable foundation · continuing development",
    links: [
      {
        label: "View GENKŌ source",
        href: "https://github.com/aakash8930/langapp",
        external: true,
      },
    ],
  },
  {
    number: "07",
    id: "ai-engineering",
    navLabel: "AI workflow",
    title: "The multiplier is not the engineer",
    message:
      "AI increases the speed and number of possible approaches. Engineering judgment determines what actually belongs in the system.",
    paragraphs: [
      "I use AI heavily for research, project audits, comparing approaches, implementation, and iteration. It helps me move considerably faster than I would without it.",
      "But an answer is not the same as a working decision. I still have to understand the problem, evaluate the output, check it against requirements and architecture, debug what breaks, and decide whether the result should be accepted, changed, or rejected.",
      "Computer-science fundamentals and accumulated project experience are what let me use AI as an engineering multiplier rather than treat generated output as automatically correct.",
    ],
    evidenceLabel: "Decision responsibilities",
    evidence: [
      "Research",
      "Audits",
      "Approach comparison",
      "Implementation",
      "Evaluation",
      "Debugging",
      "Accept · revise · reject",
    ],
    visualState: "ai-judgment",
    visualTitle: "Proposals pass through engineering judgment",
    visualDescription:
      "AI, documentation, and the running system feed an evaluation gate; only inspected decisions enter the build.",
    layout: "process",
  },
  {
    number: "08",
    id: "quantx-experiment",
    navLabel: "QuantX",
    title: "When the problem required experimentation",
    message:
      "QuantX began when the trading problem became difficult enough that I started experimenting with machine learning.",
    paragraphs: [
      "Manual trading meant monitoring charts, deciding when to trade, placing orders, and remembering when to sell. If I became busy and missed the right moment, I could lose money.",
      "I started QuantX around a pipeline from market information to analysis, model, decision, and risk or execution. The engineering direction includes experimentation with XGBoost, LSTM, and other approaches.",
      "QuantX is unfinished. It is an active engineering and ML experiment, not a successful or proven profitable trading system. The unresolved work is part of what the project represents.",
    ],
    evidenceLabel: "Experimental pipeline",
    evidence: [
      "Market analysis",
      "XGBoost experimentation",
      "LSTM experimentation",
      "Model-driven decision",
      "Risk / execution",
      "No profitability claim",
    ],
    visualState: "quantx-pipeline",
    visualTitle: "A decision system under investigation",
    visualDescription:
      "Market information passes through analysis, experimental models, decision, and risk gates; not every path becomes an action.",
    layout: "diagram",
    status: "Unfinished experiment",
  },
  {
    number: "09",
    id: "how-i-build-now",
    navLabel: "Capability",
    title: "How I build now",
    message:
      "I can start with an idea, research what it requires, and keep building even when I do not know every answer yet.",
    paragraphs: [
      "My process is not a straight line. An idea leads to research, experimentation, implementation, something breaking, more research, another approach, AI and other tools, debugging, and then a further build.",
      "Personal projects give me room to experiment. Client work requires professionalism, requirements, constraints, and delivery. Both have shaped how I think about software.",
      "I do not always finish everything. GENKŌ has a usable foundation and continues to develop. QuantX remains an unfinished experiment. What has accumulated is the ability to move a problem forward across interfaces, backends, APIs, data, mobile software, integrations, automation, and experimental ML.",
    ],
    evidenceLabel: "Accumulated capability",
    evidence: [
      "Interfaces and product UI",
      "Backend systems and APIs",
      "Data and shared state",
      "Mobile applications",
      "Payments and external integrations",
      "Business automation",
      "AI-assisted product development",
      "Experimental ML systems",
      "Client delivery",
    ],
    visualState: "build-loop",
    visualTitle: "The current build loop",
    visualDescription:
      "Idea, research, experiment, build, break, investigate, decide, debug, and build further form a repeatable but non-linear process.",
    layout: "finale",
    quote:
      "Capable of building further—not finished learning.",
  },
];

export const quickLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#client-work" },
  { label: "Current capability", href: "#how-i-build-now" },
  { label: "Contact", href: "#contact" },
] as const;
