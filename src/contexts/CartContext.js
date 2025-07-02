// File: src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchProductById } from '../Data/Data'; // To get product details when adding

const CartContext = createContext(null);

// Helper to manage cart in localStorage
const getInitialCart = () => {
  try {
    const storedCart = localStorage.getItem('shoppingCart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart); // { product: {}, quantity: number, designId?: string } or { customDesign: {}, quantity: number }
  const [loading, setLoading] = useState(false); // For async operations like fetching product details
  const [error, setError] = useState(null);
  const [numCustom, setNumCustom] = useState(0); // Track number of custom designs in cart


  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = useCallback(async (itemData, quantity = 1) => {
    // itemData can be a product ID (string) or a full customDesign object
    setLoading(true);
    setError(null);
    try {
      let newItem;
      let existingItemIndex = -1;

      if (typeof itemData === 'string') { // Standard Product ID
        existingItemIndex = cartItems.findIndex(
          (item) => item.product && item.product._id === itemData && !item.customDesign // Ensure it's not a custom item with same base product ID
        );
        
        if (existingItemIndex > -1) {
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
          setCartItems(updatedItems);
        } else {
          const productDetails = await fetchProductById(itemData);
          if (!productDetails) throw new Error("Product not found");
          newItem = { product: productDetails, quantity, type: 'standard' };
          setCartItems((prevItems) => [...prevItems, newItem]);
        }
      } else if (itemData && itemData._id && itemData.isCustom) { // Custom Design Object
         // For custom items, assume each unique design is a new cart entry
         // Or, if you want to stack identical custom designs, you'd need a more complex check
         setNumCustom((prev) => prev + 1); // Increment custom design count
         itemData.name = `My Custom Skimboard ${numCustom + 1}`; // Ensure name is set 
        newItem = { customDesign: itemData, quantity, type: 'custom', _id: itemData._id }; // Use design _id for keying
        setCartItems((prevItems) => [...prevItems, newItem]);
      } else {
        throw new Error("Invalid item data provided to cart.");
      }
    } catch (err) {
      setError(err.message || "Failed to add item to cart.");
      console.error("Cart Error:", err);
    } finally {
      setLoading(false);
    }
  }, [cartItems]);

  const updateItemQuantity = (itemId, newQuantity) => { // itemId can be product._id or customDesign._id
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const currentItemId = item.product?._id || item.customDesign?._id;
        if (currentItemId === itemId) {
          return { ...item, quantity: Math.max(0, newQuantity) }; // Prevent negative quantity
        }
        return item;
      }).filter(item => item.quantity > 0) // Remove item if quantity is 0
    );
  };

  const removeItemFromCart = (itemId) => { // itemId can be product._id or customDesign._id
    setCartItems((prevItems) => prevItems.filter((item) => (item.product?._id || item.customDesign?._id) !== itemId));
    if (cartItems.length === 1) {
      setNumCustom(0); // Reset custom count if last custom item is removed
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setNumCustom(0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
        const price = item.product ? item.product.price : item.customDesign.price;
        return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    getCartTotal,
    getTotalItems,
    itemCount: getTotalItems(), // Convenience for Navbar badge
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);