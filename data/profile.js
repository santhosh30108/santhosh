export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://santhosh30108.vercel.app";

export const profile = {
  name: "S K Santhosh Kumar",
  shortName: "Santhosh Kumar",
  firstName: "Santhosh",
  initials: "SK",
  role: "Senior Software Engineer",
  company: "Aakash Educational Services Limited",
  companyShort: "AESL",
  tagline: "Senior Software Engineer · Full-Stack Developer",
  location: "Bengaluru, Karnataka, India",
  email: "santhoshshashikumar@gmail.com",
  phone: "+91 99809 40397",
  phoneHref: "+919980940397",
  linkedin: "https://www.linkedin.com/in/santhosh30108",
  linkedinHandle: "in/santhosh30108",
  resume: "/resume.pdf",
  availability: "Open to conversations",
  roles: [
    "Full-Stack Developer",
    "Senior Software Engineer",
    "Product-Minded Builder",
    "Problem Solver",
  ],
  summary:
    "Full-stack developer with end-to-end ownership across the design, development, and optimisation of scalable systems. I build user-centric products in the ed-tech space — from CRM platforms that replaced costly third-party licenses to secure assessment engines used across web and mobile — with a commitment to clean, efficient, maintainable code.",
  about: [
    "I'm a Senior Software Engineer at Aakash Educational Services Limited (AESL), where I own products across their full lifecycle — from architecture and design through development, testing, and long-term optimisation.",
    "Over the last four years I've shipped an in-house CRM that cut Salesforce licensing dependency, secure test platforms that render flawlessly across web and native webviews, ML-assisted doubt-resolution chat, payment flows, and NPS systems reaching users over app, email, and SMS.",
    "I'm an Electrical & Electronics engineer by training (BMSCE '22), a published author on voice-controlled robotics, and a continuous learner — actively practicing data structures and algorithms and deepening expertise in modern technologies.",
  ],
  stats: [
    { value: 4, suffix: "+", label: "Years building software" },
    { value: 12, suffix: "+", label: "Products & features shipped" },
    { value: 5, suffix: "", label: "Professional certifications" },
    { value: 4, suffix: "", label: "Awards & recognitions" },
  ],
  languages: [
    { name: "English", level: "Full professional" },
    { name: "Kannada", level: "Native" },
    { name: "Telugu", level: "Native" },
    { name: "Hindi", level: "Full professional" },
    { name: "Tamil", level: "Limited working" },
  ],
};

export const experience = [
  {
    company: "Aakash Educational Services Limited",
    role: "Senior Software Engineer",
    period: "Apr 2024 — Present",
    location: "Hyderabad, India",
    current: true,
    summary:
      "Owning core learning and CRM platforms end-to-end — architecture, delivery, and optimisation.",
    highlights: [
      "Built an in-house CRM platform managing complete lead and opportunity lifecycles with global search across name, phone, and PSID — significantly reducing Salesforce dependency and licensing costs.",
      "Developed a nested practice-test platform where tests contain only incorrectly attempted questions, each dynamically unlocking related sub-questions for focused, concept-level practice.",
      "Implemented dynamic test generation letting students compose custom practice tests by subject, chapter, topic, and difficulty — enabling personalised, self-paced learning.",
      "Designed a context-driven Service Request flow exposing only relevant services per student, with adaptive PDF/video Help Guides and a no-code Help Guide Management API for real-time business updates.",
      "Led major codebase optimisations and architectural revamps, improving performance, readability, and long-term maintainability across multiple modules.",
    ],
    tags: ["CRM", "Search", "Test Platforms", "API Design", "Architecture"],
  },
  {
    company: "Aakash Educational Services Limited",
    role: "Software Engineer",
    period: "Aug 2023 — Mar 2024",
    location: "Hyderabad, India",
    summary:
      "Built AESL's standardised secure assessment platform used across web, Android, and iOS.",
    highlights: [
      "Built a standardised, secure online test platform reused across web and Android/iOS webviews — reliable MathJax rendering, fullscreen exam integrity, multi-question support, custom numeric keyboard, session validation, and inactivity handling.",
      "Delivered end-to-end test and result flows with resume, auto/manual submission, and rich performance analytics; ensured stability with Playwright-based end-to-end and integration testing.",
      "Designed a practice-oriented variant allowing unlimited re-attempts, with a dedicated analytics experience tailored for repeated attempts and learning-focused insights.",
    ],
    tags: ["Security", "MathJax", "WebViews", "Playwright", "Analytics"],
  },
  {
    company: "BYJU'S",
    role: "Software Engineer",
    period: "Jul 2022 — Jul 2023",
    location: "Bengaluru, India",
    summary:
      "Shipped engagement, payment, and feedback systems for one of the world's largest ed-tech apps.",
    highlights: [
      "Built a responsive in-app doubt chat supporting subject-specific text and image queries, with ML-generated solution suggestions, pagination, resolution actions, and expert escalation — reused across app webviews with accurate MathJax rendering.",
      "Designed a secure webview-based payment flow handling CCAvenue transactions end-to-end: initiation, status tracking, and callback handling driven by client-side events.",
      "Implemented a backend-driven, configurable NPS system with dynamic questions — auto-triggered on first login, resurfaced at configurable intervals, and extended to email and SMS via secure links.",
      "Developed an internal feedback system with auto-triggered modals for new users and a dedicated CTA for existing users, feeding continuous product improvements.",
    ],
    tags: ["React", "Payments", "ML Integration", "NPS", "WebViews"],
  },
  {
    company: "Karnataka Power Transmission Corporation Limited",
    role: "Electrical Engineering Apprentice",
    period: "May 2022 — Jun 2022",
    location: "Bengaluru, India",
    summary:
      "Hands-on apprenticeship in 220/66KV substation maintenance and equipment.",
    highlights: [
      "Gained hands-on experience with receiving-substation maintenance: lightning arrestors, CVTs, circuit breakers, isolators, wave traps, relays, transformers, and transmission & distribution systems.",
    ],
    tags: ["Electrical Systems", "Substations"],
  },
  {
    company: "Olcademy",
    role: "Software Testing Intern",
    period: "Jul 2020 — Oct 2020",
    location: "New Delhi, India (Remote)",
    summary:
      "Quality assurance for an e-learning platform — earned a Letter of Recommendation.",
    highlights: [
      "Performed manual testing of the e-learning platform to identify functional, UI, and responsiveness issues.",
      "Designed and documented test cases and scenarios for comprehensive coverage; reported, tracked, and validated bug fixes across modules.",
      "Conducted module walkthroughs and demonstrations to explain functionality and testing outcomes.",
    ],
    tags: ["Manual Testing", "Test Design", "QA"],
  },
];

export const projects = [
  {
    title: "In-House CRM Platform",
    org: "AESL",
    kind: "Enterprise Platform",
    description:
      "A ground-up CRM managing the complete lead and opportunity lifecycle — CRUD, insights, and global search across name, phone number, and PSID.",
    impact:
      "Significantly reduced Salesforce dependency and licensing costs for the organisation.",
    stack: ["Full-Stack", "Global Search", "Insights & Analytics"],
    accent: "indigo",
  },
  {
    title: "Secure Online Test Platform",
    org: "AESL",
    kind: "Assessment Engine",
    description:
      "A standardised exam engine reused across web and Android/iOS webviews — fullscreen exam integrity, session validation, custom numeric keyboard, inactivity handling, and reliable MathJax rendering.",
    impact:
      "One codebase powering high-stakes tests on every platform, hardened with Playwright E2E and integration suites.",
    stack: ["Security", "MathJax", "Playwright", "Cross-Platform"],
    accent: "cyan",
  },
  {
    title: "Dynamic Test Generation",
    org: "AESL",
    kind: "Personalised Learning",
    description:
      "Students compose their own practice tests by selecting subject, chapter, topics, and difficulty — the system assembles a tailored paper on the fly.",
    impact: "Enabled personalised, self-paced learning at scale.",
    stack: ["Rules Engine", "Personalisation", "Full-Stack"],
    accent: "violet",
  },
  {
    title: "Nested Practice Tests",
    org: "AESL",
    kind: "Adaptive Learning",
    description:
      "A practice mode built from a student's incorrectly attempted questions, where each question dynamically unlocks related sub-questions for concept-level drilling.",
    impact: "Turned every mistake into a focused, adaptive learning path.",
    stack: ["Adaptive Logic", "Analytics", "UX"],
    accent: "emerald",
  },
  {
    title: "In-App Doubt Chat",
    org: "BYJU'S",
    kind: "ML-Assisted Support",
    description:
      "Responsive chat for subject-specific text and image doubts with validated attachments, ML-generated solution suggestions, and expert escalation when needed.",
    impact:
      "Consistent doubt-resolution experience across the app and webviews, with accurate MathJax rendering.",
    stack: ["React", "ML Integration", "Chat UX"],
    accent: "amber",
  },
  {
    title: "Voice-Controlled Robotic Car",
    org: "Publication",
    kind: "Published Research",
    description:
      "Designed and simulated a voice-controlled robotic car — published as 'Design and Simulation of Voice Controlled Robotic Car'.",
    impact:
      "Peer-recognised research bridging embedded systems and human-machine interaction.",
    stack: ["Embedded Systems", "Microcontrollers", "Simulation"],
    accent: "rose",
  },
];

export const skills = [
  {
    group: "Frontend Engineering",
    items: [
      { name: "JavaScript (ES6+)", level: 95 },
      { name: "React & Next.js", level: 92 },
      { name: "HTML5 & CSS3", level: 94 },
      { name: "Responsive & WebView UIs", level: 90 },
    ],
  },
  {
    group: "Platform & Backend",
    items: [
      { name: "REST API Design", level: 88 },
      { name: "Payment Integrations", level: 85 },
      { name: "Search & CRM Systems", level: 87 },
      { name: "Performance Optimisation", level: 86 },
    ],
  },
  {
    group: "Quality & Reliability",
    items: [
      { name: "Playwright E2E Testing", level: 88 },
      { name: "Integration Testing", level: 85 },
      { name: "Test Design & QA", level: 84 },
      { name: "Session & Exam Security", level: 86 },
    ],
  },
  {
    group: "Data & Systems",
    items: [
      { name: "Python", level: 82 },
      { name: "Data Science & ML", level: 75 },
      { name: "Data Structures & Algorithms", level: 85 },
      { name: "Embedded Systems & Arduino", level: 78 },
    ],
  },
];

export const certifications = [
  {
    title: "IBM Data Science Professional Certificate",
    issuer: "IBM",
  },
  {
    title: "Machine Learning",
    issuer: "Certification",
  },
  {
    title: "Python 3 Programming Specialization",
    issuer: "Specialization",
  },
  {
    title: "HTML, CSS, and JavaScript for Web Developers",
    issuer: "Certification",
  },
  {
    title: "NASSCOM Data Science Course",
    issuer: "NASSCOM — Certificate of Completion",
  },
];

export const awards = [
  {
    title: "Runner-Up — Aakash Hackathon 2026",
    detail: "Company-wide hackathon podium finish.",
    year: "2026",
  },
  {
    title: "Engineering Hero — Q3 2024",
    detail: "Quarterly engineering excellence recognition at AESL.",
    year: "2024",
  },
  {
    title: "Engineering Hero — Q4 2023",
    detail: "Quarterly engineering excellence recognition at AESL.",
    year: "2023",
  },
  {
    title: "Paper Presentation Winner — TRIGGER 2K21",
    detail: "First place for technical paper presentation.",
    year: "2021",
  },
  {
    title: "Letter of Recommendation — Olcademy",
    detail: "Awarded for outstanding contribution as a testing intern.",
    year: "2020",
  },
];

export const publication = {
  title: "Design and Simulation of Voice Controlled Robotic Car",
  type: "Publication",
};

export const education = [
  {
    school: "B. M. S. College of Engineering",
    degree: "BE — Electrical and Electronics Engineering",
    period: "2018 — 2022",
  },
  {
    school: "Christ University, Bangalore",
    degree: "Pre-University — PCME",
    period: "2016 — 2018",
  },
];
