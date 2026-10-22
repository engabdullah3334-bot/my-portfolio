/**
 * Default global site settings & links.
 * ALL values here are fully editable via the Admin Dashboard (/admin_add)
 * and persisted in the Supabase `site_settings` table (id = 'global').
 *
 * Components consume these via the `useSiteSettings()` hook.
 */
export const DEFAULT_SITE_SETTINGS = {
  // ── Personal Info ──────────────────────────────────────────────────────────
  name: "Abdullah Adel",
  title_tag: "Abdullah Adel | Mechatronics, AI & Software Engineer",
  tagline: "intelligent systems & robotics",
  bio: "Ambitious Mechatronics Engineering student with hands-on experience building full-stack applications, AI-powered systems, and embedded hardware. Passionate about bridging intelligent software with the physical world.",
  location: "Cairo, Egypt",
  availability_status: "Available for opportunities",
  is_available: true,

  // ── Contact Links ──────────────────────────────────────────────────────────
  email: "engabdullah3334@gmail.com",
  phone: "+20 101 486 0948",
  whatsapp_url: "https://wa.me/201014860948",
  github_url: "https://github.com/abdullahadel",
  linkedin_url: "https://linkedin.com/in/abdullahadel",
  twitter_url: "",
  telegram_url: "",

  // ── Documents ──────────────────────────────────────────────────────────────
  resume_url: "/resume.pdf",

  // ── Typewriter Roles ───────────────────────────────────────────────────────
  roles: [
    "Mechatronics Eng. Student",
    "AI & ML Engineer",
    "Backend Developer",
    "Embedded Systems Dev",
    "Full-Stack Builder",
  ],

  // ── Hero Core Skills Chips ─────────────────────────────────────────────────
  hero_skills: [
    "Python",
    "C / C++",
    "Flask",
    "MongoDB",
    "YOLO",
    "LLaMA 3",
    "Arduino",
    "Gemini API",
    "Streamlit",
    "Git / GitHub",
  ],

  // ── Marquee Ticker Skills ──────────────────────────────────────────────────
  marquee_skills: [
    "Python",
    "C / C++",
    "Flask",
    "MongoDB",
    "YOLO",
    "LLaMA 3",
    "Arduino",
    "Gemini API",
    "Streamlit",
    "Git / GitHub",
    "Robotics",
    "Mechatronics",
    "PyTorch",
    "FastAPI",
  ],

  // ── Navbar Labels ──────────────────────────────────────────────────────────
  nav_overview_label: "Overview",
  nav_skills_label: "Arsenal",
  nav_projects_label: "Projects",
  nav_contact_label: "Contact",
  nav_cta_label: "Get In Touch",

  // ── Statistics ─────────────────────────────────────────────────────────────
  stats: [
    { label: "Projects Built", value: "10+", count: 10 },
    { label: "AI Systems", value: "4+", count: 4 },
    { label: "Years Coding", value: "3+", count: 3 },
    { label: "English Level", value: "B2", count: null },
  ],

  // ── Education ──────────────────────────────────────────────────────────────
  education: {
    university: "Helwan National University",
    location: "Cairo, Egypt",
    degree: "B.Sc. Mechatronics Engineering",
    stage: "Freshman · 1st Year · Class of 2030",
    coursework: "Robotics with AI · Circuit Analysis · Digital Logic",
    status: "Currently Enrolled & Active",
  },
  high_school_grade: "87% — High Honors",
  japanese_level: "Beginner (Self-studying)",

  // ── Contact Section Text ───────────────────────────────────────────────────
  contact_headline: "Have a challenge worth solving?",
  contact_subtext:
    "Open to technical internships, robotics collaborations, and engineering opportunities in artificial intelligence, backend systems, and mechatronics.",

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer_tagline: "Mechatronics & AI Engineering",
};
