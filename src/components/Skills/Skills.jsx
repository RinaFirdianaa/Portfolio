/**
 * Skills
 * Interactive skill bubbles pulled from constants/data.js.
 */

import { useRef, useState } from 'react'
import { SKILLS } from '@/constants/data'
import { useScore } from '@/components/Score/ScoreContext'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './Skills.module.css'

const START_POSITIONS = [
  { x: 4, y: 8 },
  { x: 34, y: 0 },
  { x: 72, y: 14 },
  { x: 12, y: 68 },
  { x: 62, y: 72 },
]

const SECTION_ZONES = [
  { x: 0, y: 1, width: 42, height: 34 },
  { x: 62, y: 1, width: 38, height: 34 },
  { x: 0, y: 50, width: 42, height: 34 },
  { x: 62, y: 50, width: 38, height: 34 },
]

const SKILL_THEMES = {
  code: {
    '--skill-card-bg': 'var(--yellow-10)',
    '--skill-card-border': 'rgba(169, 128, 57, 0.26)',
    '--skill-bubble-start': 'rgba(255, 233, 191, 0.96)',
    '--skill-bubble-end': 'rgba(255, 202, 112, 0.62)',
    '--skill-bubble-shadow': 'rgba(169, 128, 57, 0.22)',
    '--skill-accent': 'var(--yellow-60)',
    '--skill-bubble-hue': '38',
  },
  design: {
    '--skill-card-bg': 'var(--pink-10)',
    '--skill-card-border': 'rgba(215, 113, 150, 0.24)',
    '--skill-bubble-start': 'rgba(253, 195, 217, 0.96)',
    '--skill-bubble-end': 'rgba(252, 165, 197, 0.64)',
    '--skill-bubble-shadow': 'rgba(215, 113, 150, 0.2)',
    '--skill-accent': 'var(--pink-60)',
    '--skill-bubble-hue': '336',
  },
  tools: {
    '--skill-card-bg': 'var(--purple-10)',
    '--skill-card-border': 'rgba(168, 127, 219, 0.24)',
    '--skill-bubble-start': 'rgba(213, 188, 245, 0.96)',
    '--skill-bubble-end': 'rgba(168, 127, 219, 0.62)',
    '--skill-bubble-shadow': 'rgba(168, 127, 219, 0.22)',
    '--skill-accent': 'var(--purple-40)',
    '--skill-bubble-hue': '265',
  },
  soft: {
    '--skill-card-bg': 'rgba(213, 232, 255, 0.58)',
    '--skill-card-border': 'rgba(117, 165, 223, 0.24)',
    '--skill-bubble-start': 'rgba(213, 232, 255, 0.96)',
    '--skill-bubble-end': 'rgba(117, 165, 223, 0.6)',
    '--skill-bubble-shadow': 'rgba(117, 165, 223, 0.22)',
    '--skill-accent': 'var(--blue-60)',
    '--skill-bubble-hue': '210',
  },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const BUBBLE_BASE_SIZE = 100
const BUBBLE_MERGE_INCREMENT = 30
const BUBBLE_SIZE_STEP_DOWN = 10
const BUBBLE_EDGE_BUFFER = 12
const SKILL_STAR_SCORE = 5
const SPARKLE_TRAVEL_MS = 850
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
const clampBubbleToStage = (value, maxValue) => (
  clamp(value, BUBBLE_EDGE_BUFFER, Math.max(BUBBLE_EDGE_BUFFER, maxValue - BUBBLE_EDGE_BUFFER))
)

export default function Skills() {
  const { fireSparkles } = useSparkles()
  const { addScore } = useScore()
  const stageRef = useRef(null)
  const bubbleRefs = useRef({})
  const titleSparkleRefs = useRef({})
  const activeBubbleRef = useRef(null)
  const dragMetricsRef = useRef(null)
  const pointerMoveRafRef = useRef(null)
  const pendingPointerMoveRef = useRef(null)
  const bubblePositionsRef = useRef({})
  const collectedSkillStarIdsRef = useRef(new Set())
  const [bubblePositions, setBubblePositions] = useState({})
  const [skillGroups, setSkillGroups] = useState(makeSkillGroups)
  const [mergeTargetId, setMergeTargetId] = useState(null)
  const [collectedSkillStarIds, setCollectedSkillStarIds] = useState(() => new Set())
  const [draggingBubbleId, setDraggingBubbleId] = useState(null)
  const isSkillsCompleted = collectedSkillStarIds.size >= SKILLS.length

  const getSectionZone = (skillId) => SECTION_ZONES[SKILLS.findIndex((skill) => skill.id === skillId)] || SECTION_ZONES[0]

  const getStartPosition = (skillId, index) => {
    const zone = getSectionZone(skillId)
    const position = START_POSITIONS[index % START_POSITIONS.length]
    return {
      x: zone.x + (position.x / 100) * zone.width,
      y: zone.y + (position.y / 100) * zone.height,
    }
  }

  const updateBubblePosition = (bubbleId, bubbleEl, clientX, clientY) => {
    const metrics = dragMetricsRef.current
    if (!metrics?.stageRect) return

    const x = clampBubbleToStage(
      clientX - metrics.stageRect.left - metrics.bubbleWidth / 2,
      metrics.stageRect.width - metrics.bubbleWidth
    )
    const y = clampBubbleToStage(
      clientY - metrics.stageRect.top - metrics.bubbleHeight / 2,
      metrics.stageRect.height - metrics.bubbleHeight
    )

    bubblePositionsRef.current[bubbleId] = { x, y }
    bubbleEl.style.left = '0px'
    bubbleEl.style.top = '0px'
    bubbleEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
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

  const triggerSkillSparkles = (skillId) => {
    if (collectedSkillStarIdsRef.current.has(skillId)) return

    const sparkleEl = titleSparkleRefs.current[skillId]
    const scoreEl = document.querySelector('[aria-label="Score badge"]')
    if (!sparkleEl || !scoreEl) return

    collectedSkillStarIdsRef.current.add(skillId)
    setCollectedSkillStarIds((current) => new Set(current).add(skillId))

    const from = sparkleEl.getBoundingClientRect()
    const to = scoreEl.getBoundingClientRect()

    fireSparkles(
      from.left + from.width / 2,
      from.top + from.height / 2,
      to.left + to.width / 2,
      to.top + to.height / 2,
      12
    )
    window.setTimeout(() => addScore(SKILL_STAR_SCORE), SPARKLE_TRAVEL_MS)
  }

  const mergeBubbles = (skillId, sourceId, targetId) => {
    const skill = SKILLS.find((item) => item.id === skillId)
    const currentGroups = skillGroups[skillId] || []
    const currentSource = currentGroups.find((group) => group.id === sourceId)
    const currentTarget = currentGroups.find((group) => group.id === targetId)
    const willCompleteSection = Boolean(
      skill &&
      currentSource &&
      currentTarget &&
      currentSource.labels.length + currentTarget.labels.length >= skill.items.length
    )

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
            x: clampBubbleToStage(zoneRect.x + (zoneRect.width - finalSize) / 2, stageRect.width - finalSize),
            y: clampBubbleToStage(zoneRect.y + (zoneRect.height - finalSize) / 2, stageRect.height - finalSize),
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

    if (willCompleteSection) {
      window.setTimeout(() => triggerSkillSparkles(skillId), 80)
    }

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
    dragMetricsRef.current = {
      stageRect: stageRef.current?.getBoundingClientRect(),
      bubbleWidth: event.currentTarget.offsetWidth,
      bubbleHeight: event.currentTarget.offsetHeight,
    }
    setDraggingBubbleId(bubbleId)
    setMergeTargetId(null)
    event.currentTarget.setPointerCapture(event.pointerId)
    updateBubblePosition(bubbleId, event.currentTarget, event.clientX, event.clientY)
  }

  const handlePointerMove = (skillId, bubbleId, event) => {
    if (activeBubbleRef.current?.bubbleId !== bubbleId) return

    pendingPointerMoveRef.current = {
      skillId,
      bubbleId,
      bubbleEl: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
    }

    if (pointerMoveRafRef.current) return

    pointerMoveRafRef.current = requestAnimationFrame(() => {
      pointerMoveRafRef.current = null
      const pendingMove = pendingPointerMoveRef.current
      if (!pendingMove || activeBubbleRef.current?.bubbleId !== pendingMove.bubbleId) return

      updateBubblePosition(
        pendingMove.bubbleId,
        pendingMove.bubbleEl,
        pendingMove.clientX,
        pendingMove.clientY
      )
      setMergeTargetId(findMergeTarget(pendingMove.skillId, pendingMove.bubbleId)?.id || null)
    })
  }

  const handlePointerUp = (event) => {
    const activeBubble = activeBubbleRef.current
    activeBubbleRef.current = null
    dragMetricsRef.current = null
    pendingPointerMoveRef.current = null
    if (pointerMoveRafRef.current) {
      cancelAnimationFrame(pointerMoveRafRef.current)
      pointerMoveRafRef.current = null
    }
    setDraggingBubbleId(null)
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
          <p className={`${styles.subtitle} ${isSkillsCompleted ? styles.subtitleDone : ''}`}>
            {isSkillsCompleted ? 'Completed!' : 'Merge the bubbles according to the colors'}
          </p>
        </div>
      </div>

      <article className={styles.universe}>
        <div className={styles.backgroundLabels} aria-hidden="true">
          {SKILLS.map((skill, index) => {
            const zone = getSectionZone(skill.id)
            const isLeftSide = index % 2 === 0
            const labelYOffset = skill.id === 'tools' || skill.id === 'soft' ? 15 : 0
            const labelTop = `${zone.y + zone.height / 2 + labelYOffset}%`
            return (
              <span
                key={skill.id}
                className={styles.backgroundTitle}
                style={{
                  ...SKILL_THEMES[skill.id],
                  '--label-rotate': isLeftSide ? '-90deg' : '90deg',
                  '--label-translate': isLeftSide ? '0 -50%' : '-100% -50%',
                  left: isLeftSide ? '0%' : '100%',
                  top: labelTop,
                }}
              >
                {skill.id === 'soft' ? (
                  <>
                    Soft
                    <br />
                    Skills
                  </>
                ) : skill.label}
                {!collectedSkillStarIds.has(skill.id) ? (
                  <span
                    className={styles.titleSparkle}
                    ref={(node) => {
                      if (node) {
                        titleSparkleRefs.current[skill.id] = node
                      } else {
                        delete titleSparkleRefs.current[skill.id]
                      }
                    }}
                  >
                    <StarIcon
                      size="14px"
                      color="var(--yellow-40)"
                      glow
                    />
                  </span>
                ) : null}
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
                  data-skill-id={skill.id}
                  data-has-image={group.images.length > 0 ? 'true' : 'false'}
                  data-image-count={group.images.length}
                  data-label-count={group.labels.length}
                  data-complete={isCompleteBubble ? 'true' : 'false'}
                  data-merge-target={mergeTargetId === group.id ? 'true' : 'false'}
                  data-dragging={draggingBubbleId === group.id ? 'true' : 'false'}
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
