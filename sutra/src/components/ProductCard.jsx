import './ProductCard.css'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {

  const discount = Math.round(
    ((product.original_price - product.price) / product.original_price) * 100
  )

  return (

    <Link
      to={`/product/${product.id}`}
      className="product-link"
    >

      <div className="product-card">

        <img
          src={product.image}
          alt={product.name}
        />

        <h2>{product.name}</h2>

        <div className="price-box">

          <span className="old-price">

            ₹{product.original_price}

          </span>

          <span className="new-price">

            ₹{product.price}

          </span>

          <span className="discount">

            {discount}% OFF

          </span>

        </div>

      </div>

    </Link>

  )

}

export default ProductCard