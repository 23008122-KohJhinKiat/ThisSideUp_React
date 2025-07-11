
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; 
import { useCart } from '../contexts/CartContext';

const CartItem = ({ cartEntry, onQuantityChange, onSelect, onRemove, isSelected }) => {
    const itemData = cartEntry.product || cartEntry.customDesign;

    if (!itemData) {
        console.warn("CartItem: Missing itemData in cartEntry", cartEntry);
        return null;
    }
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
    const {
        cartItems,
        updateItemQuantity,
        removeItemFromCart,
    } = useCart();

    const [selectedItemsMap, setSelectedItemsMap] = useState(() => {
        // Initialize with all items selected
        const initialSelected = {};
        cartItems.forEach(item => {
            const itemId = item.product?._id || item.customDesign?._id;
            if (itemId) {
                initialSelected[itemId] = true;
            }
        });
        return initialSelected;
    });
    const [totalPriceOfSelected, setTotalPriceOfSelected] = useState(0);

    useEffect(() => {
        const newSelectionMap = {};
        cartItems.forEach(cartEntry => {
            const itemId = cartEntry.product?._id || cartEntry.customDesign?._id;
            if (itemId) {
                newSelectionMap[itemId] = selectedItemsMap.hasOwnProperty(itemId) ? selectedItemsMap[itemId] : false;
            }
        });
        setSelectedItemsMap(newSelectionMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems]);

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
    };    const handleActualCheckout = () => {
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
                selectedItems: selectedItemsMap
            }
        });
    };
    
    const handleRemoveItem = (itemId) => {
        removeItemFromCart(itemId);
        setSelectedItemsMap(prevMap => {
            const { [itemId]: _, ...rest } = prevMap;
            return rest;
        });
    };

    

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

                    <div className="checkout-button-container">
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
