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
        onChange={(e)=>setSearch(e.target.value)}
      />

      <div className="nav-icons">

        <button>♡</button>

        <Link to="/cart" className="cart-link">
          🛒
        </Link>

        <button>Login</button>

      </div>

    </nav>

  )

}

export default Navbar