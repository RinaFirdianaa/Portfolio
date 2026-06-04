import { useState } from 'react'
import { SparkleProvider } from '@/components/Sparkle/SparkleContext'
import { ScoreProvider } from '@/components/Score/ScoreContext'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'
import Footer from '@/components/Footer/Footer'
import SurpriseClouds from '@/components/SurpriseClouds/SurpriseClouds'

export default function App() {
  const [surpriseCloudSeed, setSurpriseCloudSeed] = useState(null)

  const handleSurpriseClick = () => {
    setSurpriseCloudSeed(Date.now())
  }

  return (
    <SparkleProvider>
      <ScoreProvider>
        {surpriseCloudSeed ? <SurpriseClouds seed={surpriseCloudSeed} /> : null}

        <Navbar onSurpriseClick={handleSurpriseClick} />

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
  )
}
