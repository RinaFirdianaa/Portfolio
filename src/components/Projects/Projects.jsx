import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PROJECTS, PROJECT_CATEGORIES } from '@/constants/data'
import { useScore } from '@/components/Score/ScoreContext'
import { useSparkles } from '@/components/Sparkle/SparkleContext'
import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './Projects.module.css'

const VISIBLE_CARD_COUNT = 7
const CENTER_OFFSET = Math.floor(VISIBLE_CARD_COUNT / 2)
const RENDER_OFFSET = CENTER_OFFSET + 1
const PLACEHOLDER_IMAGE = '/images/placeholder.png'
const DRAG_STEP_PX = 48
const PLACEHOLDER_CARD_COUNT = 3
const CLICK_SPIN_STEP_MS = 95
const PROJECT_STAR_SCORE = 5
const SPARKLE_TRAVEL_MS = 850
const CARD_SETTLE_MS = 520
const CARD_FRAMES = {
  Game: '/images/card_game.png',
  Design: '/images/card_design.png',
  Others: '/images/card_others.png',
}

const CATEGORY_THEMES = {
  Game: {
    '--card-start': 'rgba(182, 211, 250, 0.96)',
    '--card-end': 'rgba(106, 143, 196, 0.98)',
    '--card-shadow': 'rgba(126, 93, 181, 0.22)',
    '--category-accent': 'var(--blue-60)',
    '--category-accent-dark': 'var(--blue-80)',
    '--category-accent-soft': 'var(--blue-20)',
  },
  Design: {
    '--card-start': 'rgba(252, 197, 221, 0.96)',
    '--card-end': 'rgba(214, 126, 169, 0.98)',
    '--card-shadow': 'rgba(126, 93, 181, 0.22)',
    '--category-accent': 'var(--pink-60)',
    '--category-accent-dark': 'var(--pink-80)',
    '--category-accent-soft': 'var(--pink-10)',
  },
  Others: {
    '--card-start': 'rgba(215, 198, 255, 0.96)',
    '--card-end': 'rgba(126, 93, 181, 0.98)',
    '--card-shadow': 'rgba(126, 93, 181, 0.22)',
    '--category-accent': 'var(--purple-40)',
    '--category-accent-dark': 'var(--purple-60)',
    '--category-accent-soft': 'var(--purple-10)',
  },
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const renderInfoSummary = (summary, imageLinks, setActiveImageIndex) => {
  if (!summary || !imageLinks?.length) {
    return summary
  }

  const validLinks = imageLinks
    .filter((link) => link.label && Number.isInteger(link.imageIndex))
    .sort((a, b) => b.label.length - a.label.length)

  if (!validLinks.length) {
    return summary
  }

  const linkByLabel = new Map(
    validLinks.map((link) => [link.label.toLowerCase(), link]),
  )
  const pattern = new RegExp(`(${validLinks.map((link) => escapeRegExp(link.label)).join('|')})`, 'gi')

  return summary.split(pattern).map((part, index) => {
    const link = linkByLabel.get(part.toLowerCase())

    if (!link) {
      return part
    }

    return (
      <button
        key={`${part}-${index}`}
        type="button"
        className={styles.infoTextLink}
        onClick={() => setActiveImageIndex(link.imageIndex)}
      >
        {part}
      </button>
    )
  })
}

const syncImageOverlayArea = (image) => {
  const container = image.parentElement

  if (!container || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  const containerAspect = containerWidth / containerHeight
  const imageAspect = image.naturalWidth / image.naturalHeight
  let top = 0
  let right = 0
  let bottom = 0
  let left = 0

  if (imageAspect > containerAspect) {
    const displayedHeight = containerWidth / imageAspect
    top = (containerHeight - displayedHeight) / 2
    bottom = top
  } else {
    const displayedWidth = containerHeight * imageAspect
    left = (containerWidth - displayedWidth) / 2
    right = left
  }

  container.style.setProperty('--image-overlay-top', `${top}px`)
  container.style.setProperty('--image-overlay-right', `${right}px`)
  container.style.setProperty('--image-overlay-bottom', `${bottom}px`)
  container.style.setProperty('--image-overlay-left', `${left}px`)
}

function FbxModelViewer({ model }) {
  const mountRef = useRef(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!model || !mountRef.current) {
      return undefined
    }

    const mount = mountRef.current
    let scene = null
    let renderer = null
    let frameId = null
    let mixer = null
    let controls = null
    let resizeObserver = null
    let isDisposed = false

    setHasError(false)
    setIsLoaded(false)

    const startViewer = async () => {
      const THREE = await import('three')
      const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

      if (isDisposed) {
        return
      }

      scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      const clock = new THREE.Clock()
      const loader = new FBXLoader()

      camera.position.set(0, 0.75, 5)
      camera.lookAt(0, 0.75, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      mount.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.screenSpacePanning = true
      controls.enablePan = true
      controls.enableZoom = true
      controls.enableRotate = true
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.8
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_ROTATE,
      }

      scene.add(new THREE.HemisphereLight(0xffffff, 0xb8a390, 2.2))

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.3)
      keyLight.position.set(3, 4, 4)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0xffd8cc, 1)
      fillLight.position.set(-3, 2, 2)
      scene.add(fillLight)

      const frameScene = () => {
        const { width, height } = mount.getBoundingClientRect()
        const nextWidth = Math.max(1, width)
        const nextHeight = Math.max(1, height)

        renderer.setSize(nextWidth, nextHeight, false)
        camera.aspect = nextWidth / nextHeight
        camera.updateProjectionMatrix()
      }

      const centerModel = (object) => {
        const box = new THREE.Box3().setFromObject(object)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxSize = Math.max(size.x, size.y, size.z) || 1

        object.position.sub(center)
        object.scale.setScalar(2.45 / maxSize)

        const scaledBox = new THREE.Box3().setFromObject(object)
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3())

        object.position.x -= scaledCenter.x
        object.position.z -= scaledCenter.z
        object.position.y -= scaledBox.min.y

        const framedBox = new THREE.Box3().setFromObject(object)
        const framedSize = framedBox.getSize(new THREE.Vector3())
        const framedCenter = framedBox.getCenter(new THREE.Vector3())
        const distance = Math.max(framedSize.x, framedSize.y, framedSize.z) * 2.1

        camera.position.set(framedCenter.x, framedCenter.y + framedSize.y * 0.08, distance)
        camera.lookAt(framedCenter.x, framedCenter.y, framedCenter.z)
        camera.updateProjectionMatrix()

        controls.target.copy(framedCenter)
        controls.update()
      }

      const animate = () => {
        frameId = window.requestAnimationFrame(animate)

        if (mixer) {
          mixer.update(clock.getDelta())
        }

        if (controls) {
          controls.update()
        }

        renderer.render(scene, camera)
      }

      resizeObserver = new ResizeObserver(frameScene)
      resizeObserver.observe(mount)
      frameScene()

      loader.load(
        model,
        (object) => {
          if (isDisposed) {
            return
          }

          centerModel(object)
          object.traverse((child) => {
            if (!child.isMesh) {
              return
            }

            child.castShadow = false
            child.receiveShadow = false
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            materials.filter(Boolean).forEach((material) => {
              material.transparent = false
              material.opacity = 1
              material.depthWrite = true
              material.side = THREE.DoubleSide
              if (material.map) {
                material.map.colorSpace = THREE.SRGBColorSpace
                material.map.needsUpdate = true
              }
              material.needsUpdate = true
            })
          })

          scene.add(object)
          setIsLoaded(true)

          if (object.animations.length) {
            mixer = new THREE.AnimationMixer(object)
            mixer.clipAction(object.animations[0]).play()
          }
        },
        undefined,
        () => setHasError(true),
      )

      animate()
    }

    startViewer().catch(() => setHasError(true))

    return () => {
      isDisposed = true

      if (resizeObserver) {
        resizeObserver.disconnect()
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      if (scene) {
        scene.traverse((object) => {
          if (!object.isMesh) {
            return
          }

          object.geometry?.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.filter(Boolean).forEach((material) => material.dispose())
        })
      }

      if (renderer) {
        renderer.dispose()
        renderer.domElement.remove()
      }
    }
  }, [model])

  return (
    <div className={styles.infoModelCard} ref={mountRef}>
      <span className={styles.modelControlsHint}>
        <strong>right click + drag</strong> to rotate
      </span>
      {!isLoaded && !hasError ? (
        <span className={styles.infoModelStatus}>Loading model...</span>
      ) : null}
      {hasError ? (
        <span className={styles.infoModelError}>Model could not load</span>
      ) : null}
    </div>
  )
}

function AnimationSelector({ animations, onSelect }) {
  return (
    <div className={styles.animationSelectorCard}>
      <h5>Click to view animation</h5>
      <div className={styles.animationGrid}>
        {animations.map((animation) => (
          <button
            key={animation.model}
            type="button"
            className={styles.animationTile}
            onClick={() => onSelect(animation)}
          >
            <span className={styles.animationPreview}>
              <img src={animation.image ?? PLACEHOLDER_IMAGE} alt="" />
            </span>
            <span>{animation.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const { fireSparkles } = useSparkles()
  const { addScore } = useScore()
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
  const [selectedAnimation, setSelectedAnimation] = useState(null)
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null)
  const [dragStartX, setDragStartX] = useState(null)
  const [collectedStarIds, setCollectedStarIds] = useState(() => new Set())
  const lastDragTimeRef = useRef(0)
  const pendingSelectCardIdRef = useRef(null)
  const clickSpinTimerRef = useRef(null)
  const sparkleRefs = useRef({})
  const collectedStarIdsRef = useRef(new Set())
  useEffect(() => {
    document.body.classList.toggle('info-popup-open', isInfoOpen)
    document.body.style.overflow = isInfoOpen ? 'hidden' : ''
    return () => {
      document.body.classList.remove('info-popup-open')
      document.body.style.overflow = ''
    }
  }, [isInfoOpen])

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
          title: selectedProject.title,
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
  const previewImageSlides = currentImageSlides.filter((slide) => slide !== 'animation-selector')
  const selectedPreviewImageIndex = Math.max(0, previewImageSlides.indexOf(selectedPreviewImage))
  const movePreviewImage = (direction) => {
    if (!previewImageSlides.length) {
      return
    }

    const nextIndex =
      (selectedPreviewImageIndex + direction + previewImageSlides.length) % previewImageSlides.length
    const nextImage = previewImageSlides[nextIndex]

    setSelectedPreviewImage(nextImage)
    setActiveImageIndex(currentImageSlides.indexOf(nextImage))
  }

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
    setSelectedAnimation(null)
    setSelectedPreviewImage(null)
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
              style={CATEGORY_THEMES[category] ?? CATEGORY_THEMES.Game}
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
            <h4 className={styles.detailTitle}>{selectedProject.title}</h4>
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
                    const name  = typeof tool === 'string' ? tool : tool.name
                    const image = typeof tool === 'string' ? null : tool.image
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
          onClick={() => {
            setActiveInfoPage(0)
            setActiveImageIndex(0)
            setSelectedAnimation(null)
            setSelectedPreviewImage(null)
            setIsInfoOpen(true)
          }}
          >
            More info
          </button>
        </aside>
      </div>

      {isInfoOpen ? createPortal(
        <div
          className={styles.infoOverlay}
          role="presentation"
          onClick={() => {
            setIsInfoOpen(false)
            setSelectedAnimation(null)
            setSelectedPreviewImage(null)
          }}
        >
          <div
            className={styles.infoWrapper}
            style={activeTheme}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Tab bar + close */}
            <div className={styles.infoTabBar}>
              {selectedPages.map((page, i) => (
                <button
                  key={page.title}
                  type="button"
                  className={`${styles.infoTab} ${activeInfoPage === i ? styles.infoTabActive : ''}`}
                  onClick={() => {
                    setActiveInfoPage(i)
                    setActiveImageIndex(0)
                    setSelectedAnimation(null)
                    setSelectedPreviewImage(null)
                  }}
                >
                  {page.title}
                </button>
              ))}
            </div>

            {/* Arrow + card + arrow */}
            <div className={styles.infoRow}>
              <div
                className={styles.infoModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-info-title"
              >
                <button
                  className={styles.infoClose}
                  type="button"
                  onClick={() => {
                    setIsInfoOpen(false)
                    setSelectedAnimation(null)
                    setSelectedPreviewImage(null)
                  }}
                  aria-label="Close project details"
                >
                  ×
                </button>
                <h4 id="project-info-title" className={styles.infoPageTitle}>
                  {currentInfoPage.title}
                </h4>
                <div className={styles.infoBody}>
                  <div className={styles.infoImageCarousel}>
                    {currentInfoPage.video ? (
                      <div className={styles.infoVideoCard}>
                        <iframe
                          src={currentInfoPage.video}
                          title="Project video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : currentInfoPage.model ? (
                      <FbxModelViewer model={currentInfoPage.model} />
                    ) : isAnimationSelectorSlide ? (
                      <AnimationSelector
                        animations={currentInfoPage.animations}
                        onSelect={setSelectedAnimation}
                      />
                    ) : (
                    <button
                      className={styles.infoImageCard}
                      type="button"
                      onMouseEnter={(event) => {
                        const image = event.currentTarget.querySelector(`.${styles.infoImage}`)
                        if (image) {
                          syncImageOverlayArea(image)
                        }
                      }}
                      onClick={() => setSelectedPreviewImage(currentImageSlides[activeImageIndex] ?? PLACEHOLDER_IMAGE)}
                      aria-label="Open image preview"
                    >
                      <span className={styles.infoImageInner}>
                        <img
                          src={currentImageSlides[activeImageIndex] ?? PLACEHOLDER_IMAGE}
                          alt=""
                          className={styles.infoImage}
                          onLoad={(event) => syncImageOverlayArea(event.currentTarget)}
                        />
                        <img
                          src="/images/icons/zoomin.png"
                          alt=""
                          className={styles.imageZoomIcon}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                    )}
                    {!currentInfoPage.video && !currentInfoPage.model && <div className={styles.imageNav}>
                      <button
                        className={styles.imageNavArrow}
                        style={{ visibility: currentImageSlides.length > 1 ? 'visible' : 'hidden' }}
                        onClick={() => setActiveImageIndex(i => (i - 1 + currentImageSlides.length) % currentImageSlides.length)}
                        aria-label="Previous image"
                      >‹</button>
                      <div className={styles.imageDots}>
                        {currentImageSlides.map((_, i) => (
                          <button
                            key={i}
                            className={`${styles.imageDot} ${activeImageIndex === i ? styles.imageDotActive : ''}`}
                            onClick={() => setActiveImageIndex(i)}
                            aria-label={`Image ${i + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        className={styles.imageNavArrow}
                        style={{ visibility: currentImageSlides.length > 1 ? 'visible' : 'hidden' }}
                        onClick={() => setActiveImageIndex(i => (i + 1) % currentImageSlides.length)}
                        aria-label="Next image"
                      >›</button>
                    </div>}
                  </div>
                  <div className={styles.infoText}>

                    <p>
                      {renderInfoSummary(
                        currentInfoPage.summary ?? selectedProject.description,
                        currentInfoPage.imageLinks,
                        setActiveImageIndex,
                      )}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {selectedAnimation ? createPortal(
        <div
          className={styles.modelOverlay}
          role="presentation"
          onClick={() => setSelectedAnimation(null)}
        >
          <div
            className={styles.modelModal}
            style={activeTheme}
            role="dialog"
            aria-modal="true"
            aria-labelledby="animation-viewer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.modelClose}
              type="button"
              onClick={() => setSelectedAnimation(null)}
              aria-label="Close animation viewer"
            >
              Ã—
            </button>
            <h4 id="animation-viewer-title" className={styles.modelTitle}>
              {selectedAnimation.label}
            </h4>
            <FbxModelViewer model={selectedAnimation.model} />
          </div>
        </div>,
        document.body
      ) : null}

      {selectedPreviewImage ? createPortal(
        <div
          className={styles.modelOverlay}
          role="presentation"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div
            className={`${styles.modelModal} ${styles.imagePreviewModal}`}
            style={activeTheme}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.modelClose}
              type="button"
              onClick={() => setSelectedPreviewImage(null)}
              aria-label="Close image preview"
            >
              Ã—
            </button>
            <button
              className={`${styles.previewArrow} ${styles.previewArrowLeft}`}
              type="button"
              onClick={() => movePreviewImage(-1)}
              aria-label="Previous image"
              style={{ visibility: previewImageSlides.length > 1 ? 'visible' : 'hidden' }}
            />
            <img src={selectedPreviewImage} alt="" className={styles.imagePreviewFull} />
            <button
              className={`${styles.previewArrow} ${styles.previewArrowRight}`}
              type="button"
              onClick={() => movePreviewImage(1)}
              aria-label="Next image"
              style={{ visibility: previewImageSlides.length > 1 ? 'visible' : 'hidden' }}
            />
          </div>
        </div>,
        document.body
      ) : null}

    </section>
  )
}
