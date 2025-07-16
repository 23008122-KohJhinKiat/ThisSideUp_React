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

    const [hydratedCart, setHydratedCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [numCustomDesigns, setNumCustomDesigns] = useState(0);    

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const hydrateAndValidateCart = async () => {
            setLoading(true);
            const detailedCart = [];
            const validItems = [];
            let numCustom = 0;

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
                    numCustom++;
                }
            }
            setNumCustomDesigns(numCustom);
            setHydratedCart(detailedCart);

            if (validItems.length < cartItems.length) {
                console.log("Cart self-healed: Removed unavailable products.");
                setCartItems(validItems);
            }
            setLoading(false);
        };

        hydrateAndValidateCart();
    }, [cartItems, getProductById]);

    const addItemToCart = useCallback((itemData, quantity = 1) => {
        setCartItems(prevItems => {
            if (itemData.isCustom) {
                // Custom designs are always unique, add as a new item.
                const newItem = { customDesign: { ...itemData }, quantity, type: 'custom', _id: itemData._id };
                return [...prevItems, newItem];
            } else {
                // Standard product ID is the itemData itself (string)
                const productId = itemData;
                const existingItem = prevItems.find(item => item.productId === productId);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevItems, { productId, quantity }];
            }
        });
    }, []);
    
    // --- BUG FIX: This function now correctly identifies both standard and custom items ---
    const removeItemFromCart = useCallback((itemIdToRemove) => {
        setCartItems(prevItems => prevItems.filter(item => {
            // Check standard product 'productId' or custom item '_id'
            const currentItemId = item.productId || item._id; 
            return currentItemId !== itemIdToRemove;
        }));
    }, []);
    
    // --- BUG FIX: Proactively fixed the same bug here for quantity updates ---
    const updateItemQuantity = useCallback((itemIdToUpdate, newQuantity) => {
        // Ensure quantity is at least 1
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

    // --- BUG FIX: Proactively fixed the same bug here for getting quantity ---
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