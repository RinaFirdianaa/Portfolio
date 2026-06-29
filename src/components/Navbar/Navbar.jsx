import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useScrolled } from '@/hooks/useScrolled'
import { useTheme } from '@/components/Theme/ThemeContext'
import { NAV_LINKS } from '@/constants/data'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import { useScore } from '@/components/Score/ScoreContext'
import ScorePopup from '@/components/ScorePopup/ScorePopup'
import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './Navbar.module.css'

const SCORE_PER_SECTION = 10
const SPARKLE_TRAVEL_MS = 850
const TOTAL_SCORE = 100
const NAV_SCROLL_EXTRA_OFFSET = 28
const MOBILE_HEADER_HIDE_THRESHOLD = 72
const MOBILE_MENU_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Project', href: '#projects' },
  { label: 'Skills', href: '#skills' },
]

export default function Navbar() {
  const scrolled            = useScrolled()
  const { fireSparkles }    = useSparkles()
  const { score, addScore } = useScore()

  const [activeSection, setActiveSection]     = useState('home')
  const [glowingSection, setGlowingSection]   = useState(null)
  const [visitedSections, setVisitedSections] = useState(new Set())
  const [displayScore, setDisplayScore]       = useState(0)
  const [scoreGlowing, setScoreGlowing]       = useState(false)
  const [isScorePopupOpen, setIsScorePopupOpen] = useState(false)
  const [isScorePopupClosing, setIsScorePopupClosing] = useState(false)
  const [isMobileCompletionOpen, setIsMobileCompletionOpen] = useState(false)
  const [isMobileCompletionClosing, setIsMobileCompletionClosing] = useState(false)
  const [isMobileHeaderHidden, setIsMobileHeaderHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false)
  const [popupPos, setPopupPos] = useState({ top: 0, right: 0 })
  const { isDark, toggle: toggleDark } = useTheme()
  const navListRef     = useRef(null)
  const scoreWrapRef   = useRef(null)
  const popupPortalRef = useRef(null)
  const headerRef      = useRef(null)
  const scoreRef    = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuCloseTimerRef = useRef(null)
  const navItemRefs = useRef({})
  const prevSection = useRef('home')
  const visitedRef  = useRef(new Set())
  const initialHomeSparkleRef = useRef(false)
  const hasOpenedCompleteScoreRef = useRef(false)
  const displayScoreRef = useRef(displayScore)
  const scoreGlowTimeoutRef = useRef(null)
  const scorePopupFadeTimerRef = useRef(null)
  const scorePopupCloseTimerRef = useRef(null)
  const lastHeaderScrollYRef = useRef(0)
  const fireSparklesRef = useRef(fireSparkles)
  const addScoreRef     = useRef(addScore)
  useEffect(() => { fireSparklesRef.current = fireSparkles }, [fireSparkles])
  useEffect(() => { addScoreRef.current     = addScore     }, [addScore])
  useEffect(() => { displayScoreRef.current = displayScore }, [displayScore])

  const openMobileMenu = useCallback(() => {
    window.clearTimeout(mobileMenuCloseTimerRef.current)
    setIsMobileMenuClosing(false)
    setIsMobileMenuOpen(true)
  }, [])

  const closeMobileMenu = useCallback(() => {
    if (!isMobileMenuOpen || isMobileMenuClosing) return

    setIsMobileMenuClosing(true)
    window.clearTimeout(mobileMenuCloseTimerRef.current)
    mobileMenuCloseTimerRef.current = window.setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsMobileMenuClosing(false)
    }, 280)
  }, [isMobileMenuClosing, isMobileMenuOpen])

  useEffect(() => () => window.clearTimeout(mobileMenuCloseTimerRef.current), [])
  useEffect(() => () => {
    window.clearTimeout(scorePopupFadeTimerRef.current)
    window.clearTimeout(scorePopupCloseTimerRef.current)
  }, [])

  useEffect(() => {
    let rafScheduled = false

    const handleHeaderVisibility = () => {
      if (rafScheduled) return
      rafScheduled = true

      requestAnimationFrame(() => {
        rafScheduled = false
        const isMobile = window.matchMedia('(max-width: 600px)').matches
        const currentY = window.scrollY
        const previousY = lastHeaderScrollYRef.current
        const isScrollingDown = currentY > previousY

        setIsMobileHeaderHidden(isMobile && isScrollingDown && currentY > MOBILE_HEADER_HIDE_THRESHOLD)
        lastHeaderScrollYRef.current = Math.max(currentY, 0)
      })
    }

    lastHeaderScrollYRef.current = window.scrollY
    window.addEventListener('scroll', handleHeaderVisibility, { passive: true })
    window.addEventListener('resize', handleHeaderVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleHeaderVisibility)
      window.removeEventListener('resize', handleHeaderVisibility)
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeMobileMenu()
    }

    document.body.style.overflow = 'hidden'
    setIsMobileHeaderHidden(false)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [closeMobileMenu, isMobileMenuOpen])

  const updatePopupPosition = useCallback(() => {
    if (!scoreWrapRef.current) return

    const rect = scoreWrapRef.current.getBoundingClientRect()
    setPopupPos({
      top: rect.bottom + 10,
      right: window.innerWidth - rect.right,
    })
  }, [])

  useEffect(() => {
    if (!isScorePopupOpen) return undefined
    if (score >= TOTAL_SCORE && window.matchMedia('(max-width: 600px)').matches) return undefined

    const handleOutsidePointerDown = (event) => {
      if (scoreWrapRef.current?.contains(event.target)) return
      if (popupPortalRef.current?.contains(event.target)) return
      setIsScorePopupOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown)
  }, [isScorePopupOpen, score])
  const geoCacheRef = useRef(null)

  const buildGeoCache = useCallback(() => {
    if (!navListRef.current) return null
    const listWidth = navListRef.current.offsetWidth
    const rightEdge = NAV_LINKS.map(({ href }) => {
      const id   = href.replace('#', '')
      const item = navItemRefs.current[id]
      return item ? item.offsetLeft + item.offsetWidth : 0
    })
    const centre = NAV_LINKS.map(({ href }) => {
      const id   = href.replace('#', '')
      const item = navItemRefs.current[id]
      return item ? item.offsetLeft + item.offsetWidth / 2 : 0
    })
    const cache = { listWidth, rightEdge, centre }
    geoCacheRef.current = cache
    return cache
  }, [])
  useEffect(() => {
    const t = setTimeout(buildGeoCache, 50)
    window.addEventListener('resize', buildGeoCache, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', buildGeoCache)
    }
  }, [buildGeoCache])
  const sectionOffsetsRef = useRef([])

  const buildSectionOffsets = useCallback(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const offsets = sectionIds.map((id) => {
      const el = document.getElementById(id)
      return el ? el.offsetTop : 0
    })
    sectionOffsetsRef.current = offsets
    return offsets
  }, [])

  useEffect(() => {
    const t = setTimeout(buildSectionOffsets, 50)
    window.addEventListener('resize', buildSectionOffsets, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', buildSectionOffsets)
    }
  }, [buildSectionOffsets])
  const applyFill = useCallback((fillPx) => {
    const geo = geoCacheRef.current
    if (!navListRef.current || !geo) return
    const pct = (fillPx / geo.listWidth) * 100
    navListRef.current.style.setProperty('--nav-fill', `${pct}%`)
    NAV_LINKS.forEach(({ href }, i) => {
      const id = href.replace('#', '')
      const el = navItemRefs.current[id]?.querySelector('a')
      if (!el) return
      if (fillPx >= geo.centre[i]) {
        el.classList.add(styles.filled)
      } else {
        el.classList.remove(styles.filled)
      }
    })
  }, [])

  const getFillForScroll = useCallback((geo, offsets) => {
    const scrollY    = window.scrollY
    const vh         = window.innerHeight
    const docHeight  = document.documentElement.scrollHeight

    if (vh + scrollY >= docHeight - 10) {
      return geo.listWidth
    }

    const threshold = vh * 0.4
    for (let i = offsets.length - 1; i >= 0; i--) {
      const top = offsets[i] - threshold
      if (scrollY >= top) {
        const nextTop   = i + 1 < offsets.length ? offsets[i + 1] - threshold : docHeight
        const segPct    = Math.min((scrollY - top) / (nextTop - top), 1)
        const curRight  = geo.rightEdge[i]
        const nextRight = i + 1 < geo.rightEdge.length ? geo.rightEdge[i + 1] : geo.listWidth
        const fill      = curRight + segPct * (nextRight - curRight)
        return Math.max(fill, geo.rightEdge[0])
      }
    }

    return geo.rightEdge[0]
  }, [])
  useEffect(() => {
    let rafScheduled = false

    const onScroll = () => {
      if (rafScheduled) return
      rafScheduled = true

      requestAnimationFrame(() => {
        rafScheduled = false
        const geo      = geoCacheRef.current
        const offsets  = sectionOffsetsRef.current
        if (!geo || offsets.length === 0) return

        applyFill(getFillForScroll(geo, offsets))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [applyFill, getFillForScroll])
  useEffect(() => {
    const t = setTimeout(() => {
      const geo      = buildGeoCache() || geoCacheRef.current
      const offsets  = buildSectionOffsets() || sectionOffsetsRef.current
      if (!geo || offsets.length === 0) return

      applyFill(getFillForScroll(geo, offsets))
    }, 120)
    return () => clearTimeout(t)
  }, [applyFill, buildGeoCache, buildSectionOffsets, getFillForScroll])
  const shootSparkles = useCallback((sectionId) => {
    const navEl   = navItemRefs.current[sectionId]
    const targetEl = window.matchMedia('(max-width: 600px)').matches
      ? mobileMenuRef.current
      : scoreRef.current
    if (!navEl || !targetEl) return
    const from = navEl.getBoundingClientRect()
    const to   = targetEl.getBoundingClientRect()
    fireSparklesRef.current(
      from.left + from.width  / 2,
      from.top  + from.height / 2,
      to.left   + to.width    / 2,
      to.top    + to.height   / 2,
      12
    )
    setTimeout(() => addScoreRef.current(SCORE_PER_SECTION), SPARKLE_TRAVEL_MS)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (initialHomeSparkleRef.current || window.scrollY > 8) return
      const sparkleTarget = window.matchMedia('(max-width: 600px)').matches
        ? mobileMenuRef.current
        : scoreRef.current
      if (!navItemRefs.current.home || !sparkleTarget) return

      initialHomeSparkleRef.current = true
      visitedRef.current.add('home')
      setVisitedSections(prev => new Set([...prev, 'home']))
      setActiveSection('home')
      shootSparkles('home')
      setGlowingSection('home')
      setTimeout(() => setGlowingSection(null), 800)
    }, 180)

    return () => clearTimeout(t)
  }, [shootSparkles])

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const sections   = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
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
        })
      },
      { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => sections.forEach((s) => observer.unobserve(s))
  }, [shootSparkles])
  useEffect(() => {
    const start = displayScoreRef.current
    if (start === score) return undefined

    window.clearTimeout(scoreGlowTimeoutRef.current)
    setScoreGlowing(true)
    const end       = score
    const duration  = 800
    const startTime = performance.now()
    const easeOut   = (t) => 1 - Math.pow(1 - t, 3)
    let raf

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1)
      const nextScore = Math.round(start + (end - start) * easeOut(t))
      displayScoreRef.current = nextScore
      setDisplayScore(nextScore)
      if (t < 1) { raf = requestAnimationFrame(tick) }
      else {
        scoreGlowTimeoutRef.current = window.setTimeout(() => {
          setScoreGlowing(false)
        }, 250)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(scoreGlowTimeoutRef.current)
    }
  }, [score])
  useEffect(() => {
    if (hasOpenedCompleteScoreRef.current || score < TOTAL_SCORE) return
    hasOpenedCompleteScoreRef.current = true

    if (window.matchMedia('(max-width: 600px)').matches) {
      setIsMobileCompletionClosing(false)
      setIsMobileCompletionOpen(true)
      scorePopupFadeTimerRef.current = window.setTimeout(() => {
        setIsMobileCompletionClosing(true)
        scorePopupCloseTimerRef.current = window.setTimeout(() => {
          setIsMobileCompletionOpen(false)
          setIsMobileCompletionClosing(false)
        }, 400)
      }, 3000)
      return
    }

    updatePopupPosition()
    setIsScorePopupClosing(false)
    setIsScorePopupOpen(true)
  }, [score, updatePopupPosition])

  const total           = NAV_LINKS.length
  const activeIndex     = NAV_LINKS.findIndex((l) => l.href.replace('#', '') === activeSection)
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex
  const isComplete      = safeActiveIndex === total - 1

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const section = document.querySelector(href)
    if (!section) return

    const headerHeight = headerRef.current?.offsetHeight || 0
    const targetTop = section.getBoundingClientRect().top + window.scrollY

    window.scrollTo({
      top: Math.max(targetTop - headerHeight - NAV_SCROLL_EXTRA_OFFSET, 0),
      behavior: 'smooth',
    })
  }

  return (
    <>
    {isScorePopupOpen && createPortal(
      <div
        ref={popupPortalRef}
        className={`${styles.popupPortal} ${styles.desktopPopupPortal} ${isScorePopupClosing ? styles.popupPortalClosing : ''}`}
        style={{ top: popupPos.top, right: popupPos.right }}
      >
        <ScorePopup
          score={displayScore}
          total={TOTAL_SCORE}
          completed={score >= TOTAL_SCORE}
          mobileCompact
        />
      </div>,
      document.body
    )}
    {isMobileCompletionOpen && createPortal(
      <div className={`${styles.mobileCompletionPortal} ${isMobileCompletionClosing ? styles.popupPortalClosing : ''}`}>
        <ScorePopup
          score={displayScore}
          total={TOTAL_SCORE}
          completed
          mobileCompact
        />
      </div>,
      document.body
    )}
    <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isMobileHeaderHidden ? styles.headerHidden : ''} ${isMobileMenuOpen ? styles.menuOpen : ''}`}>
      <div data-header-inner>
      <div className={styles.topBar}>
        <span className={styles.brand}>Rina Firdiana</span>

        <button
          ref={mobileMenuRef}
          className={styles.mobileMenuButton}
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-panel"
          onClick={() => {
            setIsScorePopupOpen(false)
            openMobileMenu()
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <button
          className={styles.darkToggle}
          type="button"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleDark}
        >
          <img
            src={isDark ? '/images/icons/moon.png' : '/images/icons/sun.png'}
            alt={isDark ? 'Moon' : 'Sun'}
            className={styles.darkToggleIcon}
          />
        </button>

        <div ref={scoreWrapRef} className={styles.scoreWrap}>
          <button
            ref={scoreRef}
            type="button"
            className={`${styles.scoreBadge} ${isScorePopupOpen ? styles.scoreBadgeOpen : ''}`}
            aria-label="Score badge"
            aria-expanded={isScorePopupOpen}
            aria-pressed={isScorePopupOpen}
            onClick={() => {
              if (!isScorePopupOpen) {
                updatePopupPosition()
              }
              setIsScorePopupOpen((open) => !open)
            }}
          >
            <StarIcon
              size="2.5rem"
              glow={scoreGlowing}
              className={`${styles.scoreIcon} ${scoreGlowing ? styles.scoreIconGlow : ''}`}
            />
            <span className={styles.scoreText}>
              <span className={styles.scoreLabel}>Points</span>
              <span className={`${styles.scoreValue} ${scoreGlowing ? styles.scoreValueGlow : ''}`}>
                {displayScore}
              </span>
            </span>
          </button>

        </div>
      </div>

      {isMobileMenuOpen ? (
        <div
          id="mobile-navigation-panel"
          className={`${styles.mobilePanel} ${isMobileMenuClosing ? styles.mobilePanelClosing : styles.mobilePanelOpen}`}
        >
          <div className={styles.mobilePanelTop}>
            <span className={styles.mobilePanelBrand}>R<span className={styles.mobilePanelBrandF}>f</span></span>

            <button
              className={styles.mobilePanelTheme}
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleDark}
            >
              <img
                src={isDark ? '/images/icons/moon.png' : '/images/icons/sun.png'}
                alt=""
                className={styles.mobilePanelThemeIcon}
              />
            </button>

            <button
              className={`${styles.mobileMenuButton} ${styles.mobileMenuButtonOpen}`}
              type="button"
              aria-label="Close menu"
              aria-expanded="true"
              aria-controls="mobile-navigation-panel"
              onClick={closeMobileMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className={styles.mobilePanelScore} aria-label={`Score ${displayScore} out of ${TOTAL_SCORE}`}>
            <span className={styles.mobilePanelScoreRow}>
              <StarIcon size="1.5rem" glow={scoreGlowing} />
              <span className={styles.mobilePanelScoreText}>
                <span className={styles.mobilePanelScoreLabel}>Score</span>
                <span className={styles.mobilePanelScoreValue}>{displayScore}/{TOTAL_SCORE}</span>
              </span>
            </span>
            <span className={styles.mobilePanelScoreHint}>
              Earn points whenever you see
              <StarIcon size="0.75rem" glow />
            </span>
          </div>

          <nav className={styles.mobilePanelNav} aria-label="Mobile navigation">
            <ul className={styles.mobilePanelList}>
              {MOBILE_MENU_LINKS.map(({ label, href }) => {
                const sectionId = href.replace('#', '')
                const isVisited = visitedSections.has(sectionId)
                const isGlowing = glowingSection === sectionId

                return (
                  <li key={href} className={styles.mobilePanelItem}>
                    <a
                      href={href}
                      className={styles.mobilePanelLink}
                      onClick={(event) => {
                        closeMobileMenu()
                        handleNavClick(event, href)
                      }}
                    >
                      <span>{label}</span>
                      <StarIcon
                        size="1rem"
                        glow={isGlowing || !isVisited}
                        className={styles.mobilePanelStar}
                        style={{ opacity: isVisited && !isGlowing ? 0 : 1 }}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      ) : null}

      <nav className={styles.nav} aria-label="Main navigation">
        <ul
          ref={navListRef}
          className={`${styles.navList} ${isComplete ? styles.complete : ''} ${styles.scrolling}`}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace('#', '')
            const isActive  = activeSection === sectionId
            const isGlowing = glowingSection === sectionId
            const isVisited = visitedSections.has(sectionId)

            return (
              <li
                key={label}
                ref={(el) => { navItemRefs.current[sectionId] = el }}
                className={styles.navItem}
              >
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`${styles.navLink} ${isActive ? styles.active : ''} ${isGlowing ? styles.glowing : ''}`}
                >
                  <span className={styles.navText}>{label}</span>
                  <StarIcon
                    size="0.75rem"
                    glow={isGlowing || !isVisited}
                    className={styles.navStar}
                    style={{ opacity: isVisited && !isGlowing ? 0 : 1 }}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      </div>
    </header>
    </>
  )
}
