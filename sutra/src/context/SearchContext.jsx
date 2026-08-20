import { createContext,useState } from 'react'
export const SearchContext=createContext()
export function SearchProvider({ children }){
  const [search,setSearch]=useState('')
  const [selectedPrice,setSelectedPrice]=useState('All')
  const [sortOption,setSortOption]=useState('Default')
  function clearFilters(){
    setSelectedPrice('All')
  }
  function clearAllBrowsing(){
    setSearch('')
    setSelectedPrice('All')
    setSortOption('Default')
  }
  return(
    <SearchContext.Provider
      value={{
        search,
        setSearch,
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
export default SearchContext