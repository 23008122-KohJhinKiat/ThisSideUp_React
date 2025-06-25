
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useProducts } from '../contexts/ProductContext'; 
import ProductCard from './ProductCard'; 
import '../index.css';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #101010 0%, #670097 100%);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 0;
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #101010 0%, #670097 100%);
    z-index: -1;
  }
`;

const PageWrapper = styled.div`
  color: var(--color-text-light, #FFFFFF);
  padding: var(--spacing-l, 24px) var(--spacing-m, 16px);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const MainContent = styled.main`
  flex-grow: 1;
  margin-bottom: var(--spacing-xxl, 60px);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-l, 24px);
  max-width: 1200px;
  margin: 0 auto;
`;


const MessageText = styled.p`
  text-align: center;
  font-size: var(--font-size-large, 20px);
  margin-top: var(--spacing-xl, 32px);
  color: var(--color-neutral-gray, #BDBDBD);
`;

const Search = () => {
  const { 
    filteredProducts, 
    loading, 
    error, 
  } = useProducts();


    return (
    <PageContainer>
      <PageWrapper>
        <MainContent>


          {loading && <MessageText>Loading products...</MessageText>}
          {error && <MessageText>Error: {error}</MessageText>}
          
          {!loading && !error && filteredProducts.length === 0 && (
            <MessageText>No products found in this category.</MessageText>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductGrid>
          )}        </MainContent>
      </PageWrapper>
    </PageContainer>
  );
};

export default Search;