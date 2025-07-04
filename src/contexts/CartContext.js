// File: src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchProductById } from '../Data/Data';

const CartContext = createContext(null);

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
  const [cartItems, setCartItems] = useState(getInitialCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // REMOVED: const [numCustom, setNumCustom] = useState(0);

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = useCallback(async (itemData, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof itemData === 'string') {
        // Use functional update to avoid dependency on cartItems
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.product && item.product._id === itemData && !item.customDesign
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Note: The async fetchProductById part makes this pattern
                // a bit trickier, but for the custom item part, we can fully isolate it.
                // We'll leave the outer logic as is but fix the custom item part.
                return prevItems; // We will handle adding outside this functional update for now.
            }
        });

        // Handle adding a new standard item (since it's async)
        const currentCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if (!currentCart.some(item => item.product?._id === itemData)) {
            const productDetails = await fetchProductById(itemData);
            if (!productDetails) throw new Error("Product not found");
            const newItem = { product: productDetails, quantity, type: 'standard' };
            setCartItems((prevItems) => [...prevItems, newItem]);
        }

      } else if (itemData && itemData._id && itemData.isCustom) {
        // --- THIS IS THE KEY CHANGE ---
        setCartItems((prevItems) => {
          // 1. Derive the count from the previous state
          const numExistingCustom = prevItems.filter(item => item.type === 'custom').length;
          
          // 2. Create the new name
          const newName = `My Custom Skimboard ${numExistingCustom + 1}`;
          
          // 3. Create the new item with the correct name
          const newItem = {
            customDesign: { ...itemData, name: newName },
            quantity,
            type: 'custom',
            _id: itemData._id
          };
          
          // 4. Return the new state array
          return [...prevItems, newItem];
        });
      } else {
        throw new Error("Invalid item data provided to cart.");
      }
    } catch (err) {
      setError(err.message || "Failed to add item to cart.");
      console.error("Cart Error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // <<<<< DEPENDENCY ARRAY IS NOW EMPTY!

  const updateItemQuantity = (itemId, newQuantity) => {
    // ... (this function is already correct)
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const currentItemId = item.product?._id || item.customDesign?._id;
        if (currentItemId === itemId) {
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItemFromCart = (itemId) => {
    // REMOVED: The check for numCustom is no longer needed
    setCartItems((prevItems) => prevItems.filter((item) => (item.product?._id || item.customDesign?._id) !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    // REMOVED: setNumCustom(0);
  };

  // ... (rest of the provider is unchanged)
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
    itemCount: getTotalItems(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);