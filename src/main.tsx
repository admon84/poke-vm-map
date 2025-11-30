import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Set favicon dynamically to work with base URL in dev and production
const faviconLink = document.getElementById('favicon') as HTMLLinkElement
if (faviconLink) {
  faviconLink.href = `${import.meta.env.BASE_URL}favicon.ico`
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
