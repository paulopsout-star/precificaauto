import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Precificador from './pages/Precificador'
import Checklist from './pages/Checklist'
import Buscador from './pages/Buscador'
import Rede from './pages/Rede'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/precificador" element={<Precificador />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/buscador" element={<Buscador />} />
      <Route path="/rede" element={<Rede />} />
    </Routes>
  )
}

export default App
