import { useEffect,useState,useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { SearchContext } from '../context/SearchContext'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import CategoryBar from '../components/CategoryBar'
import CustomerWords from '../components/CustomerWords'

function Home(){
  const {
    search,
    selectedPrice,
    sortOption
  }=useContext(SearchContext)
  const location=useLocation()
  const [products,setProducts]=useState([])
  const [filteredProducts,setFilteredProducts]=useState([])
  const [selectedCategory,setSelectedCategory]=useState('All')
  useEffect(()=>{
    fetchProducts()
  },[])
  useEffect(()=>{
    let filtered=[...products]
    if(search.trim()!==''){
      filtered=filtered.filter(item=>
        item.name.toLowerCase().includes(
          search.toLowerCase()
        )
      )
    }
    if(selectedCategory!=='All'){
      filtered=filtered.filter(item=>
        item.category===selectedCategory
      )
    }
    if(selectedPrice==='under500'){
      filtered=filtered.filter(item=>
        item.price<500
      )
    }
    if(selectedPrice==='500to1000'){
      filtered=filtered.filter(item=>
        item.price>=500 &&
        item.price<=1000
      )
    }
    if(selectedPrice==='1000to2000'){
      filtered=filtered.filter(item=>
        item.price>1000 &&
        item.price<=2000
      )
    }
    if(selectedPrice==='above2000'){
      filtered=filtered.filter(item=>
        item.price>2000
      )
    }
    if(sortOption==='Price Low'){
      filtered.sort((a,b)=>a.price-b.price)
    }
    if(sortOption==='Price High'){
      filtered.sort((a,b)=>b.price-a.price)
    }
    if(sortOption==='Newest'){
      filtered.sort((a,b)=>{
        const dateA=a.created_at
          ? new Date(a.created_at).getTime()
          : 0
        const dateB=b.created_at
          ? new Date(b.created_at).getTime()
          : 0
        return dateB-dateA
      })
    }
    setFilteredProducts(filtered)
  },[
    products,
    search,
    selectedCategory,
    selectedPrice,
    sortOption
  ])
  useEffect(()=>{
    if(location.state?.scrollToProducts){
      setTimeout(()=>{
        document
          .getElementById("featured-products")
          ?.scrollIntoView({
            behavior:"smooth",
            block:"start"
          })
      },100)
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
    setSelectedCategory(category)
    setTimeout(()=>{
      document
        .getElementById("featured-products")
        ?.scrollIntoView({
          behavior:"smooth",
          block:"start"
        })
    },100)
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