/**
 * hooks/useScrolled.js
 * Returns true when the page has scrolled past a given threshold (default 20px).
 * Used by Navbar to apply a drop shadow on scroll.
 */

import { useState, useEffect } from 'react'

export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}
