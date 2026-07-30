import { useState, useEffect } from "react";
import apiClient from "../api/client";
import Spinner from "../components/Spinner";
import "./AdminOrders.css";

const STATUS_OPTIONS = ["processing", "packed", "in_transit", "delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    apiClient
      .get("/orders/admin/all")
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await apiClient.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
    fetchOrders();
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-page">
      <h1>All Orders (Admin)</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Placed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer_name} <br /><small>{order.customer_email}</small></td>
              <td>{order.item_count}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <select
                  className="admin-status-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}