import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiClient from "../api/client";
import { useCart } from "../context/CartContext";
import "./Products.css";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

  // fetch categories once, on first load
  useEffect(() => {
    apiClient.get("/categories").then((res) => setCategories(res.data.categories));
  }, []);

  // re-fetch products whenever category, search, or sort changes
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "all") params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;

    apiClient
      .get("/products", { params })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleAddToCart = (productId) => {
    addItem(productId, 1);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Fresh, quality groceries delivered to your door</p>
      </div>

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          className="products-search"
        />

        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="products-filter"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="products-sort"
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
  <Spinner />
) : products.length === 0 ? (
  <EmptyState
    icon="🔍"
    title="No products found"
    message="Try adjusting your search or filters."
  />
) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-card-link">
                <div className="product-card-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <span>{product.name.charAt(0)}</span>
                  )}
                </div>
                <span className="product-card-category">{product.category}</span>
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-unit">{product.unit}</p>
              </Link>

              <div className="product-card-footer">
                <div className="product-card-price">
                  <span className="price-current">
                    ${product.sale_price ?? product.price}
                  </span>
                  {product.sale_price && (
                    <span className="price-original">${product.price}</span>
                  )}
                </div>
                <button
                  className="product-card-add"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock_quantity < 1}
                >
                  {product.stock_quantity < 1 ? "Out of stock" : "Add"}
                </button>
              </div>
            </div>
          ))}
        </div>)}
    </div>
  );
}