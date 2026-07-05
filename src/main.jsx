import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Roster from './Roster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Roster />
  </StrictMode>,
)
