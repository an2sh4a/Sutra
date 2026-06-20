import { useContext } from 'react'

import { CartContext } from '../context/CartContext'

import './Cart.css'

function Cart(){

const {

cart,

increaseQuantity,

decreaseQuantity,

removeItem

}

= useContext(CartContext)


const total = cart.reduce(

(sum,item)=>

sum+(item.price*item.quantity),

0

)


return(

<div className="cart-container">

<h1>

My Cart

</h1>


{

cart.length===0

?

<p>

Your cart is empty

</p>

:

<>

{

cart.map(item=>(

<div

className="cart-card"

key={item.id}

>

<img

src={item.image}

alt={item.name}

/>


<div className="cart-info">

<h2>

{item.name}

</h2>

<h3>

₹{item.price}

</h3>


<div className="quantity-box">

<button

onClick={()=>

decreaseQuantity(item.id)

}

>

-

</button>


<span>

{item.quantity}

</span>


<button

onClick={()=>

increaseQuantity(item.id)

}

>

+

</button>

</div>


<button

className="remove-btn"

onClick={()=>

removeItem(item.id)

}

>

Remove

</button>


</div>

</div>

))

}


<div className="summary">

<h2>

Total : ₹{total}

</h2>


<button>

Proceed To Checkout

</button>

</div>

</>

}

</div>

)

}

export default Cart