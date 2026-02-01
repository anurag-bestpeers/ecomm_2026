import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount, getCart } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsCartOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            ShopHub
          </Link>

          <div className="navbar-menu">
            <Link to="/products" className="nav-link">
              Products
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="nav-link">
                  My Orders
                </Link>

                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/products" className="nav-link">
                      Products
                    </Link>
                    <Link to="/admin/orders" className="nav-link">
                      Orders
                    </Link>
                  </>
                )}

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="cart-btn"
                >
                  <FaShoppingCart />
                  {itemCount > 0 && (
                    <span className="cart-badge">{itemCount}</span>
                  )}
                </button>

                <div className="user-menu">
                  <FaUser />
                  <span>{user.name}</span>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
