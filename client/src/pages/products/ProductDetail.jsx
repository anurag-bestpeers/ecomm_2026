import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductContext from '../../context/ProductContext';
import CartContext from '../../context/CartContext';
import { FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, getProductById } = useContext(ProductContext);
  const { cart, addToCart, loading: cartLoading } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProductById(id);
  }, [id]);

  // Check if product is already in cart
  const isInCart = cart?.items?.some(item => item.product._id === product?._id);
  const cartItem = cart?.items?.find(item => item.product._id === product?._id);

  const handleAddToCart = async () => {
    if (isInCart) {
      setMessage(`⚠️ This item is already in your cart (${cartItem.quantity} items). Use the cart to update quantity.`);
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setMessage('✓ Added to cart!');
      setQuantity(1); // Reset quantity after adding
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`✗ ${result.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          {/* Image Gallery */}
          <div className="image-section">
            <img
              src={product.images[0] || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="info-section">
            <h1>{product.name}</h1>
            <p className="category">Category: {product.category?.name}</p>

            <div className="rating">
              <FaStar className="star" />
              <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
              <span className="count">({product.rating?.count || 0} reviews)</span>
            </div>

            <p className="price">${product.price.toFixed(2)}</p>

            <p className="stock">
              {product.stock > 0 ? (
                <span className="in-stock">{product.stock} in stock</span>
              ) : (
                <span className="out-of-stock">Out of stock</span>
              )}
            </p>

            <p className="description">{product.description}</p>

            {product.stock > 0 && (
              <div className="quantity-selector" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Quantity:
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  style={{ width: '100px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            )}

            {message && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                background: message.includes('✓')
                  ? 'rgba(34, 197, 94, 0.12)'
                  : message.includes('⚠️')
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'rgba(239, 68, 68, 0.12)',
                color: message.includes('✓')
                  ? '#16a34a'
                  : message.includes('⚠️')
                    ? '#d97706'
                    : '#dc2626',
                fontWeight: 600,
                fontSize: '0.9375rem',
                lineHeight: '1.5'
              }}>
                {message}
              </div>
            )}

            <button
              className="add-to-cart-btn"
              disabled={product.stock === 0 || cartLoading}
              onClick={handleAddToCart}
            >
              {cartLoading
                ? 'Adding...'
                : isInCart
                  ? 'Already in Cart'
                  : product.stock > 0
                    ? 'Add to Cart'
                    : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-list">
              {product.reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <strong>{review.name}</strong>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'star filled' : 'star'}
                        />
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
