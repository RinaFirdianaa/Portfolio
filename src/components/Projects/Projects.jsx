import { useRef, useState } from 'react'
import { PROJECTS, PROJECT_CATEGORIES } from '@/constants/data'
import styles from './Projects.module.css'

const VISIBLE_CARD_COUNT = 7
const CENTER_OFFSET = Math.floor(VISIBLE_CARD_COUNT / 2)
const RENDER_OFFSET = CENTER_OFFSET + 1
const PLACEHOLDER_IMAGE = '/images/placeholder.png'
const DRAG_STEP_PX = 48
const PLACEHOLDER_CARD_COUNT = 3
const CLICK_SPIN_STEP_MS = 95

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
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [activeInfoPage, setActiveInfoPage] = useState(0)
  const [dragStartX, setDragStartX] = useState(null)
  const lastDragTimeRef = useRef(0)
  const pendingSelectCardIdRef = useRef(null)
  const clickSpinTimerRef = useRef(null)
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
  const selectedProject =
    visibleCards.find((project) => project.virtualId === selectedCardId) ?? activeItem
  const selectedPages = selectedProject.pages?.length
    ? selectedProject.pages
    : [
        {
          title: selectedProject.title,
          summary: selectedProject.description,
          image: selectedProject.image ?? PLACEHOLDER_IMAGE,
        },
      ]
  const currentInfoPage = selectedPages[activeInfoPage] ?? selectedPages[0]

  const moveWheel = (direction) => {
    window.clearTimeout(clickSpinTimerRef.current)
    const nextIndex =
      (activeItemIndex + direction + wheelItems.length) % wheelItems.length

    setActiveItemIndex(nextIndex)
    setSelectedCardId(null)
    setIsInfoOpen(false)
    setActiveInfoPage(0)
  }

  const spinCardToCenter = (cardId, offset) => {
    window.clearTimeout(clickSpinTimerRef.current)

    if (offset === 0) {
      setSelectedCardId(cardId)
      setActiveInfoPage(0)
      return
    }

    const direction = offset > 0 ? 1 : -1
    const stepCount = Math.abs(offset)
    let completedSteps = 0

    setSelectedCardId(null)

    const spinStep = () => {
      completedSteps += 1
      setActiveItemIndex((currentIndex) => (
        (currentIndex + direction + wheelItems.length) % wheelItems.length
      ))

      if (completedSteps < stepCount) {
        clickSpinTimerRef.current = window.setTimeout(spinStep, CLICK_SPIN_STEP_MS)
        return
      }

      clickSpinTimerRef.current = window.setTimeout(() => {
        setSelectedCardId(cardId)
        setActiveInfoPage(0)
      }, CLICK_SPIN_STEP_MS)
    }

    spinStep()
  }

  const handleDragStart = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    const card = event.target.closest('[data-card-id]')

    setDragStartX(event.clientX)
    pendingSelectCardIdRef.current = card?.dataset.selectable === 'true'
      ? `${card.dataset.cardId}:${card.dataset.offset}`
      : null
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
    pendingSelectCardIdRef.current = null
    lastDragTimeRef.current = Date.now()
  }

  const handleDragEnd = () => {
    if (Date.now() - lastDragTimeRef.current >= 180 && pendingSelectCardIdRef.current) {
      const [cardId, offset] = pendingSelectCardIdRef.current.split(':')
      spinCardToCenter(cardId, Number(offset))
    }

    pendingSelectCardIdRef.current = null
    setDragStartX(null)
  }

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        <span className={styles.ptsBadge} aria-hidden="true">0 pts</span>
      </div>

      <div className={styles.stage}>
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
            const angle = offset * 4.5
            const y = depth * depth * 8

            return (
              <button
                key={project.virtualId}
                type="button"
                role="listitem"
                data-card-id={project.virtualId}
                data-item-index={project.itemIndex}
                data-offset={offset}
                data-selectable={depth <= CENTER_OFFSET}
                className={`${styles.projectCard} ${
                  depth > CENTER_OFFSET ? styles.projectCardFadeSlot : ''
                } ${isActive ? styles.projectCardActive : ''}`}
                style={{
                  ...(CATEGORY_THEMES[project.category] ?? CATEGORY_THEMES.Game),
                  '--card-offset': offset,
                  '--card-depth': depth,
                  '--card-angle': `${angle}deg`,
                  '--card-y': `${y}px`,
                }}
                onClick={(event) => {
                  event.stopPropagation()

                  if (Date.now() - lastDragTimeRef.current < 180) {
                    return
                  }

                  spinCardToCenter(project.virtualId, offset)
                }}
                aria-label={`Select ${project.category}: ${project.title}`}
                aria-pressed={isActive}
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
              </button>
            )
          })}
        </div>

        <div className={styles.detailIntro} aria-live="polite">
          <span className={styles.detailCategory}>{selectedProject.category}</span>
          <h4 className={styles.detailTitle}>{selectedProject.title}</h4>
        </div>

        <aside className={styles.projectDetails} aria-label="Selected project details">
          <p className={styles.detailDescription}>
            {selectedProject.summary ?? selectedProject.description}
          </p>
          <div className={styles.detailMeta}>
            {selectedProject.role ? (
              <span>
                <strong>Role</strong>
                {selectedProject.role}
              </span>
            ) : null}
            {selectedProject.status ? (
              <span>
                <strong>Status</strong>
                {selectedProject.status}
              </span>
            ) : null}
            {selectedProject.tools?.length ? (
              <span>
                <strong>Tools</strong>
                {selectedProject.tools.join(', ')}
              </span>
            ) : null}
          </div>
          {selectedProject.links?.length ? (
            <div className={styles.detailLinks}>
              {selectedProject.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
          <button
            className={styles.moreInfoButton}
            type="button"
            onClick={() => {
              setActiveInfoPage(0)
              setIsInfoOpen(true)
            }}
          >
            More info
          </button>
        </aside>
      </div>

      {isInfoOpen ? (
        <div
          className={styles.infoOverlay}
          role="presentation"
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            className={styles.infoModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-info-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.infoClose}
              type="button"
              onClick={() => setIsInfoOpen(false)}
              aria-label="Close project images"
            >
              x
            </button>
            <span className={styles.infoCategory}>{selectedProject.category}</span>
            <h4 id="project-info-title" className={styles.infoTitle}>
              {selectedProject.title}
            </h4>
            <div className={styles.infoPager} aria-label="Project popup pages">
              <button
                type="button"
                onClick={() => setActiveInfoPage((page) => (
                  (page - 1 + selectedPages.length) % selectedPages.length
                ))}
                disabled={selectedPages.length <= 1}
              >
                &lt;
              </button>
              <span>{activeInfoPage + 1} / {selectedPages.length}</span>
              <button
                type="button"
                onClick={() => setActiveInfoPage((page) => (
                  (page + 1) % selectedPages.length
                ))}
                disabled={selectedPages.length <= 1}
              >
                &gt;
              </button>
            </div>
            <div className={styles.infoBody}>
              <figure className={styles.infoImageCard}>
                <img src={currentInfoPage.image ?? PLACEHOLDER_IMAGE} alt="" />
              </figure>
              <div className={styles.infoText}>
                <h5>{currentInfoPage.title}</h5>
                <p>{currentInfoPage.summary ?? selectedProject.description}</p>
                <dl className={styles.infoFacts}>
                  {selectedProject.role ? (
                    <>
                      <dt>Role</dt>
                      <dd>{selectedProject.role}</dd>
                    </>
                  ) : null}
                  {selectedProject.status ? (
                    <>
                      <dt>Status</dt>
                      <dd>{selectedProject.status}</dd>
                    </>
                  ) : null}
                  {selectedProject.tools?.length ? (
                    <>
                      <dt>Tools</dt>
                      <dd>{selectedProject.tools.join(', ')}</dd>
                    </>
                  ) : null}
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </section>
  )
}
