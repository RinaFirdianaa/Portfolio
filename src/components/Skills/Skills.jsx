/**
 * Skills
 * Interactive skill bubbles pulled from constants/data.js.
 */

import { useRef, useState } from 'react'
import { SKILLS } from '@/constants/data'
import styles from './Skills.module.css'

const START_POSITIONS = [
  { x: 8, y: 12 },
  { x: 36, y: 8 },
  { x: 62, y: 18 },
  { x: 18, y: 54 },
  { x: 52, y: 58 },
]

const SKILL_THEMES = {
  code: {
    '--skill-card-bg': 'var(--yellow-10)',
    '--skill-card-border': 'rgba(169, 128, 57, 0.26)',
    '--skill-bubble-start': 'rgba(255, 233, 191, 0.96)',
    '--skill-bubble-end': 'rgba(255, 202, 112, 0.62)',
    '--skill-bubble-shadow': 'rgba(169, 128, 57, 0.22)',
    '--skill-accent': 'var(--yellow-80)',
    '--skill-bubble-hue': '38',
  },
  design: {
    '--skill-card-bg': 'var(--pink-10)',
    '--skill-card-border': 'rgba(215, 113, 150, 0.24)',
    '--skill-bubble-start': 'rgba(253, 195, 217, 0.96)',
    '--skill-bubble-end': 'rgba(252, 165, 197, 0.64)',
    '--skill-bubble-shadow': 'rgba(215, 113, 150, 0.2)',
    '--skill-accent': 'var(--pink-80)',
    '--skill-bubble-hue': '336',
  },
  tools: {
    '--skill-card-bg': 'var(--purple-10)',
    '--skill-card-border': 'rgba(168, 127, 219, 0.24)',
    '--skill-bubble-start': 'rgba(213, 188, 245, 0.96)',
    '--skill-bubble-end': 'rgba(168, 127, 219, 0.62)',
    '--skill-bubble-shadow': 'rgba(168, 127, 219, 0.22)',
    '--skill-accent': 'var(--purple-60)',
    '--skill-bubble-hue': '265',
  },
  soft: {
    '--skill-card-bg': 'rgba(213, 232, 255, 0.58)',
    '--skill-card-border': 'rgba(117, 165, 223, 0.24)',
    '--skill-bubble-start': 'rgba(213, 232, 255, 0.96)',
    '--skill-bubble-end': 'rgba(117, 165, 223, 0.6)',
    '--skill-bubble-shadow': 'rgba(117, 165, 223, 0.22)',
    '--skill-accent': 'var(--blue-100)',
    '--skill-bubble-hue': '210',
  },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const getBubbleSize = (count) => `${clamp(136 - count * 8, 72, 104)}px`
const normalizeSkillItem = (item) => (
  typeof item === 'string'
    ? { label: item }
    : item
)

export default function Skills() {
  const stageRefs = useRef({})
  const activeBubbleRef = useRef(null)
  const bubblePositionsRef = useRef({})
  const [bubblePositions, setBubblePositions] = useState({})

  const getBubbleKey = (skillId, item) => `${skillId}-${item.label}`

  const getStartPosition = (index) => START_POSITIONS[index % START_POSITIONS.length]

  const updateBubblePosition = (skillId, bubbleKey, event) => {
    const stage = stageRefs.current[skillId]
    if (!stage) return

    const stageRect = stage.getBoundingClientRect()
    const bubbleRect = event.currentTarget.getBoundingClientRect()
    const x = clamp(event.clientX - stageRect.left - bubbleRect.width / 2, 0, stageRect.width - bubbleRect.width)
    const y = clamp(event.clientY - stageRect.top - bubbleRect.height / 2, 0, stageRect.height - bubbleRect.height)

    bubblePositionsRef.current[bubbleKey] = { x, y }
    event.currentTarget.style.left = '0px'
    event.currentTarget.style.top = '0px'
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const handlePointerDown = (skillId, bubbleKey, event) => {
    activeBubbleRef.current = bubbleKey
    event.currentTarget.setPointerCapture(event.pointerId)
    updateBubblePosition(skillId, bubbleKey, event)
  }

  const handlePointerMove = (skillId, bubbleKey, event) => {
    if (activeBubbleRef.current !== bubbleKey) return
    updateBubblePosition(skillId, bubbleKey, event)
  }

  const handlePointerUp = (event) => {
    const bubbleKey = activeBubbleRef.current
    activeBubbleRef.current = null
    if (bubbleKey && bubblePositionsRef.current[bubbleKey]) {
      setBubblePositions((current) => ({
        ...current,
        [bubbleKey]: bubblePositionsRef.current[bubbleKey],
      }))
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <section id="skills" className={`section ${styles.skills}`} aria-label="Skills">
      <div className={styles.header}>
        <div>
          <h2 className={styles.sectionTitle}>What I bring to the table</h2>
          <p className={styles.subtitle}>Complete the puzzle</p>
        </div>
      </div>

      <div className={styles.grid}>
        {SKILLS.map((skill) => (
          <article
            key={skill.id}
            className={styles.card}
            style={{
              ...SKILL_THEMES[skill.id],
            }}
          >
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon} aria-hidden="true">{skill.icon}</span>
              {skill.label}
            </h3>

            <div
              ref={(node) => { stageRefs.current[skill.id] = node }}
              className={styles.bubbleStage}
              aria-label={`${skill.label} skills`}
            >
              {skill.items.map((rawItem, index) => {
                const item = normalizeSkillItem(rawItem)
                const bubbleKey = getBubbleKey(skill.id, item)
                const savedPosition = bubblePositions[bubbleKey]
                const startPosition = getStartPosition(index)
                const bubbleSize = getBubbleSize(skill.items.length)
                const style = savedPosition
                  ? {
                      '--bubble-size': bubbleSize,
                      '--bubble-delay': `${index * -0.55}s`,
                      '--bubble-duration': `${3.6 + (index % 4) * 0.45}s`,
                      '--bubble-drift': index % 2 === 0 ? '1' : '-1',
                      transform: `translate3d(${savedPosition.x}px, ${savedPosition.y}px, 0)`,
                    }
                  : {
                      '--bubble-size': bubbleSize,
                      '--bubble-delay': `${index * -0.55}s`,
                      '--bubble-duration': `${3.6 + (index % 4) * 0.45}s`,
                      '--bubble-drift': index % 2 === 0 ? '1' : '-1',
                      left: `${startPosition.x}%`,
                      top: `${startPosition.y}%`,
                    }

                return (
                  <div
                    key={bubbleKey}
                    role="button"
                    tabIndex="0"
                    className={styles.bubble}
                    style={style}
                    onPointerDown={(event) => handlePointerDown(skill.id, bubbleKey, event)}
                    onPointerMove={(event) => handlePointerMove(skill.id, bubbleKey, event)}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    aria-label={item.label}
                    data-has-image={item.image ? 'true' : 'false'}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className={styles.bubbleImage} />
                    ) : null}
                    <svg className={styles.bubbleText} viewBox="0 0 100 100" aria-hidden="true">
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">
                        {item.label}
                      </text>
                    </svg>
                  </div>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
