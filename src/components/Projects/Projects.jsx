import { useRef, useState } from 'react'
import { PROJECTS, PROJECT_CATEGORIES, PROJECT_TOOLS } from '../../constants/data'
import { useScore } from '../Score/ScoreContext'
import { useSparkles } from '../Sparkle/SparkleContext'
import { useTheme } from '../Theme/ThemeContext'
import StarIcon from '../StarIcon/StarIcon'
import { assetUrl } from '../../utils/assetUrl'
import ProjectInfoModal from './ProjectInfoModal'
import styles from './Projects.module.css'

const VISIBLE_CARD_COUNT = 7
const CENTER_OFFSET = Math.floor(VISIBLE_CARD_COUNT / 2)
const RENDER_OFFSET = CENTER_OFFSET + 1
const PLACEHOLDER_IMAGE = assetUrl('/images/placeholder.png')
const DRAG_STEP_PX = 48
const PLACEHOLDER_CARD_COUNT = 3
const CLICK_SPIN_STEP_MS = 95
const PROJECT_STAR_SCORE = 5
const SPARKLE_TRAVEL_MS = 850
const CARD_SETTLE_MS = 520
const CARD_FRAMES = {
  Game: assetUrl('/images/card_game.png'),
  Design: assetUrl('/images/card_design.png'),
  Others: assetUrl('/images/card_others.png'),
}

const CATEGORY_THEMES = {
  Game: {
    '--card-start': 'rgba(182, 211, 250, 0.96)',
    '--card-end': 'rgba(106, 143, 196, 0.98)',
    '--card-shadow': 'rgba(126, 93, 181, 0.22)',
    '--category-accent': '#265894',
    '--category-accent-dark': 'var(--blue-80)',
    '--category-accent-soft': 'var(--blue-20)',
    '--category-tag-bg': 'var(--blue-20)',
    '--category-tag-text-dark': '#2e517b',
  },
  Design: {
    '--card-start': 'rgba(252, 197, 221, 0.96)',
    '--card-end': 'rgba(214, 126, 169, 0.98)',
    '--card-shadow': 'rgba(126, 93, 181, 0.22)',
    '--category-accent': 'var(--pink-70)',
    '--category-accent-dark': 'var(--pink-80)',
    '--category-accent-soft': 'var(--pink-10)',
    '--category-tag-bg': 'var(--pink-20)',
    '--category-tag-text-dark': 'var(--pink-100)',
  },
  Others: {
    '--card-start': 'rgba(215, 198, 255, 0.96)',
    '--card-end': 'rgba(126, 93, 181, 0.98)',
    '--card-shadow': 'rgba(126, 93, 181, 0.22)',
    '--category-accent': 'var(--purple-65)',
    '--category-accent-dark': 'var(--purple-60)',
    '--category-accent-soft': 'var(--purple-10)',
    '--category-tag-bg': 'var(--purple-10)',
    '--category-tag-text-dark': 'var(--purple-70)',
  },
}

const DARK_CATEGORY_ACCENTS = {
  Game: 'var(--blue-10)',
  Design: 'var(--pink-10)',
  Others: 'var(--purple-10)',
}

const getProjectTool = (tool) => {
  if (typeof tool !== 'string') {
    return tool
  }

  return PROJECT_TOOLS[tool] ?? { name: tool }
}

export default function Projects() {
  const { fireSparkles } = useSparkles()
  const { addScore } = useScore()
  const { isDark } = useTheme()
  const getCategoryTheme = (category) => {
    const theme = CATEGORY_THEMES[category] ?? CATEGORY_THEMES.Game
    const darkAccent = DARK_CATEGORY_ACCENTS[category] ?? DARK_CATEGORY_ACCENTS.Game

    return isDark
      ? { ...theme, '--category-accent': darkAccent, '--category-accent-dark': darkAccent }
      : theme
  }
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
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeImageCallout, setActiveImageCallout] = useState(null)
  const [selectedAnimation, setSelectedAnimation] = useState(null)
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null)
  const [dragStartX, setDragStartX] = useState(null)
  const [collectedStarIds, setCollectedStarIds] = useState(() => new Set())
  const lastDragTimeRef = useRef(0)
  const pendingSelectCardIdRef = useRef(null)
  const clickSpinTimerRef = useRef(null)
  const sparkleRefs = useRef({})
  const collectedStarIdsRef = useRef(new Set())

  const activeItem = wheelItems[activeItemIndex]
  const activeCategory = activeItem.category
  const activeTheme = getCategoryTheme(activeCategory)

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
  const [sparkleCardIds] = useState(() => new Set(
    [...baseWheelItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((project) => project.id),
  ))
  const selectedProject =
    visibleCards.find((project) => project.virtualId === selectedCardId) ?? activeItem
  const selectedPages = selectedProject.pages?.length
    ? selectedProject.pages
    : [
        {
          title: selectedProject.pageTitle ?? selectedProject.detailTitle ?? selectedProject.title,
          summary: selectedProject.description,
          image: selectedProject.image ?? PLACEHOLDER_IMAGE,
        },
      ]
  const currentInfoPage = selectedPages[activeInfoPage] ?? selectedPages[0]
  const currentImageSlides = !currentInfoPage.video && !currentInfoPage.model
    ? [
        ...(currentInfoPage.images?.length
          ? currentInfoPage.images
          : [currentInfoPage.image ?? PLACEHOLDER_IMAGE]),
        ...(currentInfoPage.animations?.length ? ['animation-selector'] : []),
      ]
    : []
  const isAnimationSelectorSlide =
    currentInfoPage.animations?.length &&
    activeImageIndex === currentImageSlides.length - 1

  const triggerProjectSparkles = (cardId, sparkleEl) => {
    if (collectedStarIdsRef.current.has(cardId)) {
      return
    }

    collectedStarIdsRef.current.add(cardId)

    window.setTimeout(() => {
      const scoreEl = document.querySelector('[aria-label="Score badge"]')

      if (!sparkleEl || !scoreEl) {
        collectedStarIdsRef.current.delete(cardId)
        setCollectedStarIds((current) => {
          const next = new Set(current)
          next.delete(cardId)
          return next
        })
        return
      }

      const from = sparkleEl.getBoundingClientRect()
      const to = scoreEl.getBoundingClientRect()

      fireSparkles(
        from.left + from.width / 2,
        from.top + from.height / 2,
        to.left + to.width / 2,
        to.top + to.height / 2,
        12,
      )
      setCollectedStarIds((current) => new Set(current).add(cardId))
      window.setTimeout(() => addScore(PROJECT_STAR_SCORE), SPARKLE_TRAVEL_MS)
    }, CARD_SETTLE_MS)
  }

  const moveWheel = (direction) => {
    window.clearTimeout(clickSpinTimerRef.current)
    const nextIndex =
      (activeItemIndex + direction + wheelItems.length) % wheelItems.length

    setActiveItemIndex(nextIndex)
    setSelectedCardId(null)
    setIsInfoOpen(false)
    setActiveInfoPage(0)
    setActiveImageCallout(null)
    setSelectedAnimation(null)
    setSelectedPreviewImage(null)
  }

  const openProjectInfo = () => {
    setActiveInfoPage(0)
    setActiveImageIndex(0)
    setActiveImageCallout(null)
    setSelectedAnimation(null)
    setSelectedPreviewImage(null)
    setIsInfoOpen(true)
  }

  const openProjectInfoFromCard = (project) => {
    window.clearTimeout(clickSpinTimerRef.current)
    pendingSelectCardIdRef.current = null
    setActiveItemIndex(project.itemIndex)
    setSelectedCardId(project.virtualId)
    openProjectInfo()
  }

  const spinCardToCenter = (cardId, offset, openAfterCenter = false) => {
    window.clearTimeout(clickSpinTimerRef.current)

    if (offset === 0) {
      setSelectedCardId(cardId)
      if (openAfterCenter) {
        openProjectInfo()
      } else {
        setActiveInfoPage(0)
        setActiveImageCallout(null)
      }
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
        if (openAfterCenter) {
          openProjectInfo()
        } else {
          setActiveInfoPage(0)
          setActiveImageCallout(null)
        }
      }, CLICK_SPIN_STEP_MS)
    }

    spinStep()
  }

  const jumpToCategory = (category) => {
    window.clearTimeout(clickSpinTimerRef.current)

    const categoryIndexes = wheelItems
      .map((item, index) => (item.category === category ? index : -1))
      .filter((index) => index >= 0)

    if (!categoryIndexes.length) {
      return
    }

    const targetOffset = categoryIndexes
      .map((index) => {
        const forward = (index - activeItemIndex + wheelItems.length) % wheelItems.length
        const backward = forward - wheelItems.length

        return Math.abs(forward) <= Math.abs(backward) ? forward : backward
      })
      .sort((a, b) => Math.abs(a) - Math.abs(b))[0]

    setSelectedCardId(null)
    setIsInfoOpen(false)
    setActiveInfoPage(0)
    setActiveImageCallout(null)
    setSelectedAnimation(null)
    setSelectedPreviewImage(null)

    if (targetOffset === 0) {
      return
    }

    const direction = targetOffset > 0 ? 1 : -1
    const stepCount = Math.abs(targetOffset)
    let completedSteps = 0

    const spinStep = () => {
      completedSteps += 1
      setActiveItemIndex((currentIndex) => (
        (currentIndex + direction + wheelItems.length) % wheelItems.length
      ))

      if (completedSteps < stepCount) {
        clickSpinTimerRef.current = window.setTimeout(spinStep, CLICK_SPIN_STEP_MS)
      }
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

  const handleDragEnd = (event) => {
    if (Date.now() - lastDragTimeRef.current >= 180 && pendingSelectCardIdRef.current) {
      const [cardId, offset] = pendingSelectCardIdRef.current.split(':')
      const itemIndex = wheelItems.findIndex((item) => item.wheelId === cardId)

      if (event.type === 'pointerup' && itemIndex >= 0 && Number(offset) === 0) {
        openProjectInfoFromCard({ itemIndex, virtualId: cardId })
      } else {
        spinCardToCenter(cardId, Number(offset))
      }
    }

    pendingSelectCardIdRef.current = null
    setDragStartX(null)
  }

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.header}>
        <div>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <p className={`${styles.sectionSubtitle} ${collectedStarIds.size >= sparkleCardIds.size ? styles.sectionSubtitleDone : ''}`}>
            {collectedStarIds.size >= sparkleCardIds.size ? 'Completed!' : 'Find the stars on the cards'}
          </p>
        </div>
      </div>

      <div className={styles.stage} style={activeTheme}>
        <div className={styles.categoryPicker} aria-label="Project sections">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${
                activeCategory === category ? styles.categoryButtonActive : ''
              }`}
              style={getCategoryTheme(category)}
              type="button"
              onClick={() => jumpToCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className={styles.cardArc}
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
            const hasSparkle =
              sparkleCardIds.has(project.id) &&
              !collectedStarIds.has(project.id)
            const cardFrame = CARD_FRAMES[project.category] ?? CARD_FRAMES.Game

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
                  ...getCategoryTheme(project.category),
                  '--card-offset': offset,
                  '--card-depth': depth,
                  '--card-angle': `${angle}deg`,
                  '--card-y': `${y}px`,
                }}
                onClick={(event) => {
                  event.stopPropagation()

                  if (event.detail !== 0 || Date.now() - lastDragTimeRef.current < 180) {
                    return
                  }

                  if (offset === 0) {
                    openProjectInfoFromCard(project)
                  } else {
                    spinCardToCenter(project.virtualId, offset)
                  }
                }}
                aria-label={`Select ${project.category}: ${project.title}`}
                aria-pressed={isActive}
              >
                {hasSparkle ? (
                  <span
                    className={styles.cardSparkle}
                    ref={(node) => {
                      if (node) {
                        sparkleRefs.current[project.virtualId] = node

                        if (offset === 0) {
                          triggerProjectSparkles(project.id, node)
                        }
                      } else {
                        delete sparkleRefs.current[project.virtualId]
                      }
                    }}
                  >
                    <StarIcon
                      size="24px"
                      color="var(--yellow-40)"
                      glow
                    />
                  </span>
                ) : null}
                <span className={styles.cardVisual} aria-hidden="true">
                  <img src={project.image} alt="" className={styles.cardProjectImage} />
                  <img src={cardFrame} alt="" className={styles.cardFrame} />
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
          <div className={styles.detailTitleRow}>
            <button
              className={styles.detailArrow}
              type="button"
              onClick={() => moveWheel(-1)}
              aria-label="Previous project"
            >
              &lt;
            </button>
            <h4 className={styles.detailTitle}>{selectedProject.detailTitle ?? selectedProject.title}</h4>
            <button
              className={styles.detailArrow}
              type="button"
              onClick={() => moveWheel(1)}
              aria-label="Next project"
            >
              &gt;
            </button>
          </div>
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
            {selectedProject.date ? (
              <span>
                <strong>Date</strong>
                {selectedProject.date}
              </span>
            ) : null}
            {selectedProject.tools?.length ? (
              <span>
                <strong>Tools</strong>
                <span className={styles.toolList}>
                  {selectedProject.tools.map((tool) => {
                    const { name, image } = getProjectTool(tool)
                    return (
                      <span key={name} className={styles.toolItem}>
                        {image && <img src={image} alt="" className={styles.toolIcon} />}
                        {name}
                      </span>
                    )
                  })}
                </span>
              </span>
            ) : null}
          </div>
          {selectedProject.links?.length ? (
            <div className={styles.detailLinks}>
              {selectedProject.links.map((link) => (
                <span key={link.label}>
                  {link.label}
                </span>
              ))}
            </div>
          ) : null}
          <button
            className={styles.moreInfoButton}
            type="button"
            onClick={openProjectInfo}
          >
            More info
          </button>
        </aside>
      </div>

      <ProjectInfoModal
        isInfoOpen={isInfoOpen}
        activeTheme={activeTheme}
        selectedPages={selectedPages}
        activeInfoPage={activeInfoPage}
        setActiveInfoPage={setActiveInfoPage}
        currentInfoPage={currentInfoPage}
        selectedProject={selectedProject}
        currentImageSlides={currentImageSlides}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        activeImageCallout={activeImageCallout}
        setActiveImageCallout={setActiveImageCallout}
        isAnimationSelectorSlide={isAnimationSelectorSlide}
        selectedAnimation={selectedAnimation}
        setSelectedAnimation={setSelectedAnimation}
        selectedPreviewImage={selectedPreviewImage}
        setSelectedPreviewImage={setSelectedPreviewImage}
        setIsInfoOpen={setIsInfoOpen}
      />

    </section>
  )
}

