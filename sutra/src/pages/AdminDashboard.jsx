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
  images: [],
  rating: '0',
  is_active: true,
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
  const [selectedImages, setSelectedImages] = useState([])
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [productToToggle, setProductToToggle] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [productFilter, setProductFilter] = useState('all')

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

  async function handleOrderStatusChange(orderId, nextStatus) {
    const currentOrder = orders.find((order) => order.id === orderId)
    if (!currentOrder || currentOrder.status === nextStatus || updatingOrderId) return

    setUpdatingOrderId(orderId)
    setErrorMessage('')
    setMessage('')

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId)
        .select('*')
        .single()

      if (error) throw error
      if (!data) throw new Error('The order status was not updated.')

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, ...data } : order))
      )
      setMessage(`Order status updated to ${nextStatus}.`)
    } catch (error) {
      console.error('Order status update failed:', error)
      setErrorMessage(
        `Could not update order status. ${error.message || 'Please try again.'}`
      )
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const ORDER_STATUSES = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ]

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
    setSelectedImages([])
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
      images: Array.isArray(product.images) && product.images.length ? product.images : (product.image ? [product.image] : []),
      rating: product.rating ?? '0',
      is_active: product.is_active ?? true,
    })

    document.getElementById('product-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setSelectedImages([])
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

    let uploadedImageUrls = []

    try {
      const newlyUploadedUrls = []
      for (const file of selectedImages) {
        const uploadedUrl = await uploadProductImage(file)
        newlyUploadedUrls.push(uploadedUrl)
        uploadedImageUrls.push(uploadedUrl)
      }

      // Preserve existing gallery images and append newly uploaded images.
      const existingImages = (form.images || []).filter(Boolean)
      const galleryImages = [...existingImages, ...newlyUploadedUrls]
      const uniqueGalleryImages = [...new Set(galleryImages)]
      const imageUrl = uniqueGalleryImages[0] || form.image.trim() || null

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
        image: imageUrl,
        images: uniqueGalleryImages,
        rating: form.rating === '' ? null : Number(form.rating),
        is_active: form.is_active ?? true,
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

      setMessage(editingId ? 'Product updated successfully.' : 'Product added successfully.')
      resetForm()
      await fetchProducts()
    } catch (error) {
      console.error('Save product failed:', error)

      for (const uploadedUrl of uploadedImageUrls) {
        await removeStorageImage(uploadedUrl)
      }

      setErrorMessage(error.message || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  

  async function handleToggleProductStatus() {
    if (!productToToggle || updatingStatus) return

    setUpdatingStatus(true)
    setErrorMessage('')
    setMessage('')

    const product = productToToggle
    const nextIsActive = !(product.is_active ?? true)

    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: nextIsActive })
        .eq('id', product.id)
        .select('id, is_active')
        .single()

      if (error) throw error
      if (!data) throw new Error('The product status was not updated.')

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, is_active: data.is_active }
            : item
        )
      )

      setProductToToggle(null)
      setMessage(
        nextIsActive
          ? `${product.name || 'Product'} restored successfully.`
          : `${product.name || 'Product'} archived successfully.`
      )
    } catch (error) {
      console.error('Product status update failed:', error)
      setErrorMessage(`Could not update product status: ${error.message}`)
    } finally {
      setUpdatingStatus(false)
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
        <div className="card">
          <h3>Active Products</h3>
          <p>{products.filter((product) => product.is_active ?? true).length}</p>
        </div>
        <div className="card">
          <h3>Archived Products</h3>
          <p>{products.filter((product) => !(product.is_active ?? true)).length}</p>
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
              Product status
              <select
                name="is_active"
                value={form.is_active ? 'active' : 'archived'}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    is_active: event.target.value === 'active',
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
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

            <div className="product-form-full admin-gallery-field">
              <label htmlFor="product-image-file">Product images</label>
              <input
                id="product-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(event) =>
                  setSelectedImages(Array.from(event.target.files || []))
                }
              />
              <span className="field-hint">
                Select multiple images at once. JPG, PNG, WEBP or GIF, up to 5 MB per image.
                {editingId && ' Existing images are kept; new images are added to the gallery.'}
                {!editingId && ' The first image will be the main product image.'}
              </span>

              {(form.images || []).length > 0 && (
                <div className="admin-gallery-preview">
                  <p className="admin-gallery-title">Current product gallery</p>
                  <div className="admin-gallery-thumbnails">
                    {form.images.map((imageUrl, index) => (
                      <div className="admin-gallery-thumbnail" key={`${imageUrl}-${index}`}>
                        <img src={imageUrl} alt={`Product image ${index + 1}`} />
                        {index === 0 && <span>Main image</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedImages.length > 0 && (
                <div className="admin-gallery-preview">
                  <p className="admin-gallery-title">
                    New images selected ({selectedImages.length})
                  </p>
                  <div className="admin-gallery-thumbnails">
                    {selectedImages.map((file, index) => (
                      <div className="admin-gallery-thumbnail" key={`${file.name}-${file.lastModified}-${index}`}>
                        <img src={URL.createObjectURL(file)} alt={`Selected product image ${index + 1}`} />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            <p className="field-hint">
              {products.filter((product) => product.is_active ?? true).length} active ·{' '}
              {products.filter((product) => !(product.is_active ?? true)).length} archived
            </p>
          </div>
          <label className="admin-product-filter">
            Show
            <select
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
            >
              <option value="all">All products</option>
              <option value="active">Active only</option>
              <option value="archived">Archived only</option>
            </select>
          </label>
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
        ) : products.filter((product) => {
          const active = product.is_active ?? true
          if (productFilter === 'active') return active
          if (productFilter === 'archived') return !active
          return true
        }).length === 0 ? (
          <div className="admin-empty-state">
            <h3>No products in this view</h3>
            <p>Try another filter or add a product.</p>
          </div>
        ) : (
          <div className="admin-product-grid">
            {products
              .filter((product) => {
                const active = product.is_active ?? true
                if (productFilter === 'active') return active
                if (productFilter === 'archived') return !active
                return true
              })
              .map((product) => (
              <article className={`admin-product-card ${!(product.is_active ?? true) ? 'is-archived' : ''}`} key={product.id}>
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
                  <span className={`admin-product-status ${(product.is_active ?? true) ? 'is-active' : 'is-archived'}`}>
                    {(product.is_active ?? true) ? 'Active' : 'Archived'}
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
                      className={`admin-button ${(product.is_active ?? true) ? 'admin-button-danger' : 'admin-button-primary'}`}
                      onClick={() => {
                        setErrorMessage('')
                        setMessage('')
                        setProductToToggle(product)
                      }}
                    >
                      {(product.is_active ?? true) ? 'Archive' : 'Restore'}
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
              <div className="order-status-controls">
                <span
                  className={`order-status ${
                    order.status?.toLowerCase() || 'unknown'
                  }`}
                >
                  {order.status || 'Unknown'}
                </span>
                <label className="order-status-editor">
                  <span>Update status</span>
                  <select
                    value={order.status || 'Pending'}
                    onChange={(event) =>
                      handleOrderStatusChange(order.id, event.target.value)
                    }
                    disabled={updatingOrderId !== null}
                    aria-label={`Update status for order ${order.id}`}
                  >
                    {!ORDER_STATUSES.includes(order.status) && order.status && (
                      <option value={order.status}>{order.status}</option>
                    )}
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {updatingOrderId === order.id && (
                    <small role="status">Saving status...</small>
                  )}
                </label>
              </div>
            </article>
          ))
        )}
      </section>

      {productToToggle && (
        <div
          className="delete-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !updatingStatus) {
              setProductToToggle(null)
            }
          }}
        >
          <div
            className="delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="status-dialog-title"
            aria-describedby="status-dialog-description"
          >
            <h2 id="status-dialog-title">
              {(productToToggle.is_active ?? true) ? 'Archive product?' : 'Restore product?'}
            </h2>
            <p id="status-dialog-description">
              {(productToToggle.is_active ?? true)
                ? `“${productToToggle.name}” will be hidden from the storefront. Existing order records will be preserved.`
                : `“${productToToggle.name}” will become visible in the storefront again.`}
            </p>
            <div className="delete-dialog-actions">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={updatingStatus}
                onClick={() => setProductToToggle(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`admin-button ${(productToToggle.is_active ?? true) ? 'admin-button-danger' : 'admin-button-primary'}`}
                disabled={updatingStatus}
                onClick={handleToggleProductStatus}
              >
                {updatingStatus
                  ? 'Updating...'
                  : (productToToggle.is_active ?? true)
                    ? 'Yes, Archive'
                    : 'Yes, Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminDashboard
