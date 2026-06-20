import './ProductCard.css'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {

  return (

    <Link to={`/product/${product.id}`} className="product-link">

      <div className="product-card">

        <div className="image-container">

          <img
            src={product.image}
            alt={product.name}
          />

          <button className="wishlist-btn">
            ♡
          </button>

        </div>

        <h3>{product.name}</h3>

        <div className="price-box">

          <span className="old-price">

            ₹{product.price + 100}

          </span>

          <span className="new-price">

            ₹{product.price}

          </span>

        </div>

        <div className="rating">

          ★★★★★

        </div>

      </div>

    </Link>

  )

}

export default ProductCard