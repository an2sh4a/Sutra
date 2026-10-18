
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiPackage, FiHeart, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import './Profile.css'

function Profile() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()

      if (!cancelled) {
        if (error) {
          console.error('Could not fetch profile:', error)
        }

        setFullName(data?.full_name || user.user_metadata?.full_name || '')
        setLoading(false)
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [user])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  if (!user) {
    return (
      <main className="profile-page">
        <section className="profile-message">
          <h1>Sign in to view your profile</h1>
          <p>Your account details and orders will appear here.</p>
          <button onClick={() => navigate('/login')}>
            Login
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <header className="profile-heading">
        <span className="profile-eyebrow">YOUR SUTRĀ ACCOUNT</span>
        <h1>My Profile</h1>
      </header>

      <section className="profile-card">
        <div className="profile-avatar">
          <FiUser />
        </div>

        <div className="profile-identity">
          <h2>{fullName || 'Welcome to Sutrā'}</h2>
          <p>{user.email}</p>
        </div>
      </section>

      <section className="profile-section">
        <h2>Account Details</h2>

        <div className="profile-detail">
          <span>Full name</span>
          <strong>{loading ? 'Loading...' : fullName || 'Not added yet'}</strong>
        </div>

        <div className="profile-detail">
          <span>Email address</span>
          <strong>{user.email}</strong>
        </div>
      </section>

      <section className="profile-section profile-links">
        <h2>Your Account</h2>

        <Link to="/orders" className="profile-link">
          <FiPackage />
          <span>
            <strong>My Orders</strong>
            <small>View your orders and their status</small>
          </span>
        </Link>

        <Link to="/wishlist" className="profile-link">
          <FiHeart />
          <span>
            <strong>My Wishlist</strong>
            <small>View your saved jewellery</small>
          </span>
        </Link>
      </section>

      <button className="profile-logout" onClick={handleLogout}>
        <FiLogOut />
        Logout
      </button>
    </main>
  )
}

export default Profile
