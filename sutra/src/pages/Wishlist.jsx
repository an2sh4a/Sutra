import { useContext } from 'react'
import { WishlistContext } from '../context/WishlistContext'
import './Wishlist.css'

function Wishlist() {

  const { wishlist, removeWishlist } = useContext(WishlistContext)

  return (

    <div className="wishlist-container">

      <h1>My Wishlist</h1>

      {

        wishlist.length === 0 ?

        <p>Your wishlist is empty.</p>

        :

        wishlist.map((item) => (

          <div className="wishlist-card" key={item.id}>

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="wishlist-info">

              <h2>{item.name}</h2>

              <p>{item.description}</p>

              <div className="price-box">

                <span className="old-price">
                  ₹{item.price + 100}
                </span>

                <span className="new-price">
                  ₹{item.price}
                </span>

              </div>

              <button
                className="remove-btn"
                onClick={() => removeWishlist(item.id)}
              >
                Remove
              </button>

            </div>

          </div>

        ))

      }

    </div>

  )

}

export default Wishlist