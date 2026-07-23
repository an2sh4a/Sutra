import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WishlistContext } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import { FiHeart } from 'react-icons/fi'
import './Wishlist.css'

function Wishlist(){

  const {
    wishlist,
    removeFromWishlist
  } = useContext(WishlistContext)

  const { addToCart } = useContext(CartContext)

  function handleCart(product){
    addToCart(product)
    removeFromWishlist(product.id)
  }

  if(wishlist.length===0){

    return(

      <div className="empty-wishlist-container">

        <div className="empty-wishlist-box">

          <div className="empty-icon">

            <FiHeart/>

          </div>

          <h1>Your Wishlist is Empty</h1>

          <p>

            Save your favourite handcrafted jewellery and find it here anytime.

          </p>

          <Link to="/">

            <button className="shop-btn">

              Explore Collection

            </button>

          </Link>

        </div>

      </div>

    )

  }

  return(

    <div className="wishlist-container">

      <div className="wishlist-header">

        <h1>My Wishlist</h1>

      </div>

      <div className="wishlist-grid">

        {

          wishlist.map(item=>{

            const discount=Math.round(

              ((item.original_price-item.price)/item.original_price)*100

            )

            return(

              <div
                className="wishlist-card"
                key={item.id}
              >

                <Link
                  to={`/product/${item.id}`}
                  className="wishlist-link"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </Link>

                <div className="wishlist-info">

                  <Link
                    to={`/product/${item.id}`}
                    className="wishlist-link"
                  >

                    <h2>{item.name}</h2>

                  </Link>

                  <p className="description">

                    {item.description}

                  </p>

                  <div className="price-box">

                    <span className="old-price">

                      ₹{item.original_price}

                    </span>

                    <span className="new-price">

                      ₹{item.price}

                    </span>

                    <span className="discount">

                      {discount}% OFF

                    </span>

                  </div>

                  <p className="delivery">

                    🚚 Free Delivery

                  </p>

                  <div className="wishlist-buttons">

                    <button
                      className="cart-btn"
                      onClick={()=>handleCart(item)}
                    >

                      Add To Cart

                    </button>

                    <Link to={`/product/${item.id}`}>

                      <button className="view-btn">

                        View Details

                      </button>

                    </Link>

                    <button
                      className="remove-btn"
                      onClick={()=>removeFromWishlist(item.id)}
                    >

                      Remove

                    </button>

                  </div>

                </div>

              </div>

            )

          })

        }

      </div>

    </div>

  )

}

export default Wishlist