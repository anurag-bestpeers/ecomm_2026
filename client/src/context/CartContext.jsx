import { createContext, useState, useContext } from 'react';
import api from '../utils/axios';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Calculate item count
  const calculateItemCount = (cartData) => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart
  const getCart = async () => {
    if (!user) {
      setCart(null);
      setItemCount(0);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data.data);
      setItemCount(calculateItemCount(data.data));
      setLoading(false);
      return { success: true, data: data.data };
    } catch (error) {
      setLoading(false);
      console.error('Get cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch cart'
      };
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      return {
        success: false,
        message: 'Please login to add items to cart'
      };
    }

    try {
      setLoading(true);
      const { data } = await api.post('/cart/add', { productId, quantity });
      setCart(data.data);
      setItemCount(calculateItemCount(data.data));
      setLoading(false);
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart'
      };
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (!user) return { success: false, message: 'Please login' };

    try {
      setLoading(true);
      const { data } = await api.put(`/cart/item/${productId}`, { quantity });
      setCart(data.data);
      setItemCount(calculateItemCount(data.data));
      setLoading(false);
      return { success: true, data: data.data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity'
      };
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    if (!user) return { success: false, message: 'Please login' };

    try {
      setLoading(true);
      const { data } = await api.delete(`/cart/item/${productId}`);
      setCart(data.data);
      setItemCount(calculateItemCount(data.data));
      setLoading(false);
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item'
      };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return { success: false, message: 'Please login' };

    try {
      setLoading(true);
      const { data } = await api.delete('/cart');
      setCart(data.data);
      setItemCount(0);
      setLoading(false);
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        getCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
