import './index.css'
import HeroSection from './components/HeroSection'
import ProjectsSection from './components/ProjectsSection'
import TrustSection from './components/TrustSection'
import CursorFollower from './components/CursorFollower'
import projectsData from './data/projects.json'

/**
 * App is the data owner.
 * It imports the JSON once and passes it down via props.
 * To add/edit a project → only touch src/data/projects.json
 */
function App() {
  return (
    <div className="min-h-screen bg-cyber-bg">
      <CursorFollower />
      <HeroSection />
      <TrustSection />
      <ProjectsSection projects={projectsData} />
      {/* Future sections: Experience · Contact */}
    </div>
  )
}

export default App
