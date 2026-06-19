import './ProductCard.css'

import { Link }

from 'react-router-dom'


function ProductCard({ product }) {

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

        <h2>

          {product.name}

        </h2>

        <p>

          ₹{product.price}

        </p>

      </div>

    </Link>

  )

}


export default ProductCard