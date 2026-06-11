import './Navbar.css'

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
        <button>🛒</button>
        <button>Login</button>
      </div>

    </nav>
  )
}

export default Navbar