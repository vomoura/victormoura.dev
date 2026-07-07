import { useState, useEffect, useRef } from 'react'

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({})
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    applyEffect(x, y, rect.width, rect.height)
  }

  const handleMouseLeave = () => {
    resetEffect()
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    const card = cardRef.current
    if (!card || !touch) return

    const rect = card.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    applyEffect(x, y, rect.width, rect.height)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    const card = cardRef.current
    if (!card || !touch) return

    const rect = card.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    applyEffect(x, y, rect.width, rect.height)
  }

  const handleTouchEnd = () => {
    resetEffect()
  }

  const applyEffect = (x: number, y: number, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2

    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    setCardStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    })

    const glareX = (x / width) * 100
    const glareY = (y / height) * 100

    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
      opacity: 1,
    })
  }

  const resetEffect = () => {
    setCardStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    })
    setGlareStyle({ opacity: 0 })
  }

  return (
    <div className="container">
      <button
        className="theme-toggle"
        onClick={() => setDark(!dark)}
        aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        title={dark ? 'Tema claro' : 'Tema escuro'}
      >
        {dark ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <main className="content">
        <div
          className="card"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={cardStyle}
        >
          <div className="card-glare" style={glareStyle}></div>
          <div className="card-content">
            <div className="hero">
              <div className="hexagon-wrapper">
                <div className="hexagon-inner">
                  <img src="/photo.jpg" alt="Victor Moura" />
                </div>
              </div>
              <div className="hero-text">
                <h1 className="name">
                  VICTOR<span className="accent">MOURA</span>
                </h1>
                <p className="subtitle">developer</p>
              </div>
            </div>

            <nav className="links" aria-label="Social links">
              <a
                href="https://github.com/vomoura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a
                href="https://linkedin.com/in/vomoura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="mailto:contato@victormoura.dev" aria-label="E-mail">
                <i className="fa-solid fa-envelope"></i>
              </a>
            </nav>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Victor Moura</p>
      </footer>
    </div>
  )
}

export default App
