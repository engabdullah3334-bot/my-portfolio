-- ==============================================================================
-- INITIAL PROJECTS SEED DATA
-- Run in Supabase SQL Editor if you want to pre-populate the database
-- ==============================================================================

insert into public.projects (
  slug, title, subtitle, category, year, status, rank, is_featured,
  description, highlights, tech, github_url, demo_url, tech_sheet_url, sort_order, published
) values
(
  'lifeos',
  'LifeOS',
  'Personal Life Management System',
  'fullstack',
  '2026',
  'Active',
  1,
  true,
  'A full-stack productivity platform combining task management, structured note-taking, and a context-aware AI assistant in a single unified workspace.',
  array[
    'AI Action System — assistant creates/updates/deletes tasks & notes directly in MongoDB',
    'AI provider waterfall: Gemini → Grok → Ollama for zero-crash fail-safe responses',
    'JWT authentication, drag-and-drop ordering, recurrence engine & full UI customization',
    'Layered architecture: routes → core → MongoDB with config-driven schema factory'
  ],
  array['Python', 'Flask', 'MongoDB', 'JWT', 'Gemini API', 'Grok', 'Ollama', 'AI Agents'],
  'https://github.com',
  'https://life-os-six-zeta.vercel.app/',
  null,
  1,
  true
),
(
  'omnitranslate',
  'OmniTranslate Agent',
  'AI-Powered Document Translator',
  'aipipeline',
  '2026',
  'Published',
  2,
  true,
  'A two-phase AI pipeline combining LLaMA 3 for structural analysis and NLLB-200 for neural machine translation across 200+ languages.',
  array[
    'LLaMA 3 via Ollama for language detection & document structural analysis',
    'NLLB-200 (HuggingFace) for neural translation across 200+ languages',
    'Memory-safe sequential model execution — peak RAM under 4 GB on consumer hardware',
    'Supports PDF, TXT, raw text; preserves formatting and outputs translated PDF'
  ],
  array['Python', 'LLaMA 3', 'NLLB-200', 'HuggingFace', 'PyMuPDF', 'Ollama'],
  'https://github.com',
  null,
  '/omnitranslate-architecture.pdf',
  2,
  true
),
(
  'multiagent',
  'AI Multi-Agent Platform',
  'Professional Desktop Chat Application',
  'desktop',
  '2025–2026',
  'Complete',
  3,
  true,
  'A professional multi-agent chat platform with persistent conversation history, context memory using sliding window, and specialized AI bots.',
  array[
    'Multi-agent architecture: general chat bot + developer/coding assistant',
    'Persistent SQLite conversation history with sliding window context memory',
    'Interactive sidebar with live stats, session archive & full OOP structure',
    'Custom CSS UI built with Streamlit for a polished professional look'
  ],
  array['Python', 'Streamlit', 'Ollama', 'SQLite', 'LLaMA 3', 'OOP'],
  'https://github.com',
  null,
  null,
  3,
  true
),
(
  'autonomous-robot',
  'Autonomous Robot',
  'Embedded AI Integration',
  'embedded',
  '2024–2025',
  'Complete',
  null,
  false,
  'Arduino-based autonomous robot integrating motors, sensors, and AI-enhanced behavior via Python. Full circuit design and assembly.',
  array[]::text[],
  array['Arduino', 'C / C++', 'Python', 'Circuit Design'],
  'https://github.com',
  null,
  null,
  4,
  true
),
(
  'syndicate-management',
  'Syndicate Management System',
  'Enterprise Web App',
  'soon',
  '2026',
  'In Progress',
  null,
  false,
  'Comprehensive syndicate management system being polished for release with role-based access control and member workflows.',
  array[]::text[],
  array['Python', 'Flask', 'PostgreSQL', 'Tailwind'],
  null,
  null,
  null,
  5,
  true
)
on conflict (slug) do nothing;
