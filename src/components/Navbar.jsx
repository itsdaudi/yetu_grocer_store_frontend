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
        {user?.role === "admin" && (
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}
          >
            Admin
          </NavLink>
        )}
      </div>

      <div className="navbar-search">
        <span className="navbar-search-icon">🔍</span>
        <input type="text" placeholder="Search groceries..." />
      </div>

      <div className="navbar-actions">
        <Link to="/cart" className="navbar-cart">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
  > 
           <circle cx="9" cy="21" r="1" />
           <circle cx="20" cy="21" r="1" />
           <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
         </svg>
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