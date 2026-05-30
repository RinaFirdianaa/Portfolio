/**
 * Hero
 * Full-width landing section with gradient sky background,
 * intro text, and a floating hero image with planet rings.
 */

import { useRef, useState } from 'react'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import { useScore } from '@/components/Score/ScoreContext'
import CloudBackground from './CloudBackground'
import styles from './Hero.module.css'
import StarIcon from '@/components/StarIcon/StarIcon'

const SPARKLE_TRAVEL_MS = 850
const PLANET_SCORE = 10

export default function Hero() {
  const imageRef = useRef(null)
  const rafRef = useRef(null)
  const angleRef = useRef(0)
  const planetWrapperRef = useRef(null)
  const { fireSparkles } = useSparkles()
  const { addScore } = useScore()

  const [hovered, setHovered] = useState(false)
  const [everHovered, setEverHovered] = useState(false)
  const [scored, setScored] = useState(false)

  const startSpin = () => {
    setHovered(true)
    setEverHovered(true)

    if (!scored && planetWrapperRef.current) {
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
      }
    }

    const loop = () => {
      angleRef.current = (angleRef.current + 3) % 360
      if (imageRef.current) {
        imageRef.current.style.transform = `rotateY(${angleRef.current}deg)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const stopSpin = () => {
    setHovered(false)
    cancelAnimationFrame(rafRef.current)

    const startAngle = angleRef.current % 360
    const duration = 600
    const startTime = performance.now()
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const unwind = (now) => {
      const t = Math.min((now - startTime) / duration, 1)
      const angle = startAngle * (1 - easeOut(t))
      angleRef.current = angle
      if (imageRef.current) {
        imageRef.current.style.transform = `rotateY(${angle}deg)`
      }
      if (t < 1) requestAnimationFrame(unwind)
      else if (imageRef.current) {
        imageRef.current.style.transform = ''
      }
    }
    requestAnimationFrame(unwind)
  }

  return (
    <section id="home" className={styles.hero} aria-label="Hero section">

      {/* Animated cloud background — contained to hero only */}
      <CloudBackground />

      {/* Content sits above clouds */}
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
          <p className={styles.hint}>
            Earn pts wherever you see <StarIcon size="1rem" glow />
          </p>
        </div>

        <div className={styles.illustrationBlock} aria-hidden="true">
          <div
            ref={planetWrapperRef}
            className={styles.planetWrapper}
            onMouseEnter={startSpin}
            onMouseLeave={stopSpin}
          >
            <svg
              className={`${styles.orbitText} ${hovered ? styles.orbitTextSpin : ''}`}
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="orbitCircle"
                  d="M 100,100 m -88,0 a 88,68 0 1,1 176,0 a 88,88 0 1,1 -176,0"
                />
              </defs>
              <text className={styles.orbitLabel}>
                <textPath href="#orbitCircle" startOffset="0%">
                  {hovered ? (
                    'weeee!'
                  ) : everHovered ? (
                    'hover me'
                  ) : (
                    <>
                      <tspan>hover me </tspan>
                      <tspan fill="var(--yellow-40)">✦</tspan>
                    </>
                  )}
                </textPath>
              </text>
            </svg>

            <img src="/images/rings.png" alt="" className={styles.rings} />
            <img
              ref={imageRef}
              src="/images/hero.png"
              alt="Rina"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}