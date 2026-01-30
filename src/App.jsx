import HeroAnimation from './components/HeroAnimation.jsx'
import Transition from './components/Transition.jsx'
import OurStory from './components/OurStory.jsx'
import ProductShowcase from './components/ProductShowcase.jsx'
import Craftsmanship from './components/Craftsmanship.jsx'
import FlavorExperience from './components/FlavorExperience.jsx'
import Retailers from './components/Retailers.jsx'
import { Newsletter, Footer } from './components/FooterSections.jsx'

function App() {
  return (
    <div className="app">
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: 'transparent'
      }}>
        <div style={{
          color: 'white', fontWeight: '900', fontSize: '1.2rem',
          fontFamily: 'var(--font-heading)', letterSpacing: '0.2rem',
          opacity: 0.9
        }}>
          CRUNCH.
        </div>
        <div style={{ display: 'flex', gap: '3rem', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.25rem' }}>
          <a href="#flavors" className="nav-link">COLLECTIONS</a>
          <a href="#story" className="nav-link">PHILOSOPHY</a>
          <a href="#store" className="nav-link">RETAILERS</a>
        </div>
      </nav>

      <main>
        <HeroAnimation />
        <Transition />
        <ProductShowcase />
        <OurStory />
        <Craftsmanship />
        <FlavorExperience />
        <Retailers />
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
export default App
