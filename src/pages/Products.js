// File: src/pages/Products.js (or src/pages/products/ProductsPage.js)
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
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


const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl, 32px);
  padding: 0 var(--spacing-m, 16px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const CategorySelectorWrapper = styled.div`
  position: relative;
`;

const CategoryDisplayButton = styled.button`
  background-color: var(--color-secondary-peach, #FFDAB9);
  color: var(--color-primary-purple, #5D3FD3);
  padding: var(--spacing-s, 10px) var(--spacing-l, 20px);
  border: none;
  border-radius: var(--border-radius-m, 6px);
  font-size: var(--font-size-large, 18px);
  font-family: var(--font-heading);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  min-width: 200px; 
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);

  svg {
    margin-left: var(--spacing-s, 8px);
    font-size: var(--font-size-small, 14px);
  }
`;

const CategoryDropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background-color: var(--color-secondary-peach-dark, #FFA07A);
  border: 1px solid var(--color-primary-purple, #5D3FD3);
  border-radius: var(--border-radius, 8px);
  list-style: none;
  padding: var(--spacing-s, 8px) 0;
  margin: 0;
  z-index: 10;
  min-width: 100%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const CategoryDropdownItem = styled.li`
  padding: var(--spacing-s, 8px) var(--spacing-m, 16px);
  color: var(--color-text-dark, #333333);
  cursor: pointer;
  font-size: var(--font-size-medium, 16px);
  font-weight: 500;

  &:hover {
    background-color: var(--color-primary-purple, #5D3FD3);
    color: var(--color-text-light, #FFFFFF);
  }
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

const Products = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { 
    filteredProducts, 
    loading, 
    error, 
    categories, 
    currentCategory, 
    filterAndSortProducts 
  } = useProducts();

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const targetCategory = categoryName || 'All';
    filterAndSortProducts(targetCategory); 
  }, [categoryName, filterAndSortProducts]);

  const handleCategorySelect = (category) => {
    setShowDropdown(false);
    if (category === "All") {
      navigate('/products');
    } else {
      navigate(`/products/category/${encodeURIComponent(category)}`);
    }
  };
    return (
    <PageContainer className="products-font">
      <PageWrapper>
        <MainContent> {/* Wrap main content */}
          <PageHeader>
            <CategorySelectorWrapper>
              <CategoryDisplayButton onClick={() => setShowDropdown(!showDropdown)}>
                {currentCategory === "All" ? "All Products" : currentCategory}
                <FaChevronDown /> {/* Add icon here */}
              </CategoryDisplayButton>
              {showDropdown && (
                <CategoryDropdownList>
                  {categories.map((cat) => (
                    <CategoryDropdownItem 
                      key={cat} 
                      onClick={() => handleCategorySelect(cat)}
                    >
                      {cat === "All" ? "All Products" : cat}
                    </CategoryDropdownItem>
                  ))}
                </CategoryDropdownList>
              )}
            </CategorySelectorWrapper>

          </PageHeader>

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

export default Products;