import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const Landing = lazy(() => import('./pages/Landing.jsx'))

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Memuat...</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Suspense>
  )
}
