import { useEffect } from 'react'
import { ThemeProvider } from '@/components/Theme/ThemeContext'
import { SparkleProvider } from '@/components/Sparkle/SparkleContext'
import { ScoreProvider, useScore } from '@/components/Score/ScoreContext'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'
import Footer from '@/components/Footer/Footer'
import SurpriseClouds from '@/components/SurpriseClouds/SurpriseClouds'

const TOTAL_SCORE = 100

function CloudsWhenComplete() {
  const { score, addScore } = useScore()

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        const needed = TOTAL_SCORE - score
        if (needed > 0) addScore(needed)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [score, addScore])

  return score >= TOTAL_SCORE ? <SurpriseClouds seed={1} /> : null
}

export default function App() {
  return (
    <ThemeProvider>
    <SparkleProvider>
      <ScoreProvider>
        <CloudsWhenComplete />

        <Navbar />

        <main>
          <section id="home">
            <Hero />
          </section>

          <section id="about">
            <About />
          </section>

          <section id="projects">
            <Projects />
          </section>

          <section id="skills">
            <Skills />
          </section>
        </main>

        <Footer />
      </ScoreProvider>
    </SparkleProvider>
    </ThemeProvider>
  )
}
