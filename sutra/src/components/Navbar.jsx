import './Navbar.css'
import { Link } from 'react-router-dom'

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

        <button>♡</button>

        <Link to="/cart" className="cart-btn">
          🛒
        </Link>

        <button>Login</button>

      </div>

    </nav>

  )

}

export default Navbar