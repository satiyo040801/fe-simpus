import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth.jsx'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))

// Admin Components
const AdminLayout = lazy(() => import('./admin/components/AdminLayout.jsx'))
const Dashboard = lazy(() => import('./pages/pages_admin/Dashboard.jsx'))
const Buku = lazy(() => import('./pages/pages_admin/Buku.jsx'))
const Anggota = lazy(() => import('./pages/pages_admin/Anggota.jsx'))
const Sirkulasi = lazy(() => import('./pages/pages_admin/Sirkulasi.jsx'))
const Denda = lazy(() => import('./pages/pages_admin/Denda.jsx'))
const Laporan = lazy(() => import('./pages/pages_admin/Laporan.jsx'))
const Pengaturan = lazy(() => import('./pages/pages_admin/Pengaturan.jsx'))

function Fallback() {
  return (
    <div className="flex min-h-screen items-center justify-center font-poppins text-sm text-slate-500">
      Memuat...
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="buku" element={<Buku />} />
            <Route path="anggota" element={<Anggota />} />
            <Route path="sirkulasi" element={<Sirkulasi />} />
            <Route path="denda" element={<Denda />} />
            <Route path="laporan" element={<Laporan />} />
            <Route path="pengaturan" element={<Pengaturan />} />
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
