import { useContext,useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Login.css'

function Signup(){
  const { signUp }=useContext(AuthContext)
  const navigate=useNavigate()
  const [fullName,setFullName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [loading,setLoading]=useState(false)

  async function handleSignup(e){
    e.preventDefault()
    setError('')
    setMessage('')

    if(password!==confirmPassword){
      setError('Passwords do not match.')
      return
    }

    if(password.length<8){
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const {data,error}=await signUp(email,password,fullName)

    if(error){
      setError(error.message)
      setLoading(false)
      return
    }

    if(data.user&&!data.session){
      setMessage('Account created. Please check your email to verify your account before logging in.')
      setLoading(false)
      return
    }

    navigate('/')
  }

  return(
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your Sutrā account.
        </p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e)=>setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />

          {error&&(
            <p className="auth-error">
              {error}
            </p>
          )}

          {message&&(
            <p className="auth-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading?'Creating Account...':'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup