import { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { CartContext } from '../context/CartContext'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return

      if (data) {
        setProduct(data)
        setActiveImageIndex(0)
      } else {
        console.log(error)
      }
    }

    fetchProduct()

    return () => {
      cancelled = true
    }
  }, [id])

  const galleryImages = (() => {
    if (!product) return []

    const images = Array.isArray(product.images)
      ? product.images.filter(
          (image) => typeof image === 'string' && image.trim() !== ''
        )
      : []

    // Keep compatibility with products that only have the original image field.
    const allImages = images.length > 0
      ? images
      : product.image
        ? [product.image]
        : []

    return [...new Set(allImages)]
  })()

  if (!product) {
    return (
      <div className="loading-page">
        <h2>Loading Product...</h2>
      </div>
    )
  }

  const discount = product.original_price > 0
    ? Math.round(
        ((product.original_price - product.price) /
          product.original_price) *
          100
      )
    : 0

  const activeImage = galleryImages[activeImageIndex] || product.image

  function showPreviousImage() {
    if (galleryImages.length < 2) return
    setActiveImageIndex((current) => Math.max(0, current - 1))
  }

  function showNextImage() {
    if (galleryImages.length < 2) return
    setActiveImageIndex((current) =>
      Math.min(galleryImages.length - 1, current + 1)
    )
  }

  function handleAddToCart() {
    addToCart(product, quantity)
  }

  function handleBuyNow() {
    navigate('/checkout', {
      state: {
        buyNowItem: {
          ...product,
          quantity
        }
      }
    })
  }

  return (
    <div className="product-page">

      <div className="details-container">

        <div className="details-image-section">

          <div className="image-card">
            <img
              src={activeImage}
              alt={`${product.name} - image ${activeImageIndex + 1}`}
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="product-image-arrow product-image-arrow-left"
                  onClick={showPreviousImage}
                  disabled={activeImageIndex === 0}
                  aria-label="View previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="product-image-arrow product-image-arrow-right"
                  onClick={showNextImage}
                  disabled={activeImageIndex === galleryImages.length - 1}
                  aria-label="View next image"
                >
                  ›
                </button>

                <span className="product-image-counter">
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
              </>
            )}
          </div>

        </div>

        <div className="details-info">

          <p className="category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="price-row">

            <span className="new-price">
              ₹{product.price}
            </span>

            <span className="old-price">
              ₹{product.original_price}
            </span>

            <span className="discount">
              {discount}% OFF
            </span>

          </div>

          <p className="tax-text">
            Inclusive of all taxes
          </p>

          <div className="info-table">

            <div className="info-item">
              <span>{product.material}</span>
            </div>

            <div className="info-item">
              <span className="label">Category</span>
              <span>{product.category}</span>
            </div>

            <div className="info-item">
              <span className="label">Availability</span>
              <span className="stock">
                In Stock
              </span>
            </div>

          </div>

          <div className="feature-strip">

            <div className="feature-card">
              🚚
              <span>Free Delivery</span>
            </div>

            <div className="feature-card">
              ↩
              <span>Easy Returns</span>
            </div>

            <div className="feature-card">
              🔒
              <span>Secure Payment</span>
            </div>

            <div className="feature-card">
              ✨
              <span>Handmade</span>
            </div>

          </div>

          <div className="purchase-box">

            <div className="quantity-wrapper">

              <span className="qty-title">
                Quantity
              </span>

              <div className="quantity-box">

                <button
                  onClick={() =>
                    quantity > 1 &&
                    setQuantity(quantity - 1)
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                >
                  +
                </button>

              </div>

            </div>

            <div className="buttons">

              <button
                className="cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className="buy-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

          </div>

          {/* <div className="highlights-card">

            <h2>Why You'll Love It</h2>

            <div className="highlights-grid">

              <div className="highlight-item">
                <span className="highlight-icon">✓</span>
                <div>
                  <h4>Handcrafted Design</h4>
                  <p>Made with care and attention to every detail.</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">❤</span>
                <div>
                  <h4>Skin Friendly</h4>
                  <p>Comfortable for long hours of daily wear.</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">✨</span>
                <div>
                  <h4>Premium Finish</h4>
                  <p>Elegant shine that complements every outfit.</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">🎁</span>
                <div>
                  <h4>Perfect Gift</h4>
                  <p>A thoughtful choice for birthdays and celebrations.</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">🪶</span>
                <div>
                  <h4>Lightweight</h4>
                  <p>Designed for comfortable all-day use.</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">💎</span>
                <div>
                  <h4>Elegant Style</h4>
                  <p>A timeless piece that suits every occasion.</p>
                </div>
              </div>

            </div>
          </div> */}

        </div>

      </div>

    </div>
  )
}

export default ProductDetails
