function ProductCard({ product }) {
  return (
    <div>
      <img
        src={product.image}
        alt={product.name}
        width="200"
      />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>
    </div>
  )
}

export default ProductCard