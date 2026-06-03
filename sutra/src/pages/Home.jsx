import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'

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

    <Navbar />

    <Hero />

    <ProductGrid products={products} />

    <Footer />

  </div>
  )

}

export default Home