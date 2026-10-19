
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import './AdminDashboard.css'

const EMPTY_FORM = {
  name: '',
  price: '',
  original_price: '',
  category: 'Necklaces',
  description: '',
  material: '',
  image: '',
  rating: '0',
}

const CATEGORIES = [
  'Earrings',
  'Necklaces',
  'Chains',
  'Bracelets',
  'Hair Clips',
  'Sets',
]

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [productToDelete, setProductToDelete] = useState(null)
const [deleting, setDeleting] = useState(false)

  const checkAdmin = useCallback(async () => {
    setCheckingAdmin(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user) {
        setIsAdmin(false)
        return
      }

      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error

      setIsAdmin(Boolean(data))
    } catch (error) {
      console.error('Admin verification failed:', error)
      setIsAdmin(false)
      setErrorMessage('Unable to verify admin access. Please refresh.')
    } finally {
      setCheckingAdmin(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Orders error:', error)
      setErrorMessage((current) =>
        current || 'Could not load orders. Check the orders table permissions.'
      )
      return
    }

    setOrders(data || [])
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Products error:', error)
      setErrorMessage('Could not load products: ' + error.message)
    } else {
      setProducts(data || [])
    }

    setLoadingProducts(false)
  }, [])

  useEffect(() => {
    checkAdmin()
  }, [checkAdmin])

  useEffect(() => {
    if (isAdmin) {
      fetchOrders()
      fetchProducts()
    }
  }, [isAdmin, fetchOrders, fetchProducts])

  function handleFormChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function startEditing(product) {
    setEditingId(product.id)
    setSelectedImage(null)
    setMessage('')
    setErrorMessage('')

    setForm({
      name: product.name || '',
      price: product.price ?? '',
      original_price: product.original_price ?? '',
      category: product.category || 'Necklaces',
      description: product.description || '',
      material: product.material || '',
      image: product.image || '',
      rating: product.rating ?? '0',
    })

    document.getElementById('product-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setSelectedImage(null)
    setMessage('')
    setErrorMessage('')

    const fileInput = document.getElementById('product-image-file')
    if (fileInput) fileInput.value = ''
  }

  async function uploadProductImage(file) {
    if (!file) return form.image

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.')
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Use a JPG, PNG, WEBP or GIF image.')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be 5 MB or less.')
    }

    setUploading(true)

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filePath = `products/${crypto.randomUUID()}.${extension}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (error) throw error

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  function getStoragePath(imageUrl) {
    if (!imageUrl) return null

    try {
      const url = new URL(imageUrl)
      const marker = '/storage/v1/object/public/product-images/'

      if (!url.pathname.includes(marker)) return null

      const path = url.pathname.split(marker)[1]
      return path ? decodeURIComponent(path) : null
    } catch {
      return null
    }
  }

  async function removeStorageImage(imageUrl) {
    const path = getStoragePath(imageUrl)
    if (!path) return

    const { error } = await supabase.storage
      .from('product-images')
      .remove([path])

    if (error) {
      console.error('Image cleanup failed:', error)
    }
  }

  async function handleSaveProduct(event) {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    if (!form.name.trim()) {
      setErrorMessage('Product name is required.')
      return
    }

    const price = Number(form.price)

    if (!Number.isFinite(price) || price < 0) {
      setErrorMessage('Enter a valid product price.')
      return
    }

    if (
      form.original_price !== '' &&
      (!Number.isFinite(Number(form.original_price)) ||
        Number(form.original_price) < 0)
    ) {
      setErrorMessage('Enter a valid original price.')
      return
    }

    if (
      form.rating !== '' &&
      (!Number.isFinite(Number(form.rating)) ||
        Number(form.rating) < 0 ||
        Number(form.rating) > 5)
    ) {
      setErrorMessage('Rating must be between 0 and 5.')
      return
    }

    setSaving(true)

    let uploadedImageUrl = null

    try {
      let imageUrl = form.image.trim()

      if (selectedImage) {
        imageUrl = await uploadProductImage(selectedImage)
        uploadedImageUrl = imageUrl
      }

      const productData = {
        name: form.name.trim(),
        price,
        original_price:
          form.original_price === ''
            ? null
            : Math.round(Number(form.original_price)),
        category: form.category,
        description: form.description.trim() || null,
        material: form.material.trim() || null,
        image: imageUrl || null,
        rating: form.rating === '' ? null : Number(form.rating),
      }

      let result

      if (editingId) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)
          .select()
          .single()
      } else {
        result = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      const previousProduct = editingId
        ? products.find((product) => product.id === editingId)
        : null

      if (
        selectedImage &&
        previousProduct?.image &&
        previousProduct.image !== imageUrl
      ) {
        await removeStorageImage(previousProduct.image)
      }

      setMessage(editingId ? 'Product updated successfully.' : 'Product added successfully.')
      resetForm()
      await fetchProducts()
    } catch (error) {
      console.error('Save product failed:', error)

      if (uploadedImageUrl) {
        await removeStorageImage(uploadedImageUrl)
      }

      setErrorMessage(error.message || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  

async function handleDeleteProduct() {
  if (!productToDelete || deleting) return

  setDeleting(true)
  setErrorMessage('')
  setMessage('')

  const product = productToDelete

  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)
      .select('id')

    if (error) throw error

    if (!data || data.length === 0) {
      throw new Error(
        'No product was deleted. Check the admin DELETE policy.'
      )
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    )

    if (editingId === product.id) {
      resetForm()
    }

    setProductToDelete(null)
    setMessage('Product deleted successfully.')

    // Image cleanup is separate from deleting the product record.
    await removeStorageImage(product.image)
  } catch (error) {
    console.error('Delete product failed:', error)
    setErrorMessage(`Could not delete product: ${error.message}`)
  } finally {
    setDeleting(false)
  }
}


  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    (order) => order.status?.toLowerCase() === 'pending'
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.status?.toLowerCase() === 'delivered'
  ).length

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  )

  if (checkingAdmin) {
    return (
      <div className="admin-container">
        <h1>Checking access...</h1>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <h1>Access Denied</h1>
        <p>You do not have permission to access the admin dashboard.</p>
      </div>
    )
  }

  return (
    <main className="admin-container">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">SUTRĀ STORE MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      {errorMessage && (
        <div className="admin-alert admin-alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      {message && (
        <div className="admin-alert admin-alert-success" role="status">
          {message}
        </div>
      )}

      <section className="cards" aria-label="Order statistics">
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
          <p>₹{revenue.toLocaleString('en-IN')}</p>
        </div>
      </section>

      <section className="admin-section" id="product-form">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">CATALOGUE</p>
            <h2>{editingId ? 'Edit Product' : 'Add a Product'}</h2>
          </div>
          {editingId && (
            <button
              className="admin-button admin-button-secondary"
              type="button"
              onClick={resetForm}
            >
              Cancel editing
            </button>
          )}
        </div>

        <form className="product-form" onSubmit={handleSaveProduct}>
          <div className="product-form-grid">
            <label>
              Product name *
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="e.g. Floral Thread Necklace"
                required
              />
            </label>

            <label>
              Price (₹) *
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleFormChange}
                required
              />
            </label>

            <label>
              Original price (₹)
              <input
                name="original_price"
                type="number"
                min="0"
                step="1"
                value={form.original_price}
                onChange={handleFormChange}
              />
            </label>

            <label>
              Category *
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Material
              <input
                name="material"
                value={form.material}
                onChange={handleFormChange}
                placeholder="e.g. Cotton thread, brass"
              />
            </label>

            <label>
              Rating (0–5)
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleFormChange}
              />
            </label>

            <label className="product-form-full">
              Description
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Describe the jewellery piece..."
              />
            </label>

            <label className="product-form-full">
              Product image
              <input
                id="product-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) =>
                  setSelectedImage(event.target.files?.[0] || null)
                }
              />
              <span className="field-hint">
                Optional. JPG, PNG, WEBP or GIF, up to 5 MB.
                {editingId && ' Leave empty to keep the existing image.'}
              </span>
            </label>

            {form.image && !selectedImage && (
              <div className="product-image-preview product-form-full">
                <span>Current image</span>
                <img src={form.image} alt="Current product" />
              </div>
            )}

            {selectedImage && (
              <div className="product-image-preview product-form-full">
                <span>Selected image: {selectedImage.name}</span>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected product preview"
                />
              </div>
            )}
          </div>

          <div className="product-form-actions">
            <button
              className="admin-button admin-button-primary"
              type="submit"
              disabled={saving || uploading}
            >
              {uploading
                ? 'Uploading image...'
                : saving
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Add Product'}
            </button>

            <button
              className="admin-button admin-button-secondary"
              type="button"
              onClick={resetForm}
            >
              Clear Form
            </button>
          </div>
        </form>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">YOUR INVENTORY</p>
            <h2>Manage Products ({products.length})</h2>
          </div>
          <button
            className="admin-button admin-button-secondary"
            type="button"
            onClick={fetchProducts}
            disabled={loadingProducts}
          >
            {loadingProducts ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loadingProducts && products.length === 0 ? (
          <p className="admin-empty-state">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No products found</h3>
            <p>Add your first jewellery product using the form above.</p>
          </div>
        ) : (
          <div className="admin-product-grid">
            {products.map((product) => (
              <article className="admin-product-card" key={product.id}>
                <div className="admin-product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name || 'Product'} />
                  ) : (
                    <div className="admin-no-image">No image</div>
                  )}
                </div>

                <div className="admin-product-info">
                  <span className="admin-product-category">
                    {product.category || 'Uncategorised'}
                  </span>
                  <h3>{product.name || 'Untitled product'}</h3>
                  <p className="admin-product-material">
                    {product.material || 'Material not specified'}
                  </p>
                  <div className="admin-product-prices">
                    <strong>
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </strong>
                    {product.original_price &&
                      Number(product.original_price) > Number(product.price) && (
                        <del>
                          ₹{Number(product.original_price).toLocaleString('en-IN')}
                        </del>
                      )}
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="admin-button admin-button-secondary"
                      onClick={() => startEditing(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button-danger"
                      onClick={() => {
                        setErrorMessage('')
                        setMessage('')
                        setProductToDelete(product)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">FULFILMENT</p>
            <h2>Recent Orders ({orders.length})</h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="admin-empty-state">
            <p>No orders found.</p>
          </div>
        ) : (
          orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <h3>{order.customer_name || 'Customer'}</h3>
                <p>{order.phone || 'No phone number'}</p>
                <span className="order-date">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString('en-IN')
                    : ''}
                </span>
              </div>
              <strong>
                ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
              </strong>
              <span
                className={`order-status ${
                  order.status?.toLowerCase() || 'unknown'
                }`}
              >
                {order.status || 'Unknown'}
              </span>
            </article>
          ))
        )}
      </section>

      {productToDelete && (
        <div
          className="delete-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setProductToDelete(null)
            }
          }}
        >
          <div
            className="delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <h2 id="delete-dialog-title">Delete product?</h2>
            <p id="delete-dialog-description">
              Are you sure you want to delete "{productToDelete.name}"? This
              action cannot be undone.
            </p>
            <div className="delete-dialog-actions">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-button admin-button-danger"
                disabled={deleting}
                onClick={handleDeleteProduct}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminDashboard
