import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import './Checkout.css'

function Checkout() {

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  async function fetchLocation(pin) {

    if (pin.length !== 6) {
      setCity('')
      setState('')
      return
    }

    try {

      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      )

      const data = await response.json()

      if (data[0].Status === "Success") {

        setCity(data[0].PostOffice[0].District)
        setState(data[0].PostOffice[0].State)

      } else {

        setCity('')
        setState('')

      }

    }

    catch (error) {

      console.log(error)

    }

  }

  async function placeOrder() {

    if (!/^[A-Za-z ]+$/.test(customerName)) {
      alert('Please enter a valid name')
      return
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert('Please enter a valid 10 digit phone number')
      return
    }

    if (
      email !== '' &&
      !/^\S+@\S+\.\S+$/.test(email)
    ) {
      alert('Please enter a valid email')
      return
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert('Please enter a valid pincode')
      return
    }

    if (address.trim() === '') {
      alert('Address cannot be empty')
      return
    }

    const { error } = await supabase

      .from('orders')

      .insert([

        {

          customer_name: customerName,

          phone: phone,

          email: email,

          address: address,

          city: city,

          state: state,

          pincode: pincode,

          total_amount: 599,

          status: 'Pending'

        }

      ])

    if (error) {

      console.log(error)

      alert('Failed to place order')

    }

    else {

      alert('Order placed successfully')

      setCustomerName('')
      setPhone('')
      setEmail('')
      setAddress('')
      setCity('')
      setState('')
      setPincode('')

    }

  }

  return (

    <div className="checkout-container">

      <div className="checkout-form">

        <h1>Checkout</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          maxLength={6}
          onChange={(e) => {

            setPincode(e.target.value)

            fetchLocation(e.target.value)

          }}
        />

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
          onChange={(e) => setAddress(e.target.value)}
        />

        <button onClick={placeOrder}>

          Place Order

        </button>

      </div>

      <div className="order-summary">

        <h2>Order Summary</h2>

        <div className="summary-row">

          <span>Subtotal</span>

          <span>₹599</span>

        </div>

        <div className="summary-row">

          <span>Shipping</span>

          <span>Free</span>

        </div>

        <div className="summary-row total">

          <span>Total</span>

          <span>₹599</span>

        </div>

      </div>

    </div>

  )

}

export default Checkout