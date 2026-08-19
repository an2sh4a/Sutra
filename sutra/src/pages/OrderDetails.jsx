import { useContext,useEffect,useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { AuthContext } from '../context/AuthContext'
import './OrderDetails.css'

function OrderDetails(){

  const { id }=useParams()
  const { user,loading:authLoading }=useContext(AuthContext)
  const navigate=useNavigate()

  const [order,setOrder]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{

    if(authLoading){
      return
    }

    if(!user){
      navigate('/login')
      return
    }

    fetchOrder()

  },[user,authLoading,id])

  async function fetchOrder(){

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
      .eq('id',id)
      .eq('user_id',user.id)
      .single()

    if(error){
      console.log(error)
      setOrder(null)
    }else{
      setOrder(data)
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
      <div className="order-details-page">
        <div className="order-details-loading">
          <h2>Loading Order</h2>
          <p>Please wait while we fetch your order details.</p>
        </div>
      </div>
    )

  }

  if(!order){

    return(
      <div className="order-details-page">
        <div className="order-details-loading">
          <h2>Order Not Found</h2>
          <p>We could not find this order.</p>
          <button onClick={()=>navigate('/orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
    )

  }

  return(
    <div className="order-details-page">

      <div className="order-details-header">

        <button
          className="back-orders-btn"
          onClick={()=>navigate('/orders')}
        >
          ← Back to My Orders
        </button>

        <div className="order-details-title">

          <div>
            <p className="order-details-label">
              ORDER
            </p>

            <h1>
              {order.order_number}
            </h1>

            <p>
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className={`order-details-status ${getStatusClass(order.status)}`}>
            {order.status}
          </div>

        </div>

      </div>

      <div className="order-details-card">

        <div className="order-details-section">

          <h2>Delivery Estimate</h2>

          <div className="delivery-details-box">

            <span className="delivery-details-icon">
              🚚
            </span>

            <div>
              <span>Estimated Delivery</span>
              <strong>3 - 5 Business Days</strong>
            </div>

          </div>

        </div>

        <div className="order-details-section">

          <h2>Items</h2>

          <div className="order-details-items">

            {
              order.order_items?.map((item,index)=>(
                <div
                  className="order-details-item"
                  key={`${order.id}-${index}`}
                >

                  <img
                    src={item.product_image}
                    alt={item.product_name}
                  />

                  <div className="order-details-item-info">

                    <h3>
                      {item.product_name}
                    </h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

        <div className="order-details-section">

          <h2>Order Summary</h2>

          <div className="order-details-summary">

            <div>
              <span>Items</span>
              <span>₹{order.subtotal + order.discount}</span>
            </div>

            <div>
              <span>Discount</span>
              <span className="discount-value">
                -₹{order.discount}
              </span>
            </div>

            <div>
              <span>Shipping</span>
              <span className="free-value">
                FREE
              </span>
            </div>

            <div className="order-details-total">
              <span>Grand Total</span>
              <strong>
                ₹{order.total_amount}
              </strong>
            </div>

          </div>

        </div>

        <div className="order-details-section">

          <h2>Delivery Address</h2>

          <div className="order-details-address">

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

      </div>

    </div>
  )

}

export default OrderDetails