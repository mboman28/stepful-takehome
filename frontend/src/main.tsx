import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </HashRouter>
  </StrictMode>,
)
