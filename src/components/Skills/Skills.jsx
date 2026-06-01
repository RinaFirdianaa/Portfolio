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

const SECTION_ZONES = [
  { x: 2, y: 8, width: 42, height: 34 },
  { x: 56, y: 8, width: 42, height: 34 },
  { x: 2, y: 58, width: 42, height: 34 },
  { x: 56, y: 58, width: 42, height: 34 },
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
const BUBBLE_BASE_SIZE = 100
const BUBBLE_MERGE_INCREMENT = 30
const BUBBLE_SIZE_STEP_DOWN = 10
const normalizeSkillItem = (item) => (
  typeof item === 'string'
    ? { label: item }
    : item
)

const makeSkillGroups = () => Object.fromEntries(
  SKILLS.map((skill) => [
    skill.id,
    skill.items.map((rawItem, index) => {
      const item = normalizeSkillItem(rawItem)
      return {
        id: `${skill.id}-${item.label}-${index}`,
        labels: [item.label],
        images: item.image ? [item.image] : [],
        startIndex: index,
      }
    }),
  ])
)

const getBaseBubbleSize = (sectionCount) => (
  clamp(BUBBLE_BASE_SIZE - Math.max(sectionCount - 5, 0) * BUBBLE_SIZE_STEP_DOWN, 72, BUBBLE_BASE_SIZE)
)
const getBubbleSizePx = (sectionCount, labels) => (
  getBaseBubbleSize(sectionCount) + (labels.length - 1) * BUBBLE_MERGE_INCREMENT
)
const getBubbleSize = (sectionCount, labels) => `${getBubbleSizePx(sectionCount, labels)}px`

export default function Skills() {
  const stageRef = useRef(null)
  const bubbleRefs = useRef({})
  const activeBubbleRef = useRef(null)
  const bubblePositionsRef = useRef({})
  const [bubblePositions, setBubblePositions] = useState({})
  const [skillGroups, setSkillGroups] = useState(makeSkillGroups)
  const [mergeTargetId, setMergeTargetId] = useState(null)

  const getSectionZone = (skillId) => SECTION_ZONES[SKILLS.findIndex((skill) => skill.id === skillId)] || SECTION_ZONES[0]

  const getStartPosition = (skillId, index) => {
    const zone = getSectionZone(skillId)
    const position = START_POSITIONS[index % START_POSITIONS.length]
    return {
      x: zone.x + (position.x / 100) * zone.width,
      y: zone.y + (position.y / 100) * zone.height,
    }
  }

  const updateBubblePosition = (skillId, bubbleId, event) => {
    const stage = stageRef.current
    if (!stage) return

    const stageRect = stage.getBoundingClientRect()
    const bubbleRect = event.currentTarget.getBoundingClientRect()
    const x = clamp(event.clientX - stageRect.left - bubbleRect.width / 2, 0, stageRect.width - bubbleRect.width)
    const y = clamp(event.clientY - stageRect.top - bubbleRect.height / 2, 0, stageRect.height - bubbleRect.height)

    bubblePositionsRef.current[bubbleId] = { x, y }
    event.currentTarget.style.left = '0px'
    event.currentTarget.style.top = '0px'
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const findMergeTarget = (skillId, bubbleId) => {
    const activeEl = bubbleRefs.current[bubbleId]
    if (!activeEl) return null

    const activeRect = activeEl.getBoundingClientRect()
    const activeCenter = {
      x: activeRect.left + activeRect.width / 2,
      y: activeRect.top + activeRect.height / 2,
    }

    return (skillGroups[skillId] || []).find((group) => {
      if (group.id === bubbleId) return false
      const targetEl = bubbleRefs.current[group.id]
      if (!targetEl) return false

      const targetRect = targetEl.getBoundingClientRect()
      const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      }
      const distance = Math.hypot(activeCenter.x - targetCenter.x, activeCenter.y - targetCenter.y)
      return distance < (activeRect.width + targetRect.width) * 0.34
    })
  }

  const mergeBubbles = (skillId, sourceId, targetId) => {
    setSkillGroups((current) => {
      const groups = current[skillId] || []
      const source = groups.find((group) => group.id === sourceId)
      const target = groups.find((group) => group.id === targetId)
      if (!source || !target) return current

      const merged = {
        ...target,
        labels: [...target.labels, ...source.labels],
        images: [...target.images, ...source.images],
      }

      if (merged.labels.length >= SKILLS.find((skill) => skill.id === skillId)?.items.length) {
        const stage = stageRef.current
        if (stage) {
          const stageRect = stage.getBoundingClientRect()
          const zone = getSectionZone(skillId)
          const zoneRect = {
            x: (zone.x / 100) * stageRect.width,
            y: (zone.y / 100) * stageRect.height,
            width: (zone.width / 100) * stageRect.width,
            height: (zone.height / 100) * stageRect.height,
          }
          const finalSize = Math.min(
            getBubbleSizePx(SKILLS.find((skill) => skill.id === skillId)?.items.length || 5, merged.labels),
            zoneRect.width - 16,
            zoneRect.height - 16
          )
          bubblePositionsRef.current[targetId] = {
            x: clamp(zoneRect.x + (zoneRect.width - finalSize) / 2, 0, stageRect.width - finalSize),
            y: clamp(zoneRect.y + (zoneRect.height - finalSize) / 2, 0, stageRect.height - finalSize),
          }
        }
      }

      return {
        ...current,
        [skillId]: groups
          .filter((group) => group.id !== sourceId)
          .map((group) => (group.id === targetId ? merged : group)),
      }
    })

    delete bubblePositionsRef.current[sourceId]
    setBubblePositions((current) => {
      const next = { ...current }
      delete next[sourceId]
      if (bubblePositionsRef.current[targetId]) {
        next[targetId] = bubblePositionsRef.current[targetId]
      }
      return next
    })
  }

  const handlePointerDown = (skillId, bubbleId, event) => {
    activeBubbleRef.current = { skillId, bubbleId }
    setMergeTargetId(null)
    event.currentTarget.setPointerCapture(event.pointerId)
    updateBubblePosition(skillId, bubbleId, event)
  }

  const handlePointerMove = (skillId, bubbleId, event) => {
    if (activeBubbleRef.current?.bubbleId !== bubbleId) return
    updateBubblePosition(skillId, bubbleId, event)
    setMergeTargetId(findMergeTarget(skillId, bubbleId)?.id || null)
  }

  const handlePointerUp = (event) => {
    const activeBubble = activeBubbleRef.current
    activeBubbleRef.current = null
    setMergeTargetId(null)

    if (activeBubble) {
      const mergeTarget = findMergeTarget(activeBubble.skillId, activeBubble.bubbleId)

      if (mergeTarget) {
        mergeBubbles(activeBubble.skillId, activeBubble.bubbleId, mergeTarget.id)
      } else if (bubblePositionsRef.current[activeBubble.bubbleId]) {
        setBubblePositions((current) => ({
          ...current,
          [activeBubble.bubbleId]: bubblePositionsRef.current[activeBubble.bubbleId],
        }))
      }
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

      <article className={styles.universe}>
        <div className={styles.backgroundLabels} aria-hidden="true">
          {SKILLS.map((skill, index) => {
            const zone = getSectionZone(skill.id)
            const isLeftSide = index % 2 === 0
            return (
              <span
                key={skill.id}
                className={styles.backgroundTitle}
                style={{
                  ...SKILL_THEMES[skill.id],
                  '--label-rotate': isLeftSide ? '-90deg' : '90deg',
                  left: isLeftSide ? '4%' : '96%',
                  top: `${zone.y + zone.height / 2}%`,
                }}
              >
                {skill.label}
              </span>
            )
          })}
        </div>

        <div
          ref={stageRef}
          className={styles.bubbleStage}
          aria-label="Skills bubbles"
        >
          {SKILLS.flatMap((skill) => {
            const groups = skillGroups[skill.id] || []

            return groups.map((group, index) => {
              const label = group.labels.join(' + ')
              const savedPosition = bubblePositions[group.id]
              const startPosition = getStartPosition(skill.id, group.startIndex)
              const bubbleSize = getBubbleSize(skill.items.length, group.labels)
              const isCompleteBubble = group.labels.length >= skill.items.length
              const style = savedPosition
                ? {
                    ...SKILL_THEMES[skill.id],
                    '--bubble-size': bubbleSize,
                    '--bubble-delay': isCompleteBubble ? '-0.8s' : `${index * -0.55}s`,
                    '--bubble-duration': isCompleteBubble ? '7.5s' : `${3.6 + (index % 4) * 0.45}s`,
                    '--bubble-drift': index % 2 === 0 ? '1' : '-1',
                    transform: `translate3d(${savedPosition.x}px, ${savedPosition.y}px, 0)`,
                  }
                : {
                    ...SKILL_THEMES[skill.id],
                    '--bubble-size': bubbleSize,
                    '--bubble-delay': isCompleteBubble ? '-0.8s' : `${index * -0.55}s`,
                    '--bubble-duration': isCompleteBubble ? '7.5s' : `${3.6 + (index % 4) * 0.45}s`,
                    '--bubble-drift': index % 2 === 0 ? '1' : '-1',
                    left: `${startPosition.x}%`,
                    top: `${startPosition.y}%`,
                  }

              return (
                <div
                  key={group.id}
                  ref={(node) => {
                    if (node) {
                      bubbleRefs.current[group.id] = node
                    } else {
                      delete bubbleRefs.current[group.id]
                    }
                  }}
                  role="button"
                  tabIndex="0"
                  className={styles.bubble}
                  style={style}
                  onPointerDown={(event) => handlePointerDown(skill.id, group.id, event)}
                  onPointerMove={(event) => handlePointerMove(skill.id, group.id, event)}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  aria-label={label}
                  data-has-image={group.images.length > 0 ? 'true' : 'false'}
                  data-image-count={group.images.length}
                  data-label-count={group.labels.length}
                  data-complete={isCompleteBubble ? 'true' : 'false'}
                  data-merge-target={mergeTargetId === group.id ? 'true' : 'false'}
                >
                  {group.images.length > 0 ? (
                    <span className={styles.bubbleImageGrid} aria-hidden="true">
                      {group.images.map((image, imageIndex) => (
                        <img
                          key={`${image}-${imageIndex}`}
                          src={image}
                          alt=""
                          className={styles.bubbleImage}
                          draggable="false"
                        />
                      ))}
                    </span>
                  ) : null}
                  <span className={styles.bubbleLabelGrid} aria-hidden="true">
                    {group.labels.map((text) => (
                      <span key={text} className={styles.bubbleLabelItem}>
                        {text}
                      </span>
                    ))}
                  </span>
                </div>
              )
            })
          })}
        </div>
      </article>
    </section>
  )
}
