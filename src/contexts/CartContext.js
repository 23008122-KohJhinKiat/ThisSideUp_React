// File: src/contexts/CartContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { getProductById } = useProducts();
    
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            return [];
        }
    });

    // The customDesignCounter state is no longer needed.
    const [hydratedCart, setHydratedCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Persist raw cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // This "hydrating" effect for cart items remains unchanged.
    useEffect(() => {
        const hydrateAndValidateCart = async () => {
            setLoading(true);
            const detailedCart = [];
            const validItems = [];

            if (typeof getProductById !== 'function') {
                setLoading(false);
                return;
            }

            for (const item of cartItems) {
                if (item.productId) {
                    const product = await getProductById(item.productId);
                    if (product) {
                        detailedCart.push({ ...item, product, isAvailable: true });
                        validItems.push(item);
                    } else {
                        detailedCart.push({ ...item, product: null, isAvailable: false });
                    }
                }
                else if (item.type === 'custom') {
                    detailedCart.push({ ...item, isAvailable: true });
                    validItems.push(item);
                }
            }
            setHydratedCart(detailedCart);

            if (validItems.length < cartItems.length) {
                console.log("Cart self-healed: Removed unavailable products.");
                setCartItems(validItems);
            }
            setLoading(false);
        };

        hydrateAndValidateCart();
    }, [cartItems, getProductById]);

    // --- MODIFIED: addItemToCart now dynamically calculates the next board number ---
    const addItemToCart = useCallback((itemData, quantity = 1) => {
        if (itemData.isCustom) {
            // It's a custom design. We calculate the name inside the state updater function
            // to get the most up-to-date cart state.
            setCartItems(prevItems => {
                // 1. Find the highest number currently in the cart.
                const maxNumberInCart = prevItems.reduce((max, item) => {
                    if (item.type === 'custom' && item.customDesign?.name) {
                        // Use regex to find the number in "Custom Skimboard X"
                        const match = item.customDesign.name.match(/Custom Skimboard (\d+)/);
                        if (match && match[1]) {
                            const num = parseInt(match[1], 10);
                            return Math.max(max, num);
                        }
                    }
                    return max;
                }, 0); // Start with 0 if cart is empty or has no custom boards.

                // 2. The new number is the highest found + 1.
                const newNumber = maxNumberInCart + 1;
                const newName = `Custom Skimboard ${newNumber}`;
                
                // 3. Create the final item with the new name and add it to the cart.
                const finalItemData = { ...itemData, name: newName };
                const newItem = { 
                    customDesign: finalItemData, 
                    quantity, 
                    type: 'custom', 
                    _id: finalItemData._id 
                };
                return [...prevItems, newItem];
            });
        } else {
            // Logic for standard products remains unchanged.
            const productId = itemData;
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.productId === productId);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevItems, { productId, quantity }];
            });
        }
    }, []); // Dependency array is now empty as the logic is self-contained.

    // --- NO CHANGES needed for the functions below ---
    const removeItemFromCart = useCallback((itemIdToRemove) => {
        setCartItems(prevItems => prevItems.filter(item => {
            const currentItemId = item.productId || item._id; 
            return currentItemId !== itemIdToRemove;
        }));
    }, []);
    
    const updateItemQuantity = useCallback((itemIdToUpdate, newQuantity) => {
        const finalQuantity = Math.max(1, newQuantity); 

        setCartItems(prevItems => 
            prevItems.map(item => {
                const currentItemId = item.productId || item._id;
                if (currentItemId === itemIdToUpdate) {
                    return { ...item, quantity: finalQuantity };
                }
                return item;
            })
        );
    }, []);

    const getQuantityById = useCallback((idToFind) => {
        const item = cartItems.find(item => {
            const currentItemId = item.productId || item._id;
            return currentItemId === idToFind;
        });
        return item ? item.quantity : 0;
    }, [cartItems]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const value = {
        cartItems: hydratedCart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        getQuantityById,
        clearCart,
        loading,
        cartCount: cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};