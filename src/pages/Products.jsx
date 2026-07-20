import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("name");

  // Sample products - in production these come from your backend
  const sampleProducts = [
    { id: 1, name: "Organic Apples", price: 350, category: "fruits", stock: 50, image: "🍎" },
    { id: 2, name: "Fresh Milk", price: 250, category: "dairy", stock: 30, image: "🥛" },
    { id: 3, name: "Avocado", price: 200, category: "fruits", stock: 25, image: "🥑" },
    { id: 4, name: "Whole Chicken", price: 850, category: "meat", stock: 15, image: "🍗" },
    { id: 5, name: "Sourdough Bread", price: 180, category: "bakery", stock: 20, image: "🍞" },
    { id: 6, name: "Orange Juice", price: 300, category: "beverages", stock: 40, image: "🧃" },
    { id: 7, name: "Tomatoes", price: 150, category: "vegetables", stock: 35, image: "🍅" },
    { id: 8, name: "Cheddar Cheese", price: 450, category: "dairy", stock: 18, image: "🧀" },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? product.category === category : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleCategoryFilter = (cat) => {
    setCategory(cat);
    setSearchParams({ category: cat });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loader">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Fresh, quality groceries delivered to your door</p>
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
            <option value="bakery">Bakery</option>
            <option value="beverages">Beverages</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {(search || category) && (
            <button className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          <button onClick={clearFilters} className="clear-btn">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image">{product.image}</div>
                <h3 className="product-name">{product.name}</h3>
              </Link>
              <div className="product-info">
                <div className="product-price">KSh {product.price}</div>
                <div className="product-stock">
                  {product.stock > 0 ? (
                    <span className="in-stock">In Stock ({product.stock})</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Sold Out"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}