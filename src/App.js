// File: src/App.js
import React, { Suspense, lazy } from 'react';
// The import statement is correct, we just need to use 'Router'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext'; 
import { DesignProvider } from './contexts/DesignContext';
import { AuthProvider } from './contexts/AuthContext'; 
import { CartProvider } from './contexts/CartContext'; 

// Layout components
import Navbar from './components/Navbar'; 
import Footer from './components/layout/Footer'; 

// Lazy load pages
const HomePage = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/Products'));
const AboutPage = lazy(() => import('./pages/About'));
const FAQPage = lazy(() => import('./pages/FAQ'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const DesignSkimboardPage = lazy(() => import('./pages/DesignSkimboard'));
const ActualShoppingCartPage = lazy(() => import('./pages/shoppingCart'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const SignUpPage = lazy (() => import ('./pages/auth/SignUpPage'));
const SignInPage = lazy (() => import ('./pages/auth/LoginPage'));
const UserProfilePage = lazy(() => import('./pages/auth/UserProfile'));
const Search = lazy(() => import('./pages/Search'));

function App() {
  return (    
    // --- FIX: Add the <Router> component to wrap the application ---
    <Router>
      <AuthProvider> 
        <ProductProvider>
          <CartProvider> 
            <DesignProvider>
              <Navbar />
              <Suspense fallback={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Loading Page...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/products/category/:categoryName" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/design-skimboard" element={<DesignSkimboardPage />} />
                  <Route path="/shoppingCart" element={<ActualShoppingCartPage />} /> 
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/login" element={<SignInPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/search" element={<Search />} />
                  
                  <Route path="*" element={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Page Not Found</div>} /> {/* Basic 404 */}
                </Routes>
              </Suspense>
              <Footer />
            </DesignProvider>
           </CartProvider> 
         </ProductProvider> 
       </AuthProvider>
    </Router> // --- FIX: Close the <Router> component ---
  );
}

export default App;