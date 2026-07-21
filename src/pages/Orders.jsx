import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../api/client";
import { useCart } from "../context/CartContext";
import "./Orders.css";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "delivered", label: "Delivered" },
];

export default function Orders() {
  const location = useLocation();
  const { refreshCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(location.state?.newOrderId || null);
  const [orderDetails, setOrderDetails] = useState({});

  const fetchOrders = () => {
    setLoading(true);
    apiClient
      .get("/orders")
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (tab === "all") return true;
    if (tab === "delivered") return o.status === "delivered";
    if (tab === "active") return o.status !== "delivered";
    return true;
  });

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (!orderDetails[orderId]) {
      const res = await apiClient.get(`/orders/${orderId}`);
      setOrderDetails((prev) => ({ ...prev, [orderId]: res.data.order }));
    }
  };

  const handleReorder = async (orderId) => {
    const res = await apiClient.post(`/orders/${orderId}/reorder`);
    await refreshCart();
    alert(
      res.data.skipped_out_of_stock.length > 0
        ? `Added to cart. Out of stock: ${res.data.skipped_out_of_stock.join(", ")}`
        : "Items added to cart!"
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      <div className="orders-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`orders-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
  <EmptyState
    icon="📋"
    title="No orders yet"
    message="Your order history will show up here."
    actionLabel="Start Shopping"
    actionTo="/products"
  />
) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span className="order-card-id">Order #{order.id}</span>
              <span className={`order-status ${order.status}`}>
                {order.status.replace("_", " ")}
              </span>
            </div>

            <div className="order-card-meta">
              {new Date(order.created_at).toLocaleDateString()} · {order.item_count} items
            </div>

            <div className="order-card-footer">
              <span className="order-card-total">${order.total.toFixed(2)}</span>
              <div className="order-card-actions">
                <button onClick={() => toggleExpand(order.id)}>
                  {expandedId === order.id ? "Hide Details" : "View Details"}
                </button>
                {order.status === "delivered" && (
                  <button className="primary" onClick={() => handleReorder(order.id)}>
                    Reorder
                  </button>
                )}
              </div>
            </div>

            {expandedId === order.id && orderDetails[order.id] && (
              <div className="order-detail-items">
                {orderDetails[order.id].items.map((item) => (
                  <div key={item.product_id} className="order-detail-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}