import { useContext, useEffect, useState } from 'react';
import ProductContext from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import FilterSidebar from '../../components/products/FilterSidebar';
import Pagination from '../../components/common/Pagination';

const ProductList = () => {
  const { products, categories, loading, pagination, getProducts, getCategories } =
    useContext(ProductContext);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    console.log('Search term:', searchTerm); // Debug log

    // If search is empty, remove search from filters
    if (!searchTerm || searchTerm.trim() === '') {
      const { search, ...restFilters } = filters;
      const newFilters = { ...restFilters, page: 1 };
      setFilters(newFilters);
      getProducts(newFilters);
    } else {
      const newFilters = { ...filters, search: searchTerm.trim(), page: 1 };
      setFilters(newFilters);
      getProducts(newFilters);
    }
  };

  const handleFilter = (newFilters) => {
    const combinedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(combinedFilters);
    getProducts(combinedFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    getProducts(newFilters);
  };

  return (
    <div className="product-list-page">
      <div className="container">
        <h1>Our Products</h1>
        <p>Discover our curated collection of premium items</p>

        <SearchBar onSearch={handleSearch} />

        <div className="content-wrapper">
          <FilterSidebar categories={categories} onFilter={handleFilter} />

          <div className="products-section">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products found</div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
