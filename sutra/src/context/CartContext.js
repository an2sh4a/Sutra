import { createContext,useState } from 'react'

export const CartContext=createContext()

export function CartProvider({children}){

  const [cart,setCart]=useState([])

  function addToCart(product){

    const existing=cart.find(
      item=>item.id===product.id
    )

    if(existing){

      setCart(

        cart.map(item=>

          item.id===product.id

          ?

          {...item,quantity:item.quantity+1}

          :

          item

        )

      )

    }

    else{

      setCart([

        ...cart,

        {

          ...product,

          quantity:1

        }

      ])

    }

  }

  function increaseQuantity(id){

    setCart(

      cart.map(item=>

        item.id===id

        ?

        {

          ...item,

          quantity:item.quantity+1

        }

        :

        item

      )

    )

  }

  function decreaseQuantity(id){

    setCart(

      cart.map(item=>

        item.id===id

        ?

        {

          ...item,

          quantity:item.quantity-1

        }

        :

        item

      )

      .filter(item=>item.quantity>0)

    )

  }

  function removeItem(id){

    setCart(

      cart.filter(

        item=>item.id!==id

      )

    )

  }

  function clearCart(){

    setCart([])

  }

  return(

    <CartContext.Provider

      value={{

        cart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeItem,

        clearCart

      }}

    >

      {children}

    </CartContext.Provider>

  )

}