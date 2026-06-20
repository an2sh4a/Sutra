import { useContext } from 'react'

import { CartContext } from '../context/CartContext'

function Cart() {

  const { cart } = useContext(CartContext)

  return (

    <div style={{padding:"40px"}}>

      <h1>My Cart</h1>

      {

        cart.length === 0 ?

        <p>Your cart is empty.</p>

        :

        cart.map((item)=>(

          <div key={item.id}>

            <h3>{item.name}</h3>

            <p>₹{item.price}</p>

          </div>

        ))

      }

    </div>

  )

}

export default Cart