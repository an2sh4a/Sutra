import { createContext,useState } from 'react'

export const CartContext=createContext()

export function CartProvider({children}){
  const [cart,setCart]=useState([])

  function addToCart(product,quantity=1){
    setCart(prevCart=>{
      const existing=prevCart.find(item=>item.id===product.id)

      if(existing){
        return prevCart.map(item=>
          item.id===product.id
          ? {...item,quantity:quantity}
          : item
        )
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity
        }
      ]
    })
  }

  function increaseQuantity(id){
    setCart(prevCart=>
      prevCart.map(item=>
        item.id===id
        ? {...item,quantity:item.quantity+1}
        : item
      )
    )
  }

  function decreaseQuantity(id){
    setCart(prevCart=>
      prevCart.map(item=>
        item.id===id
        ? {...item,quantity:item.quantity-1}
        : item
      ).filter(item=>item.quantity>0)
    )
  }

  function removeItem(id){
    setCart(prevCart=>
      prevCart.filter(item=>item.id!==id)
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