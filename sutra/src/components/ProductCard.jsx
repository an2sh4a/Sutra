
import './ProductCard.css'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { WishlistContext } from '../context/WishlistContext'
import { AuthContext } from '../context/AuthContext'
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useContext(WishlistContext)

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  )

  const price = Number(product.price)
  const originalPrice = Number(product.original_price)

  const hasDiscount =
    Number.isFinite(price) &&
    Number.isFinite(originalPrice) &&
    originalPrice > price &&
    originalPrice > 0

  const discount = hasDiscount
    ? Math.round(
        ((originalPrice - price) / originalPrice) * 100
      )
    : 0

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <article className="product-card">
      <button
        type="button"
        className="wishlist-btn"
        onClick={handleWishlist}
        aria-label={
          isWishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={isWishlisted}
      >
        {isWishlisted ? (
          <FaHeart className="heart-filled" />
        ) : (
          <FiHeart className="heart-outline" />
        )}
      </button>

      <Link
        to={`/product/${product.id}`}
        className="product-link"
      >
        <div className="product-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        </div>

        <div className="product-card-details">
          <h2 title={product.name}>
            {product.name}
          </h2>

          <div className="product-card-prices">
            {hasDiscount && (
              <span className="product-card-old-price">
                ₹{originalPrice}
              </span>
            )}

            <span className="product-card-new-price">
              ₹{Number.isFinite(price) ? price : product.price}
            </span>

            {hasDiscount && (
              <span className="product-card-discount">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
