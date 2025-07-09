import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext'; 
import { DesignProvider } from './contexts/DesignContext';
import { AuthProvider } from './contexts/AuthContext'; 
import { CartProvider } from './contexts/CartContext'; 

import Navbar from './components/Navbar'; 
import Footer from './components/layout/Footer'; 

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
const Addproductpage = lazy(() => import('./pages/AddAndEdit/Add'));
const Editproductpage = lazy(() => import('./pages/AddAndEdit/Edit'));

const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditionsPage = lazy(() => import('./pages/Terms&Conditions'));

function App() {
  return (    
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
                <Route path="add" element={<Addproductpage />} />
                <Route path="/product/:id" element={<Editproductpage />} />

                <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
                <Route path="/termsconditions" element={<TermsConditionsPage />} />

                <Route path="*" element={<div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Page Not Found</div>} />
              </Routes>
            </Suspense>
            <Footer />
          </DesignProvider>
        </CartProvider> 
      </ProductProvider> 
    </AuthProvider>
  );
}

export default App;