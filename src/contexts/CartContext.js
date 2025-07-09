// File: src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchProductById } from '../DataPack/Data';

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

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = useCallback(async (itemData, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof itemData === 'string') {
        // --- This part for standard products remains the same ---
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.product && item.product._id === itemData && !item.customDesign
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                return prevItems;
            }
        });

        const currentCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if (!currentCart.some(item => item.product?._id === itemData)) {
            const productDetails = await fetchProductById(itemData);
            if (!productDetails) throw new Error("Product not found");
            const newItem = { product: productDetails, quantity, type: 'standard' };
            setCartItems((prevItems) => [...prevItems, newItem]);
        }

      } else if (itemData && itemData._id && itemData.isCustom) {
        // =================================================================
        // --- THIS IS THE CORRECTED LOGIC FOR NAMING CUSTOM SKIMBOARDS ---
        // =================================================================
        setCartItems((prevItems) => {
          
          // 1. Find the highest number used in existing custom skimboard names.
          let maxNumber = 0;
          prevItems
            .filter(item => item.type === 'custom' && item.customDesign?.name)
            .forEach(item => {
              // Use a regular expression to find the number at the end of the name.
              const match = item.customDesign.name.match(/\d+$/);
              if (match) {
                const number = parseInt(match[0], 10);
                if (number > maxNumber) {
                  maxNumber = number;
                }
              }
            });

          // 2. The new board's number is the highest found number + 1.
          const newNumber = maxNumber + 1;
          const newName = `My Custom Skimboard ${newNumber}`;
          
          // 3. Create the new item with the correct name.
          const newItem = {
            customDesign: { ...itemData, name: newName },
            quantity,
            type: 'custom',
            _id: itemData._id
          };
          
          // 4. Return the new state array.
          return [...prevItems, newItem];
        });
        // =================================================================
        // --- END OF CORRECTED LOGIC ---
        // =================================================================
      } else {
        throw new Error("Invalid item data provided to cart.");
      }
    } catch (err) {
      setError(err.message || "Failed to add item to cart.");
      console.error("Cart Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItemQuantity = (itemId, newQuantity) => {
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
    setCartItems((prevItems) => prevItems.filter((item) => (item.product?._id || item.customDesign?._id) !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
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
    itemCount: getTotalItems(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);