import { useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import OrderContext from '../../context/OrderContext';
import { FaCheckCircle, FaBox } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, getOrderById, loading } = useContext(OrderContext);

  useEffect(() => {
    if (id) {
      getOrderById(id);
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentOrder) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h1>Order Placed Successfully!</h1>
          <p className="confirmation-message">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          <div className="order-info">
            <div className="info-row">
              <span className="label">Order ID:</span>
              <span className="value">#{currentOrder._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="label">Order Date:</span>
              <span className="value">{new Date(currentOrder.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Total Amount:</span>
              <span className="value total-amount">${currentOrder.totalPrice.toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="label">Payment Method:</span>
              <span className="value">{currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : currentOrder.paymentMethod.toUpperCase()}</span>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Shipping Address</h3>
            <p>{currentOrder.shippingAddress.fullName}</p>
            <p>{currentOrder.shippingAddress.address}</p>
            <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}</p>
            <p>{currentOrder.shippingAddress.country}</p>
            <p>Phone: {currentOrder.shippingAddress.phone}</p>
          </div>

          <div className="order-items">
            <h3><FaBox /> Items Ordered ({currentOrder.orderItems.length})</h3>
            {currentOrder.orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image || 'https://placehold.co/60x60'} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="view-orders-btn">
              View My Orders
            </Link>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
