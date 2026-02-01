import { useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderContext from '../../context/OrderContext';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

const OrderDetail = () => {
  const { id } = useParams();
  const { currentOrder, getOrderById, loading } = useContext(OrderContext);

  useEffect(() => {
    if (id) {
      getOrderById(id);
    }
  }, [id]);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!currentOrder) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link">
          <FaArrowLeft /> Back to Orders
        </Link>

        <div className="order-detail-header">
          <div>
            <h1>Order #{currentOrder._id.slice(-8).toUpperCase()}</h1>
            <p className="order-date">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`status-badge ${getStatusBadgeClass(currentOrder.orderStatus)}`}>
            {currentOrder.orderStatus.charAt(0).toUpperCase() + currentOrder.orderStatus.slice(1)}
          </span>
        </div>

        {/* Order Status Timeline */}
        <div className="order-timeline">
          <div className={`timeline-step ${['pending', 'processing', 'shipped', 'delivered'].includes(currentOrder.orderStatus) ? 'completed' : ''}`}>
            <div className="step-icon"><FaBox /></div>
            <div className="step-label">Order Placed</div>
          </div>
          <div className={`timeline-step ${['processing', 'shipped', 'delivered'].includes(currentOrder.orderStatus) ? 'completed' : ''}`}>
            <div className="step-icon"><FaBox /></div>
            <div className="step-label">Processing</div>
          </div>
          <div className={`timeline-step ${['shipped', 'delivered'].includes(currentOrder.orderStatus) ? 'completed' : ''}`}>
            <div className="step-icon"><FaTruck /></div>
            <div className="step-label">Shipped</div>
          </div>
          <div className={`timeline-step ${currentOrder.orderStatus === 'delivered' ? 'completed' : ''}`}>
            <div className="step-icon"><FaCheckCircle /></div>
            <div className="step-label">Delivered</div>
          </div>
        </div>

        <div className="order-detail-grid">
          {/* Order Items */}
          <div className="order-items-section">
            <h2>Order Items</h2>
            {currentOrder.orderItems.map((item, index) => (
              <div key={index} className="order-detail-item">
                <img src={item.image || 'https://placehold.co/80x80'} alt={item.name} />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            {/* Shipping Address */}
            <div className="summary-card">
              <h3>Shipping Address</h3>
              <p><strong>{currentOrder.shippingAddress.fullName}</strong></p>
              <p>{currentOrder.shippingAddress.address}</p>
              <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}</p>
              <p>{currentOrder.shippingAddress.country}</p>
              <p>Phone: {currentOrder.shippingAddress.phone}</p>
            </div>

            {/* Payment Info */}
            <div className="summary-card">
              <h3>Payment Information</h3>
              <p><strong>Method:</strong> {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : currentOrder.paymentMethod.toUpperCase()}</p>
              <p><strong>Status:</strong> <span className={`payment-status ${currentOrder.paymentStatus}`}>
                {currentOrder.paymentStatus.charAt(0).toUpperCase() + currentOrder.paymentStatus.slice(1)}
              </span></p>
            </div>

            {/* Order Totals */}
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items:</span>
                <span>${currentOrder.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>${currentOrder.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${currentOrder.taxPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${currentOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
