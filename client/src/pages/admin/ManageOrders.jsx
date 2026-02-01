import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderContext from '../../context/OrderContext';
import { FaEye, FaSearch } from 'react-icons/fa';

const ManageOrders = () => {
  const { orders, getAllOrders, updateOrderStatus, loading } = useContext(OrderContext);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    getAllOrders(1, filter);
  }, [filter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    setUpdatingOrder(null);

    if (result.success) {
      // Refresh orders
      getAllOrders(1, filter);
    }
  };

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

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="manage-orders-page">
      <div className="container">
        <div className="header">
          <h1>Manage Orders</h1>
        </div>

        <div className="orders-controls">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={filter === '' ? 'active' : ''}
              onClick={() => setFilter('')}
            >
              All
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
        </div>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <strong>{order.user?.name}</strong>
                        <span className="email">{order.user?.email}</span>
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.orderItems.length}</td>
                    <td><strong>${order.totalPrice.toFixed(2)}</strong></td>
                    <td>
                      <span className="payment-label">
                        {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updatingOrder === order._id}
                        className={`status-select ${getStatusBadgeClass(order.orderStatus)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/orders/${order._id}`} className="view-btn">
                        <FaEye /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
