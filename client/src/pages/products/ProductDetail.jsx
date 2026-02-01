import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductContext from '../../context/ProductContext';
import { FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, getProductById } = useContext(ProductContext);

  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          {/* Image Gallery */}
          <div className="image-section">
            <img
              src={product.images[0] || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="info-section">
            <h1>{product.name}</h1>
            <p className="category">Category: {product.category?.name}</p>

            <div className="rating">
              <FaStar className="star" />
              <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
              <span className="count">({product.rating?.count || 0} reviews)</span>
            </div>

            <p className="price">${product.price.toFixed(2)}</p>

            <p className="stock">
              {product.stock > 0 ? (
                <span className="in-stock">{product.stock} in stock</span>
              ) : (
                <span className="out-of-stock">Out of stock</span>
              )}
            </p>

            <p className="description">{product.description}</p>

            <button
              className="add-to-cart-btn"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-list">
              {product.reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <strong>{review.name}</strong>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'star filled' : 'star'}
                        />
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
