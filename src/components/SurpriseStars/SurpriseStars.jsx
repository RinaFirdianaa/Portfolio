import { useState, useEffect } from 'react'
import styles from './SurpriseStars.module.css'

const STAR_COUNT = 44
const STAR_CHARS = ['✦', '✧', '⋆', '✦', '✧']
const STAR_COLORS = [
  'var(--purple-20)',
  'var(--purple-10)',
  'var(--pink-20)',
  'var(--yellow-40)',
  '#ffffff',
]

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function buildStars(seed) {
  const pageH   = document.documentElement.scrollHeight
  const pageW   = document.documentElement.clientWidth

  const aboutEl  = document.getElementById('about')
  const skillsEl = document.getElementById('skills')
  const zoneTop    = (aboutEl  ? aboutEl.getBoundingClientRect().top  + window.scrollY : 0) + 100
  const zoneBottom = skillsEl  ? skillsEl.getBoundingClientRect().top + window.scrollY + skillsEl.offsetHeight : pageH
  const zoneH      = zoneBottom - zoneTop

  const viewCenter = window.scrollY + window.innerHeight / 2

  const stars = Array.from({ length: STAR_COUNT }, (_, index) => {
    const top  = zoneTop + ((index + randomBetween(0.05, 0.95)) / STAR_COUNT) * zoneH
    const left = randomBetween(0, pageW)

    return {
      id:       `${seed}-${index}`,
      char:     STAR_CHARS[index % STAR_CHARS.length],
      color:    STAR_COLORS[index % STAR_COLORS.length],
      top,
      left,
      size:     randomBetween(10, 28),
      opacity:  randomBetween(0.4, 0.9),
      duration: randomBetween(2, 5),
      delay:    randomBetween(0, 3),
    }
  })

  // Stars closest to viewport appear first
  const distances = stars.map(s => Math.abs(s.top - viewCenter))
  const maxDist   = Math.max(...distances) || 1
  stars.forEach(s => {
    s.appearDelay = (Math.abs(s.top - viewCenter) / maxDist) * 2
  })

  return stars
}

export default function SurpriseStars({ seed = 0 }) {
  const [stars, setStars] = useState([])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setStars(buildStars(seed))
    })
    return () => cancelAnimationFrame(raf)
  }, [seed])

  return (
    <div className={styles.layer} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={styles.star}
          style={{
            '--star-top':          `${star.top}px`,
            '--star-left':         `${star.left}px`,
            '--star-size':         `${star.size}px`,
            '--star-opacity':      star.opacity,
            '--star-duration':     `${star.duration}s`,
            '--star-delay':        `${star.delay}s`,
            '--star-appear-delay': `${star.appearDelay}s`,
            '--star-color':        star.color,
          }}
        >
          {star.char}
        </span>
      ))}
    </div>
  )
}
