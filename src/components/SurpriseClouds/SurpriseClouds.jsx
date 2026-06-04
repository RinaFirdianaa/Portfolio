import { useMemo } from 'react'
import styles from './SurpriseClouds.module.css'

const CLOUD_IMAGES = [
  '/images/bg_clouds/bg_cloud1.png',
  '/images/bg_clouds/bg_cloud2.png',
  '/images/bg_clouds/bg_cloud3.png',
  '/images/bg_clouds/bg_cloud4.png',
  '/images/bg_clouds/bg_cloud5.png',
]

const CLOUD_COUNT = 32
const SECTION_COUNT = 4

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function SurpriseClouds({ seed = 0 }) {
  const clouds = useMemo(
    () =>
      Array.from({ length: CLOUD_COUNT }, (_, index) => {
        const image = CLOUD_IMAGES[index % CLOUD_IMAGES.length]
        const sectionIndex = index % SECTION_COUNT

        return {
          id: `${seed}-${index}`,
          image,
          left: randomBetween(8, 82),
          top: ((sectionIndex + randomBetween(0.15, 0.55)) / SECTION_COUNT) * 100,
          size: randomBetween(200, 260),
          opacity: randomBetween(0.3, 0.4),
          duration: randomBetween(8, 16),
          delay: randomBetween(-18, 0),
          driftX: randomBetween(-40, 44),
          driftY: randomBetween(-22, 22),
          rotate: randomBetween(-8, 8),
        }
      }),
    [seed]
  )

  return (
    <div className={styles.layer} aria-hidden="true">
      {clouds.map((cloud) => (
        <img
          key={cloud.id}
          className={styles.cloud}
          src={cloud.image}
          alt=""
          style={{
            '--cloud-left': `${cloud.left}%`,
            '--cloud-top': `${cloud.top}%`,
            '--cloud-size': `${cloud.size}px`,
            '--cloud-opacity': cloud.opacity,
            '--cloud-duration': `${cloud.duration}s`,
            '--cloud-delay': `${cloud.delay}s`,
            '--cloud-drift-x': `${cloud.driftX}px`,
            '--cloud-drift-y': `${cloud.driftY}px`,
            '--cloud-rotate': `${cloud.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
