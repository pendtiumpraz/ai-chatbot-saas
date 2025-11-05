'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-lg glass-card hover:scale-110 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
    </button>
  )
}
