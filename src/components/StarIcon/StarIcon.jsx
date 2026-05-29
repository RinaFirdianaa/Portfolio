/**
 * StarIcon
 * Reusable ✦ star with optional glow and color.
 *
 * Props:
 *   size    — font size (default: '1em')
 *   color   — CSS color or var() (default: var(--yellow-40))
 *   glow    — boolean, adds a yellow glow (default: false)
 *   className — extra class names
 *   style   — inline styles
 */

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
      className={className}
      style={{
        display:    'inline-block',
        fontSize:   size,
        color,
        filter: glow
          ? `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 10px ${color})`
          : 'none',
        lineHeight: 1,
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      ✦
    </span>
  )
}