import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Infosys_CivicPulse-Hub-Unified-Smart-City-Feedback-and-Redressal-System/',
})
