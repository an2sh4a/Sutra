import { useContext,useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { AuthContext } from '../context/AuthContext'
import './MyOrders.css'

function MyOrders(){
  const {user,loading:authLoading}=useContext(AuthContext)
  const navigate=useNavigate()
  const [orders,setOrders]=useState([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(authLoading)return
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
    return new Date(date).toLocaleDateString('en-IN',{
      day:'numeric',
      month:'long',
      year:'numeric'
    })
  }

  function getStatusClass(status){
    return status?.toLowerCase().replace(/\s+/g,'-')
  }

  function openOrder(orderId){
    navigate(`/orders/${orderId}`)
  }

  if(authLoading||loading){
    return(
      <div className="orders-page">
        <div className="orders-loading-card">
          <h2>Loading Your Orders</h2>
          <p>Please wait while we fetch your order history.</p>
        </div>
      </div>
    )
  }

  return(
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your Sutrā purchases.</p>
      </div>

      {orders.length===0?(
        <div className="no-orders-card">
          <div className="no-orders-icon">🛍</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <button onClick={()=>navigate('/')}>Start Shopping</button>
        </div>
      ):(
        <div className="orders-list">
          {orders.map(order=>{
            const firstItem=order.order_items?.[0]
            const itemCount=order.order_items?.length||0
            const totalQuantity=order.order_items?.reduce((sum,item)=>sum+item.quantity,0)||0

            return(
              <div
                className="order-preview-card"
                key={order.id}
                onClick={()=>openOrder(order.id)}
                role="button"
                tabIndex="0"
                onKeyDown={(e)=>{
                  if(e.key==='Enter'||e.key===' ')openOrder(order.id)
                }}
              >
                <div className="order-preview-main">
                  <div className="order-preview-image">
                    {firstItem?.product_image&&(
                      <img
                        src={firstItem.product_image}
                        alt={firstItem.product_name}
                      />
                    )}
                  </div>

                  <div className="order-preview-info">
                    <p className="order-label">ORDER</p>
                    <h2>{order.order_number}</h2>
                    <p className="order-date">
                      Placed on {formatDate(order.created_at)}
                    </p>
                    {firstItem&&(
                      <p className="order-product-name">
                        {firstItem.product_name}
                        {itemCount>1&&` + ${itemCount-1} more item${itemCount-1>1?'s':''}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="order-preview-right">
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="order-arrow">→</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders