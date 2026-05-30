import { useState } from 'react'
import { PROJECTS, PROJECT_CATEGORIES } from '@/constants/data'
import styles from './Projects.module.css'

const VISIBLE_CARD_COUNT = 5
const CENTER_OFFSET = Math.floor(VISIBLE_CARD_COUNT / 2)
const RENDER_OFFSET = CENTER_OFFSET + 1
const PLACEHOLDER_IMAGE = '/images/placeholder.png'
const DRAG_STEP_PX = 48
const PLACEHOLDER_CARD_COUNT = 3
const TAGS = ['3D', 'UI', 'UX', 'Game', 'Case']

const CATEGORY_THEMES = {
  Game: {
    '--card-start': 'rgba(182, 211, 250, 0.96)',
    '--card-end': 'rgba(106, 143, 196, 0.98)',
    '--card-shadow': 'rgba(61, 92, 145, 0.18)',
  },
  Design: {
    '--card-start': 'rgba(252, 197, 221, 0.96)',
    '--card-end': 'rgba(214, 126, 169, 0.98)',
    '--card-shadow': 'rgba(155, 74, 104, 0.18)',
  },
  Others: {
    '--card-start': 'rgba(215, 198, 255, 0.96)',
    '--card-end': 'rgba(126, 93, 181, 0.98)',
    '--card-shadow': 'rgba(89, 66, 143, 0.18)',
  },
}

export default function Projects() {
  const baseWheelItems = PROJECT_CATEGORIES.flatMap((category) => {
    const categoryProjects = PROJECTS.filter((project) => project.category === category)

    if (categoryProjects.length > 0) {
      return categoryProjects.map((project) => ({
        ...project,
        image: project.image ?? PLACEHOLDER_IMAGE,
      }))
    }

    return Array.from({ length: PLACEHOLDER_CARD_COUNT }, (_, index) => ({
        id: `${category}-placeholder-${index + 1}`,
        title: `${category} ${index + 1}`,
        category,
        description: 'A new project card will land here soon.',
        image: PLACEHOLDER_IMAGE,
        placeholder: true,
      }))
  })
  const repeatCount = Math.ceil(VISIBLE_CARD_COUNT / baseWheelItems.length) + 1
  const wheelItems = Array.from({ length: repeatCount }, () => baseWheelItems)
    .flat()
    .map((item, index) => ({
      ...item,
      wheelId: `${item.id}-${index}`,
    }))

  const [activeItemIndex, setActiveItemIndex] = useState(
    Math.max(
      CENTER_OFFSET,
      wheelItems.findIndex((item) => !item.placeholder),
    ),
  )
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [dragStartX, setDragStartX] = useState(null)
  const [didDrag, setDidDrag] = useState(false)
  const activeItem = wheelItems[activeItemIndex]
  const activeCategory = activeItem.category
  const activeTheme = CATEGORY_THEMES[activeCategory] ?? CATEGORY_THEMES.Game

  const getCircularOffset = (itemIndex) => {
    const forward = (itemIndex - activeItemIndex + wheelItems.length) % wheelItems.length
    const backward = forward - wheelItems.length

    return Math.abs(forward) <= Math.abs(backward) ? forward : backward
  }

  const visibleCards = wheelItems
    .map((item, itemIndex) => ({
      ...item,
      offset: getCircularOffset(itemIndex),
      itemIndex,
      virtualId: item.wheelId,
    }))
    .filter((item) => Math.abs(item.offset) <= RENDER_OFFSET)
    .sort((a, b) => a.offset - b.offset)

  const moveWheel = (direction) => {
    const nextIndex =
      (activeItemIndex + direction + wheelItems.length) % wheelItems.length

    setActiveItemIndex(nextIndex)
    setSelectedCardId(null)
  }

  const selectCategory = (category) => {
    const nextIndex = wheelItems.findIndex((item) => item.category === category)

    if (nextIndex === -1) {
      return
    }

    setActiveItemIndex(nextIndex)
    setSelectedCardId(null)
  }

  const handleDragStart = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragStartX(event.clientX)
    setDidDrag(false)
  }

  const handleDragMove = (event) => {
    if (dragStartX === null) {
      return
    }

    const dragDistance = event.clientX - dragStartX

    if (Math.abs(dragDistance) < DRAG_STEP_PX) {
      return
    }

    moveWheel(dragDistance < 0 ? 1 : -1)
    setDragStartX(event.clientX)
    setDidDrag(true)
  }

  const handleDragEnd = () => {
    setDragStartX(null)
  }

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        <span className={styles.ptsBadge} aria-hidden="true">0 pts</span>
      </div>

      <div className={`container ${styles.stage}`}>
        <div className={styles.categoryPicker} aria-label="Project categories">
          <button
            className={styles.arrowButton}
            type="button"
            onClick={() => moveWheel(-1)}
            aria-label="Previous project card"
          >
            &lt;
          </button>
          <h3 className={styles.categoryTitle}>{activeCategory}</h3>
          <button
            className={styles.arrowButton}
            type="button"
            onClick={() => moveWheel(1)}
            aria-label="Next project card"
          >
            &gt;
          </button>
        </div>

        <div
          className={styles.cardArc}
          style={activeTheme}
          role="list"
          aria-label="Project card wheel"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onPointerLeave={handleDragEnd}
        >
          {visibleCards.map((project) => {
            const { offset } = project
            const depth = Math.abs(offset)
            const isActive = selectedCardId === project.virtualId
            const angle = offset * 14.5

            return (
              <button
                key={project.virtualId}
                type="button"
                role="listitem"
                className={`${styles.projectCard} ${
                  depth > CENTER_OFFSET ? styles.projectCardFadeSlot : ''
                } ${isActive ? styles.projectCardActive : ''}`}
                style={{
                  ...(CATEGORY_THEMES[project.category] ?? CATEGORY_THEMES.Game),
                  '--card-offset': offset,
                  '--card-depth': depth,
                  '--card-angle': `${angle}deg`,
                }}
                onClick={() => {
                  if (didDrag) {
                    setDidDrag(false)
                    return
                  }

                  setSelectedCardId(project.virtualId)
                }}
                aria-label={`Select ${project.category}: ${project.title}`}
              >
                <span className={styles.cardCornerTop} aria-hidden="true" />
                <span className={styles.cardCornerBottom} aria-hidden="true" />

                <span className={styles.cardImageWrap}>
                  <img src={project.image} alt="" className={styles.cardImage} />
                </span>

                <span className={styles.cardTitle}>
                  <span aria-hidden="true">✦</span>
                  {project.title}
                  <span aria-hidden="true">✦</span>
                </span>
                <span className={styles.cardCategory}>{project.category}</span>

                <span className={styles.cardDivider} />

                <span className={styles.tagGrid} aria-label="Project tags">
                  {TAGS.map((tag) => (
                    <span key={tag} className={styles.tagPill}>
                      {tag}
                    </span>
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <nav className={styles.categoryDots} aria-label="Jump to project category">
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryDot} ${activeCategory === cat ? styles.categoryDotActive : ''}`}
            type="button"
            onClick={() => selectCategory(cat)}
            aria-label={`Show ${cat} projects`}
            aria-pressed={activeCategory === cat}
          />
        ))}
      </nav>
    </section>
  )
}
