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

  const [selectedCategory, setSelectedCategory] =
  useState('all')



  useEffect(() => {

    fetchProducts()

  }, [selectedCategory])



  async function fetchProducts() {

    let query = supabase

      .from('products')

      .select('*')



    if(selectedCategory !== 'all'){

      query = query.eq(
        'category',
        selectedCategory
      )

    }



    const { data, error } = await query



    if(error){

      console.log(error)

    }

    else{

      setProducts(data)

    }

  }



  return (

    <div>

      <Navbar />

      <CategoryBar

        selectedCategory={selectedCategory}

        setSelectedCategory={
          setSelectedCategory
        }

      />

      <Hero />

      <ProductGrid products={products} />

      <CustomerWords />

      <Footer />

    </div>

  )

}

export default Home