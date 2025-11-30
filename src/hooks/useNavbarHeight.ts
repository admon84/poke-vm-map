import { useState, useEffect } from 'react'

/**
 * Custom hook to dynamically measure and track the navbar height
 * This ensures panels always align correctly below the navbar on all screen sizes
 */
export function useNavbarHeight() {
  const [navbarHeight, setNavbarHeight] = useState(68) // Default fallback

  useEffect(() => {
    const updateHeight = () => {
      const navbar = document.querySelector('nav')
      if (navbar) {
        const height = navbar.offsetHeight
        setNavbarHeight(height)
        // Set CSS custom property for use in CSS if needed
        document.documentElement.style.setProperty('--navbar-height', `${height}px`)
      }
    }

    let resizeObserver: ResizeObserver | null = null

    // Initial measurement (use requestAnimationFrame to ensure DOM is ready)
    const rafId = requestAnimationFrame(() => {
      updateHeight()

      // Use ResizeObserver for more accurate tracking of navbar size changes
      const navbar = document.querySelector('nav')
      if (navbar) {
        resizeObserver = new ResizeObserver(updateHeight)
        resizeObserver.observe(navbar)
      }
    })

    // Also listen to window resize for responsive breakpoint changes
    window.addEventListener('resize', updateHeight)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateHeight)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return navbarHeight
}

