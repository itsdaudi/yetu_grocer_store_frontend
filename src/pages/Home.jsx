import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  // Sample categories - these would come from your backend eventually
  const categories = [
    { id: 1, name: "Fruits", slug: "fruits" },
    { id: 2, name: "Vegetables", slug: "vegetables" },
    { id: 3, name: "Dairy", slug: "dairy" },
    { id: 4, name: "Meat", slug: "meat" },
    { id: 5, name: "Bakery", slug: "bakery" },
    { id: 6, name: "Beverages", slug: "beverages" },
  ];

  // Sample deals - these would come from your backend
  const deals = [
    { id: 1, name: "Organic Apples", price: 350, originalPrice: 500 },
    { id: 2, name: "Fresh Milk", price: 180, originalPrice: 250 },
    { id: 3, name: "Avocado", price: 120, originalPrice: 200 },
  ];

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
              <Link to={`/products?category=${category.slug}`} key={category.id} className="category-card">
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
            {deals.map((deal) => (
              <div key={deal.id} className="deal-card">
                <div className="deal-image">{deal.name.charAt(0)}</div>
                <h3 className="deal-name">{deal.name}</h3>
                <div className="deal-pricing">
                  <span className="deal-price">KSh {deal.price}</span>
                  <span className="deal-original">KSh {deal.originalPrice}</span>
                </div>
                <button className="deal-add">Add to Cart</button>
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
              <p>On orders over KSh 1,000</p>
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