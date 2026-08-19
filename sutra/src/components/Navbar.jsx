import './Navbar.css'
import { Link,useNavigate } from 'react-router-dom'
import { useContext,useState } from 'react'
import { FiHeart,FiShoppingBag,FiUser } from 'react-icons/fi'
import { WishlistContext } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import { SearchContext } from '../context/SearchContext'
import { AuthContext } from '../context/AuthContext'
import logo from '../assets/images/sutra-logo.png'

function Navbar(){
  const navigate=useNavigate()
  const { wishlist }=useContext(WishlistContext)
  const { cart }=useContext(CartContext)
  const { setSearch }=useContext(SearchContext)
  const { user,logout }=useContext(AuthContext)
  const [input,setInput]=useState('')
  const [accountOpen,setAccountOpen]=useState(false)

  const cartCount=cart.reduce(
    (sum,item)=>sum+item.quantity,
    0
  )

  function handleSearch(e){
    if(e.key==="Enter"){
      setSearch(input)
      navigate("/",{
        state:{
          scrollToProducts:true
        }
      })
    }
  }

  function handleLogoClick(){
    setSearch("")
    setInput("")
    navigate("/")
  }

  async function handleLogout(){
    setAccountOpen(false)
    await logout()
    navigate("/")
  }

  return(
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt="Sutrā"
        />
      </Link>

      <input
        type="text"
        placeholder="Search jewellery..."
        className="search-bar"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        onKeyDown={handleSearch}
      />

      <div className="nav-icons">
        <Link
          to="/wishlist"
          className="icon-btn"
        >
          <FiHeart />

          {
            wishlist.length>0 &&
            <span className="badge">
              {wishlist.length}
            </span>
          }
        </Link>

        <Link
          to="/cart"
          className="icon-btn"
        >
          <FiShoppingBag />

          {
            cartCount>0 &&
            <span className="badge">
              {cartCount}
            </span>
          }
        </Link>

        {
          user ? (
            <div className="account-wrapper">
              <button
                className="account-btn"
                onClick={()=>
                  setAccountOpen(!accountOpen)
                }
              >
                <FiUser />
                <span>Account</span>
              </button>

              {
                accountOpen &&
                <div className="account-dropdown">
                  <button
                    onClick={()=>{
                      setAccountOpen(false)
                      navigate('/orders')
                    }}
                  >
                    My Orders
                  </button>

                  <button
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              }
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={()=>navigate('/login')}
            >
              Login
            </button>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar