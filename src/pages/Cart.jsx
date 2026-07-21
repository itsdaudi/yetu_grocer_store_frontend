import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <Spinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          actionLabel="Browse Products"
          actionTo="/products"
/>  
      </div>
    );
  }

  const remainingForFreeDelivery = Math.max(
    0,
    cart.free_delivery_threshold - cart.subtotal
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <span>{item.name.charAt(0)}</span>
                )}
              </div>

              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-unit">{item.unit}</div>
              </div>

              <div className="cart-item-qty">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateItem(item.id, item.quantity - 1)
                      : removeItem(item.id)
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <div className="cart-item-total">
                ${item.line_total.toFixed(2)}
              </div>

              <button
                className="cart-item-remove"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          {remainingForFreeDelivery > 0 ? (
            <div className="cart-delivery-note">
              Add ${remainingForFreeDelivery.toFixed(2)} more for free delivery
            </div>
          ) : (
            <div className="cart-delivery-note">
              You've unlocked free delivery! 🎉
            </div>
          )}

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>${cart.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>

          <button
            className="cart-checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}