import { useContext,useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { AuthContext } from '../context/AuthContext'
import './MyOrders.css'

function MyOrders(){

  const { user,loading:authLoading }=useContext(AuthContext)
  const navigate=useNavigate()

  const [orders,setOrders]=useState([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{

    if(authLoading){
      return
    }

    if(!user){
      navigate('/login')
      return
    }

    fetchOrders()

  },[user,authLoading,navigate])


  async function fetchOrders(){

    setLoading(true)

    const {data,error}=await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_name,
          product_image,
          product_price,
          quantity,
          subtotal
        )
      `)
      .eq('user_id',user.id)
      .order('created_at',{ascending:false})

    if(error){

      console.log(error)

    }else{

      setOrders(data||[])

    }

    setLoading(false)

  }


  function formatDate(date){

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day:'numeric',
        month:'long',
        year:'numeric'
      }
    )

  }


  function getStatusClass(status){

    return status?.toLowerCase().replace(/\s+/g,'-')

  }


  if(authLoading||loading){

    return(

      <div className="orders-page">

        <div className="orders-loading-card">

          <h2>Loading Your Orders</h2>

          <p>
            Please wait while we fetch your order history.
          </p>

        </div>

      </div>

    )

  }


  return(

    <div className="orders-page">

      <div className="orders-header">

        <h1>My Orders</h1>

        <p>
          Track and manage your Sutrā purchases.
        </p>

      </div>


      {
        orders.length===0 ? (

          <div className="no-orders-card">

            <div className="no-orders-icon">
              🛍
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              onClick={()=>navigate('/')}
            >
              Start Shopping
            </button>

          </div>

        ) : (

          <div className="orders-list">

            {
              orders.map(order=>(

                <div
                  className="order-card"
                  key={order.id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div>

                      <p className="order-label">
                        ORDER
                      </p>

                      <h2>
                        {order.order_number}
                      </h2>

                      <p className="order-date">
                        Placed on {formatDate(order.created_at)}
                      </p>

                    </div>


                    <div
                      className={`order-status ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </div>

                  </div>


                  {/* DELIVERY ESTIMATE */}

                  <div className="delivery-estimate">

                    <div className="delivery-icon">
                      🚚
                    </div>

                    <div>

                      <span>
                        Estimated Delivery
                      </span>

                      <strong>
                        3 - 5 Business Days
                      </strong>

                    </div>

                  </div>


                  {/* ITEMS */}

                  <div className="order-section">

                    <h3>
                      Items
                    </h3>


                    <div className="order-items">

                      {
                        order.order_items?.map(
                          (item,index)=>(

                            <div
                              className="order-item"
                              key={`${order.id}-${index}`}
                            >

                              <img
                                src={item.product_image}
                                alt={item.product_name}
                              />


                              <div className="order-item-details">

                                <h4>
                                  {item.product_name}
                                </h4>

                                <p>
                                  Quantity: {item.quantity}
                                </p>

                                <p className="item-price">
                                  ₹{item.product_price} each
                                </p>

                              </div>


                              <strong className="item-total">
                                ₹{item.subtotal}
                              </strong>

                            </div>

                          )
                        )
                      }

                    </div>

                  </div>


                  {/* ORDER TOTAL */}

                  <div className="order-section">

                    <h3>
                      Order Summary
                    </h3>


                    <div className="price-breakdown">

                      <div>

                        <span>
                          Items
                        </span>

                        <span>
                          ₹{order.subtotal + order.discount}
                        </span>

                      </div>


                      <div>

                        <span>
                          Discount
                        </span>

                        <span className="discount-value">
                          -₹{order.discount}
                        </span>

                      </div>


                      <div>

                        <span>
                          Shipping
                        </span>

                        <span className="free-value">
                          FREE
                        </span>

                      </div>


                      <div className="grand-total">

                        <span>
                          Grand Total
                        </span>

                        <strong>
                          ₹{order.total_amount}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* DELIVERY ADDRESS */}

                  <div className="order-section">

                    <h3>
                      Delivery Address
                    </h3>


                    <div className="address-card">

                      <strong>
                        {order.customer_name}
                      </strong>

                      <p>
                        {order.address}
                      </p>

                      <p>
                        {order.city}, {order.state} - {order.pincode}
                      </p>

                      <p>
                        {order.phone}
                      </p>

                    </div>

                  </div>


                  {/* FOOTER */}

                  <div className="order-card-footer">

                    <span>
                      Need help with this order?
                    </span>

                    <button
                      onClick={()=>{
                        alert(
                          `Please keep your order number ${order.order_number} ready when contacting support.`
                        )
                      }}
                    >
                      Get Help
                    </button>

                  </div>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  )

}

export default MyOrders