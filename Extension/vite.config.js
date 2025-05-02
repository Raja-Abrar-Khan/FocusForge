import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'src/manifest.json', dest: '.' },
        { src: 'src/assets', dest: '.' },
        { src: 'src/content.js', dest: '.' },
        { src: 'src/background.js', dest: '.' },
        { src: 'src/popup/index.html', dest: 'popup' },
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.jsx',   // <--- Change here: input is popup.jsx
      },
      output: {
        entryFileNames: 'popup/[name].js',
        assetFileNames: 'popup/[name].[ext]',
        chunkFileNames: 'popup/[name].js',
      }
    }
  }
})