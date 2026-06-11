import { createContext, memo, useContext, useState, useRef, useEffect, useCallback } from 'react'

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
    const ids = Array.from({ length: count }, () => ++_id)

    const newParticles = ids.map((id, i) => ({
      id,
      fromX,
      fromY,
      toX: toX + (Math.random() - 0.5) * 16,
      toY: toY + (Math.random() - 0.5) * 16,
      delay: i * 55,
      size: 14 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      char: CHARS[i % CHARS.length],
      burstAngle: Math.random() * Math.PI * 2,
      burstDistance: 18 + Math.random() * 22,
    }))
    setParticles(prev => [...prev, ...newParticles])

    setTimeout(() => {
      const idSet = new Set(ids)
      setParticles(prev => prev.filter(p => !idSet.has(p.id)))
    }, 1000 + count * 55)
  }, [])

  return (
    <SparkleCtx.Provider value={{ fireSparkles }}>
      {children}
      <SparkleCanvas particles={particles} />
    </SparkleCtx.Provider>
  )
}

const SparkleCanvas = memo(function SparkleCanvas({ particles }) {
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
})

function SparkleParticle({ fromX, fromY, toX, toY, delay, size, color, char, burstAngle, burstDistance }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const burstX = fromX + Math.cos(burstAngle) * burstDistance
    const burstY = fromY + Math.sin(burstAngle) * burstDistance

    const timer = setTimeout(() => {
      if (!el) return
      el.animate(
        [
          {
            transform: `translate(${fromX}px, ${fromY}px) scale(0) rotate(0deg)`,
            opacity: 0,
            offset: 0,
          },
          {
            transform: `translate(${burstX}px, ${burstY}px) scale(1.3) rotate(120deg)`,
            opacity: 1,
            offset: 0.3,
          },
          {
            transform: `translate(${toX}px, ${toY}px) scale(0.4) rotate(240deg)`,
            opacity: 0.9,
            offset: 0.85,
          },
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
  }, [burstAngle, burstDistance, delay, fromX, fromY, toX, toY])

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
