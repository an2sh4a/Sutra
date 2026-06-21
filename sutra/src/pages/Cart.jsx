import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import './Cart.css'
import { Link } from 'react-router-dom'

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

  return (

    <div className="cart-container">

      <h1>My Cart</h1>

      {

        cart.length === 0 ?

        <p className="empty-cart">

          Your cart is empty

        </p>

        :

        <>

          {

            cart.map((item) => (

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

                      ₹{item.price + 100}

                    </span>

                    <span className="new-price">

                      ₹{item.price}

                    </span>

                    <span className="discount">

                      22% OFF

                    </span>

                  </div>

                  <p className="item-total">

                    Item Total : ₹{item.price * item.quantity}

                  </p>

                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      -
                    </button>

                    <span>

                      {item.quantity}

                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
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

            ))

          }

          <div className="summary">

          <h2 className="summary-title">

          Order Summary

          </h2>

          <div className="summary-row">

          <span>

          Items (

          {

          cart.reduce(

          (sum,item)=>sum+item.quantity,

          0

          )

          }

          )

          </span>

          <span>

          ₹{total}

          </span>

          </div>

          <div className="summary-row">

          <span>

          Shipping

          </span>

          <span className="free">

          FREE

          </span>

          </div>

          <div className="summary-row">

          <span>

          Discount

          </span>

          <span className="saved">

          - ₹{cart.length * 100}

          </span>

          </div>

          <hr />

          <div className="grand-total">

          <span>

          Grand Total

          </span>

          <span>

          ₹{total}

          </span>

          </div>

          <p className="saved-message">

          You Saved ₹{cart.length * 100} 🎉

          </p>

          <Link to="/checkout">

          <button className="checkout-btn">

          Proceed To Checkout

          </button>

          </Link>

          </div>

        </>

      }

    </div>

  )

}

export default Cart