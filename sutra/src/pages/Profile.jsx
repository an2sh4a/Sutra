
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiEdit2,
  FiX,
  FiCheck
} from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import './Profile.css'

function Profile() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .maybeSingle()

      if (cancelled) return

      if (error) {
        console.error('Could not fetch profile:', error)
        setErrorMessage('Unable to load your profile details.')
      }

      const name =
        data?.full_name ||
        user.user_metadata?.full_name ||
        ''

      const phoneNumber = data?.phone || ''

      setFullName(name)
      setPhone(phoneNumber)
      setFormName(name)
      setFormPhone(phoneNumber)
      setLoading(false)
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [user])

  function startEditing() {
    setFormName(fullName)
    setFormPhone(phone)
    setMessage('')
    setErrorMessage('')
    setEditing(true)
  }

  function cancelEditing() {
    setFormName(fullName)
    setFormPhone(phone)
    setEditing(false)
    setMessage('')
    setErrorMessage('')
  }

  async function handleSave(e) {
    e.preventDefault()

    if (!user || saving) return

    const trimmedName = formName.trim()
    const trimmedPhone = formPhone.trim()

    if (!trimmedName) {
      setErrorMessage('Please enter your name.')
      return
    }

    if (trimmedPhone && !/^[+()\d\s-]{7,20}$/.test(trimmedPhone)) {
      setErrorMessage('Please enter a valid phone number.')
      return
    }

    setSaving(true)
    setMessage('')
    setErrorMessage('')

    try {
      const { data: existingProfile, error: fetchError } =
        await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

      if (fetchError) throw fetchError

      let saveError

      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: trimmedName,
            phone: trimmedPhone || null
          })
          .eq('id', user.id)

        saveError = error
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: trimmedName,
            phone: trimmedPhone || null
          })

        saveError = error
      }

      if (saveError) throw saveError

      const { error: authUpdateError } =
        await supabase.auth.updateUser({
          data: {
            full_name: trimmedName
          }
        })

      if (authUpdateError) {
        console.error(
          'Profile saved, but authentication metadata could not be updated:',
          authUpdateError
        )
      }

      setFullName(trimmedName)
      setPhone(trimmedPhone)
      setEditing(false)
      setMessage('Your profile has been updated.')
    } catch (error) {
      console.error('Could not save profile:', error)
      setErrorMessage(
        error.code === '42501'
          ? 'You do not have permission to update this profile. Please check your Supabase policies.'
          : error.message ||
            'Unable to save your profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

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
        <span className="profile-eyebrow">
          YOUR SUTRĀ ACCOUNT
        </span>
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
        <div className="profile-section-heading">
          <h2>Account Details</h2>

          {!editing && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={startEditing}
              disabled={loading}
            >
              <FiEdit2 />
              Edit Profile
            </button>
          )}
        </div>

        {loading ? (
          <p className="profile-status">Loading your details...</p>
        ) : editing ? (
          <form
            className="profile-edit-form"
            onSubmit={handleSave}
          >
            <div className="profile-form-group">
              <label htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="profile-email">Email address</label>
              <input
                id="profile-email"
                type="email"
                value={user.email || ''}
                readOnly
                disabled
              />
              <small>
                Email changes are not available here.
              </small>
            </div>

            <div className="profile-form-group">
              <label htmlFor="profile-phone">Phone number</label>
              <input
                id="profile-phone"
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="Enter your phone number"
                maxLength={20}
              />
            </div>

            {errorMessage && (
              <p className="profile-feedback error" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={cancelEditing}
                disabled={saving}
              >
                <FiX />
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                <FiCheck />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-detail">
              <span>Full name</span>
              <strong>{fullName || 'Not added yet'}</strong>
            </div>

            <div className="profile-detail">
              <span>Email address</span>
              <strong>{user.email}</strong>
            </div>

            <div className="profile-detail">
              <span>Phone number</span>
              <strong>{phone || 'Not added yet'}</strong>
            </div>
          </>
        )}
      </section>

      {message && (
        <p className="profile-feedback success" role="status">
          {message}
        </p>
      )}

      {!editing && errorMessage && (
        <p className="profile-feedback error" role="alert">
          {errorMessage}
        </p>
      )}

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

      <button
        className="profile-logout"
        onClick={handleLogout}
      >
        <FiLogOut />
        Logout
      </button>
    </main>
  )
}

export default Profile
