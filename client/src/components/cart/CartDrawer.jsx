import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import CartItem from './CartItem';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, loading, getCart, itemCount } = useContext(CartContext);

  // Fetch cart when drawer opens or when itemCount changes
  useEffect(() => {
    if (isOpen) {
      getCart();
    }
  }, [isOpen, itemCount]);

  const totalAmount = cart?.totalAmount?.toFixed(2) || '0.00';
  const cartItemCount = cart?.items?.length || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            <FaShoppingCart /> Shopping Cart
          </h2>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>

        <div className="cart-content">
          {loading ? (
            <div className="cart-loading">Loading...</div>
          ) : cartItemCount === 0 ? (
            <div className="cart-empty">
              <FaShoppingCart className="empty-icon" />
              <p>Your cart is empty</p>
              <button onClick={onClose} className="continue-shopping">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items
                  .filter(item => item && item.product && typeof item.product === 'object' && item.product._id)
                  .map((item) => (
                    <CartItem key={item.product._id} item={item} />
                  ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${totalAmount}</span>
                </div>
                <Link to="/checkout" className="checkout-btn" onClick={onClose}>
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
