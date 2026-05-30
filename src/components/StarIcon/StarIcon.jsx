/**
 * StarIcon
 * Reusable ✦ star with optional glow and color.
 *
 * Props:
 *   size      — font size (default: '1em')
 *   color     — CSS color or var() (default: var(--yellow-40))
 *   glow      — boolean, adds a pulsing yellow glow (default: false)
 *   className — extra class names
 *   style     — inline styles
 */

import styles from './StarIcon.module.css'

export default function StarIcon({
  size      = '1em',
  color     = 'var(--yellow-40)',
  glow      = false,
  className = '',
  style     = {},
  ...props
}) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.star} ${glow ? styles.glow : ''} ${className}`}
      style={{
        fontSize: size,
        color,
        ...style,
      }}
      {...props}
    >
      ✦
    </span>
  )
}