import './Navbar.css'
import { Link,useNavigate } from 'react-router-dom'
import { useContext,useState,useEffect } from 'react'
import { FiHeart,FiShoppingBag,FiUser,FiFilter,FiChevronDown } from 'react-icons/fi'
import { WishlistContext } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import { SearchContext } from '../context/SearchContext'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import logo from '../assets/images/sutra-logo.png'

function Navbar(){
  const navigate=useNavigate()
  const { wishlist }=useContext(WishlistContext)
  const { cart }=useContext(CartContext)
  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    sortOption,
    setSortOption,
    clearFilters
  }=useContext(SearchContext)
  const { user,logout }=useContext(AuthContext)
  const [input,setInput]=useState(search)
  const [accountOpen,setAccountOpen]=useState(false)
  const [filterOpen,setFilterOpen]=useState(false)
  const [sortOpen,setSortOpen]=useState(false)
  const [categories,setCategories]=useState([])
  const cartCount=cart.reduce(
    (sum,item)=>sum+item.quantity,
    0
  )
  useEffect(()=>{
    setInput(search)
  },[search])
  useEffect(()=>{
    fetchCategories()
  },[])
  async function fetchCategories(){
    const {data,error}=await supabase
      .from('products')
      .select('category')
    if(data){
      const uniqueCategories=[
        ...new Set(
          data
            .map(item=>item.category)
            .filter(Boolean)
        )
      ]
      setCategories(uniqueCategories)
    }
    if(error){
      console.log(error)
    }
  }
  function handleSearch(e){
    if(e.key==="Enter"){
      setSearch(input)
      navigate("/",{
        state:{
          scrollToProducts:true
        }
      })
    }
  }
  function handleLogoClick(){
    setSearch("")
    setInput("")
    clearFilters()
    setSortOption("Default")
    setFilterOpen(false)
    setSortOpen(false)
    navigate("/")
  }
  function handleFilterClick(){
    setFilterOpen(!filterOpen)
    setSortOpen(false)
  }
  function handleSortClick(){
    setSortOpen(!sortOpen)
    setFilterOpen(false)
  }
  function selectSort(option){
    setSortOption(option)
    setSortOpen(false)
  }
  async function handleLogout(){
    setAccountOpen(false)
    await logout()
    navigate("/")
  }
  return(
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt="Sutrā"
        />
      </Link>
      <div className="search-area">
        <input
          type="text"
          placeholder="Search jewellery..."
          className="search-bar"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={handleSearch}
        />
        <div className="browse-controls">
          <button
            className={
              "browse-btn "+
              (
                selectedCategory!=="All" ||
                selectedPrice!=="All"
                ? "active"
                : ""
              )
            }
            onClick={handleFilterClick}
          >
            <FiFilter />
            <span>Filter</span>
          </button>
          <button
            className={
              "browse-btn "+
              (
                sortOption!=="Default"
                ? "active"
                : ""
              )
            }
            onClick={handleSortClick}
          >
            <span>Sort By</span>
            <FiChevronDown />
          </button>
          {
            filterOpen && (
              <div className="browse-dropdown filter-dropdown">
                <h3>Filter Products</h3>
                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e)=>setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {
                      categories.map(category=>(
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="filter-group">
                  <label>Price</label>
                  <select
                    value={selectedPrice}
                    onChange={(e)=>setSelectedPrice(e.target.value)}
                  >
                    <option value="All">All Prices</option>
                    <option value="under500">Under ₹500</option>
                    <option value="500to1000">₹500 - ₹1,000</option>
                    <option value="1000to2000">₹1,001 - ₹2,000</option>
                    <option value="above2000">Above ₹2,000</option>
                  </select>
                </div>
                <div className="filter-actions">
                  <button
                    className="clear-btn"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                  <button
                    className="apply-btn"
                    onClick={()=>setFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )
          }
          {
            sortOpen && (
              <div className="browse-dropdown sort-dropdown">
                <h3>Sort Products</h3>
                <button
                  className={
                    sortOption==="Default"
                    ? "sort-option selected"
                    : "sort-option"
                  }
                  onClick={()=>selectSort("Default")}
                >
                  Default
                </button>
                <button
                  className={
                    sortOption==="Price Low"
                    ? "sort-option selected"
                    : "sort-option"
                  }
                  onClick={()=>selectSort("Price Low")}
                >
                  Price: Low to High
                </button>
                <button
                  className={
                    sortOption==="Price High"
                    ? "sort-option selected"
                    : "sort-option"
                  }
                  onClick={()=>selectSort("Price High")}
                >
                  Price: High to Low
                </button>
                <button
                  className={
                    sortOption==="Newest"
                    ? "sort-option selected"
                    : "sort-option"
                  }
                  onClick={()=>selectSort("Newest")}
                >
                  Newest
                </button>
              </div>
            )
          }
        </div>
      </div>
      <div className="nav-icons">
        <Link
          to="/wishlist"
          className="icon-btn"
        >
          <FiHeart />
          {
            wishlist.length>0 &&
            <span className="badge">
              {wishlist.length}
            </span>
          }
        </Link>
        <Link
          to="/cart"
          className="icon-btn"
        >
          <FiShoppingBag />
          {
            cartCount>0 &&
            <span className="badge">
              {cartCount}
            </span>
          }
        </Link>
        {
          user ? (
            <div className="account-wrapper">
              <button
                className="account-btn"
                onClick={()=>
                  setAccountOpen(!accountOpen)
                }
              >
                <FiUser />
                <span>Account</span>
              </button>
              {
                accountOpen &&
                <div className="account-dropdown">
                  <button
                    onClick={()=>{
                      setAccountOpen(false)
                      navigate('/orders')
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              }
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={()=>navigate('/login')}
            >
              Login
            </button>
          )
        }
      </div>
    </nav>
  )
}
export default Navbar