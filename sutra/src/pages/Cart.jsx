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

          <Link to="/">

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

        {

          cart.map((item) => {

            const discount = Math.round(
              ((item.original_price - item.price) /
              item.original_price) * 100
            )

            return (

              <div className="cart-card" key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-info">

                  <h2>{item.name}</h2>

                  <p className="description">

                    {item.description}

                  </p>

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

                  <p className="item-total">

                    Item Total : ₹{item.price * item.quantity}

                  </p>

                  <div className="quantity-box">

                    <button onClick={() => decreaseQuantity(item.id)}>-</button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id)}>+</button>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >

                    Remove

                  </button>

                  <p className="delivery">

                    🚚 Free Delivery

                  </p>

                  <p className="delivery-date">

                    Delivery by 28 June

                  </p>

                </div>

              </div>

            )

          })

        }

      </div>

      <div className="cart-right">

        <div className="summary">

          <h2>Order Summary</h2>

          <div className="bill-row big-row">

            <span>Items ({totalItems})</span>

            <span>₹{originalTotal}</span>

          </div>

          {

            cart.map(item => (

              <div
                className="summary-item"
                key={item.id}
              >

                <span>{item.name} × {item.quantity}</span>

                <span>₹{item.original_price * item.quantity}</span>

              </div>

            ))

          }

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

          <Link to="/checkout">

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