import './Navbar.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import { WishlistContext } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import logo from '../assets/images/sutra-logo.png'

function Navbar() {

  const { wishlist } = useContext(WishlistContext)
  const { cart } = useContext(CartContext)

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (

    <nav className="navbar">

      <Link to="/" className="logo">

      <img
        src={logo}
        alt="Sutrā"
      />

      </Link>

      <input
        type="text"
        placeholder="Search jewellery..."
        className="search-bar"
      />

      <div className="nav-icons">

        <Link to="/wishlist" className="icon-btn">

          <FiHeart />

          {

            wishlist.length > 0 &&

            <span className="badge">

              {wishlist.length}

            </span>

          }

        </Link>

        <Link to="/cart" className="icon-btn">

          <FiShoppingBag />

          {

            cartCount > 0 &&

            <span className="badge">

              {cartCount}

            </span>

          }

        </Link>

        <button className="login-btn">

          Login

        </button>

      </div>

    </nav>

  )

}

export default Navbar