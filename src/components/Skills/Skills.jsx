/**
 * Skills
 * Interactive skill bubbles pulled from constants/data.js.
 */

import { useEffect, useRef, useState } from 'react'
import { SKILLS } from '@/constants/data'
import mobileScatterPositions from '@/constants/mobileSkillPositions.json'
import desktopScatterPositions from '@/constants/desktopSkillPositions.json'
import { useScore } from '@/components/Score/ScoreContext'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './Skills.module.css'

const SECTION_ZONES = [
  { x: 0, y: 2, width: 50, height: 42 },
  { x: 50, y: 2, width: 50, height: 42 },
  { x: 0, y: 54, width: 50, height: 42 },
  { x: 50, y: 54, width: 50, height: 42 },
]

const SCATTER_POSITIONS = {
  code: [
    { x: 8, y: 14 }, /*php */
    { x: 6, y: 60 }, /*html */
    { x: 30, y: 13 },/*css */
    { x: 32, y: 60 }, /*javascript */
    { x: 66, y: 38 }, /*sql */
    { x: 20, y: 76 }, /*c */
    { x: 54, y: 83 }, /*c++ */
    { x: 78, y: 14 }, /*c# */
    { x: 84, y: 52 }, /*jetpack compose */
  ],
  design: [
    { x: 28, y: 21 },
    { x: 48, y: 21 },
    { x: 38, y: 67 },
    { x: 78, y: 64 },
    { x: 84, y: 31 },
    { x: 58, y: 71 },
    { x: 68, y: 21 },
  ],
  tools: [
    { x: 26, y: 52 },
    { x: 38, y: 14 },
    { x: 70, y: 28 },
    { x: 52, y: 54 },
  ],
  soft: [
    { x: 28, y: 64 },
    { x: 64, y: 24 },
    { x: 18, y: 14 },
    { x: 54, y: 70 },
  ],
}

const SKILL_TITLE_POSITIONS = {
  code: { left: '0%', top: '36%' },
  tools: { left: '100%', top: '65%' },
  design: { left: '0%', top: '65%' },
  soft: { left: '100%', top: '65%' },
}

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
const BUBBLE_SIZE_OVERRIDES = {
  code: { base: 130, min: 104 },
  design: { base: 116, min: 104 },
  tools: { base: 108, min: 92 },
  soft: { base: 126, min: 112 },
}
const SKILL_STAR_SCORE = 5
const SPARKLE_TRAVEL_MS = 850
const normalizeSkillItem = (item) => (
  typeof item === 'string'
    ? { label: item }
    : item
)

const getSkillEntry = (item) => ({
  label: item.label,
  image: item.image,
  icon: item.icon,
})

const makeSkillGroups = () => Object.fromEntries(
  SKILLS.map((skill) => [
    skill.id,
    skill.items.map((rawItem, index) => {
      const item = normalizeSkillItem(rawItem)
      return {
        id: `${skill.id}-${item.label}-${index}`,
        entries: [getSkillEntry(item)],
        startIndex: index,
      }
    }),
  ])
)

const getBaseBubbleSize = (skillId, sectionCount) => {
  const override = BUBBLE_SIZE_OVERRIDES[skillId] || {}
  const baseSize = override.base || BUBBLE_BASE_SIZE
  const minSize = override.min || 72

  return clamp(baseSize - Math.max(sectionCount - 5, 0) * BUBBLE_SIZE_STEP_DOWN, minSize, baseSize)
}

const getBubbleScale = () => (
  typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches ? 0.65 : 1
)
const getBubbleSizePx = (skillId, sectionCount, labels) => (
  (getBaseBubbleSize(skillId, sectionCount) + (labels.length - 1) * BUBBLE_MERGE_INCREMENT) * getBubbleScale()
)
const getBubbleSize = (skillId, sectionCount, labels) => `${getBubbleSizePx(skillId, sectionCount, labels)}px`
const getGroupLabels = (group) => group.entries.map((entry) => entry.label)
const isCompactLabel = (text) => text.trim().length <= 3
const getLabelLengthSize = (text) => {
  if (/\s/.test(text)) {
    return 'medium'
  }

  const length = text.replace(/\s+/g, '').length

  if (length < 6) {
    return 'short'
  }

  if (length > 8) {
    return 'long'
  }

  return 'medium'
}
const getSkillsSignature = () => JSON.stringify(
  SKILLS.map((skill) => ({
    id: skill.id,
    items: skill.items.map((rawItem) => normalizeSkillItem(rawItem)),
  })),
)
const getBubbleEdgeBuffer = () => (
  window.matchMedia('(max-width: 600px)').matches ? 0 : BUBBLE_EDGE_BUFFER
)
const clampBubbleToStage = (value, maxValue, edgeBuffer = BUBBLE_EDGE_BUFFER) => (
  clamp(value, edgeBuffer, Math.max(edgeBuffer, maxValue - edgeBuffer))
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
  const skillsSignature = getSkillsSignature()
  const isSkillsCompleted = collectedSkillStarIds.size >= SKILLS.length

  useEffect(() => {
    bubblePositionsRef.current = {}
    collectedSkillStarIdsRef.current = new Set()
    setBubblePositions({})
    setSkillGroups(makeSkillGroups())
    setCollectedSkillStarIds(new Set())
    setMergeTargetId(null)
    setDraggingBubbleId(null)
  }, [skillsSignature])

  const getSectionZone = (skillId) => SECTION_ZONES[SKILLS.findIndex((skill) => skill.id === skillId)] || SECTION_ZONES[0]

  const getStartPosition = (skillId, index) => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches) {
      const mobilePosition = mobileScatterPositions[skillId]?.[index]
      if (mobilePosition) return mobilePosition
    }

    const desktopPosition = desktopScatterPositions[skillId]?.[index]
    if (desktopPosition) return desktopPosition

    const zone = getSectionZone(skillId)
    const pattern = SCATTER_POSITIONS[skillId] || []
    const position = pattern[index] || {
      x: 6 + ((index * 37) % 78),
      y: 5 + (Math.floor((index * 37) / 78) * 26) % 84,
    }

    return {
      x: zone.x + (clamp(position.x, 0, 84) / 100) * zone.width,
      y: zone.y + (clamp(position.y, 0, 84) / 100) * zone.height,
    }
  }

  const updateBubblePosition = (bubbleId, bubbleEl, clientX, clientY) => {
    const metrics = dragMetricsRef.current
    if (!metrics?.stageRect) return

    const x = clampBubbleToStage(
      clientX - metrics.stageRect.left - metrics.bubbleWidth / 2,
      metrics.stageRect.width - metrics.bubbleWidth,
      metrics.edgeBuffer
    )
    const y = clampBubbleToStage(
      clientY - metrics.stageRect.top - metrics.bubbleHeight / 2,
      metrics.stageRect.height - metrics.bubbleHeight,
      metrics.edgeBuffer
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
      currentSource.entries.length + currentTarget.entries.length >= skill.items.length
    )

    setSkillGroups((current) => {
      const groups = current[skillId] || []
      const source = groups.find((group) => group.id === sourceId)
      const target = groups.find((group) => group.id === targetId)
      if (!source || !target) return current

      const merged = {
        ...target,
        entries: [...target.entries, ...source.entries],
      }

      if (merged.entries.length >= SKILLS.find((skill) => skill.id === skillId)?.items.length) {
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
            getBubbleSizePx(skillId, SKILLS.find((skill) => skill.id === skillId)?.items.length || 5, getGroupLabels(merged)),
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
    const bubbleRect = event.currentTarget.getBoundingClientRect()
    activeBubbleRef.current = { skillId, bubbleId }
    dragMetricsRef.current = {
      stageRect: stageRef.current?.getBoundingClientRect(),
      bubbleWidth: bubbleRect.width,
      bubbleHeight: bubbleRect.height,
      edgeBuffer: getBubbleEdgeBuffer(),
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
          {SKILLS.map((skill) => {
            const titlePosition = SKILL_TITLE_POSITIONS[skill.id] || { left: '50%', top: '50%' }
            return (
              <span
                key={skill.id}
                className={styles.backgroundTitle}
                data-title-skill-id={skill.id}
                style={{
                  ...SKILL_THEMES[skill.id],
                  '--label-translate': titlePosition.left === '100%' ? '-100% -50%' : '0 -50%',
                  left: titlePosition.left,
                  top: titlePosition.top,
                }}
              >
                <span className={styles.backgroundTitleText}>
                  {skill.id === 'code' ? (
                    <>Dev &amp;<br className={styles.desktopTitleBreak} /> Web</>
                  ) : skill.label}
                </span>
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
              const labels = getGroupLabels(group)
              const regularLabels = labels.filter((text) => !isCompactLabel(text))
              const compactLabels = labels.filter(isCompactLabel)
              const label = labels.join(' + ')
              const savedPosition = bubblePositions[group.id]
              const startPosition = getStartPosition(skill.id, group.startIndex)
              const bubbleSize = getBubbleSize(skill.id, skill.items.length, labels)
              const isCompleteBubble = group.entries.length >= skill.items.length
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
                  data-has-media={group.entries.some((entry) => entry.image || entry.icon) ? 'true' : 'false'}
                  data-entry-count={group.entries.length}
                  data-complete={isCompleteBubble ? 'true' : 'false'}
                  data-merge-target={mergeTargetId === group.id ? 'true' : 'false'}
                  data-dragging={draggingBubbleId === group.id ? 'true' : 'false'}
                >
                  {group.entries.some((entry) => entry.image || entry.icon) ? (
                    <span className={styles.bubbleMediaGrid} aria-hidden="true">
                      {group.entries.map((entry, entryIndex) => (
                        entry.image ? (
                          <img
                            key={`${entry.label}-${entryIndex}`}
                            src={entry.image}
                            alt=""
                            className={styles.bubbleImage}
                            draggable="false"
                          />
                        ) : (
                          <span key={`${entry.label}-${entryIndex}`} className={styles.bubbleIcon}>
                            {entry.icon || entry.label}
                          </span>
                        )
                      ))}
                    </span>
                  ) : null}
                  <span className={styles.bubbleLabelGrid} aria-hidden="true">
                    {regularLabels.map((text) => (
                      <span
                        key={text}
                        className={styles.bubbleLabelItem}
                        data-label-size={getLabelLengthSize(text)}
                      >
                        {text}
                      </span>
                    ))}
                    {compactLabels.length > 0 ? (
                      <span
                        className={styles.bubbleCompactLabelGrid}
                        data-odd={compactLabels.length % 2 === 1 ? 'true' : 'false'}
                      >
                        {compactLabels.map((text) => (
                          <span
                            key={text}
                            className={styles.bubbleLabelItem}
                            data-label-size={getLabelLengthSize(text)}
                          >
                            {text}
                          </span>
                        ))}
                      </span>
                    ) : null}
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
