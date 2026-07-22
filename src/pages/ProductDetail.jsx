import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/client";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";
import Spinner from "../components/Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <EmptyState title="Product not found" />;

  const inStock = product.stock_quantity > 0;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(product.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        <div className="product-detail-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <span>{product.name.charAt(0)}</span>
          )}
        </div>

        <div>
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-unit">{product.unit}</p>

          <div className="product-detail-price">
            <span className="price-current">
              ${product.sale_price ?? product.price}
            </span>
            {product.sale_price && (
              <span className="price-original">${product.price}</span>
            )}
          </div>

          <p className={`product-detail-stock ${inStock ? "in-stock" : "out-of-stock"}`}>
            {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
          </p>

          {inStock && (
            <div className="product-detail-qty">
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock_quantity, q + 1))
                }
              >
                +
              </button>
            </div>
          )}

          <button
            className="product-detail-add"
            onClick={handleAddToCart}
            disabled={!inStock || adding}
          >
            {adding ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          <div className="product-detail-tabs">
            <button
              className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === "nutrition" ? "active" : ""}`}
              onClick={() => setActiveTab("nutrition")}
            >
              Nutrition
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description"
              ? product.description || "No description available for this product."
              : product.nutrition_info || "No nutrition information available."}
          </div>
        </div>
      </div>
    </div>
  );
}