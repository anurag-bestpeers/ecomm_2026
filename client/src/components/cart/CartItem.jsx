import { useContext } from 'react';
import CartContext from '../../context/CartContext';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem, loading } = useContext(CartContext);

  const handleIncrease = async () => {
    await updateQuantity(item.product._id, item.quantity + 1);
  };

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      await updateQuantity(item.product._id, item.quantity - 1);
    }
  };

  const handleRemove = async () => {
    await removeItem(item.product._id);
  };

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.product.images?.[0] || 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image'}
          alt={item.product.name}
        />
      </div>

      <div className="cart-item-details">
        <h4>{item.product.name}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>

        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button
              onClick={handleDecrease}
              disabled={loading || item.quantity <= 1}
              className="qty-btn"
            >
              <FaMinus />
            </button>
            <span className="quantity">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={loading}
              className="qty-btn"
            >
              <FaPlus />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={loading}
            className="remove-btn"
          >
            <FaTrash />
          </button>
        </div>

        <p className="cart-item-subtotal">Subtotal: ${subtotal}</p>
      </div>
    </div>
  );
};

export default CartItem;
