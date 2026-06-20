import './Checkout.css'

function Checkout() {

  return (

    <div className="checkout-container">

      <div className="checkout-form">

        <h1>Checkout</h1>

        <input type="text" placeholder="Full Name" />

        <input type="text" placeholder="Phone Number" />

        <input type="email" placeholder="Email Address" />

        <textarea placeholder="Full Address"></textarea>

        <div className="row">

          <input type="text" placeholder="City" />

          <input type="text" placeholder="State" />

        </div>

        <input type="text" placeholder="Pincode" />

        <button>

          Place Order

        </button>

      </div>

      <div className="order-summary">

        <h2>Order Summary</h2>

        <div className="summary-row">

          <span>Subtotal</span>

          <span>₹599</span>

        </div>

        <div className="summary-row">

          <span>Shipping</span>

          <span>Free</span>

        </div>

        <div className="summary-row total">

          <span>Total</span>

          <span>₹599</span>

        </div>

      </div>

    </div>

  )

}

export default Checkout