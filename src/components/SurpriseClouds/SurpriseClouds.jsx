import { useState, useEffect } from 'react'
import styles from './SurpriseClouds.module.css'
import { assetUrl } from '../../utils/assetUrl'

const CLOUD_IMAGES = [
  assetUrl('/images/bg_clouds/bg_cloud1.png'),
  assetUrl('/images/bg_clouds/bg_cloud2.png'),
  assetUrl('/images/bg_clouds/bg_cloud3.png'),
  assetUrl('/images/bg_clouds/bg_cloud4.png'),
  assetUrl('/images/bg_clouds/bg_cloud5.png'),
]

const CLOUD_COUNT = 10

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function buildClouds(seed) {
  const pageH   = document.documentElement.scrollHeight

  const aboutEl  = document.getElementById('about')
  const skillsEl = document.getElementById('skills')
  const zoneTop    = (aboutEl  ? aboutEl.getBoundingClientRect().top  + window.scrollY : 0) + 100
  const zoneBottom = skillsEl  ? skillsEl.getBoundingClientRect().top + window.scrollY + skillsEl.offsetHeight : pageH
  const zoneH      = zoneBottom - zoneTop

  const viewCenter = window.scrollY + window.innerHeight / 2

  const clouds = Array.from({ length: CLOUD_COUNT }, (_, index) => {
    const image    = CLOUD_IMAGES[index % CLOUD_IMAGES.length]
    const size     = randomBetween(300, 500)
    const duration = randomBetween(45, 80)
    // negative delay places the cloud at a random point in its journey
    const scrollDelay = -randomBetween(0, duration)
    const top      = zoneTop + ((index + randomBetween(0.05, 0.95)) / CLOUD_COUNT) * (zoneH - size)

    return {
      id: `${seed}-${index}`,
      image,
      size,
      top,
      duration,
      scrollDelay,
      opacity: randomBetween(0.25, 0.4),
    }
  })

  // Clouds closest to viewport fade in first
  const distances = clouds.map(c => Math.abs(c.top + c.size / 2 - viewCenter))
  const maxDist   = Math.max(...distances) || 1
  clouds.forEach(c => {
    c.appearDelay = (Math.abs(c.top + c.size / 2 - viewCenter) / maxDist) * 2
  })

  return clouds
}

export default function SurpriseClouds({ seed = 0 }) {
  const [clouds, setClouds] = useState([])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setClouds(buildClouds(seed))
    })
    return () => cancelAnimationFrame(raf)
  }, [seed])

  return (
    <div className={styles.layer} aria-hidden="true">
      {clouds.map((cloud) => (
        <img
          key={cloud.id}
          className={styles.cloud}
          src={cloud.image}
          alt=""
          style={{
            '--cloud-top':          `${cloud.top}px`,
            '--cloud-size':         `${cloud.size}px`,
            '--cloud-opacity':      cloud.opacity,
            '--cloud-duration':     `${cloud.duration}s`,
            '--cloud-scroll-delay': `${cloud.scrollDelay}s`,
            '--cloud-appear-delay': `${cloud.appearDelay}s`,
          }}
        />
      ))}
    </div>
  )
}
