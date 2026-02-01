import { createContext, useState, useContext } from 'react';
import api from '../utils/axios';
import AuthContext from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create order from cart
  const createOrder = async (shippingAddress, paymentMethod = 'cod') => {
    if (!user) {
      return {
        success: false,
        message: 'Please login to place an order'
      };
    }

    try {
      setLoading(true);
      const { data } = await api.post('/orders', {
        shippingAddress,
        paymentMethod
      });
      setCurrentOrder(data.data);
      setLoading(false);
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order'
      };
    }
  };

  // Get user's orders
  const getMyOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data.data);
      setLoading(false);
      return { success: true, data: data.data };
    } catch (error) {
      setLoading(false);
      console.error('Get my orders error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  };

  // Get order by ID
  const getOrderById = async (id) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setCurrentOrder(data.data);
      setLoading(false);
      return { success: true, data: data.data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  };

  // Get all orders (admin)
  const getAllOrders = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ page });
      if (status) queryParams.append('status', status);

      const { data } = await api.get(`/orders?${queryParams}`);
      setOrders(data.data);
      setLoading(false);
      return { success: true, data: data.data, pagination: data.pagination };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  };

  // Update order status (admin)
  const updateOrderStatus = async (id, status) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/orders/${id}/status`, { status });

      // Update order in orders list
      setOrders(orders.map(order =>
        order._id === id ? data.data : order
      ));

      // Update current order if it's the same
      if (currentOrder?._id === id) {
        setCurrentOrder(data.data);
      }

      setLoading(false);
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        createOrder,
        getMyOrders,
        getOrderById,
        getAllOrders,
        updateOrderStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
