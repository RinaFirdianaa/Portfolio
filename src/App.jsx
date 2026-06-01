import { SparkleProvider } from '@/components/Sparkle/SparkleContext'
import { ScoreProvider } from '@/components/Score/ScoreContext'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'
import Footer from '@/components/Footer/Footer'

export default function App() {
  return (
    <SparkleProvider>
      <ScoreProvider>
        <Navbar />

        <main>
          <section id="home">
            <Hero />
          </section>

          <section id="about">
            <About />
          </section>

          <section id="skills">
            <Skills />
          </section>

          <section id="projects">
            <Projects />
          </section>
        </main>

        <Footer />
      </ScoreProvider>
    </SparkleProvider>
  )
}
