import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Sample product data - in production this would come from your backend
  const sampleProducts = {
    1: { id: 1, name: "Organic Apples", price: 350, category: "fruits", stock: 50, description: "Fresh organic apples from local farms. Crisp and sweet." },
    2: { id: 2, name: "Fresh Milk", price: 250, category: "dairy", stock: 30, description: "Pure, fresh milk from grass-fed cows. Pasteurized for safety." },
    3: { id: 3, name: "Avocado", price: 200, category: "fruits", stock: 25, description: "Perfectly ripe avocados. Great for salads and toast." },
    4: { id: 4, name: "Whole Chicken", price: 850, category: "meat", stock: 15, description: "Farm-fresh whole chicken. Free-range and hormone-free." },
    5: { id: 5, name: "Sourdough Bread", price: 180, category: "bakery", stock: 20, description: "Artisan sourdough bread. Baked fresh daily." },
    6: { id: 6, name: "Orange Juice", price: 300, category: "beverages", stock: 40, description: "Freshly squeezed orange juice. No added sugar." },
    7: { id: 7, name: "Tomatoes", price: 150, category: "vegetables", stock: 35, description: "Ripe, juicy tomatoes. Perfect for cooking and salads." },
    8: { id: 8, name: "Cheddar Cheese", price: 450, category: "dairy", stock: 18, description: "Aged cheddar cheese. Rich and creamy flavor." },
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const found = sampleProducts[id];
      if (found) {
        setProduct(found);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loader">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="back-link">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image">
          <div className="product-emoji">{product.name.charAt(0)}</div>
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="product-detail-price">
            <span className="price">KSh {product.price}</span>
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>

          <Link to="/products" className="back-to-products">
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}