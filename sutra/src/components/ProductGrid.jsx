
import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './ProductGrid.css'
import ProductCard from './ProductCard'

const categories = [
  'All',
  'Earrings',
  'Necklaces',
  'Chains',
  'Bracelets',
  'Hair Clips',
  'Sets',
]

function ProductGrid({
  products,
  selectedCategory = 'All',
  onCategoryChange,
}) {
  const trackRef = useRef(null)

  function scrollProducts(direction) {
    const track = trackRef.current
    if (!track) return

    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: 'smooth',
    })
  }

  return (
    <section
      id="featured-products"
      className="featured-products"
    >
      {/* Centered section heading */}
      <div className="products-heading">
        <div className="products-heading-text">
          <h2 className="section-title">
            THE SUTRĀ COLLECTION
          </h2>
        </div>
      </div>

      {/* Category filters */}
      <div
        className="product-category-tabs"
        role="group"
        aria-label="Filter products by category"
      >
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              selectedCategory === category
                ? 'product-category-tab active'
                : 'product-category-tab'
            }
            aria-pressed={selectedCategory === category}
            onClick={() => onCategoryChange?.(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product carousel and right-side arrows */}
      <div className="product-carousel-row">
        {products.length > 0 ? (
          <div
            className="product-carousel"
            ref={trackRef}
            aria-label="Products"
          >
            {products.map((product) => (
              <div
                className="product-carousel-item"
                key={product.id}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="products-empty">
            <h3>No products found</h3>
            <p>
              Try another category or adjust your search and filters.
            </p>
          </div>
        )}

        {products.length > 0 && (
          <div className="carousel-controls product-carousel-controls">
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Previous products"
              onClick={() => scrollProducts(-1)}
            >
              <FiChevronLeft />
            </button>

            <button
              type="button"
              className="carousel-arrow"
              aria-label="Next products"
              onClick={() => scrollProducts(1)}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
