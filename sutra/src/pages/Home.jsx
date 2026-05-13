import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import ProductCard from '../components/ProductCard'

function Home() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {

    const { data, error } = await supabase
      .from('products')
      .select('*')

    console.log(data)
    console.log(error)

    if (data) {
      setProducts(data)
    }
  }

  return (
    <div>

      <h1>Sutra</h1>

      {
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))
      }

    </div>
  )
}

export default Home