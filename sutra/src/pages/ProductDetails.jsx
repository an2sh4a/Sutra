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

    }else{

      console.log(error)

    }

  }

  if(!product){

    return <h2>Loading...</h2>

  }

  return (

    <div className="details-container">

      <img
        src={product.image}
        alt={product.name}
      />

      <div className="details-info">

        <h1>{product.name}</h1>

        <h2>₹{product.price}</h2>

        <p>{product.description}</p>

        <button onClick={() => addToCart(product)}>

          Add To Cart

        </button>

      </div>

    </div>

  )

}

export default ProductDetails