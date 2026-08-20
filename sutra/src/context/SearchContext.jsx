import { createContext,useState } from 'react'
export const SearchContext=createContext()
export function SearchProvider({ children }){
  const [search,setSearch]=useState('')
  const [selectedCategory,setSelectedCategory]=useState('All')
  const [selectedPrice,setSelectedPrice]=useState('All')
  const [sortOption,setSortOption]=useState('Default')
  function clearFilters(){
    setSelectedCategory('All')
    setSelectedPrice('All')
  }
  function clearAllBrowsing(){
    setSearch('')
    setSelectedCategory('All')
    setSelectedPrice('All')
    setSortOption('Default')
  }
  return(
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        selectedPrice,
        setSelectedPrice,
        sortOption,
        setSortOption,
        clearFilters,
        clearAllBrowsing
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}