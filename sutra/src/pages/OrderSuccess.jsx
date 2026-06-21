import { Link } from 'react-router-dom'
import './OrderSuccess.css'

function OrderSuccess() {

  return (

    <div className="success-container">

      <div className="success-card">

        <div className="tick">

          ✓

        </div>

        <h1>

          Order Placed Successfully

        </h1>

        <p>

          Thank you for shopping with Sutrā

        </p>

        <Link to="/">

          <button>

            Continue Shopping

          </button>

        </Link>

      </div>

    </div>

  )

}

export default OrderSuccess