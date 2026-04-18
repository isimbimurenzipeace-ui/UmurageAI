import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profileType, setProfileType] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfileType(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setProfileType(data.profile_type)
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    })
    if (error) throw error
    return data
  }

  const signup = async (email, password, name, type) => {
    const { data, error } = await supabase.auth.signUp({
      email, password
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        profile_type: type,
      })

      await supabase.from('notifications').insert({
        user_id: data.user.id,
        title: 'Welcome to UmurageAI! 🌳',
        message: `Welcome ${name}! Start by recording your first story or exploring the community.`,
        type: 'welcome',
      })
    }
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfileType(null)
  }

  return (
    <AuthContext.Provider value={{
      user, profileType, loading, login, signup, logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
