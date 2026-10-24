import { useProjects } from '../hooks/useProjects';
import { useSiteSettings } from '../hooks/useSiteSettings';
import Wires from '../components/common/Wires';
import Marquee from '../components/common/Marquee';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/hero/HeroSection';
import TrustSection from '../components/trust/TrustSection';
import ProjectsSection from '../components/projects/ProjectsSection';
import ContactSection from '../components/contact/ContactSection';

const FALLBACK_MARQUEE_SKILLS = [
  'Python', 'C / C++', 'Flask', 'MongoDB', 'YOLO', 'LLaMA 3',
  'Arduino', 'Gemini API', 'Streamlit', 'Git / GitHub',
  'Robotics', 'Mechatronics', 'PyTorch', 'FastAPI',
];

export default function Home() {
  const { projects } = useProjects();
  const { settings } = useSiteSettings();

  const marqueeSkills = (settings.marquee_skills && settings.marquee_skills.length > 0)
    ? settings.marquee_skills
    : FALLBACK_MARQUEE_SKILLS;

  return (
    <div className="relative min-h-screen bg-cyber-bg text-slate-100 flex flex-col">
      {/* Background Ambience & Canvas */}
      <Wires />

      {/* Main Header / Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <Marquee items={marqueeSkills} />
        <TrustSection />
        <ProjectsSection projects={projects} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
