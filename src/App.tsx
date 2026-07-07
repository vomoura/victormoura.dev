import { useState, useEffect } from 'react'
import ThemeToggle from './components/ThemeToggle'
import Card3D from './components/Card3D'
import HeroSection from './components/HeroSection'
import SocialLinks from './components/SocialLinks'

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="container">
      <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />

      <main className="content">
        <Card3D>
          <HeroSection />
          <SocialLinks />
        </Card3D>
      </main>

      <footer className="footer">
        <p>© 2026 Victor Moura</p>
      </footer>
    </div>
  )
}

export default App
