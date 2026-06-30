import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { assetUrl } from '@/utils/assetUrl'
import modalStyles from './ProjectInfoModal.module.css'

const PLACEHOLDER_IMAGE = assetUrl('/images/placeholder.png')

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const renderBoldSegments = (text, keyPrefix) => (
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-bold-${index}`}>{part.slice(2, -2)}</strong>
    }

    return part
  })
)

const renderBoldText = (text, keyPrefix) => (
  text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

    if (linkMatch) {
      return (
        <a
          key={`${keyPrefix}-link-${index}`}
          className={modalStyles.infoInlineLink}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
        >
          {linkMatch[1]}
        </a>
      )
    }

    return renderBoldSegments(part, `${keyPrefix}-text-${index}`)
  })
)

const renderInlineSummary = (text, imageLinks, setActiveImageIndex, setActiveImageCallout, keyPrefix) => {
  if (!text || !imageLinks?.length) {
    return renderBoldText(text ?? '', keyPrefix)
  }

  const validLinks = imageLinks
    .filter((link) => link.label && Number.isInteger(link.imageIndex))
    .sort((a, b) => b.label.length - a.label.length)

  if (!validLinks.length) {
    return renderBoldText(text, keyPrefix)
  }

  const linkByLabel = new Map(
    validLinks.map((link) => [link.label.toLowerCase(), link]),
  )
  const pattern = new RegExp(`(${validLinks.map((link) => escapeRegExp(link.label)).join('|')})`, 'gi')

  return text.split(pattern).map((part, index) => {
    const link = linkByLabel.get(part.toLowerCase())

    if (!link) {
      return renderBoldText(part, `${keyPrefix}-text-${index}`)
    }

    return (
      <button
        key={`${keyPrefix}-${part}-${index}`}
        type="button"
        className={modalStyles.infoTextLink}
        onClick={() => {
          setActiveImageIndex(link.imageIndex)
          setActiveImageCallout(link.callout ?? null)
        }}
      >
        {part}
      </button>
    )
  })
}

const renderInfoSummary = (summary, imageLinks, setActiveImageIndex, setActiveImageCallout) => {
  const lines = (summary ?? '').split('\n')
  const nodes = []
  let bulletItems = []

  const flushBullets = () => {
    if (!bulletItems.length) return

    const listIndex = nodes.length
    nodes.push(
      <ul key={`bullet-list-${listIndex}`} className={modalStyles.infoBulletList}>
        {bulletItems.map((item, index) => (
          <li key={`bullet-${listIndex}-${index}`}>
            {renderInlineSummary(item, imageLinks, setActiveImageIndex, setActiveImageCallout, `bullet-${listIndex}-${index}`)}
          </li>
        ))}
      </ul>,
    )
    bulletItems = []
  }

  lines.forEach((line, index) => {
    if (line.startsWith('- ')) {
      bulletItems.push(line.slice(2))
      return
    }

    flushBullets()
    nodes.push(
      <span key={`line-${index}`}>
        {renderInlineSummary(line, imageLinks, setActiveImageIndex, setActiveImageCallout, `line-${index}`)}
        {index < lines.length - 1 ? '\n' : null}
      </span>,
    )
  })

  flushBullets()
  return nodes
}

const getEmbedVideoUrl = (videoUrl) => {
  if (!videoUrl) {
    return ''
  }

  try {
    const url = new URL(videoUrl)

    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.replace('/', '')
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        return videoUrl
      }

      const videoId = url.searchParams.get('v')
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
  } catch {
    return videoUrl
  }

  return videoUrl
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
    <div className={modalStyles.infoModelCard} ref={mountRef}>
      <span className={modalStyles.modelControlsHint}>
        <span className={modalStyles.modelHintDesktop}>
          <strong>right click + drag</strong> to rotate
        </span>
        <span className={modalStyles.modelHintMobile}>
          drag to rotate
        </span>
      </span>
      {!isLoaded && !hasError ? (
        <span className={modalStyles.infoModelStatus}>Loading model...</span>
      ) : null}
      {hasError ? (
        <span className={modalStyles.infoModelError}>Model could not load</span>
      ) : null}
    </div>
  )
}

function AnimationSelector({ animations, onSelect }) {
  return (
    <div className={modalStyles.animationSelectorCard}>
      <h5>Click to view animation</h5>
      <div className={modalStyles.animationGrid}>
        {animations.map((animation) => (
          <button
            key={animation.model}
            type="button"
            className={modalStyles.animationTile}
            onClick={() => onSelect(animation)}
          >
            <span className={modalStyles.animationPreview}>
              <img src={animation.image ?? PLACEHOLDER_IMAGE} alt="" />
            </span>
            <span>{animation.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}


function ProjectInfoModal({
  isInfoOpen,
  activeTheme,
  selectedPages,
  activeInfoPage,
  setActiveInfoPage,
  currentInfoPage,
  selectedProject,
  currentImageSlides,
  activeImageIndex,
  setActiveImageIndex,
  activeImageCallout,
  setActiveImageCallout,
  isAnimationSelectorSlide,
  selectedAnimation,
  setSelectedAnimation,
  selectedPreviewImage,
  setSelectedPreviewImage,
  setIsInfoOpen,
}) {
  const imageDragStartRef = useRef(null)
  const suppressImageClickRef = useRef(false)
  const previewPointersRef = useRef(new Map())
  const previewPinchStartRef = useRef(null)
  const previewPanStartRef = useRef(null)
  const previewSwipeStartRef = useRef(null)
  const [imageSlideDirection, setImageSlideDirection] = useState(0)
  const [imageDragOffset, setImageDragOffset] = useState(0)
  const [previewScale, setPreviewScale] = useState(1)
  const [previewOffset, setPreviewOffset] = useState({ x: 0, y: 0 })
  const [previewSwipeOffset, setPreviewSwipeOffset] = useState(0)
  const [previewSwipeYOffset, setPreviewSwipeYOffset] = useState(0)

  useEffect(() => {
    document.body.classList.toggle('info-popup-open', isInfoOpen)
    document.body.style.overflow = isInfoOpen ? 'hidden' : ''
    return () => {
      document.body.classList.remove('info-popup-open')
      document.body.style.overflow = ''
    }
  }, [isInfoOpen])

  useEffect(() => {
    setPreviewScale(1)
    setPreviewOffset({ x: 0, y: 0 })
    previewPointersRef.current.clear()
    previewPinchStartRef.current = null
    previewPanStartRef.current = null
    previewSwipeStartRef.current = null
    setPreviewSwipeOffset(0)
    setPreviewSwipeYOffset(0)
  }, [selectedPreviewImage])

  const previewImageSlides = currentImageSlides.filter((slide) => slide !== 'animation-selector')
  const selectedPreviewImageIndex = Math.max(0, previewImageSlides.indexOf(selectedPreviewImage))
  const clampPreviewScale = (scale) => Math.min(4, Math.max(1, scale))
  const resetPreviewZoom = () => {
    setPreviewScale(1)
    setPreviewOffset({ x: 0, y: 0 })
  }
  const getPointerDistance = (pointers) => {
    if (pointers.length < 2) {
      return 0
    }

    return Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y)
  }
  const handlePreviewPointerDown = (event) => {
    if (!window.matchMedia('(max-width: 640px)').matches && previewScale <= 1) {
      return
    }

    previewPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture?.(event.pointerId)

    const pointers = [...previewPointersRef.current.values()]

    if (pointers.length === 2) {
      previewPinchStartRef.current = {
        distance: getPointerDistance(pointers),
        scale: previewScale,
      }
      previewPanStartRef.current = null
      return
    }

    if (previewScale > 1) {
      previewPanStartRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offset: previewOffset,
      }
      previewSwipeStartRef.current = null
      return
    }

    previewSwipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    setPreviewSwipeOffset(0)
    setPreviewSwipeYOffset(0)
  }
  const handlePreviewPointerMove = (event) => {
    if (!previewPointersRef.current.has(event.pointerId)) {
      return
    }

    previewPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const pointers = [...previewPointersRef.current.values()]

    if (pointers.length >= 2 && previewPinchStartRef.current) {
      previewSwipeStartRef.current = null
      setPreviewSwipeOffset(0)
      setPreviewSwipeYOffset(0)
      const distance = getPointerDistance(pointers)
      const nextScale = clampPreviewScale(
        previewPinchStartRef.current.scale * (distance / previewPinchStartRef.current.distance),
      )

      setPreviewScale(nextScale)
      if (nextScale === 1) {
        setPreviewOffset({ x: 0, y: 0 })
      }
      return
    }

    if (previewScale <= 1 && previewSwipeStartRef.current?.pointerId === event.pointerId) {
      const dragDistanceX = event.clientX - previewSwipeStartRef.current.x
      const dragDistanceY = event.clientY - previewSwipeStartRef.current.y
      setPreviewSwipeOffset(Math.max(-110, Math.min(110, dragDistanceX)))
      setPreviewSwipeYOffset(Math.max(-140, Math.min(140, dragDistanceY)))
      return
    }

    if (previewScale <= 1 || !previewPanStartRef.current || previewPanStartRef.current.pointerId !== event.pointerId) {
      return
    }

    setPreviewOffset({
      x: previewPanStartRef.current.offset.x + event.clientX - previewPanStartRef.current.x,
      y: previewPanStartRef.current.offset.y + event.clientY - previewPanStartRef.current.y,
    })
  }
  const handlePreviewPointerEnd = (event) => {
    const swipeStart = previewSwipeStartRef.current
    const swipeDistanceX = swipeStart?.pointerId === event.pointerId ? event.clientX - swipeStart.x : 0
    const swipeDistanceY = swipeStart?.pointerId === event.pointerId ? event.clientY - swipeStart.y : 0

    previewPointersRef.current.delete(event.pointerId)
    previewPinchStartRef.current = null
    previewSwipeStartRef.current = null
    setPreviewSwipeOffset(0)
    setPreviewSwipeYOffset(0)

    if (previewPointersRef.current.size === 0) {
      previewPanStartRef.current = null
    }

    if (
      previewScale <= 1 &&
      Math.abs(swipeDistanceY) >= 80 &&
      Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)
    ) {
      setSelectedPreviewImage(null)
      return
    }

    if (previewScale <= 1 && Math.abs(swipeDistanceX) >= 44 && previewImageSlides.length > 1) {
      movePreviewImage(swipeDistanceX > 0 ? -1 : 1)
      return
    }

    if (previewScale <= 1.02) {
      resetPreviewZoom()
    }
  }
  const togglePreviewZoom = () => {
    if (previewScale > 1) {
      resetPreviewZoom()
      return
    }

    setPreviewScale(2)
    setPreviewOffset({ x: 0, y: 0 })
  }
  const moveInfoImage = (direction) => {
    if (currentImageSlides.length <= 1) {
      return
    }

    setImageSlideDirection(window.matchMedia('(max-width: 640px)').matches ? direction : 0)
    setImageDragOffset(0)
    setActiveImageIndex((i) => (i + direction + currentImageSlides.length) % currentImageSlides.length)
    setActiveImageCallout(null)
  }
  const selectInfoImage = (nextIndex) => {
    if (nextIndex === activeImageIndex) {
      return
    }

    setImageSlideDirection(
      window.matchMedia('(max-width: 640px)').matches
        ? (nextIndex > activeImageIndex ? 1 : -1)
        : 0,
    )
    setImageDragOffset(0)
    setActiveImageIndex(nextIndex)
    setActiveImageCallout(null)
  }
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
  const closeInfo = () => {
    setIsInfoOpen(false)
    setActiveImageCallout(null)
    setSelectedAnimation(null)
    setSelectedPreviewImage(null)
  }
  return (
    <>
      {isInfoOpen ? createPortal(
        <div className={modalStyles.infoOverlay} role="presentation" onClick={closeInfo}>
          <div className={modalStyles.infoWrapper} style={activeTheme} onClick={(event) => event.stopPropagation()}>
            <div className={`${modalStyles.infoTabBar} ${selectedPages.length >= 4 ? modalStyles.infoTabBarCompact : ''}`}>
              {selectedPages.map((page, i) => (
                <button
                  key={page.title}
                  type="button"
                  className={`${modalStyles.infoTab} ${activeInfoPage === i ? modalStyles.infoTabActive : ''}`}
                  onClick={() => {
                    setActiveInfoPage(i)
                    setActiveImageIndex(0)
                    setActiveImageCallout(null)
                    setSelectedAnimation(null)
                    setSelectedPreviewImage(null)
                  }}
                >
                  {page.title}
                </button>
              ))}
            </div>
            <div className={modalStyles.infoRow}>
              <div className={modalStyles.infoModal} role="dialog" aria-modal="true" aria-labelledby="project-info-title">
                <button className={modalStyles.infoClose} type="button" onClick={closeInfo} aria-label="Close project details">
                  x
                </button>
                <h4 id="project-info-title" className={modalStyles.infoPageTitle}>
                  {currentInfoPage.title}
                </h4>
                <div className={modalStyles.infoBody}>
                  <div className={modalStyles.infoImageCarousel}>
                    {currentInfoPage.video ? (
                      <div className={modalStyles.infoVideoCard}>
                        <iframe
                          src={getEmbedVideoUrl(currentInfoPage.video)}
                          title="Project video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : currentInfoPage.model ? (
                      <FbxModelViewer model={currentInfoPage.model} />
                    ) : isAnimationSelectorSlide ? (
                      <AnimationSelector animations={currentInfoPage.animations} onSelect={setSelectedAnimation} />
                    ) : (
                      <button
                        className={modalStyles.infoImageCard}
                        type="button"
                        onPointerDown={(event) => {
                          if (
                            !window.matchMedia('(max-width: 640px)').matches ||
                            currentImageSlides.length <= 1
                          ) {
                            return
                          }

                          imageDragStartRef.current = event.clientX
                          suppressImageClickRef.current = false
                          setImageDragOffset(0)
                          event.currentTarget.setPointerCapture?.(event.pointerId)
                        }}
                        onPointerMove={(event) => {
                          if (!window.matchMedia('(max-width: 640px)').matches) {
                            return
                          }

                          const dragStart = imageDragStartRef.current

                          if (dragStart === null || currentImageSlides.length <= 1) {
                            return
                          }

                          const nextOffset = event.clientX - dragStart
                          setImageDragOffset(Math.max(-90, Math.min(90, nextOffset)))
                        }}
                        onPointerUp={(event) => {
                          if (!window.matchMedia('(max-width: 640px)').matches) {
                            return
                          }

                          const dragStart = imageDragStartRef.current
                          imageDragStartRef.current = null

                          if (dragStart === null || currentImageSlides.length <= 1) {
                            setImageDragOffset(0)
                            return
                          }

                          const dragDistance = event.clientX - dragStart

                          if (Math.abs(dragDistance) < 40) {
                            setImageDragOffset(0)
                            return
                          }

                          suppressImageClickRef.current = true
                          moveInfoImage(dragDistance > 0 ? -1 : 1)
                        }}
                        onPointerCancel={() => {
                          imageDragStartRef.current = null
                          setImageDragOffset(0)
                        }}
                        onMouseEnter={(event) => {
                          const image = event.currentTarget.querySelector(`.${modalStyles.infoImageCurrent}`)
                          if (image) {
                            syncImageOverlayArea(image)
                          }
                        }}
                        onClick={() => {
                          if (suppressImageClickRef.current) {
                            suppressImageClickRef.current = false
                            return
                          }

                          setSelectedPreviewImage(currentImageSlides[activeImageIndex] ?? PLACEHOLDER_IMAGE)
                        }}
                        aria-label="Open image preview"
                      >
                        <span
                          className={`${modalStyles.infoImageTrack} ${
                            imageSlideDirection > 0
                              ? modalStyles.infoImageSlideNext
                              : imageSlideDirection < 0
                                ? modalStyles.infoImageSlidePrev
                                : imageDragOffset
                                  ? modalStyles.infoImageDragging
                                  : ''
                          }`}
                          style={{
                            '--image-drag-offset': `${imageDragOffset}px`,
                          }}
                          onAnimationEnd={() => setImageSlideDirection(0)}
                        >
                          {[-1, 0, 1].map((offset) => {
                            const slideIndex =
                              (activeImageIndex + offset + currentImageSlides.length) % currentImageSlides.length
                            const isCurrentSlide = offset === 0

                            return (
                              <span
                                key={`${currentImageSlides[slideIndex] ?? PLACEHOLDER_IMAGE}-${slideIndex}-${offset}`}
                                className={modalStyles.infoImageInner}
                                aria-hidden={!isCurrentSlide}
                              >
                                <img
                                  src={currentImageSlides[slideIndex] ?? PLACEHOLDER_IMAGE}
                                  alt=""
                                  className={`${modalStyles.infoImage} ${isCurrentSlide ? modalStyles.infoImageCurrent : ''}`}
                                  onLoad={(event) => {
                                    if (isCurrentSlide) {
                                      syncImageOverlayArea(event.currentTarget)
                                    }
                                  }}
                                />
                                {isCurrentSlide ? (
                                  <>
                                    <img src={assetUrl('/images/icons/zoomin.png')} alt="" className={modalStyles.imageZoomIcon} aria-hidden="true" />
                                    {activeImageCallout && activeImageIndex === activeImageCallout.imageIndex ? (
                                      <span className={modalStyles.imageCalloutLayer} aria-hidden="true">
                                        <span
                                          className={modalStyles.imageCalloutBox}
                                          style={{
                                            left: `${activeImageCallout.x}%`,
                                            top: `${activeImageCallout.y}%`,
                                            width: `${activeImageCallout.width}%`,
                                            height: `${activeImageCallout.height}%`,
                                          }}
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                ) : null}
                              </span>
                            )
                          })}
                        </span>
                      </button>
                    )}
                    {!currentInfoPage.video && !currentInfoPage.model && (
                      <div className={modalStyles.imageNav}>
                        <button
                          className={modalStyles.imageNavArrow}
                          style={{ visibility: currentImageSlides.length > 1 ? 'visible' : 'hidden' }}
                          onClick={() => moveInfoImage(-1)}
                          aria-label="Previous image"
                        >
                          &lt;
                        </button>
                        <div className={modalStyles.imageDots}>
                          {currentImageSlides.map((_, i) => (
                            <button
                              key={i}
                              className={`${modalStyles.imageDot} ${activeImageIndex === i ? modalStyles.imageDotActive : ''}`}
                              onClick={() => selectInfoImage(i)}
                              aria-label={`Image ${i + 1}`}
                            />
                          ))}
                        </div>
                        <button
                          className={modalStyles.imageNavArrow}
                          style={{ visibility: currentImageSlides.length > 1 ? 'visible' : 'hidden' }}
                          onClick={() => moveInfoImage(1)}
                          aria-label="Next image"
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={modalStyles.infoText}>
                    <div>
                      {renderInfoSummary(
                        currentInfoPage.summary ?? selectedProject.description,
                        currentInfoPage.imageLinks,
                        setActiveImageIndex,
                        setActiveImageCallout,
                      )}
                    </div>
                    {currentInfoPage.download ? (
                      <a className={modalStyles.infoDownloadLink} href={currentInfoPage.download.href} download>
                        {currentInfoPage.download.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
      {selectedAnimation ? createPortal(
        <div className={modalStyles.modelOverlay} role="presentation" onClick={() => setSelectedAnimation(null)}>
          <div
            className={`${modalStyles.modelModal} ${modalStyles.animationViewerModal}`}
            style={activeTheme}
            role="dialog"
            aria-modal="true"
            aria-labelledby="animation-viewer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className={modalStyles.modelClose} type="button" onClick={() => setSelectedAnimation(null)} aria-label="Close animation viewer">
              x
            </button>
            <h4 id="animation-viewer-title" className={modalStyles.modelTitle}>
              {selectedAnimation.label}
            </h4>
            <FbxModelViewer model={selectedAnimation.model} />
          </div>
        </div>,
        document.body
      ) : null}
      {selectedPreviewImage ? createPortal(
        <div className={modalStyles.modelOverlay} role="presentation" onClick={() => setSelectedPreviewImage(null)}>
          <div
            className={`${modalStyles.modelModal} ${modalStyles.imagePreviewModal}`}
            style={activeTheme}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={() => setSelectedPreviewImage(null)}
          >
            <button className={modalStyles.modelClose} type="button" onClick={() => setSelectedPreviewImage(null)} aria-label="Close image preview">
              x
            </button>
            <button
              className={`${modalStyles.previewArrow} ${modalStyles.previewArrowLeft}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                movePreviewImage(-1)
              }}
              aria-label="Previous image"
              style={{ visibility: previewImageSlides.length > 1 ? 'visible' : 'hidden' }}
            />
            <img
              src={selectedPreviewImage}
              alt=""
              className={modalStyles.imagePreviewFull}
              onPointerDown={handlePreviewPointerDown}
              onPointerMove={handlePreviewPointerMove}
              onPointerUp={handlePreviewPointerEnd}
              onPointerCancel={handlePreviewPointerEnd}
              onDoubleClick={togglePreviewZoom}
              onClick={(event) => event.stopPropagation()}
              style={{
                transform: `translate(${previewOffset.x + previewSwipeOffset}px, ${previewOffset.y + previewSwipeYOffset}px) scale(${previewScale})`,
                cursor: previewScale > 1 ? 'grab' : 'zoom-in',
              }}
            />
            <button
              className={`${modalStyles.previewArrow} ${modalStyles.previewArrowRight}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                movePreviewImage(1)
              }}
              aria-label="Next image"
              style={{ visibility: previewImageSlides.length > 1 ? 'visible' : 'hidden' }}
            />
          </div>
        </div>,
        document.body
      ) : null}
    </>
  )
}
export default ProjectInfoModal
