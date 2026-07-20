import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const STEPS = ["Delivery", "Payment", "Review"];

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", street: "", city: "", postal_code: "" });
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    apiClient.get("/users/me/addresses").then((res) => {
      setAddresses(res.data.addresses);
      const defaultAddr = res.data.addresses.find((a) => a.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (res.data.addresses.length === 0) setShowNewAddressForm(true);
    });
  }, []);

  const handleSaveAddress = async () => {
    setError("");
    try {
      const res = await apiClient.post("/users/me/addresses", {
        ...newAddress,
        is_default: addresses.length === 0,
      });
      setAddresses([...addresses, res.data.address]);
      setSelectedAddressId(res.data.address.id);
      setShowNewAddressForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save address.");
    }
  };

  const handlePlaceOrder = async () => {
    setError("");
    setPlacingOrder(true);
    try {
      const res = await apiClient.post("/orders", { address_id: selectedAddressId });
      await refreshCart();
      navigate("/orders", { state: { newOrderId: res.data.order.id } });
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-steps">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`checkout-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
          >
            <div className="checkout-step-circle">{i + 1}</div>
            <div className="checkout-step-label">{label}</div>
          </div>
        ))}
      </div>

      {error && <div className="checkout-error">{error}</div>}

      {/* STEP 1: Delivery */}
      {step === 0 && (
        <div className="checkout-card">
          <h2>Delivery Address</h2>

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-option ${selectedAddressId === addr.id ? "selected" : ""}`}
              onClick={() => setSelectedAddressId(addr.id)}
            >
              <input
                type="radio"
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
              />
              <div className="address-option-text">
                <strong>{addr.label || "Address"}</strong>
                <span>{addr.street}, {addr.city}</span>
              </div>
            </div>
          ))}

          {showNewAddressForm ? (
            <>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Label</label>
                  <input
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    placeholder="Home, Work..."
                  />
                </div>
              </div>
              <div className="checkout-field">
                <label>Street</label>
                <input
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
              </div>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>City</label>
                  <input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                </div>
                <div className="checkout-field">
                  <label>Postal Code</label>
                  <input
                    value={newAddress.postal_code}
                    onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  />
                </div>
              </div>
              <button className="checkout-btn checkout-btn-secondary" onClick={handleSaveAddress}>
                Save Address
              </button>
            </>
          ) : (
            <button
              className="checkout-btn checkout-btn-secondary"
              onClick={() => setShowNewAddressForm(true)}
            >
              + Add new address
            </button>
          )}

          <div className="checkout-actions">
            <button
              className="checkout-btn checkout-btn-primary"
              disabled={!selectedAddressId}
              onClick={() => setStep(1)}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Payment (mocked) */}
      {step === 1 && (
        <div className="checkout-card">
          <h2>Payment</h2>
          <div className="checkout-field">
            <label>Card Number</label>
            <input placeholder="4242 4242 4242 4242" />
          </div>
          <div className="checkout-row">
            <div className="checkout-field">
              <label>Expiry</label>
              <input placeholder="MM/YY" />
            </div>
            <div className="checkout-field">
              <label>CVC</label>
              <input placeholder="123" />
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            This is a demo — no real payment is processed.
          </p>

          <div className="checkout-actions">
            <button className="checkout-btn checkout-btn-secondary" onClick={() => setStep(0)}>
              Back
            </button>
            <button className="checkout-btn checkout-btn-primary" onClick={() => setStep(2)}>
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review */}
      {step === 2 && (
        <div className="checkout-card">
          <h2>Review Your Order</h2>

          {cart.items.map((item) => (
            <div key={item.id} className="checkout-summary-line">
              <span>{item.name} × {item.quantity}</span>
              <span>${item.line_total.toFixed(2)}</span>
            </div>
          ))}

          <div className="checkout-summary-line">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-summary-line">
            <span>Delivery</span>
            <span>${cart.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="checkout-summary-total">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn checkout-btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="checkout-btn checkout-btn-primary"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}