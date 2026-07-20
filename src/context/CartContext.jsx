// CartContext — manages cart state across the app, so adding an item
// on the Products page instantly reflects in the Navbar's cart icon
// and the Cart page, without manually refetching everywhere.

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get("/cart");
      setCart(response.data);
    } finally {
      setLoading(false);
    }
  };

  // refetch the cart whenever the logged-in user changes
  // (e.g. right after login, or cleared out after logout)
  useEffect(() => {
    refreshCart();
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    const response = await apiClient.post("/cart/items", {
      product_id: productId,
      quantity,
    });
    setCart(response.data);
  };

  const updateItem = async (itemId, quantity) => {
    const response = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
    setCart(response.data);
  };

  const removeItem = async (itemId) => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    setCart(response.data);
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}