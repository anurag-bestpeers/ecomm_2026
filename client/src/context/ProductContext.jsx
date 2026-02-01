import { createContext, useState } from 'react';
import api from '../utils/axios';
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  // Get all products with filters
  const getProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      console.log('API Call - Filters:', filters); // Debug log
      console.log('API Call - Query String:', queryParams); // Debug log

      const { data } = await api.get(`/products?${queryParams}`);

      console.log('API Response:', data); // Debug log
      setProducts(data.data);
      setPagination(data.pagination);
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error fetching products:', error); // Debug log
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  };
  // Get single product
  const getProductById = async (id) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product',
      };
    }
  };
  // Get all categories
  const getCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch categories',
      };
    }
  };
  // Admin: Create product
  const createProduct = async (productData) => {
    try {
      const { data } = await api.post('/products', productData);
      return { success: true, data: data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create product',
      };
    }
  };
  // Admin: Update product
  const updateProduct = async (id, productData) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return { success: true, data: data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update product',
      };
    }
  };
  // Admin: Delete product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete product',
      };
    }
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        categories,
        loading,
        pagination,
        getProducts,
        getProductById,
        getCategories,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductContext;