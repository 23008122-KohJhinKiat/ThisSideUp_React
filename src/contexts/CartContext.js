// File: src/contexts/CartContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// --- BUG FIX: Import useProducts to get access to product data and functions ---
import { useProducts } from './ProductContext';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // --- BUG FIX: Get getProductById from the ProductContext ---
    const { getProductById } = useProducts();
    
    // Stores the raw cart items, e.g., [{ productId: 'abc', quantity: 2 }]
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            return [];
        }
    });

    // Stores the "hydrated" items with full product details
    const [hydratedCart, setHydratedCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Persist raw cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // This is the key "self-healing" and "hydrating" effect
    useEffect(() => {
        const hydrateAndValidateCart = async () => {
            setLoading(true);
            const detailedCart = [];
            const validItems = [];

            // The getProductById function is now available here
            if (typeof getProductById !== 'function') {
                setLoading(false);
                return; // Exit if the function isn't ready
            }

            for (const item of cartItems) {
                // Ensure we only process items with a productId
                if (item.productId) {
                    const product = await getProductById(item.productId);
                    if (product) {
                        // Product exists, add full details
                        detailedCart.push({ ...item, product, isAvailable: true });
                        validItems.push(item);
                    } else {
                        // Product does NOT exist (was deleted), add a placeholder
                        detailedCart.push({ ...item, product: null, isAvailable: false });
                        // Do NOT add it to validItems
                    }
                }
            }
            
            setHydratedCart(detailedCart);

            // Self-healing: If the number of valid items is less than the original cart,
            // it means some products were deleted. Silently update the cart state.
            if (validItems.length < cartItems.length) {
                console.log("Cart self-healed: Removed unavailable products.");
                setCartItems(validItems);
            }
            setLoading(false);
        };

        hydrateAndValidateCart();
    }, [cartItems, getProductById]); // Re-run when cart or product data changes

    // --- CHANGE: Wrapped function in useCallback ---
    // This memoizes the function so it doesn't get recreated on every render.
    // The dependency array is empty because `setCartItems` is a stable function from useState.
    const addItemToCart = useCallback((productId, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productId === productId);
            if (existingItem) {
                // Update quantity if item already in cart
                return prevItems.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Add new item
            return [...prevItems, { productId, quantity }];
        });
    }, []);
    
    // --- CHANGE: Wrapped function in useCallback ---
    const removeItemFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    }, []);
    
    // --- CHANGE: Wrapped function in useCallback ---
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const value = {
        cartItems: hydratedCart, // Components will use the hydrated cart
        addItemToCart,
        removeItemFromCart,
        clearCart,
        loading,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};