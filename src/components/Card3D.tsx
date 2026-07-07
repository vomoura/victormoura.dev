import { useState, useRef, useEffect, useCallback } from 'react'

interface Card3DProps {
  children: React.ReactNode
}

function Card3D({ children }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({})
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({})
  const [gyroEnabled, setGyroEnabled] = useState(false)

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const beta = e.beta ?? 0
    const gamma = e.gamma ?? 0

    const maxTilt = 30
    const clampedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta - 45))
    const clampedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma))

    const rotateX = (clampedBeta / maxTilt) * -12
    const rotateY = (clampedGamma / maxTilt) * 12

    setCardStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
    })

    const glareX = ((clampedGamma + maxTilt) / (maxTilt * 2)) * 100
    const glareY = ((clampedBeta + maxTilt) / (maxTilt * 2)) * 100

    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`,
      opacity: 1,
    })
  }, [])

  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isMobile) return

    const requestPermission = async () => {
      const DevOrientEvent = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>
      }

      if (typeof DevOrientEvent.requestPermission === 'function') {
        try {
          const permission = await DevOrientEvent.requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
            setGyroEnabled(true)
          }
        } catch {
          // Permission denied
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
        setGyroEnabled(true)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [handleOrientation])

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    applyEffect(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gyroEnabled) return
    e.preventDefault()
    const touch = e.touches[0]
    const card = cardRef.current
    if (!card || !touch) return
    const rect = card.getBoundingClientRect()
    applyEffect(touch.clientX - rect.left, touch.clientY - rect.top, rect.width, rect.height)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gyroEnabled) return
    const touch = e.touches[0]
    const card = cardRef.current
    if (!card || !touch) return
    const rect = card.getBoundingClientRect()
    applyEffect(touch.clientX - rect.left, touch.clientY - rect.top, rect.width, rect.height)
  }

  const handleTouchEnd = () => {
    if (gyroEnabled) return
    resetEffect()
  }

  return (
    <div
      className="card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetEffect}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={cardStyle}
    >
      <div className="card-glare" style={glareStyle}></div>
      <div className="card-content">{children}</div>
    </div>
  )
}

export default Card3D
