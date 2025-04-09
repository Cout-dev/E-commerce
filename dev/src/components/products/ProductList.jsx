import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: '',
    sort: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const res = await axios.get(`http://localhost:5000/api/products?${queryParams}`);
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
        setError('');
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
            <option value="other">Other</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <input
            type="number"
            name="minRating"
            placeholder="Min Rating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="border rounded p-2"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.images[0] || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description.substring(0, 100)}...</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-yellow-500">★ {product.rating}</span>
              </div>
              <Link
                to={`/products/${product._id}`}
                className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              filters.page === page
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 