import {
BrowserRouter,
Routes,
Route
}
from 'react-router-dom'

import { CartProvider }
from './context/CartContext'

import Home from './pages/Home'
import ProductDetails
from './pages/ProductDetails'

import Cart from './pages/Cart'

function App() {

  return (
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

      </Routes>

    </BrowserRouter>

    </CartProvider>

  )

}


export default App