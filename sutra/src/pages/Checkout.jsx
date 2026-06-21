import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import './Checkout.css'
import { useNavigate } from 'react-router-dom'

function Checkout() {

  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [pinError, setPinError] = useState('')
  const [addressError, setAddressError] = useState('')

  async function fetchLocation(pin) {

    if(pin.length !== 6){

      setCity('')
      setState('')
      return

    }

    try {

      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
      const data = await response.json()

      if(data[0].Status === "Success"){

        setCity(data[0].PostOffice[0].District)
        setState(data[0].PostOffice[0].State)
        setPinError('')

      }

      else{

        setCity('')
        setState('')
        setPinError('Invalid pincode')

      }

    }

    catch{

      setPinError('Unable to fetch location')

    }

  }

  async function placeOrder(){

    let valid = true

    setNameError('')
    setPhoneError('')
    setEmailError('')
    setPinError('')
    setAddressError('')

    if(!/^[A-Za-z ]+$/.test(customerName)){

      setNameError('Enter a valid name')
      valid = false

    }

    if(!/^[6-9]\d{9}$/.test(phone)){

      setPhoneError('Enter a valid 10 digit phone number')
      valid = false

    }

    if(email !== '' && !/^\S+@\S+\.\S+$/.test(email)){

      setEmailError('Invalid email')
      valid = false

    }

    if(!/^\d{6}$/.test(pincode)){

      setPinError('Invalid pincode')
      valid = false

    }

    if(address.trim()===''){

      setAddressError('Address is required')
      valid = false

    }

    if(!valid){

      return

    }

    const { error } = await supabase

      .from('orders')

      .insert([

        {

          customer_name: customerName,

          phone,

          email,

          address,

          city,

          state,

          pincode,

          total_amount:599,

          status:'Pending'

        }

      ])


    if(error){

      console.log(error)

    }

    else{
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

        <h1>Checkout</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e)=>setCustomerName(e.target.value)}
        />

        {nameError && <p className="error">{nameError}</p>}

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          maxLength={10}
          onChange={(e)=>setPhone(e.target.value)}
        />

        {phoneError && <p className="error">{phoneError}</p>}

        <input
          type="email"
          placeholder="Email (Optional)"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {emailError && <p className="error">{emailError}</p>}

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

        {pinError && <p className="error">{pinError}</p>}

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

        {addressError && <p className="error">{addressError}</p>}

        <button onClick={placeOrder}>

          Place Order

        </button>

      </div>

    </div>

  )

}

export default Checkout