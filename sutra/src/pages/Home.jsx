import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import CategoryBar from '../components/CategoryBar'
import CustomerWords from '../components/CustomerWords'


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

    <CategoryBar />

    <Hero />

    <ProductGrid products={products} />

    <CustomerWords />

    <Footer />

  </div>
  )

}

export default Home