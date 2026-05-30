/**
 * Navbar
 * Sticky top navigation with score badge and purple sub-nav links.
 * Uses global SparkleContext to fire sparkles toward the score badge.
 * Score is read from global ScoreContext and incremented by sections + Hero.
 */

import { useEffect, useState, useRef } from 'react'
import { useScrolled } from '@/hooks/useScrolled'
import { NAV_LINKS } from '@/constants/data'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import { useScore } from '@/components/Score/ScoreContext'
import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './Navbar.module.css'

const SCORE_PER_SECTION = 10
const SPARKLE_TRAVEL_MS = 850

export default function Navbar() {
  const scrolled         = useScrolled()
  const { fireSparkles } = useSparkles()
  const { score, addScore } = useScore()

  const [activeSection, setActiveSection]     = useState('home')
  const [fillPx, setFillPx]                   = useState(0)
  const [hasEntered, setHasEntered]           = useState(false)
  const [glowingSection, setGlowingSection]   = useState(null)
  const [visitedSections, setVisitedSections] = useState(new Set())
  const [displayScore, setDisplayScore]       = useState(0)
  const [scoreGlowing, setScoreGlowing]       = useState(false)

  const navListRef  = useRef(null)
  const scoreRef    = useRef(null)
  const navItemRefs = useRef({})
  const prevSection = useRef('home')
  const visitedRef  = useRef(new Set())

  const total = NAV_LINKS.length

  const activeIndex     = NAV_LINKS.findIndex((l) => l.href.replace('#', '') === activeSection)
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex
  const isComplete      = safeActiveIndex === total - 1

  const getItemCentrePx = (sectionId) => {
    const item = navItemRefs.current[sectionId]
    if (!item) return 0
    return item.offsetLeft + item.offsetWidth / 2
  }

  const getItemRightPx = (sectionId) => {
    const item = navItemRefs.current[sectionId]
    if (!item) return 0
    return item.offsetLeft + item.offsetWidth
  }

  const getLinkFilled = (index) => {
    const sectionId  = NAV_LINKS[index].href.replace('#', '')
    const itemCentre = getItemCentrePx(sectionId)
    return fillPx >= itemCentre
  }

  const fillPercent = navListRef.current
    ? `${(fillPx / navListRef.current.offsetWidth) * 100}%`
    : '0%'

  // Animate displayScore counting up whenever score changes
  useEffect(() => {
    if (displayScore === score) return
    setScoreGlowing(true)
    const start     = displayScore
    const end       = score
    const duration  = 800
    const startTime = performance.now()
    const easeOut   = (t) => 1 - Math.pow(1 - t, 3)

    let raf
    const tick = (now) => {
      const elapsed = now - startTime
      const t       = Math.min(elapsed / duration, 1)
      setDisplayScore(Math.round(start + (end - start) * easeOut(t)))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setScoreGlowing(false), 400)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const shootSparkles = (sectionId) => {
    const navEl   = navItemRefs.current[sectionId]
    const scoreEl = scoreRef.current
    if (!navEl || !scoreEl) return

    const from = navEl.getBoundingClientRect()
    const to   = scoreEl.getBoundingClientRect()

    fireSparkles(
      from.left + from.width  / 2,
      from.top  + from.height / 2,
      to.left   + to.width    / 2,
      to.top    + to.height   / 2,
      12
    )

    setTimeout(() => addScore(SCORE_PER_SECTION), SPARKLE_TRAVEL_MS)
  }

  // Entrance animation
useEffect(() => {
  const timer = setTimeout(() => {
    // Find which section is currently active based on scroll position
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    const scrollY = window.scrollY

    let activeIdx = 0
    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollY >= sections[i].offsetTop - window.innerHeight * 0.4) {
        activeIdx = i
        break
      }
    }

    const activeId = sectionIds[activeIdx]
    setFillPx(getItemRightPx(activeId))
  }, 400)

  // ... rest of timers
}, [])

  // Scroll fill + section detection
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))

    const computeFill = () => {
      if (!navListRef.current) return
      const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
      if (sections.length === 0) return

      const scrollY = window.scrollY

      const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 10
      if (atBottom) {
        setFillPx(navListRef.current.offsetWidth)
        return
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const top = sections[i].offsetTop - window.innerHeight * 0.4
        if (scrollY >= top) {
          const nextTop = sections[i + 1]
            ? sections[i + 1].offsetTop - window.innerHeight * 0.4
            : document.documentElement.scrollHeight

          const segPct       = Math.min((scrollY - top) / (nextTop - top), 1)
          const currentRight = getItemRightPx(sectionIds[i])
          const nextRight    = i + 1 < sectionIds.length
            ? getItemRightPx(sectionIds[i + 1])
            : navListRef.current.offsetWidth

          const newFillPx = currentRight + segPct * (nextRight - currentRight)
          setFillPx(Math.max(newFillPx, getItemRightPx('home')))
          return
        }
      }

      setFillPx(getItemRightPx('home'))
    }

    window.addEventListener('scroll', computeFill, { passive: true })

    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActiveSection(id)
            if (id !== prevSection.current && !visitedRef.current.has(id)) {
              prevSection.current = id
              visitedRef.current.add(id)
              setVisitedSections(prev => new Set([...prev, id]))
              shootSparkles(id)
              setGlowingSection(id)
              setTimeout(() => setGlowingSection(null), 800)
            } else {
              prevSection.current = id
            }
          }
        })
      },
      { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => {
      window.removeEventListener('scroll', computeFill)
      sections.forEach((s) => observer.unobserve(s))
    }
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.topBar}>
        <span className={styles.brand}>Rina Firdiana</span>

        <div ref={scoreRef} className={styles.scoreBadge} aria-label="Score badge">
          <StarIcon
            size="2.5rem"
            glow={scoreGlowing}
            className={`${styles.scoreIcon} ${scoreGlowing ? styles.scoreIconGlow : ''}`}
          />
          <div className={styles.scoreText}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={`${styles.scoreValue} ${scoreGlowing ? styles.scoreValueGlow : ''}`}>
              {displayScore}
            </span>
          </div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <ul
          ref={navListRef}
          className={`${styles.navList} ${isComplete ? styles.complete : ''} ${hasEntered ? styles.scrolling : ''}`}
          style={{ '--nav-fill': fillPercent }}
        >
          {NAV_LINKS.map(({ label, href }, index) => {
            const sectionId = href.replace('#', '')
            const isActive  = activeSection === sectionId
            const isFilled  = getLinkFilled(index)
            const isGlowing = glowingSection === sectionId

            return (
              <li
                key={label}
                ref={(el) => { navItemRefs.current[sectionId] = el }}
                className={styles.navItem}
              >
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`${styles.navLink} ${isFilled ? styles.filled : ''} ${isActive ? styles.active : ''} ${isGlowing ? styles.glowing : ''}`}
                >
                  {label}
                  <StarIcon
                    size="0.75rem"
                    glow={isGlowing}
                    className={styles.navStar}
                    style={{ opacity: visitedSections.has(sectionId) ? 0 : 1 }}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}