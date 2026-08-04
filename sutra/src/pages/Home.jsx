import { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { SearchContext } from '../context/SearchContext'

import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import CategoryBar from '../components/CategoryBar'
import CustomerWords from '../components/CustomerWords'

function Home() {

  const { search } = useContext(SearchContext)
  const location = useLocation()

  const [products,setProducts]=useState([])
  const [filteredProducts,setFilteredProducts]=useState([])

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

  useEffect(()=>{

    if(location.state?.scrollToProducts){

      document
        .getElementById("featured-products")
        ?.scrollIntoView({
          behavior:"smooth",
          block:"start"
        })

      window.history.replaceState({},document.title)

    }

  },[location])

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

      const filtered=products.filter((item)=>

        item.name.toLowerCase()
        .includes(search.toLowerCase())

      )

      setFilteredProducts(filtered)
      return

    }

    const filtered=products.filter(

      (item)=>

      item.category===category &&
      item.name.toLowerCase().includes(search.toLowerCase())

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