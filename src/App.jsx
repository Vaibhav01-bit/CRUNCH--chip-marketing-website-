import HeroAnimation from './components/HeroAnimation.jsx'
import Transition from './components/Transition.jsx'
import OurStory from './components/OurStory.jsx'
import ProductShowcase from './components/ProductShowcase.jsx'
import Craftsmanship from './components/Craftsmanship.jsx'
import FlavorExperience from './components/FlavorExperience.jsx'
import Retailers from './components/Retailers.jsx'
import { Newsletter, Footer } from './components/FooterSections.jsx'
import SplashCursor from './components/SplashCursor.jsx'
import SpiceDustOverlay from './components/SpiceDustOverlay.jsx'
import SocialProof from './components/SocialProof.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <div className="app">
      <SpiceDustOverlay />
      <SplashCursor />
      <Navbar />

      <main>
        <HeroAnimation />
        <Transition />
        <ProductShowcase />
        <SocialProof />
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
