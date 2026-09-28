import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AuthService } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const token = localStorage.getItem('simpus_token')
    if (!token) {
      setLoading(false)
      return
    }
    AuthService.me()
      .then((res) => {
        if (mounted) setUser(res.data?.data ?? res.data ?? null)
      })
      .catch(() => {
        localStorage.removeItem('simpus_token')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await AuthService.login(credentials)
    const payload = res.data?.data ?? res.data ?? {}
    const token = payload.token ?? payload.access_token
    const account = payload.user ?? payload.account ?? null
    if (token) localStorage.setItem('simpus_token', token)
    if (account) setUser(account)
    return payload
  }, [])

  const logout = useCallback(async () => {
    try {
      await AuthService.logout()
    } catch {
      // abaikan, token lokal tetap dihapus
    } finally {
      localStorage.removeItem('simpus_token')
      setUser(null)
    }
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
