import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import './AdminDashboard.css'

function AdminDashboard() {

  const [orders, setOrders] = useState([])

  useEffect(() => {

    fetchOrders()

  }, [])

  async function fetchOrders() {

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {

      setOrders(data)

    }

    if (error) {

      console.log(error)

    }

  }

  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    order => order.status === 'Pending'
  ).length

  const deliveredOrders = orders.filter(
    order => order.status === 'Delivered'
  ).length

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  )

  return (

    <div className="admin-container">

      <h1>Admin Dashboard</h1>

      <div className="cards">

        <div className="card">

          <h3>Total Orders</h3>

          <p>{totalOrders}</p>

        </div>

        <div className="card">

          <h3>Pending</h3>

          <p>{pendingOrders}</p>

        </div>

        <div className="card">

          <h3>Delivered</h3>

          <p>{deliveredOrders}</p>

        </div>

        <div className="card">

          <h3>Revenue</h3>

          <p>₹{revenue}</p>

        </div>

      </div>

      <h2>Recent Orders</h2>

      {

        orders.map((order) => (

          <div className="order-card" key={order.id}>

            <div>

              <h3>{order.customer_name}</h3>

              <p>{order.phone}</p>

            </div>

            <div>

              ₹{order.total_amount}

            </div>

            <div className={order.status}>

              {order.status}

            </div>

          </div>

        ))

      }

    </div>

  )

}

export default AdminDashboard