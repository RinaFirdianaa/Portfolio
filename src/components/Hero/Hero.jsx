import { Fragment, useRef, useState, useEffect } from 'react'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import { useScore } from '@/components/Score/ScoreContext'
import { useTheme } from '@/components/Theme/ThemeContext'
import CloudBackground from './CloudBackground'
import styles from './Hero.module.css'

const SPARKLE_TRAVEL_MS = 850
const PLANET_SCORE = 5

export default function Hero() {
  const imageRef         = useRef(null)
  const rafRef           = useRef(null)
  const unwindRafRef     = useRef(null)
  const angleRef         = useRef(0)
  const isSpinningRef    = useRef(false)
  const scoredRef        = useRef(false)
  const planetWrapperRef = useRef(null)
  const { fireSparkles } = useSparkles()
  const { addScore }     = useScore()
  const { isDark }       = useTheme()

  const [hovered, setHovered]         = useState(false)
  const [everHovered, setEverHovered] = useState(false)
  const [scored, setScored]           = useState(false)

  useEffect(() => {
    const spinAnimation = rafRef
    const unwindAnimation = unwindRafRef

    return () => {
      cancelAnimationFrame(spinAnimation.current)
      cancelAnimationFrame(unwindAnimation.current)
      isSpinningRef.current = false
    }
  }, [])

  const awardPlanetScore = () => {
    if (scoredRef.current || !planetWrapperRef.current) return

    scoredRef.current = true
    const from = planetWrapperRef.current.getBoundingClientRect()
    const scoreEl = document.querySelector('[aria-label="Score badge"]')
    if (scoreEl) {
      const to = scoreEl.getBoundingClientRect()
      fireSparkles(
        from.left + from.width / 2,
        from.top + from.height / 2,
        to.left + to.width / 2,
        to.top + to.height / 2,
        14
      )
      setTimeout(() => addScore(PLANET_SCORE), SPARKLE_TRAVEL_MS)
      setScored(true)
    } else {
      scoredRef.current = false
    }
  }

  const spinOnce = () => {
    if (isSpinningRef.current) return

    cancelAnimationFrame(rafRef.current)
    cancelAnimationFrame(unwindRafRef.current)
    isSpinningRef.current = true
    setHovered(true)
    setEverHovered(true)
    awardPlanetScore()

    const duration = 1400
    const startTime = performance.now()
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const spin = (now) => {
      const t = Math.min((now - startTime) / duration, 1)
      const angle = easeOut(t) * 360
      angleRef.current = angle
      if (imageRef.current) {
        imageRef.current.style.transform = `rotateY(${angle}deg)`
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(spin)
      } else {
        isSpinningRef.current = false
        angleRef.current = 0
        setHovered(false)
        if (imageRef.current) {
          imageRef.current.style.transform = ''
        }
      }
    }
    rafRef.current = requestAnimationFrame(spin)
  }

  const handleSpinKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      spinOnce()
    }
  }

  return (
    <section id="home" className={styles.hero} aria-label="Hero section">
      <CloudBackground />

      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <h1 className={styles.heading}>
            <span className={styles.headingName}>Rina</span> is here!
          </h1>
          <p className={styles.body}>
            I'm a fresh grad UI/UX designer who likes making apps and websites
            less confusing so people don't rage-quit after 3 seconds. I enjoy
            turning messy ideas into clean, clickable experiences that actually
            make sense and don't make users suffer.
          </p>
          <p className={styles.tagline}>
            Also, I'm a professional button mover in Figma.
          </p>
          <div className={styles.heroLinks} aria-label="Profile links">
            <a
              className={styles.iconLink}
              href="https://www.linkedin.com/in/rina-firdiana/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <img
                className={styles.linkedinIcon}
                src="/images/icons/linkedin%20.png"
                alt=""
                aria-hidden="true"
              />
            </a>
            <a className={styles.resumeLink} href="/resume.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
          </div>
        </div>

        <div className={styles.illustrationBlock}>
          <div
            ref={planetWrapperRef}
            className={styles.planetWrapper}
            role="button"
            tabIndex="0"
            aria-label="Spin portrait"
            onClick={spinOnce}
            onKeyDown={handleSpinKeyDown}
          >
            <svg
              className={styles.orbitText}
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <rect className={styles.orbitHitArea} width="200" height="200" />
              <defs>
                <path
                  id="orbitCircle"
                  d="M 100,100 m -88,0 a 88,68 0 1,1 176,0 a 88,88 0 1,1 -176,0"
                />
              </defs>
              <text className={styles.orbitLabel}>
                <textPath href="#orbitCircle" startOffset="0%">
                  {hovered ? (
                    <tspan key="weeee">weeee!</tspan>
                  ) : scored ? (
                    <tspan key="collected">press me</tspan>
                  ) : everHovered ? (
                    <Fragment key="hover-again">
                      <tspan>press me </tspan>
                      <tspan className={styles.orbitStar}>✦</tspan>
                    </Fragment>
                  ) : (
                    <Fragment key="hover-start">
                      <tspan>press me </tspan>
                      <tspan className={styles.orbitStar}>✦</tspan>
                    </Fragment>
                  )}
                </textPath>
              </text>
            </svg>

            <span className={`${styles.cssRings} ${styles.ringBack}`} aria-hidden="true" />
            <div ref={imageRef} className={styles.heroImageWrapper}>
              <img
                src="/images/hero.png"
                alt="Rina"
                className={`${styles.heroImage} ${isDark ? styles.heroImageHidden : ''}`}
              />
              <img
                src="/images/hero-dark.png"
                alt=""
                aria-hidden="true"
                className={`${styles.heroImage} ${styles.heroImageDark} ${isDark ? '' : styles.heroImageHidden}`}
              />
            </div>
            <span className={`${styles.cssRings} ${styles.ringFront}`} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
