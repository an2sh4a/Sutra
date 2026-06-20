import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar({ search, setSearch }) {

  return (
    <nav className="navbar">

      <div className="logo">
        Sutrā
      </div>

      <input
        type="text"
        placeholder="Search jewellery..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="nav-icons">

        <Link to="/wishlist" className="wishlist-icon">
          ♡
        </Link>

        <Link to="/cart" className="cart-link">
          🛒
        </Link>

        <button className="login-btn">
          Login
        </button>

      </div>

    </nav>
  )

}

export default Navbar