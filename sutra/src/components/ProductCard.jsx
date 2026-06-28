import './ProductCard.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { WishlistContext } from '../context/WishlistContext'
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

function ProductCard({ product }) {

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist
  } = useContext(WishlistContext)

  const isWishlisted = wishlist.some(item => item.id === product.id)

  const discount = Math.round(
    ((product.original_price - product.price) / product.original_price) * 100
  )

  function handleWishlist(e) {

    e.preventDefault()

    if (isWishlisted) {

      removeFromWishlist(product.id)

    } else {

      addToWishlist(product)

    }

  }

  return (

    <div className="product-card">

      <button
        className="wishlist-btn"
        onClick={handleWishlist}
      >

        {

          isWishlisted ?

          <FaHeart className="heart-filled" />

          :

          <FiHeart className="heart-outline" />

        }

      </button>

      <Link
        to={`/product/${product.id}`}
        className="product-link"
      >

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

      </Link>

    </div>

  )

}

export default ProductCard