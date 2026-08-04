import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import CategoryBar from '../components/CategoryBar'
import CustomerWords from '../components/CustomerWords'

function Home() {

  const [products,setProducts]=useState([])
  const [filteredProducts,setFilteredProducts]=useState([])
  const [search,setSearch]=useState("")

  useEffect(()=>{
    fetchProducts()
  },[])

  useEffect(()=>{

    const filtered=products.filter((item)=>

      item.name.toLowerCase()
      .includes(search.toLowerCase())

    )

    setFilteredProducts(filtered)

  },[search,products])


  async function fetchProducts(){

    const {data,error}=await supabase
    .from('products')
    .select('*')

    if(data){

      setProducts(data)
      setFilteredProducts(data)

    }

    if(error){

      console.log(error)

    }

  }


  function filterCategory(category){

    if(category==="All"){

      setFilteredProducts(products)
      return

    }

    const filtered=products.filter(

      (item)=>

      item.category===category

    )

    setFilteredProducts(filtered)

  }

  return(

    <div>

      <CategoryBar
        filterCategory={filterCategory}
      />

      <Hero />

      <ProductGrid
        products={filteredProducts}
      />

      <CustomerWords />

      <Footer />

    </div>

  )

}

export default Home