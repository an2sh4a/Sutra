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

  if(authLoading||loading){
    return(
      <div className="orders-page">
        <div className="orders-header">
          <h1>My Orders</h1>
        </div>

        <p className="orders-loading">
          Loading your orders...
        </p>
      </div>
    )
  }

  return(
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>

        <p>
          View your previous Sutrā purchases.
        </p>
      </div>

      {orders.length===0?(
        <div className="no-orders">
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
      ):(
        <div className="orders-list">
          {orders.map(order=>(
            <div
              className="order-card"
              key={order.id}
            >
              <div className="order-top">
                <div>
                  <h3>
                    Order #{order.id}
                  </h3>

                  <p>
                    {new Date(
                      order.created_at
                    ).toLocaleDateString('en-IN',{
                      day:'numeric',
                      month:'long',
                      year:'numeric'
                    })}
                  </p>
                </div>

                <span
                  className={`order-status ${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.order_items?.map((item,index)=>(
                  <div
                    className="order-item"
                    key={`${order.id}-${index}`}
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                    />

                    <div className="order-item-info">
                      <h4>
                        {item.product_name}
                      </h4>

                      <p>
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="order-item-price">
                      ₹{item.subtotal}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <div>
                  <span>
                    Discount
                  </span>

                  <strong>
                    -₹{order.discount}
                  </strong>
                </div>

                <div className="order-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{order.total_amount}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders