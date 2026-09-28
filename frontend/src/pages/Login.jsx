import { memo, useCallback, useId, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, AlertCircle, BookOpen } from 'lucide-react'
import logoBiru from '../assets/image/logobiru.png'
import { useAuth } from '../lib/auth.jsx'

const FieldError = memo(function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  )
})

function validate(values) {
  const errors = {}
  if (!values.email.trim()) errors.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Format email tidak valid'
  if (!values.password) errors.password = 'Password wajib diisi'
  else if (values.password.length < 6) errors.password = 'Minimal 6 karakter'
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const emailId = useId()
  const passwordId = useId()
  const emailErrorId = `${emailId}-error`
  const passwordErrorId = `${passwordId}-error`

  const [values, setValues] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState({ type: null, message: '' })
  const [submitting, setSubmitting] = useState(false)

  const isValid = useMemo(() => Object.keys(validate(values)).length === 0, [values])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (status.type) setStatus({ type: null, message: '' })
  }, [status.type])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors(validate(values))
  }, [values])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const nextErrors = validate(values)
      setErrors(nextErrors)
      setTouched({ email: true, password: true })
      if (Object.keys(nextErrors).length > 0) return

      setSubmitting(true)
      setStatus({ type: null, message: '' })
      try {
        await login({ email: values.email.trim(), password: values.password })
        setStatus({ type: 'success', message: 'Login berhasil. Mengalihkan...' })
        setTimeout(() => navigate('/', { replace: true }), 600)
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Email atau password salah'
        setStatus({ type: 'error', message })
      } finally {
        setSubmitting(false)
      }
    },
    [login, navigate, values]
  )

  return (
    <div className="flex min-h-[100svh] flex-col bg-[#F4F9FF] font-poppins">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[72px]">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoBiru} alt="SIMPUS SATAK" className="h-8 w-auto sm:h-10" />
            <span className="hidden font-['Poppins'] text-sm font-bold text-[#0B2960] sm:block sm:text-base">SIMPUS SATAK</span>
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-[44px] touch-manipulation items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#0B2960] transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </header>

      <main className="container-page flex flex-1 items-center justify-center py-8 sm:py-10">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
          <div className="hidden w-[46%] flex-col justify-between bg-[#0B78E3] p-8 text-white lg:flex">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <BookOpen className="h-5 w-5" />
              </span>
              <p className="font-bold">SIMPUS SATAK</p>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold leading-tight">Selamat Datang Kembali</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Masuk untuk mengelola peminjaman, melihat riwayat, dan menjelajahi ribuan koleksi perpustakaan.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/90">
                <li>• Akses katalog lengkap & status stok real-time</li>
                <li>• Riwayat peminjaman & perpanjangan mandiri</li>
                <li>• Notifikasi jatuh tempo & denda</li>
              </ul>
            </div>
            <p className="text-xs text-white/60">© {new Date().getFullYear()} SIMPUS SATAK. Seluruh hak cipta dilindungi.</p>
          </div>

          <div className="flex w-full flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="mx-auto w-full max-w-md">
              <div className="lg:hidden">
                <h1 className="text-2xl font-extrabold text-navy-900">Masuk Akun</h1>
                <p className="mt-1 text-sm text-slate-copy">Gunakan email terdaftar untuk melanjutkan.</p>
              </div>
              <div className="hidden lg:block">
                <h2 className="text-2xl font-extrabold text-navy-900">Masuk</h2>
                <p className="mt-1 text-sm text-slate-copy">Masukkan kredensial Anda dengan aman.</p>
              </div>

              {status.type && (
                <div
                  role="alert"
                  className={`mt-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${status.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}
                >
                  {status.type === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />}
                  <span className="break-words">{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div>
                  <label htmlFor={emailId} className="text-sm font-semibold text-navy-900">
                    Email
                  </label>
                  <div className={`mt-1.5 flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 transition ${touched.email && errors.email ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-[#0B78E3] focus-within:ring-2 focus-within:ring-blue-100'}`}>
                    <Mail className="h-4 w-4 shrink-0 text-slate-copy" />
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      enterKeyHint="next"
                      placeholder="nama@sekolah.sch.id"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby={touched.email && errors.email ? emailErrorId : undefined}
                      className="min-w-0 w-full bg-transparent text-[16px] text-navy-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
                    />
                  </div>
                  {touched.email && <FieldError id={emailErrorId} message={errors.email} />}
                </div>

                <div>
                  <label htmlFor={passwordId} className="text-sm font-semibold text-navy-900">
                    Password
                  </label>
                  <div className={`mt-1.5 flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 transition ${touched.password && errors.password ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-[#0B78E3] focus-within:ring-2 focus-within:ring-blue-100'}`}>
                    <Lock className="h-4 w-4 shrink-0 text-slate-copy" />
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      enterKeyHint="done"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.password && errors.password)}
                      aria-describedby={touched.password && errors.password ? passwordErrorId : undefined}
                      className="min-w-0 w-full bg-transparent text-[16px] text-navy-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-pressed={showPassword}
                      className="flex min-h-[32px] min-w-[32px] touch-manipulation items-center justify-center rounded-lg text-slate-copy transition hover:bg-slate-100 hover:text-navy-900"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.password && <FieldError id={passwordErrorId} message={errors.password} />}
                </div>

                <label className="flex cursor-pointer items-center gap-2 py-1">
                  <input
                    name="remember"
                    type="checkbox"
                    checked={values.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-[#0B78E3] focus:ring-[#0B78E3]"
                  />
                  <span className="text-sm font-medium text-navy-900">Ingat saya</span>
                </label>

                <button
                  type="submit"
                  disabled={submitting || !isValid}
                  aria-busy={submitting}
                  className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-[#0B78E3] px-6 text-[16px] font-bold text-white shadow-md transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B78E3] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </button>

                <p className="text-center text-xs text-slate-copy sm:text-sm">
                  Belum punya akun?{' '}
                  <span className="font-semibold text-[#0B78E3]">Hubungi pustakawan</span>
                </p>
              </form>

              <p className="mt-6 text-center text-xs text-slate-copy">
                Dengan masuk, Anda menyetujui kebijakan privasi perpustakaan.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
