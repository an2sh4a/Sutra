import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { CartContext } from '../context/CartContext'
import './ProductDetails.css'

function ProductDetails() {

  const { id } = useParams()
  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [])

  async function fetchProduct() {

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if(data){

      setProduct(data)

    } else {

      console.log(error)

    }

  }

  if(!product){

    return <h2>Loading...</h2>

  }

  const discount = Math.round(
    ((product.original_price - product.price) /
    product.original_price) * 100
  )

  return (

    <div className="details-container">

      <div className="details-image">

        <img
          src={product.image}
          alt={product.name}
        />

      </div>


      <div className="details-info">

        <p className="category">

          {product.category}

        </p>

        <h1>

          {product.name}

        </h1>

        <p className="material">

          Material : {product.material}

        </p>


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


        <p className="description">

          {product.description}

        </p>


        <div className="buttons">

          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
          >

            Add To Cart

          </button>

          <button className="buy-btn">

            Buy Now

          </button>

        </div>

      </div>

    </div>

  )

}

export default ProductDetails