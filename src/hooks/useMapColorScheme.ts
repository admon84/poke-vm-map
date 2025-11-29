import { useState, useEffect } from 'react'
import { ColorScheme } from '@vis.gl/react-google-maps'

type ColorSchemePreference = 'LIGHT' | 'DARK' | 'FOLLOW_SYSTEM'

/**
 * Hook to manage map color scheme preference
 * Supports: Light, Dark, and System (follows device preference)
 */
export function useMapColorScheme() {
  const [preference, setPreference] = useState<ColorSchemePreference>(() => {
    // Load from localStorage or default to FOLLOW_SYSTEM
    const saved = localStorage.getItem('mapColorScheme')
    return (saved as ColorSchemePreference) || 'FOLLOW_SYSTEM'
  })

  const [effectiveScheme, setEffectiveScheme] = useState<ColorScheme>(
    ColorScheme.LIGHT
  )

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('mapColorScheme', preference)

    // Determine the effective scheme
    if (preference === 'LIGHT') {
      setEffectiveScheme(ColorScheme.LIGHT)
    } else if (preference === 'DARK') {
      setEffectiveScheme(ColorScheme.DARK)
    } else {
      // FOLLOW_SYSTEM - check device preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setEffectiveScheme(isDark ? ColorScheme.DARK : ColorScheme.LIGHT)
    }
  }, [preference])

  useEffect(() => {
    // Listen for system preference changes when in FOLLOW_SYSTEM mode
    if (preference === 'FOLLOW_SYSTEM') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveScheme(e.matches ? ColorScheme.DARK : ColorScheme.LIGHT)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [preference])

  return {
    preference,
    effectiveScheme,
    setPreference
  }
}

