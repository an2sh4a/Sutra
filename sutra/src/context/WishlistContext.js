import { createContext,useContext,useEffect,useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { AuthContext } from './AuthContext'

export const WishlistContext=createContext()

export function WishlistProvider({children}){
  const {user}=useContext(AuthContext)
  const [wishlist,setWishlist]=useState([])

  useEffect(()=>{
    if(user){
      loadWishlist()
    }else{
      setWishlist([])
    }
  },[user])

  async function loadWishlist(){
    const {data,error}=await supabase
      .from('wishlist')
      .select('product_id,products(*)')
      .eq('user_id',user.id)

    if(error){
      console.log(error)
      return
    }

    setWishlist(
      data.map(item=>item.products)
    )
  }

  async function addToWishlist(product){
    if(!user){
      return
    }

    const exists=wishlist.find(
      item=>item.id===product.id
    )

    if(exists){
      return
    }

    const {error}=await supabase
      .from('wishlist')
      .insert({
        user_id:user.id,
        product_id:product.id
      })

    if(error){
      console.log(error)
      return
    }

    setWishlist(prevWishlist=>[
      ...prevWishlist,
      product
    ])
  }

  async function removeFromWishlist(id){
    if(!user){
      return
    }

    const {error}=await supabase
      .from('wishlist')
      .delete()
      .eq('user_id',user.id)
      .eq('product_id',id)

    if(error){
      console.log(error)
      return
    }

    setWishlist(prevWishlist=>
      prevWishlist.filter(
        item=>item.id!==id
      )
    )
  }

  async function toggleWishlist(product){
    if(!user){
      return
    }

    const exists=wishlist.find(
      item=>item.id===product.id
    )

    if(exists){
      await removeFromWishlist(product.id)
    }else{
      await addToWishlist(product)
    }
  }

  function isWishlisted(id){
    return wishlist.some(
      item=>item.id===id
    )
  }

  return(
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}