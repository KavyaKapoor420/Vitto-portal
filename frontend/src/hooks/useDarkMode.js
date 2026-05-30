import { useState, useEffect } from 'react'

export function useDarkMode() {
  // Read from localStorage or default to system preference
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('vitto-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Add/remove .dark on <html> — this is what Tailwind's darkMode:'class' reads
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('vitto-theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, setDark]
}
