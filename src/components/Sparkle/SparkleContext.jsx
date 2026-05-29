/**
 * SparkleContext.jsx
 * Global sparkle system — sparkles burst outward from source then fly straight to score.
 */

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'

const SparkleCtx = createContext(null)

export function useSparkles() {
  return useContext(SparkleCtx)
}

let _id = 0

const COLORS = [
  'var(--yellow-40)',
  'var(--pink-40)',
  'var(--purple-40)',
  'var(--pink-20)',
  'var(--white)',
  'var(--purple-20)',
]

const CHARS = ['✦', '✦', '★', '·', '✦', '+']

export function SparkleProvider({ children }) {
  const [particles, setParticles] = useState([])

  const fireSparkles = useCallback((fromX, fromY, toX, toY, count = 10) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id:    ++_id,
      fromX,
      fromY,
      toX:   toX + (Math.random() - 0.5) * 16,
      toY:   toY + (Math.random() - 0.5) * 16,
      delay: i * 55,
      size:  14 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      char:  CHARS[i % CHARS.length],
      // Random burst direction (angle in radians) and distance
      burstAngle:    Math.random() * Math.PI * 2,
      burstDistance: 18 + Math.random() * 22,
    }))

    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)))
    }, 1000 + count * 55)
  }, [])

  return (
    <SparkleCtx.Provider value={{ fireSparkles }}>
      {children}
      <SparkleCanvas particles={particles} />
    </SparkleCtx.Provider>
  )
}

function SparkleCanvas({ particles }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      {particles.map(p => (
        <SparkleParticle key={p.id} {...p} />
      ))}
    </div>
  )
}

function SparkleParticle({ fromX, fromY, toX, toY, delay, size, color, char, burstAngle, burstDistance }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Burst landing point — spread out from source
    const burstX = fromX + Math.cos(burstAngle) * burstDistance
    const burstY = fromY + Math.sin(burstAngle) * burstDistance

    const timer = setTimeout(() => {
      if (!el) return
      el.animate(
        [
          // Phase 1: appear at source
          {
            transform: `translate(${fromX}px, ${fromY}px) scale(0) rotate(0deg)`,
            opacity: 0,
            offset: 0,
          },
          // Phase 2: burst outward (spread)
          {
            transform: `translate(${burstX}px, ${burstY}px) scale(1.3) rotate(120deg)`,
            opacity: 1,
            offset: 0.3,
          },
          // Phase 3: fly straight to score badge
          {
            transform: `translate(${toX}px, ${toY}px) scale(0.4) rotate(240deg)`,
            opacity: 0.9,
            offset: 0.85,
          },
          // Phase 4: vanish at score
          {
            transform: `translate(${toX}px, ${toY}px) scale(0) rotate(360deg)`,
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration: 850,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    }, delay)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: size,
        color,
        lineHeight: 1,
        textShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}, 0 0 ${size * 3}px ${color}`,
        opacity: 0,
        willChange: 'transform, opacity',
        userSelect: 'none',
      }}
    >
      {char}
    </div>
  )
}