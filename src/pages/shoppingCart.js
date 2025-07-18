import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ cartEntry, onQuantityChange, onSelect, onRemove, isSelected }) => {
    const itemData = cartEntry.product || cartEntry.customDesign;

     if (!itemData) {
        // This can happen briefly if a product is deleted by an admin
        return null; 
    }
    // --- FIX: Use _id which is consistent across all data ---
    const itemId = itemData._id;


    return (
        <div className="cart-item-card">
            <div className="item-header">
                <input
                    type="checkbox"
                    id={`select-${itemId}`}
                    checked={isSelected}
                    onChange={() => onSelect(itemId)}
                    className="custom-checkbox-input"
                    aria-labelledby={`item-name-${itemId}`}
                />
                <label htmlFor={`select-${itemId}`} className="custom-checkbox-label" aria-hidden="true"></label>
                <p id={`item-name-${itemId}`} className="item-name" title={itemData.name}>
                    {itemData.name}
                </p>
            </div>
            <div className="item-body">
                <div className="item-visuals-and-price">
                    <img
                        src={itemData.imageUrl || '/images/placeholder-product.png'}
                        alt={itemData.name ? itemData.name.substring(0, 30) : 'Cart item image'}
                        className="item-image"
                    />
                    <p className="item-price">${itemData.price ? itemData.price.toFixed(2) : '0.00'}</p>
                </div>
                <div className="quantity-selector">
                    <button
                        onClick={() => onQuantityChange(itemId, Math.max(1, cartEntry.quantity - 1))}
                        aria-label={`Decrease quantity of ${itemData.name}`}
                        disabled={cartEntry.quantity <= 1}
                    >-</button>
                    <span>{cartEntry.quantity}</span>
                    <button
                        onClick={() => onQuantityChange(itemId, cartEntry.quantity + 1)}
                        aria-label={`Increase quantity of ${itemData.name}`}
                    >+</button>
                </div>
            </div>
            <div className="item-actions">
                <button
                    onClick={() => onRemove(itemId)} 
                    className="item-remove-button" 
                    aria-label={`Remove ${itemData.name} from cart`}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

const ActualShoppingCartPage = () => {
    const navigate = useNavigate();
    // --- MODIFIED: Get all data and functions from CartContext ---
    const {
        cartItems,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        loading, // Use the context's loading state
    } = useCart();

    const [selectedItemsMap, setSelectedItemsMap] = useState({});
    const [totalPriceOfSelected, setTotalPriceOfSelected] = useState(0);

    // --- MODIFIED: This useEffect syncs local selection state with the cart from context ---
    useEffect(() => {
        const newSelectionMap = {};
        cartItems.forEach(cartEntry => {
            const itemId = cartEntry.product?._id || cartEntry.customDesign?._id;
            if (itemId) {
                // Keep existing selection state, or default to true for new items
                newSelectionMap[itemId] = selectedItemsMap.hasOwnProperty(itemId) ? selectedItemsMap[itemId] : true;
            }
        });
        setSelectedItemsMap(newSelectionMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems]); // Rerun only when the cart itself changes

    // --- MODIFIED: Recalculates total based on cartItems from context ---
    useEffect(() => {
        const newTotal = cartItems.reduce((sum, cartEntry) => {
            const itemData = cartEntry.product || cartEntry.customDesign;
            if (!itemData || typeof itemData.price !== 'number') return sum;
            const itemId = itemData._id;
            if (selectedItemsMap[itemId]) {
                return sum + (itemData.price * cartEntry.quantity);
            }
            return sum;
        }, 0);
        setTotalPriceOfSelected(newTotal);
    }, [cartItems, selectedItemsMap]);

    const handleToggleSelectItem = (itemIdToToggle) => {
        setSelectedItemsMap(prevMap => ({
            ...prevMap,
            [itemIdToToggle]: !prevMap[itemIdToToggle],
        }));
    };    
    
    const handleActualCheckout = () => {
        const itemsToPassToCheckout = cartItems.filter(cartEntry => {
            const itemId = cartEntry.product?._id || cartEntry.customDesign?._id;
            return itemId && selectedItemsMap[itemId] === true;
        });

        if (itemsToPassToCheckout.length === 0) {
            alert("Please select items to checkout.");
            return;
        }
        
        navigate('/checkout', {
            state: { 
                itemsForCheckout: itemsToPassToCheckout,
                total: totalPriceOfSelected,
            }
        });
    };
    
    // --- MODIFIED: These handlers now directly call context functions ---
    const handleRemoveItem = (itemId) => {
        removeItemFromCart(itemId);
    };

    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to remove all items from your cart?")) {
            clearCart();
        }
    };

    if (loading) {
        return <p className="empty-cart-message">Loading Cart...</p>
    }

    return (
        <div className="shopping-cart-page">
            <div className="shopping-cart-page-container">
                <main className="shopping-cart-main-content">
                    <div className="cart-title-section">
                        <h1 className="cart-main-title">Shopping Cart</h1>
                        <p className="total-price-display">Total price: ${totalPriceOfSelected.toFixed(2)}</p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="cart-items-grid">
                            {cartItems.map(cartEntry => {
                                const itemData = cartEntry.product || cartEntry.customDesign;
                                if (!itemData) return null;
                                const itemId = itemData._id;
                                return (
                                    <CartItem
                                        key={itemId}
                                        cartEntry={cartEntry}
                                        onQuantityChange={updateItemQuantity}
                                        onSelect={handleToggleSelectItem}
                                        onRemove={handleRemoveItem}
                                        isSelected={!!selectedItemsMap[itemId]}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-cart-message">
                            Your shopping cart is empty. <a href="/products">Continue Shopping</a>
                        </p>
                    )}

                    <div className="checkout-actions-container">
                        <button
                            className="clear-cart-button"
                            onClick={handleClearCart}
                            disabled={cartItems.length === 0}
                        >
                            Clear Cart
                        </button>
                        <button
                            className="checkout-button"
                            onClick={handleActualCheckout}
                            disabled={cartItems.length === 0 || Object.values(selectedItemsMap).every(isSelected => !isSelected)}
                        >
                            Check Out
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ActualShoppingCartPage;
