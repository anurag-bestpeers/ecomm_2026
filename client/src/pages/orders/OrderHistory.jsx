import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderContext from '../../context/OrderContext';
import { FaBox, FaEye } from 'react-icons/fa';

const OrderHistory = () => {
  const { orders, getMyOrders, loading } = useContext(OrderContext);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyOrders();
  }, []);

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

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === filter);

  return (
    <div className="order-history-page">
      <div className="container">
        <h1>My Orders</h1>

        <div className="order-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'processing' ? 'active' : ''}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button
            className={filter === 'shipped' ? 'active' : ''}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button
            className={filter === 'delivered' ? 'active' : ''}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">
            <FaBox className="empty-icon" />
            <p>No orders found</p>
            <Link to="/products" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                <div className="order-body">
                  <div className="order-items-preview">
                    <p><strong>{order.orderItems.length}</strong> item(s)</p>
                    <div className="items-images">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image || 'https://placehold.co/40x40'}
                          alt={item.name}
                        />
                      ))}
                      {order.orderItems.length > 3 && (
                        <span className="more-items">+{order.orderItems.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="order-total">
                    <span className="label">Total:</span>
                    <span className="amount">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <Link to={`/orders/${order._id}`} className="view-details-btn">
                    <FaEye /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
