import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SearchProvider } from './context/SearchContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'

function App() {

  return (
    <AuthProvider>

      <WishlistProvider>

      <CartProvider>

        <SearchProvider>

        <BrowserRouter>

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/success"
              element={<OrderSuccess />}
            />

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

          </Routes>

        </BrowserRouter>

        </SearchProvider>

      </CartProvider>

    </WishlistProvider>

    </AuthProvider>
  )

}

export default App