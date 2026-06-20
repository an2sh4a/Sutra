import { createContext, useState } from 'react'

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {

  const [wishlist, setWishlist] = useState([])

  function toggleWishlist(product) {

    const exists = wishlist.find(
      item => item.id === product.id
    )

    if(exists){

      setWishlist(

        wishlist.filter(

          item => item.id !== product.id

        )

      )

    }

    else{

      setWishlist([

        ...wishlist,

        product

      ])

    }

  }

  function isWishlisted(id){

    return wishlist.some(

      item => item.id === id

    )

  }

  return (

    <WishlistContext.Provider

      value={{

        wishlist,

        toggleWishlist,

        isWishlisted

      }}

    >

      {children}

    </WishlistContext.Provider>

  )

}