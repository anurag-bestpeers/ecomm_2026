import { useContext, useEffect, useState } from 'react';
import ProductContext from '../../context/ProductContext';
import AuthContext from '../../context/AuthContext';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ManageProducts = () => {
  const { user } = useContext(AuthContext);
  const {
    products,
    categories,
    getProducts,
    getCategories,
    deleteProduct,
  } = useContext(ProductContext);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        alert('Product deleted successfully');
        getProducts();
      } else {
        alert(result.message);
      }
    }
  };

  if (user?.role !== 'admin') {
    return <div className="error">Access denied. Admin only.</div>;
  }

  return (
    <div className="manage-products-page">
      <div className="container">
        <div className="header">
          <h1>Manage Products</h1>
          <button onClick={() => setShowForm(true)} className="add-btn">
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="product-thumb"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button className="edit-btn">
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
