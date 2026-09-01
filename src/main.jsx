import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker to enable PWA offline features & install prompts
serviceWorkerRegistration.register();