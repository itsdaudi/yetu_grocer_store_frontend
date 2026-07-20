import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <h3>Get 15% off your first order</h3>
        <p>Subscribe for exclusive deals, seasonal produce guides, and healthy recipes.</p>
        <div className="footer-newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>

      <div className="footer-main">
        <div>
          <div className="footer-brand">Yetu</div>
          <p className="footer-tagline">
            Fresh groceries delivered to your door. Locally sourced, sustainably packaged.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=vegetables">Vegetables</Link>
          <Link to="/products?category=fruits">Fruits</Link>
          <Link to="/products?category=dairy">Dairy</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/">About Us</Link>
          <Link to="/">Careers</Link>
          <Link to="/">Blog</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/">Help Center</Link>
          <Link to="/orders">Track Order</Link>
          <Link to="/">Contact Us</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Yetu. All rights reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}