// File: src/App.js

import React, { Suspense, lazy } from 'react';
// REMOVED Router from this import as it's no longer used here
import { Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext'; 
import { DesignProvider } from './contexts/DesignContext';
import { AuthProvider } from './contexts/AuthContext'; 
import { CartProvider } from './contexts/CartContext'; 

import Navbar from './components/Navbar'; 
import Footer from './components/layout/Footer'; 
import ProtectedRoute from './components/ProtectedRoute.js';

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
const AddProductPage = lazy(() => import('./pages/AddAndEdit/Add'));
const EditProductPage = lazy(() => import('./pages/AddAndEdit/Edit'));

const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditionsPage = lazy(() => import('./pages/Terms&Conditions'));

function App() {
  // REMOVED the opening <Router> tag from here
  return (    
    <AuthProvider> 
      <ProductProvider>
        <CartProvider> 
          <DesignProvider>
            <Navbar />
            <Suspense fallback={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Loading Page...</div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/products/category/:categoryName" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
                <Route path="/termsconditions" element={<TermsConditionsPage />} />

                {/* User / Customer Routes */}
                <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                <Route path="/shoppingCart" element={<ProtectedRoute><ActualShoppingCartPage /></ProtectedRoute>} /> 
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/design-skimboard" element={<ProtectedRoute><DesignSkimboardPage /></ProtectedRoute>} />

                {/* --- ADMIN-ONLY ROUTES --- */}
                <Route path="/add" element={
                    <ProtectedRoute adminOnly={true}><AddProductPage /></ProtectedRoute>
                } />
                <Route path="/edit/:id" element={
                    <ProtectedRoute adminOnly={true}><EditProductPage /></ProtectedRoute>
                } />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Page Not Found</div>} />
              </Routes>
            </Suspense>
            <Footer />
          </DesignProvider>
        </CartProvider> 
      </ProductProvider> 
    </AuthProvider>
  );
  // REMOVED the closing </Router> tag from here
}

export default App;