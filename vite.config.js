import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const mobilePositionsFile = fileURLToPath(
  new URL('./src/constants/mobileSkillPositions.json', import.meta.url),
)
const desktopPositionsFile = fileURLToPath(
  new URL('./src/constants/desktopSkillPositions.json', import.meta.url),
)
const srcDir = fileURLToPath(new URL('./src', import.meta.url))

const expectedSkillCounts = { code: 9, tools: 4, design: 7, soft: 4 }

const isValidSkillPositions = (positions) => (
  positions
  && Object.entries(expectedSkillCounts).every(([skillId, count]) => (
    Array.isArray(positions[skillId])
    && positions[skillId].length === count
    && positions[skillId].every(({ x, y }) => (
      Number.isFinite(x) && Number.isFinite(y)
      && x >= 0 && x <= 100 && y >= 0 && y <= 100
    ))
  ))
)

const skillPositionsWriter = () => ({
  name: 'skill-positions-writer',
  configureServer(server) {
    server.middlewares.use('/__save-skill-positions', async (request, response, next) => {
      if (request.method !== 'POST') {
        next()
        return
      }

      try {
        let body = ''
        for await (const chunk of request) {
          body += chunk
          if (body.length > 64_000) throw new Error('Payload too large')
        }

        const positions = JSON.parse(body)
        if (!isValidSkillPositions(positions)) {
          response.statusCode = 400
          response.end('Invalid positions')
          return
        }

        const targetFile = request.headers['x-skill-layout'] === 'desktop'
          ? desktopPositionsFile
          : mobilePositionsFile
        const output = `${JSON.stringify(positions, null, 2)}\n`
        const current = await readFile(targetFile, 'utf8').catch(() => '')
        if (current !== output) await writeFile(targetFile, output, 'utf8')

        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ saved: true }))
      } catch {
        response.statusCode = 500
        response.end('Unable to save positions')
      }
    })
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), skillPositionsWriter()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
})
