import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ApplyPage from './pages/ApplyPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const [dark, setDark] = useDarkMode()

  return (
    <BrowserRouter>
      {/* Navbar always visible at top */}
      <Navbar dark={dark} setDark={setDark} />

      {/* Page content */}
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/apply"     element={<ApplyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
