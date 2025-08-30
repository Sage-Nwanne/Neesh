import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'

// Redirect Firebase default domains to custom domain
const currentHost = window.location.hostname;
const allowedDomains = ['neesh.art', 'www.neesh.art', 'localhost', '127.0.0.1'];

if (!allowedDomains.includes(currentHost)) {
  // Redirect to custom domain, preserving the path and query parameters
  const newUrl = `https://neesh.art${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(newUrl);
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
