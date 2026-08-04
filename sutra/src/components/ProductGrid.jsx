import './ProductGrid.css'
import ProductCard from './ProductCard'

function ProductGrid({ products }) {

  return (

    <section id="featured-products" className="featured-products">

      <h2 className="section-title">
        Featured Products
      </h2>

      <div className="product-grid">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </section>

  )

}

export default ProductGrid