import { Routes, Route } from 'react-router-dom'
import WhatsAppChat from './pages/WhatsAppChat'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<WhatsAppChat />} />
    </Routes>
  )
}

export default App
