// File: src/components/products/ProductCard.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // To link to the detail page

// Styled components for the card (can be adjusted to your preference)
const CardWrapper = styled(Link)`
  background-color: var(--color-background-dark-lighter, #2C2C2C); /* Example dark theme */
  color: var(--color-text-light, #FFFFFF);
  border-radius: var(--border-radius, 8px);
  padding: var(--spacing-m, 16px);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s, 8px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 180px; /* Adjust as needed */
  object-fit: cover;
  border-radius: calc(var(--border-radius, 8px) / 2);
  background-color: var(--color-neutral-gray, #BDBDBD); /* Placeholder for missing images */
`;

const ProductName = styled.h3`
  font-size: var(--font-size-medium, 16px);
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  min-height: 2.6em; /* Approx 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.p`
  font-size: var(--font-size-large, 18px);
  font-weight: bold;
  color: var(--color-secondary-peach, #FFDAB9); /* Example price color */
  margin: 0;
`;

const ProductCard = ({ product }) => {
  if (!product) {
    return null; // Or some placeholder
  }

  return (
    <CardWrapper to={`/product/${product._id}`}> {/* Links to the detail page */}
      <ProductImage src={product.imageUrl || '/images/placeholder-product.png'} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductPrice>${product.price ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
      {/* You can add rating stars or other small details here if needed */}
    </CardWrapper>
  );
};

export default ProductCard;