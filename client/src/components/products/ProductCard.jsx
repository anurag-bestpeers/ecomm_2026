import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
        />
        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category?.name}</p>
        <div className="rating">
          <FaStar className="star" />
          <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
          <span className="count">({product.rating?.count || 0})</span>
        </div>
        <div className="price-stock">
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="stock">{product.stock} in stock</p>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;