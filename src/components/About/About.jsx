import { useState, useRef, useEffect, useCallback } from 'react'
import { EDUCATION } from '@/constants/data'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import { useScore } from '@/components/Score/ScoreContext'
import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './About.module.css'
import { useTheme } from '@/components/Theme/ThemeContext'
import { assetUrl } from '@/utils/assetUrl'

const BOTTOM_STARS = [
  { id: 'star-a', size: '1.2rem' },
  { id: 'star-b', size: '1.2rem' },
  { id: 'star-c', size: '1.2rem' },
]

const SPARKLE_TRAVEL_MS   = 850
const CONSTELLATION_SCORE = 10

function AnimatedLine({ x1, y1, x2, y2, length, animate }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (animate) {
      el.style.transition       = 'none'
      el.style.strokeDasharray  = length
      el.style.strokeDashoffset = length
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition       = 'stroke-dashoffset 0.6s ease'
          el.style.strokeDashoffset = '0'
        })
      })
    } else {
      el.style.transition       = 'none'
      el.style.strokeDasharray  = length
      el.style.strokeDashoffset = '0'
    }
  }, [animate, length])

  return (
    <line
      ref={ref}
      x1={x1} y1={y1}
      x2={x2} y2={y2}
      className={styles.constellationLine}
    />
  )
}

export default function About() {
  const { isDark } = useTheme()
  const [, setClickOrder] = useState([])
  const [marked, setMarked]         = useState(() => new Set())
  const [lines, setLines]           = useState([])
  const [completed, setCompleted]   = useState(false)

  const { fireSparkles } = useSparkles()
  const { addScore }     = useScore()

  const totalStars = EDUCATION.length + BOTTOM_STARS.length
  const isLocked   = completed

  const starRefs = useRef({})
  const cardRef  = useRef(null)
  const containerRectRef = useRef(null)
  useEffect(() => {
    const update = () => { containerRectRef.current = null } // invalidate cache
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const getStarCentre = useCallback((id) => {
    const el = starRefs.current[id]
    if (!el || !cardRef.current) return null
    if (!containerRectRef.current) {
      containerRectRef.current = cardRef.current.getBoundingClientRect()
    }
    const containerRect = containerRectRef.current
    const elRect        = el.getBoundingClientRect()

    return {
      x: elRect.left + elRect.width  / 2 - containerRect.left,
      y: elRect.top  + elRect.height / 2 - containerRect.top,
    }
  }, [])
  const handleStarClick = useCallback((id) => {
    containerRectRef.current = null // always fresh on click

    if (isLocked) return

    setClickOrder((prev) => {
      const idx = prev.indexOf(id)

      if (idx !== -1) {
        const newOrder = prev.slice(0, idx)
        setLines((prevLines) => prevLines.slice(0, newOrder.length === 0 ? 0 : newOrder.length - 1))
        setMarked((prevMarked) => {
          const next = new Set(prevMarked)
          prev.slice(idx).forEach((sid) => next.delete(sid))
          return next
        })
        return newOrder
      }

      if (prev.length > 0) {
        const from = getStarCentre(prev[prev.length - 1])
        const to   = getStarCentre(id)
        if (from && to) {
          const length = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2)
          setLines((prevLines) => [
            ...prevLines,
            {
              x1: from.x, y1: from.y,
              x2: to.x,   y2: to.y,
              length,
              key: `${prev[prev.length - 1]}-${id}`,
              animate: true,
            }
          ])
        }
      }

      setMarked((prevMarked) => {
        const next = new Set(prevMarked)
        next.add(id)
        return next
      })

      const newOrder = [...prev, id]

      if (newOrder.length === totalStars) {
        setCompleted(true)
        const lastBtn = starRefs.current[id]
        const scoreEl = document.querySelector('[aria-label="Score badge"]')
        if (lastBtn && scoreEl) {
          const from = lastBtn.getBoundingClientRect()
          const to   = scoreEl.getBoundingClientRect()
          fireSparkles(
            from.left + from.width  / 2,
            from.top  + from.height / 2,
            to.left   + to.width    / 2,
            to.top    + to.height   / 2,
            16
          )
          setTimeout(() => addScore(CONSTELLATION_SCORE), SPARKLE_TRAVEL_MS)
        }
      }

      return newOrder
    })
  }, [isLocked, totalStars, fireSparkles, addScore, getStarCentre])

  return (
    <section id="about" className={`section ${styles.about}`} aria-label="About me">
      <div className={styles.grid}>

        {/* ---- Left: Bio ---- */}
        <div className={styles.bio}>
          <h2 className={styles.sectionTitle}>Something to know about me</h2>

          <div className={styles.avatarRow}>
            <img
              src={assetUrl(isDark ? '/images/chibi-dark.png' : '/images/chibi.png')}
              alt="Rina"
              className={styles.avatar}
            />
            <p className={styles.bioIntro}>
              "I'm just a CS grad from SIT (DigiPen) who ended up loving design more than coding."
            </p>
          </div>

          <p className={styles.bioPara}>
            Through my studies, I learnt UI/UX design principles, human-computer interaction,
            prototyping, and user-centred design. I was usually the one handling the UI for game
            projects, designing menus, HUDs, and interfaces that felt smooth and intuitive.
          </p>
          <p className={styles.bioPara}>
            Back in polytechnic, I also learnt web design and development using Adobe XD,
            Photoshop, HTML, CSS, and JavaScript to create mobile app prototypes and interactive
            web experiences
          </p>
        </div>

        {/* ---- Right: Education ---- */}
        <div ref={cardRef} className={styles.educationCard}>

          <svg className={styles.constellationSvg} aria-hidden="true">
            {lines.map((line) => (
              <AnimatedLine
                key={line.key}
                x1={line.x1} y1={line.y1}
                x2={line.x2} y2={line.y2}
                length={line.length}
                animate={line.animate}
              />
            ))}
          </svg>

          <h3 className={styles.cardTitle}>Education</h3>
          <p className={`${styles.cardSubtitle} ${completed ? styles.cardSubtitleDone : ''}`}>
            {completed ? 'Completed!' : 'Click on the stars'}
          </p>

          <ul className={styles.eduList}>
            {EDUCATION.map((edu, index) => {
              const isDone = marked.has(edu.id)
              return (
                <li
                  key={edu.id}
                  className={`${styles.eduItem} ${index < EDUCATION.length - 1 ? styles.hasDivider : ''}`}
                >
                  <button
                    ref={(el) => { starRefs.current[edu.id] = el }}
                    className={`${styles.starBtn} ${isDone ? styles.starDone : ''}`}
                    onClick={() => handleStarClick(edu.id)}
                    style={{ cursor: isLocked ? 'default' : 'pointer' }}
                    aria-label={`Mark ${edu.school} as complete`}
                  >
                    <StarIcon
                      size="1.2rem"
                      glow={isDone}
                      className={styles.educationStarIcon}
                      color={isDone ? 'var(--yellow-40)' : 'color-mix(in srgb, var(--yellow-20) 62%, var(--purple-20))'}
                    />
                  </button>

                  <div className={styles.eduInfo}>
                    <span className={styles.eduSchool}>{edu.school}</span>
                    <span className={styles.eduCourse}>· {edu.course}</span>
                  </div>

                  <span className={styles.eduPeriod}>{edu.period}</span>
                </li>
              )
            })}
          </ul>

          <div className={styles.bottomStars} aria-hidden="true">
            {BOTTOM_STARS.map(({ id, size }) => {
              const isDone = marked.has(id)
              return (
                <button
                  key={id}
                  ref={(el) => { starRefs.current[id] = el }}
                  className={`${styles.starBtn} ${isDone ? styles.starDone : ''}`}
                  onClick={() => handleStarClick(id)}
                  style={{ cursor: isLocked ? 'default' : 'pointer' }}
                  aria-label={`Star ${id}`}
                >
                  <StarIcon
                    size={size}
                    glow={isDone}
                    className={styles.educationStarIcon}
                    color={isDone ? 'var(--yellow-40)' : 'color-mix(in srgb, var(--yellow-20) 62%, var(--purple-20))'}
                  />
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
