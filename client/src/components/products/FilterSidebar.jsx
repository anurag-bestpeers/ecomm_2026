import { useState, useEffect } from 'react';

const FilterSidebar = ({ categories, onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Auto-apply sort changes immediately
    if (name === 'sort') {
      console.log('Sort changed, auto-applying:', value);
      onFilter(newFilters);
    }
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    // Clean up empty values
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        cleanFilters[key] = filters[key];
      }
    });
    console.log('Clean filters:', cleanFilters);
    onFilter(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    };
    setFilters(resetFilters);
    console.log('Resetting filters');
    onFilter({ sort: 'newest' }); // Keep default sort
  };

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      {/* Category Filter */}
      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label>Sort By</label>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button onClick={handleApply} className="apply-btn">
          Apply Filters
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
