import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">G</span>
        Yetu
      </Link>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}
        >
          Products
        </NavLink>
        {user && (
          <NavLink
            to="/orders"
            className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}
          >
            Orders
          </NavLink>
        )}
      </div>

      <div className="navbar-search">
        <span className="navbar-search-icon">🔍</span>
        <input type="text" placeholder="Search groceries..." />
      </div>

      <div className="navbar-actions">
        <Link to="/cart" className="navbar-cart">
          🛒
          {itemCount > 0 && <span className="navbar-cart-count">{itemCount}</span>}
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="navbar-user-name">
              {user.name}
            </Link>
            <button className="navbar-btn navbar-btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className="navbar-btn navbar-btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="navbar-btn navbar-btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}