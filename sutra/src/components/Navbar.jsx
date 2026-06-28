import './Navbar.css'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        Sutrā
      </div>

      <input
        type="text"
        placeholder="Search jewellery..."
        className="search-bar"
      />

      <div className="nav-icons">

        <button className="icon-btn">
          <FiHeart />
        </button>

        <Link to="/cart" className="icon-btn">
          <FiShoppingBag />
        </Link>

        <button className="login-btn">
          Login
        </button>

      </div>

    </nav>
  )
}

export default Navbar