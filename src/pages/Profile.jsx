import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState("info");

  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: "", street: "", city: "", postal_code: "" });

  const fetchAddresses = () => {
    apiClient.get("/users/me/addresses").then((res) => setAddresses(res.data.addresses));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await apiClient.patch("/users/me", { name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openAddForm = () => {
    setForm({ label: "", street: "", city: "", postal_code: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setForm({
      label: addr.label || "",
      street: addr.street,
      city: addr.city,
      postal_code: addr.postal_code || "",
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSaveAddress = async () => {
    if (editingId) {
      await apiClient.patch(`/users/me/addresses/${editingId}`, form);
    } else {
      await apiClient.post("/users/me/addresses", { ...form, is_default: addresses.length === 0 });
    }
    setShowForm(false);
    fetchAddresses();
  };

  const handleDeleteAddress = async (id) => {
    await apiClient.delete(`/users/me/addresses/${id}`);
    fetchAddresses();
  };

  const handleSetDefault = async (id) => {
    await apiClient.patch(`/users/me/addresses/${id}`, { is_default: true });
    fetchAddresses();
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${tab === "info" ? "active" : ""}`}
          onClick={() => setTab("info")}
        >
          Personal Info
        </button>
        <button
          className={`profile-tab ${tab === "addresses" ? "active" : ""}`}
          onClick={() => setTab("addresses")}
        >
          Addresses
        </button>
      </div>

      {tab === "info" && (
        <div className="profile-card">
          {saved && <div className="profile-success">Profile updated!</div>}

          <form onSubmit={handleSaveProfile}>
            <div className="profile-field">
              <label>Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="profile-field">
              <label>Email</label>
              <input value={user?.email || ""} disabled />
            </div>
            <button className="profile-save-btn" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {tab === "addresses" && (
        <div className="profile-card">
          {addresses.map((addr) => (
            <div key={addr.id} className={`address-card ${addr.is_default ? "is-default" : ""}`}>
              <div className="address-card-info">
                <strong>
                  {addr.label || "Address"}
                  {addr.is_default && <span className="address-default-badge">DEFAULT</span>}
                </strong>
                <span>{addr.street}, {addr.city} {addr.postal_code}</span>
              </div>
              <div className="address-card-actions">
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr.id)}>Set Default</button>
                )}
                <button onClick={() => openEditForm(addr)}>Edit</button>
                <button className="delete" onClick={() => handleDeleteAddress(addr.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {showForm ? (
            <>
              <div className="profile-field">
                <label>Label</label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Home, Work..."
                />
              </div>
              <div className="profile-field">
                <label>Street</label>
                <input
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
              <div className="profile-field">
                <label>City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="profile-field">
                <label>Postal Code</label>
                <input
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                />
              </div>
              <button className="profile-save-btn" onClick={handleSaveAddress}>
                {editingId ? "Update Address" : "Save Address"}
              </button>
            </>
          ) : (
            <button className="add-address-btn" onClick={openAddForm}>
              + Add new address
            </button>
          )}
        </div>
      )}
    </div>
  );
}