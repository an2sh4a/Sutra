import { useContext } from 'react'

import { WishlistContext }

from '../context/WishlistContext'

function Wishlist(){

const {

wishlist

}

= useContext(WishlistContext)

return(

<div style={{padding:"50px"}}>

<h1>

My Wishlist

</h1>


{

wishlist.map(item=>(

<div key={item.id}>

<h2>

{item.name}

</h2>

<p>

₹{item.price}

</p>

</div>

))

}

</div>

)

}

export default Wishlist