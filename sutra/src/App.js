import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import AdminDashboard from './pages/AdminDashboard'

function App() {

  return (

    <WishlistProvider>

      <CartProvider>

        <BrowserRouter>

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
            path="/success"
            element={<OrderSuccess />}
            />

            <Route
            path="/admin"
            element={<AdminDashboard />}
            />

          </Routes>

        </BrowserRouter>

      </CartProvider>

    </WishlistProvider>

  )

}

export default App