import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'

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

          </Routes>

        </BrowserRouter>

      </CartProvider>

    </WishlistProvider>

  )

}

export default App