// File: src/contexts/ProductContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
    fetchProducts, 
    searchProductsAPI, 
    fetchProductById as fetchProductByIdAPI, // Rename to avoid conflict
    updateProductAPI, // <-- Import the update function
    productCategories
} from '../DataPack/Data'; // Ensure correct path to your Data.js

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // Master list of all products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentCategory, setCurrentCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');

  const loadAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      const initialFiltered = await searchProductsAPI('', 'All', 'name_asc'); 
      setFilteredProducts(initialFiltered);
    } catch (err) {
      setError(err.message || "Failed to fetch products.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  const filterAndSortProducts = useCallback(async (category = currentCategory, newSortBy = sortBy, term = '') => {
    setLoading(true);
    setError(null);
    setCurrentCategory(category);
    setSortBy(newSortBy);
    try {
      const results = await searchProductsAPI(term, category, newSortBy);
      setFilteredProducts(results);
    } catch (err) {
      setError(err.message || "Failed to filter/sort products.");
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, sortBy]);

  const getProductById = useCallback(async (id) => {
    // First, try to find the product in our already loaded state
    const productFromState = products.find(p => p._id === id);
    if (productFromState) {
      return productFromState;
    }
    // If not found (e.g., direct navigation), fetch from API
    try {
      return await fetchProductByIdAPI(id);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [products]);

  // --- NEW FUNCTION TO HANDLE UPDATES ---
  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    try {
      const returnedProduct = await updateProductAPI(productId, updatedData);
      
      // Update the master list
      setProducts(prevProducts => 
        prevProducts.map(p => (p._id === productId ? returnedProduct : p))
      );

      // Also update the currently visible filtered list
      setFilteredProducts(prevFiltered => 
        prevFiltered.map(p => (p._id === productId ? returnedProduct : p))
      );
      
      setLoading(false);
      return returnedProduct; // Return the updated product for confirmation
    } catch (err) {
      setError(err.message || "Failed to update product.");
      setLoading(false);
      throw err;
    }
  };

  const value = {
    filteredProducts,
    loading,
    error,
    currentCategory,
    setCurrentCategory,
    sortBy,
    setSortBy,
    categories: productCategories,
    filterAndSortProducts,
    getProductById,
    updateProduct, // <-- Expose the new function
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};