
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import { CartContext } from '../context/CartContext'
import './Cart.css'

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeItem
  } = useContext(CartContext)

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )

  const originalTotal = cart.reduce(
    (sum, item) => sum + (item.original_price * item.quantity),
    0
  )

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const saved = originalTotal - total

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-box">
          <div className="empty-icon">
            <FiShoppingBag />
          </div>

          <h1>Your Sutrā Bag is Empty</h1>

          <p>
            Looks like you haven't added any handcrafted jewellery yet.
          </p>

          <Link to="/" className="cart-shop-link">
            <button className="shop-btn">
              Explore Collection
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-layout">
      <div className="cart-left">
        <h1>My Cart</h1>

        <div className="cart-products-scroll">
          {cart.map((item) => {
            const discount = item.original_price
              ? Math.round(
                  ((item.original_price - item.price) /
                    item.original_price) * 100
                )
              : 0

            return (
              <div className="cart-card" key={item.id}>
                <img
                  className="cart-product-image"
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-info">
                  <div className="cart-details">
                    <h2>{item.name}</h2>

                    {item.description && (
                      <p className="description">
                        {item.description}
                      </p>
                    )}

                    <div className="quantity-box">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-actions">
                    <div className="price-box">
                      <span className="old-price">
                        ₹{item.original_price}
                      </span>

                      <span className="new-price">
                        ₹{item.price}
                      </span>

                      <span className="discount">
                        {discount}% OFF
                      </span>
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="cart-right">
        <div className="summary">
          <h2>Order Summary</h2>

          <div className="bill-row big-row">
            <span>Items ({totalItems})</span>
            <span>₹{originalTotal}</span>
          </div>

          {cart.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹{item.original_price * item.quantity}
              </span>
            </div>
          ))}

          <hr />

          <div className="bill-row">
            <span>Discount</span>
            <span className="saved">- ₹{saved}</span>
          </div>

          <div className="bill-row">
            <span>Shipping</span>
            <span className="free">FREE</span>
          </div>

          <hr />

          <div className="grand-total">
            <span>Grand Total</span>
            <span>₹{total}</span>
          </div>

          <p className="saved-message">
            You Saved ₹{saved} 🎉
          </p>

          <Link to="/checkout" className="cart-checkout-link">
            <button className="checkout-btn">
              Proceed To Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
