// File: src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { countries } from '../Data/CountryData';
import '../index.css'; // Import the CSS file

// --- SHIPPING CATEGORIES & COSTS ---
const shippingCostsByCountryCode = {
  // Category 1
  "SG": 0.99,
  // Category 2
  "MY": 5.99, "ID": 5.99, "TH": 5.99, "VN": 5.99, "AU": 5.99, "PH": 5.99,
  // Category 3
  "JP": 7.99, "KR": 7.99, "CN": 7.99, "US": 7.99, "DE": 7.99, "GB": 7.99,
  // Category 4 (Default for others)
  "DEFAULT": 10.99
};

const getShippingCostForCountry = (countryCode) => {
  return shippingCostsByCountryCode[countryCode] || shippingCostsByCountryCode["DEFAULT"];
};




const PageWrapper = styled.div`
  min-height: 100vh;
  font-family: "Instrument Sans", sans-serif;
  padding: 24px 0;
  background: linear-gradient(180deg, #000000 0%, #7600AD 100%);
`;

const CheckoutTitle = styled.h1`
  font-family: var(--font-serif, 'Inria Serif', serif);
  color: #fff;
  text-shadow: 0 2px 8px #181824, 0 1px 0 #C86B98;
  text-align: center;
  margin-bottom: 32px;
`;

const Section = styled.section`
  background-color: #000;
  padding: 24px;
  margin: 0 auto 24px auto;
  max-width: 800px;
  border-radius: 24px;
  box-shadow: 0 4px 15px rgba(93, 63, 211, 0.12);
  color: #f5f6fa;
  font-family: "Instrument Sans", sans-serif;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-serif, 'Inria Serif', serif);
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 600;
  margin-bottom: var(--spacing-m, 16px);
  color: #C86B98;
`;

const AddressForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m, 16px);
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 4px);
`;

const FormLabel = styled.label`
  font-size: var(--font-size-small, 14px);
  color: #C86B98;
  font-weight: 500;
`;

const FormControlBase = styled.select` 
  width: 100%;
  padding: var(--spacing-s, 10px);
  font-size: var(--font-size-medium, 16px);
  border-radius: var(--border-radius-s, 4px);
  border: 1px solid #35354d;
  background-color: #181824;
  color: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  appearance: none; 
  margin-top: 10px;

  &::placeholder { 
    color: #808080;
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: #C86B98;
    background-color: #181824;
  }
`;

const FormInput = styled(FormControlBase).attrs({ as: 'input' })``; 

const FormSelect = styled(FormControlBase).attrs({ as: 'select' })`
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23C86B98%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right .7em top 50%;
  background-size: .65em auto;
  padding-right: 2.5em; 

  option {
    background-color: #181824; 
    color: #f5f6fa;
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--spacing-m, 16px);

  th, td {
    text-align: left;
    padding: var(--spacing-s, 8px) var(--spacing-xs, 4px);
    border-bottom: 1px solid #35354d;
  }

  th {
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    color: #C86B98;
    font-weight: 500;
  }
  
  td {
    font-size: clamp(0.8rem, 2.2vw, 0.95rem);
    color: #f5f6fa;
  }

  .product-name {
    display: flex;
    align-items: center;
    gap: var(--spacing-s, 8px);
  }

  .product-image {
    width: 35px;
    height: 35px;
    object-fit: cover;
    border-radius: var(--border-radius-s, 4px);
    background-color: #35354d;
    @media (max-width: 480px) {
        width: 30px;
        height: 30px;
    }
  }
  
  .product-name-text {
      max-width: 150px; 
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @media (min-width: 768px) {
          max-width: 250px;
      }
  }

  .unit-price, .quantity, .total-price {
    text-align: right;
  }
  .quantity {
    text-align: center;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-s, 10px) 0;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: 500;

  &:not(:last-child) {
    border-bottom: 1px solid #35354d;
  }

  &.order-total {
    font-weight: bold;
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: #C86B98; 
    margin-top: var(--spacing-s, 8px);
  }
`;

const SelectVoucherButton = styled.button`
  color: #C86B98;
  background: none;
  border: none;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #fff;
  }
`;

const PaymentButton = styled.button`
  flex-grow: 1;
  padding: var(--spacing-s, 10px); 
  border-radius: var(--border-radius-m, 8px);
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  border: 2px solid transparent;
  
  background-color: ${props => props.active ? '#C86B98' : '#181824'};
  color: ${props => props.active ? '#181824' : '#C86B98'};
  border-color: ${props => props.active ? '#fff' : '#35354d'};

  &:hover:not(:disabled) {
    border-color: #C86B98;
    background-color: #35354d;
    color: #fff;
  }
`;

const FinalSummary = styled.div`
  padding-top: var(--spacing-m, 16px);
  margin-top: var(--spacing-m, 16px);
  border-top: 1px solid #35354d;

  .total-payment { 
    font-size: clamp(1.1rem, 3.5vw, 1.4rem);
    font-weight: bold;
    color: #C86B98;
  }
`;

const PlaceOrderButton = styled.button`
  display: block; 
  width: 100%;
  max-width: 300px; 
  margin: var(--spacing-l, 24px) auto 0 auto; 
  background-color: #C86B98;
  color: #181824; 
  padding: var(--spacing-m, 12px); 
  border: none;
  border-radius: var(--border-radius-m, 8px);
  font-size: clamp(1rem, 3vw, 1.125rem);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #fff;
    color: #181824;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0px);
  }
  &:disabled {
    background-color: #35354d;
    color: #bdbdd7;
    cursor: not-allowed;
  }
   @media (min-width: 768px) {
    margin-top: var(--spacing-xl, 32px);
  }
`;

const PaymentMethodSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s, 8px);
  margin-top: var(--spacing-s, 8px);

  @media (min-width: 600px) {
    flex-direction: row;
    gap: var(--spacing-m, 16px);
  }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, cartItems } = useCart(); // Assuming cartItems might be needed if location.state fails
  
  // Get selected items from navigation state or cart context as fallback
  const itemsFromState = location.state?.itemsForCheckout;
  const totalFromState = location.state?.total;

  // Fallback to cartItems if location.state is not available or empty
  // This makes the page more robust if accessed directly without going through the cart summary
  const selectedItems = (itemsFromState && itemsFromState.length > 0) ? itemsFromState : cartItems.filter(item => item.selected);
  const totalFromCart = (totalFromState !== undefined) ? totalFromState : selectedItems.reduce((acc, item) => {
    const itemPrice = item.customDesign?.price || item.product?.price || 0;
    return acc + (itemPrice * (item.quantity || 1));
  }, 0);


  useEffect(() => {
    if (selectedItems.length === 0) {
      // Small delay to allow potential state updates from context
      const timer = setTimeout(() => {
        if (selectedItems.length === 0) { // Re-check after delay
            // console.log("No items for checkout, navigating to cart.");
            navigate('/shoppingCart'); // Changed from '/cart' to '/shoppingCart'
        }
      }, 100); // 100ms delay
      return () => clearTimeout(timer);
    }
  }, [selectedItems, navigate]);

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState(''); // Optional: Address Line 2
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState(''); 
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [shippingCost, setShippingCost] = useState(getShippingCostForCountry(country || 'SG'));
  
  const [voucherDiscount] = useState(0.00); // Placeholder
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PayNow');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    setShippingCost(getShippingCostForCountry(country || shippingCostsByCountryCode["DEFAULT"]));
  }, [country]);

  const itemSubtotal = totalFromCart;
  const orderTotal = itemSubtotal + shippingCost;
  const totalPayment = orderTotal - voucherDiscount;

  const handlePlaceOrder = async () => {
    if (!addressLine1 || !city || !postalCode || !country) {
      alert("Please fill in all required address fields, including country.");
      return;
    }
    if (selectedItems.length === 0) {
        alert("Your cart is empty or no items were selected for checkout.");
        navigate('/shoppingCart'); // Changed from '/cart' to '/shoppingCart'
        return;
    }

    setIsPlacingOrder(true);
    const selectedCountryName = countries.find(c => c.code === country)?.name || country;
    
    // Construct the fullAddress string
    let constructedAddress = `${addressLine1}`;
    if (addressLine2) constructedAddress += `, ${addressLine2}`; // Add address line 2 if present
    constructedAddress += `, ${city}`;
    if (stateProv) constructedAddress += `, ${stateProv}`;
    constructedAddress += ` ${postalCode}, ${selectedCountryName}`;
    
    const fullAddress = constructedAddress; // Assign the constructed address

    // Prepare order data for the API
    const orderData = {
      // userId: currentUser?._id, // You'd get this from useAuth() if implemented
      items: selectedItems.map(item => ({ // Format items as needed by your backend
        productId: item.customDesign?._id || item.product?._id,
        name: item.customDesign?.name || item.product?.name,
        quantity: item.quantity,
        price: item.customDesign?.price || item.product?.price,
      })),
      totalPrice: totalPayment,
      shippingAddress: fullAddress, // *** USE fullAddress HERE ***
      paymentMethod: selectedPaymentMethod,
      shippingCost: shippingCost,
      subtotal: itemSubtotal,
      voucherDiscount: voucherDiscount,
      // You might also include customer details if available (name, email)
    };

    try {
      // Simulate API call to place order
      console.log("Placing order with data:", orderData); // Log the data being "sent"
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // In a real app, this would be an actual API call:
      // const response = await createOrderAPI(orderData); 
      // console.log("Order created:", response);

      clearCart(selectedItems.map(item => item.customDesign?._id || item.product?._id)); // Pass IDs of items to clear

      alert("Thank you for your order! You will receive a confirmation email shortly.");
      navigate('/');
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const currentCartItems = selectedItems; 

  // Add Address Line 2 field in the JSX:
  // ... (inside <AddressForm>)
  // <FormRow>
  //   <FormLabel htmlFor="addressLine2">Address Line 2 (Optional)</FormLabel>
  //   <FormInput 
  //     type="text" 
  //     id="addressLine2" 
  //     value={addressLine2} 
  //     onChange={(e) => setAddressLine2(e.target.value)} 
  //     placeholder="Apartment, suite, unit, building, floor, etc."
  //   />
  // </FormRow>
  // ... (rest of the component) ...


  if (currentCartItems.length === 0 && !isPlacingOrder) {
    // This check might run before selectedItems is properly populated from context/state
    // Consider adding a loading state or ensuring items are definitely loaded before this check
    return (
        <PageWrapper>
            <CheckoutTitle>Checkout</CheckoutTitle>
            <Section style={{ textAlign: 'center' }}>
                <p>Your cart is empty or no items selected. Add some items to proceed to checkout.</p>
                <PlaceOrderButton style={{maxWidth: '200px', marginTop: '20px'}} onClick={() => navigate('/products')}>Shop Now</PlaceOrderButton>
            </Section>
        </PageWrapper>
    );
  }

  return (
      <PageWrapper>
        <CheckoutTitle>Checkout</CheckoutTitle>

        <Section>
          <SectionTitle>Delivery Address</SectionTitle>
          <AddressForm>
            <FormRow>
              <FormLabel htmlFor="addressLine1">Address Line 1*</FormLabel>
              <FormInput 
                type="text" 
                id="addressLine1" 
                value={addressLine1} 
                onChange={(e) => setAddressLine1(e.target.value)} 
                placeholder="Street address, P.O. box"
                required 
              />
            </FormRow>
            {/* ADDED Address Line 2 for completeness */}
            <FormRow>
              <FormLabel htmlFor="addressLine2">Address Line 2 (Optional)</FormLabel>
              <FormInput 
                type="text" 
                id="addressLine2" 
                value={addressLine2} 
                onChange={(e) => setAddressLine2(e.target.value)} 
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="city">City*</FormLabel>
              <FormInput 
                type="text" 
                id="city" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="e.g., Singapore"
                required 
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="stateProv">State / Province</FormLabel>
              <FormInput 
                type="text" 
                id="stateProv" 
                value={stateProv} 
                onChange={(e) => setStateProv(e.target.value)} 
                placeholder="e.g., CA (Optional)"
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="postalCode">Postal Code*</FormLabel>
              <FormInput 
                type="text" 
                id="postalCode" 
                value={postalCode} 
                onChange={(e) => setPostalCode(e.target.value)} 
                placeholder="e.g., 123456"
                required 
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="country">Country*</FormLabel>
              <FormSelect 
                id="country" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="" disabled>Select your country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </FormRow>
          </AddressForm>
        </Section>

        {/* Products Ordered Section */}
        <Section>
          <SectionTitle>Products Ordered</SectionTitle>
          <ProductTable>
            <thead>
              <tr>
                <th>Product</th>
                <th className="unit-price">Unit Price</th>
                <th className="quantity">Quantity</th>
                <th className="total-price">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCartItems.map(item => {
                if (!item) return null; // Defensive check
                const productDetails = item.customDesign || item.product;
                if (!productDetails) return null; // Defensive check
                
                const itemPrice = typeof productDetails.price === 'number' ? productDetails.price : 0;
                const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
                const itemId = productDetails._id || item._id; // Ensure consistent ID source

                return (
                  <tr key={itemId || `temp-${Math.random() * 10000}`}> {/* Fallback for key if ID is missing */}
                    <td className="product-name">
                      <img 
                          src={productDetails.imageUrl || '/images/placeholder-product.png'} 
                          alt={productDetails.name || 'Product'} 
                          className="product-image" 
                      />
                      <span className="product-name-text">{productDetails.name || 'Unnamed Product'}</span>
                    </td>
                    <td className="unit-price">${itemPrice.toFixed(2)}</td>
                    <td className="quantity">{quantity}</td>
                    <td className="total-price">${(itemPrice * quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </ProductTable>
          <SummaryRow>
            <span>Item Subtotal:</span>
            <span>${itemSubtotal.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping Option:</span>
            <span>Doorstep Delivery ${shippingCost.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow className="order-total">
            <span>Order Total:</span>
            <span>${orderTotal.toFixed(2)}</span>
          </SummaryRow>
        </Section>

        {/* Vouchers Section */}
        <Section>
          <SummaryRow>
            <SectionTitle style={{ marginBottom: 0 }}>Vouchers</SectionTitle>
            <SelectVoucherButton onClick={() => alert('Voucher selection UI to be implemented.')}>
              Select Voucher
            </SelectVoucherButton>
          </SummaryRow>
        </Section>

        {/* Payment Method Section */}
        <Section>
          <SectionTitle>Payment Method</SectionTitle>
          <PaymentMethodSelector>
            <PaymentButton 
              active={selectedPaymentMethod === 'PayNow'}
              onClick={() => setSelectedPaymentMethod('PayNow')}
            >
              PayNow
            </PaymentButton>
            <PaymentButton 
              active={selectedPaymentMethod === 'Card'}
              onClick={() => setSelectedPaymentMethod('Card')}
            >
              Credit Card/Debit Card
            </PaymentButton>
          </PaymentMethodSelector>
        </Section>

        {/* Final Order Summary Section */}
        <Section>
          <FinalSummary>
            <SummaryRow>
              <span>Item Subtotal</span>
              <span>${itemSubtotal.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping Subtotal</span>
              <span>${shippingCost.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Voucher Discount</span>
              <span>-${voucherDiscount.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow className="total-payment">
              <span>Total Payment</span>
              <span>${totalPayment.toFixed(2)}</span>
            </SummaryRow>
          </FinalSummary>
          <PlaceOrderButton onClick={handlePlaceOrder} disabled={isPlacingOrder || currentCartItems.length === 0}>
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </PlaceOrderButton>
        </Section>
      </PageWrapper>
  );
};

export default CheckoutPage;