import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddItem from './pages/AddItem'
import HouseholdSetup from './pages/HouseholdSetup'

function ProtectedRoute({ children }) {
  const { session, household } = useApp()
  if (session === undefined || household === undefined) return null // loading
  if (!session) return <Navigate to="/" replace />
  if (!household) return <Navigate to="/setup" replace />
  return children
}

function SetupRoute({ children }) {
  const { session, household } = useApp()
  if (session === undefined || household === undefined) return null // loading
  if (!session) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { session } = useApp()
  if (session === undefined) return null // loading
  if (session) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/setup" element={<SetupRoute><HouseholdSetup /></SetupRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
