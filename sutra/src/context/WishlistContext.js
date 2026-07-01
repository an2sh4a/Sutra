import { createContext, useState } from 'react'

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {

  const [wishlist, setWishlist] = useState([])

  function addToWishlist(product) {

    const exists = wishlist.find(
      item => item.id === product.id
    )

    if (!exists) {

      setWishlist([
        ...wishlist,
        product
      ])

    }

  }

  function removeFromWishlist(id) {

    setWishlist(

      wishlist.filter(
        item => item.id !== id
      )

    )

  }

  function toggleWishlist(product) {

    const exists = wishlist.find(
      item => item.id === product.id
    )

    if (exists) {

      removeFromWishlist(product.id)

    } else {

      addToWishlist(product)

    }

  }

  function isWishlisted(id) {

    return wishlist.some(
      item => item.id === id
    )

  }

  return (

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