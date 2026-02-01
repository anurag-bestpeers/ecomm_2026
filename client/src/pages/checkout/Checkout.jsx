import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import OrderContext from '../../context/OrderContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useContext(CartContext);
  const { createOrder, loading: orderLoading } = useContext(OrderContext);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    // Redirect if cart is empty
    if (!cartLoading && (!cart || cart.items?.length === 0)) {
      navigate('/products');
    }
  }, [cart, cartLoading, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!shippingAddress.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Please fill in all required fields correctly');
      return;
    }

    const result = await createOrder(shippingAddress, paymentMethod);

    if (result.success && result.data) {
      // Clear cart badge by fetching the empty cart from server
      await getCart();
      navigate(`/orders/confirmation/${result.data._id}`);
    } else if (result.success && !result.data) {
      setMessage("Order placed, but failed to retrieve order details. Please check 'My Orders'.");
    } else {
      setMessage(result.message);
    }
  };

  if (cartLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!cart || cart.items?.length === 0) {
    return null; // Will redirect
  }

  const itemsPrice = cart.totalAmount || 0;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          {/* Shipping Address Form */}
          <div className="shipping-form-section">
            <h2>Shipping Address</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    className={errors.postalCode ? 'error' : ''}
                  />
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+1 234 567 8900"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {message && (
                <div className="form-message error">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="place-order-btn"
                disabled={orderLoading}
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <img
                    src={item.product.images?.[0] || 'https://placehold.co/60x60'}
                    alt={item.product.name}
                  />
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Items:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-method">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="card">Credit/Debit Card</label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
              <p className="payment-note">
                {paymentMethod === 'cod'
                  ? 'Pay when you receive your order'
                  : `Payment via ${paymentMethod === 'card' ? 'Card' : 'PayPal'} will be processed in the next step.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
