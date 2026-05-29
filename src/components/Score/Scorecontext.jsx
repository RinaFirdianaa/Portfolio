/**
 * ScoreContext.jsx
 * Global score state shared between Hero (triggers) and Navbar (displays).
 */

import { createContext, useContext, useState, useCallback } from 'react'

const ScoreCtx = createContext(null)

export function useScore() {
  return useContext(ScoreCtx)
}

export function ScoreProvider({ children }) {
  const [score, setScore] = useState(0)

  const addScore = useCallback((points) => {
    setScore(prev => prev + points)
  }, [])

  return (
    <ScoreCtx.Provider value={{ score, addScore }}>
      {children}
    </ScoreCtx.Provider>
  )
}