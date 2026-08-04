import { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { CartContext } from '../context/CartContext'
import './Checkout.css'
function Checkout(){
  const navigate=useNavigate()
  const {cart,clearCart}=useContext(CartContext)
  const [customerName,setCustomerName]=useState('')
  const [phone,setPhone]=useState('')
  const [email,setEmail]=useState('')
  const [address,setAddress]=useState('')
  const [city,setCity]=useState('')
  const [state,setState]=useState('')
  const [pincode,setPincode]=useState('')

  const [nameError,setNameError]=useState('')
  const [phoneError,setPhoneError]=useState('')
  const [emailError,setEmailError]=useState('')
  const [pinError,setPinError]=useState('')
  const [addressError,setAddressError]=useState('')

  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.quantity,0)
  const shipping=subtotal>=999||subtotal===0?0:99
  const discount=0
  const total=subtotal+shipping-discount
  const totalItems=cart.reduce((sum,item)=>sum+item.quantity,0)

  async function fetchLocation(pin){
    if(pin.length!==6){
      setCity('')
      setState('')
      return
    }

    try{
      const response=await fetch(`https://api.postalpincode.in/pincode/${pin}`)
      const data=await response.json()

      if(data[0].Status==="Success"){
        setCity(data[0].PostOffice[0].District)
        setState(data[0].PostOffice[0].State)
        setPinError('')
      }else{
        setCity('')
        setState('')
        setPinError('Invalid pincode')
      }
    }catch{
      setPinError('Unable to fetch location')
    }
  }

  async function placeOrder(){
    if(cart.length===0){
      alert('Your cart is empty.')
      return
    }

    let valid=true

    setNameError('')
    setPhoneError('')
    setEmailError('')
    setPinError('')
    setAddressError('')

    if(!/^[A-Za-z ]+$/.test(customerName)){
      setNameError('Enter a valid name')
      valid=false
    }

    if(!/^[6-9]\d{9}$/.test(phone)){
      setPhoneError('Enter a valid 10 digit phone number')
      valid=false
    }

    if(email!==''&&!/^\S+@\S+\.\S+$/.test(email)){
      setEmailError('Invalid email')
      valid=false
    }

    if(!/^\d{6}$/.test(pincode)){
      setPinError('Invalid pincode')
      valid=false
    }

    if(address.trim()===''){
      setAddressError('Address is required')
      valid=false
    }

    if(!valid){
      return
    }

    const {error}=await supabase
      .from('orders')
      .insert([
        {
          customer_name:customerName,
          phone,
          email,
          address,
          city,
          state,
          pincode,
          total_amount:total,
          status:'Pending'
        }
      ])

    if(error){
      console.log(error)
    }else{
      clearCart()
      navigate('/success')
      setCustomerName('')
      setPhone('')
      setEmail('')
      setAddress('')
      setCity('')
      setState('')
      setPincode('')
    }
  }

  return(
    <div className="checkout-container">
      <div className="checkout-form">
        <h1>Secure Checkout</h1>

        <p className="checkout-subtitle">
          Complete your delivery details below.
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e)=>setCustomerName(e.target.value)}
        />

        {nameError&&<p className="error">{nameError}</p>}

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          maxLength={10}
          onChange={(e)=>setPhone(e.target.value)}
        />

        {phoneError&&<p className="error">{phoneError}</p>}

        <input
          type="email"
          placeholder="Email (Optional)"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {emailError&&<p className="error">{emailError}</p>}

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          maxLength={6}
          onChange={(e)=>{
            setPincode(e.target.value)
            fetchLocation(e.target.value)
          }}
        />

        {pinError&&<p className="error">{pinError}</p>}

        <div className="row">
          <input
            type="text"
            placeholder="City"
            value={city}
            disabled
          />

          <input
            type="text"
            placeholder="State"
            value={state}
            disabled
          />
        </div>

        <textarea
          placeholder="Full Address"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
        />

        {addressError&&<p className="error">{addressError}</p>}

        <button
          className="place-order-btn"
          onClick={placeOrder}
        >
          Place Order • ₹{total}
        </button>

      </div>

      <div className="order-summary">

        <h2>Order Summary</h2>

        <div className="summary-items">

          {cart.length===0?(
            <p className="empty-summary">
              Your cart is empty.
            </p>
          ):(
            cart.map(item=>(
              <div
                className="summary-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="summary-info">
                  <h4>{item.name}</h4>

                  <p>
                    Qty : {item.quantity}
                  </p>
                </div>

                <span className="summary-price">
                  ₹{item.price*item.quantity}
                </span>

              </div>
            ))
          )}

        </div>

        <hr />

        <div className="summary-row">

          <span>
            Subtotal ({totalItems} Items)
          </span>

          <span>
            ₹{subtotal}
          </span>

        </div>

        <div className="summary-row">

          <span>
            Delivery
          </span>

          <span>
            {shipping===0?'FREE':`₹${shipping}`}
          </span>

        </div>

        <div className="summary-row">

          <span>
            Discount
          </span>

          <span>
            ₹{discount}
          </span>

        </div>

        <hr />

        <div className="summary-row total">

          <span>
            Total
          </span>

          <span>
            ₹{total}
          </span>

        </div>

        <div className="delivery-box">

          <p>🚚 Estimated Delivery</p>

          <strong>
            3 - 5 Business Days
          </strong>

        </div>

        <div className="secure-box">
          🔒 100% Secure Checkout
        </div>

      </div>

    </div>

  )

}

export default Checkout