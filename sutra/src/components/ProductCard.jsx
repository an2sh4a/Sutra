import './ProductCard.css'
function ProductCard({ product }) {

  return (

    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
      />

      <h2>{product.name}</h2>

      <p>₹{product.price}</p>

    </div>

  )
}

export default ProductCard