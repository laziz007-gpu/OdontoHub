import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './Routes/index'      // ✅ SHU YO‘Q EDI
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)
