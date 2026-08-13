import { createContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.log(error)
      }

      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    return { data, error }
  }

  async function login(email, password) {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    return { data, error }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}