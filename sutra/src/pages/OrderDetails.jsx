
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { AuthContext } from '../context/AuthContext'
import './OrderDetails.css'

function OrderDetails() {
  const { id } = useParams()
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [ratings, setRatings] = useState({
    overall_rating: 0,
    product_quality_rating: 0,
    delivery_rating: 0
  })
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      navigate('/login')
      return
    }

    fetchOrder()
  }, [user, authLoading, id])

  async function fetchOrder() {
    setLoading(true)

    const { data, error } = await supabase
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
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      setOrder(null)
      setLoading(false)
      return
    }

    setOrder(data)
    setLoading(false)

    await fetchFeedback()
  }

  async function fetchFeedback() {
    setFeedbackLoading(true)

    const { data, error } = await supabase
      .from('order_feedback')
      .select('*')
      .eq('order_id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching feedback:', error)
      setFeedbackError('Unable to load feedback right now.')
    } else if (data) {
      setFeedback(data)
      setRatings({
        overall_rating: data.overall_rating,
        product_quality_rating: data.product_quality_rating,
        delivery_rating: data.delivery_rating
      })
      setComment(data.comment || '')
    }

    setFeedbackLoading(false)
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function getStatusClass(status) {
    return status?.toLowerCase().replace(/\s+/g, '-')
  }

  function selectRating(field, value) {
    setRatings(previous => ({
      ...previous,
      [field]: value
    }))
    setFeedbackMessage('')
    setFeedbackError('')
  }

  async function submitFeedback(event) {
    event.preventDefault()
    setFeedbackMessage('')
    setFeedbackError('')

    if (
      !ratings.overall_rating ||
      !ratings.product_quality_rating ||
      !ratings.delivery_rating
    ) {
      setFeedbackError('Please provide all three ratings.')
      return
    }

    setSubmitting(true)

    const payload = {
      order_id: order.id,
      user_id: user.id,
      overall_rating: ratings.overall_rating,
      product_quality_rating: ratings.product_quality_rating,
      delivery_rating: ratings.delivery_rating,
      comment: comment.trim() || null
    }

    const { data, error } = await supabase
      .from('order_feedback')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error submitting feedback:', error)

      if (error.code === '23505') {
        setFeedbackError('Feedback has already been submitted for this order.')
        await fetchFeedback()
      } else {
        setFeedbackError(
          'We could not submit your feedback. Please try again.'
        )
      }
    } else {
      setFeedback(data)
      setFeedbackMessage('Thank you! Your feedback has been submitted.')
    }

    setSubmitting(false)
  }

  function renderRating(label, field) {
    return (
      <fieldset className="feedback-rating-group">
        <legend>{label} <span>*</span></legend>

        <div
          className="feedback-stars"
          role="group"
          aria-label={label}
        >
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              className={`feedback-star ${
                value <= ratings[field] ? 'selected' : ''
              }`}
              onClick={() => selectRating(field, value)}
              aria-label={`${value} out of 5 stars`}
              aria-pressed={ratings[field] === value}
              disabled={Boolean(feedback) || submitting}
            >
              {value <= ratings[field] ? '★' : '☆'}
            </button>
          ))}
        </div>

        <p className="feedback-rating-hint">
          {ratings[field] === 0
            ? 'Select a rating'
            : ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][ratings[field]]}
        </p>
      </fieldset>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">
          <h2>Loading Order</h2>
          <p>Please wait while we fetch your order details.</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">
          <h2>Order Not Found</h2>
          <p>We could not find this order.</p>
          <button onClick={() => navigate('/orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
    )
  }

  const isDelivered = order.status?.toLowerCase() === 'delivered'

  return (
    <div className="order-details-page">
      <div className="order-details-header">
        <button
          className="back-orders-btn"
          onClick={() => navigate('/orders')}
        >
          ← Back to My Orders
        </button>

        <div className="order-details-title">
          <div>
            <p className="order-details-label">ORDER</p>
            <h1>{order.order_number}</h1>
            <p>Placed on {formatDate(order.created_at)}</p>
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
            <span className="delivery-details-icon">🚚</span>
            <div>
              <strong>
                {isDelivered ? 'Your order has been delivered' : '3 - 5 Business Days'}
              </strong>
            </div>
          </div>
        </div>

        <div className="order-details-section">
          <h2>Items Summary</h2>

          <div className="items-summary-content">
            <div className="order-details-items">
              {order.order_items?.map((item, index) => (
                <div
                  className="order-details-item"
                  key={`${order.id}-${index}`}
                >
                  <img src={item.product_image} alt={item.product_name} />
                  <div className="order-details-item-info">
                    <h3>{item.product_name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-details-summary">
              <div>
                <span>Total Amount</span>
                <span>
                  ₹{Number(order.total_amount || 0) + Number(order.discount || 0)}
                </span>
              </div>

              <div>
                <span>Discount</span>
                <span className="discount-value">
                  -₹{Number(order.discount || 0)}
                </span>
              </div>

              <div>
                <span>Shipping</span>
                <span className="free-value">FREE</span>
              </div>

              <div className="order-details-total">
                <span>Grand Total</span>
                <strong>₹{Number(order.total_amount || 0)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="order-details-section">
          <h2>Delivery Address</h2>
          <div className="order-details-address">
            <strong>{order.customer_name}</strong>
            <p>{order.address}</p>
            <p>{order.city}, {order.state} - {order.pincode}</p>
            <p>{order.phone}</p>
          </div>
        </div>

        <div className="order-feedback-section">
          <div className="order-feedback-heading">
            <p className="order-feedback-eyebrow">YOUR EXPERIENCE</p>
            <h2>Share Your Feedback</h2>
            <p>
              Your feedback helps us make every Sutrā purchase better.
            </p>
          </div>

          {!isDelivered ? (
            <div className="feedback-not-available">
              <span>Feedback will be available once your order is delivered.</span>
            </div>
          ) : feedbackLoading ? (
            <p className="feedback-loading">Checking your feedback...</p>
          ) : feedback ? (
            <div className="feedback-submitted">
              <span className="feedback-success-icon">✓</span>
              <h3>Thank you for your feedback</h3>

              <div className="feedback-submitted-ratings">
                <p>Overall experience: <strong>{feedback.overall_rating}/5 ★</strong></p>
                <p>Product quality: <strong>{feedback.product_quality_rating}/5 ★</strong></p>
                <p>Delivery experience: <strong>{feedback.delivery_rating}/5 ★</strong></p>
              </div>

              {feedback.comment && (
                <p className="feedback-submitted-comment">
                  “{feedback.comment}”
                </p>
              )}
            </div>
          ) : (
            <form className="order-feedback-form" onSubmit={submitFeedback}>
              {renderRating('Overall experience', 'overall_rating')}
              {renderRating('Product quality', 'product_quality_rating')}
              {renderRating('Packaging and delivery', 'delivery_rating')}

              <div className="feedback-comment-group">
                <label htmlFor="order-feedback-comment">
                  Your comments <span>(optional)</span>
                </label>
                <textarea
                  id="order-feedback-comment"
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  placeholder="Tell us what you liked or what we could improve..."
                  maxLength={1000}
                  rows={4}
                  disabled={submitting}
                />
                <small>{comment.length}/1000 characters</small>
              </div>

              {feedbackError && (
                <p className="feedback-error" role="alert">{feedbackError}</p>
              )}

              {feedbackMessage && (
                <p className="feedback-success" role="status">{feedbackMessage}</p>
              )}

              <button
                className="feedback-submit-btn"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>

        <div className="order-help-section">
          <span>Need help with this order?</span>
          <a
            href={`mailto:support@sutra.com?subject=Help with Order ${order.order_number}`}
            className="order-help-btn"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
