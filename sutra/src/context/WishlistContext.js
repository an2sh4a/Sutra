import { createContext, useState } from 'react'

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {

  const [wishlist, setWishlist] = useState([])

  function addToWishlist(product){

    const exists = wishlist.find(
      item => item.id === product.id
    )

    if(!exists){

      setWishlist([

        ...wishlist,

        product

      ])

    }

  }

  function removeWishlist(id){

    setWishlist(

      wishlist.filter(

        item => item.id !== id

      )

    )

  }

  return(

    <WishlistContext.Provider

      value={{

        wishlist,

        addToWishlist,

        removeWishlist

      }}

    >

      {children}

    </WishlistContext.Provider>

  )

}