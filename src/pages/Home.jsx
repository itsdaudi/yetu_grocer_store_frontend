import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import apiClient from "../api/client";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const { addItem } = useCart();

  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/categories"),
      apiClient.get("/products?per_page=3"),
    ])
      .then(([categoriesRes, productsRes]) => {
        setCategories(categoriesRes.data.categories);
        // treat any product with a sale_price as a "deal" for the homepage
        setDeals(productsRes.data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (productId) => {
    addItem(productId, 1);
  };

  if (loading) {
    return <div className="home-page">Loading...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Fresh groceries <br />
            <span>delivered to your door</span>
          </h1>
          <p className="hero-subtitle">
            Shop quality produce, dairy, meat and more -- all at affordable prices
          </p>
          <Link to="/products" className="hero-cta">
            Start Shopping
          </Link>
          {user && (
            <p className="hero-welcome">Welcome back, {user.name}!</p>
          )}
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">GROCERIES</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                to={`/products?category=${category.slug}`}
                key={category.id}
                className="category-card"
              >
                <div className="category-icon">{category.name.charAt(0)}</div>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="deals-section">
        <div className="container">
          <div className="deals-header">
            <h2 className="section-title">Today's Best Deals</h2>
            <Link to="/products" className="view-all">View All →</Link>
          </div>
          <div className="deals-grid">
            {deals.map((product) => (
              <div key={product.id} className="deal-card">
                <div className="deal-image">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  ) : (
                    product.name.charAt(0)
                  )}
                </div>
                <h3 className="deal-name">{product.name}</h3>
                <div className="deal-pricing">
                  <span className="deal-price">
                    ${product.sale_price ?? product.price}
                  </span>
                  {product.sale_price && (
                    <span className="deal-original">${product.price}</span>
                  )}
                </div>
                <button
                  className="deal-add"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Shop With Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">FD</div>
              <h3>Free Delivery</h3>
              <p>On orders over $25</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">FP</div>
              <h3>Fresh Produce</h3>
              <p>Sourced directly from farms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">BP</div>
              <h3>Best Prices</h3>
              <p>Affordable groceries every day</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}