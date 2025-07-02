// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import TSULogo from '../icons/this-side-up-logo_white.png';
import SearchPNG from '../icons/icons8-search.png';
import CloseIcon from '../icons/icons8-close.png';
import CartIconImg from '../icons/icons8-cart.png';
import UserIconImg from '../icons/icons8-user.png';
import { useAuth } from '../contexts/AuthContext';


const NavContainer = styled.nav`
  background: #222;
  color: white;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  height: 106px;
  font-family: 'Inria Serif', serif;

  @media (max-width: 992px) {
    height: 70px;
    padding: 0 1rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  z-index: 1005; 
  img {
    /* REMOVED rigid padding-left: 90px; */
    /* Let the NavContainer's padding handle spacing for better responsiveness. */
    padding: 10px 0; 
    height: 85px; 
    width: auto;
    @media (max-width: 992px) {
      height: 45px;
    }
    @media (max-width: 480px) {
      height: 40px;
    }
  }
`;

// --- NEW COMPONENT: Reusable Icon Wrapper ---
// This eliminates all `!important` overrides and provides consistent sizing.
const NavIcon = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
  }
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const DesktopNavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;

  @media (max-width: 992px) {
    display: none;
  }
`;

const NavItemDesktop = styled.div`
  position: relative;
`;

const StyledNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 26px;
  font-weight: bold;
  transition: color 0.3s ease;
  padding: 0.5rem 0.8rem;
  
  &:hover, &.active {
    color: #b19cd9;
  }
`;


const NavRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  
  @media (max-width: 768px) {
    gap: 1.25rem; /* Slightly more space for touch targets */
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  z-index: 1005;

  @media (max-width: 992px) {
    display: block;
  }
`;

const MobileNavMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #1e1e1e;
  /* FIXED: padding-top now matches mobile navbar height exactly */
  padding-top: 70px; 
  z-index: 1001;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
`;

const MobileNavItem = styled.div`
  width: 100%;
  border-bottom: 1px solid #333;
  &:last-child { border-bottom: none; }
`;

const commonMobileLinkStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.2s ease, color 0.2s ease;
  &:hover, &.active {
    background-color: #333;
    color: #b19cd9;
  }
`;

const MobileStyledNavLink = styled(Link)`
  ${commonMobileLinkStyles}
`;

const MobileButtonLink = styled.button`
  ${commonMobileLinkStyles}
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
`;

const MobileSubMenu = styled.div`
  background-color: #2a2a2a;
  padding-left: 1rem;
  ${StyledNavLink} {
    padding: 0.8rem 1.5rem 0.8rem 2.5rem;
    font-size: 1rem;
    color: #ccc;
    display: block;
    border-bottom: 1px solid #383838;
    &:last-child { border-bottom: none; }
    &:hover, &.active { background: #383838; color: #b19cd9; }
  }
`;

const ProductsDropdownDesktop = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(22, 19, 19, 0.1);
  padding: 1rem;
  min-width: 200px;
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.2s ease-in-out;
  pointer-events: ${props => props.show ? 'all' : 'none'};
`;

const DropdownGridDesktop = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
`;

const CategoryLinkDesktop = styled(Link)`
  color: #000000;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  display: block;
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const DropdownTitleDesktop = styled.h3`
  color: #333;
  font-size: 0.9rem;
  margin: 0 0 0.8rem 0;
  padding: 0 0.5rem 0.5rem;
  font-weight: 600;
  font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  border-bottom: 1px solid #eee;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  
  input {
    padding: 8px 30px 8px 12px; /* Make space for close icon */
    border-radius: 4px;
    border: 1px solid #555;
    background-color: white;
    color: black;
    min-width: 150px;

    @media (max-width: 480px) {
      min-width: 100px;
      font-size: 0.9rem;
    }
  }
`;

const CloseSearchIcon = styled.img`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; /* Smaller, more appropriate size */
    height: 16px;
    cursor: pointer;
`;

// SEARCH BAR
function SearchBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => setKeyword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setIsVisible(false);
      setKeyword('');
    }
  }

  return (
    <SearchBarContainer>
      {isVisible ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={handleInputChange}
            autoFocus
          />
          {/* Use type="button" to prevent form submission on click */}
          <CloseSearchIcon
            src={CloseIcon}
            alt="Close icon"
            onClick={() => setIsVisible(false)} 
          />
        </form>
      ) : (
        <NavIcon onClick={() => setIsVisible(true)}>
          <img src={SearchPNG} alt="Search icon" />
        </NavIcon>
      )}
    </SearchBarContainer>
  );
}

// User Dropdown
const UserDropdownContainer = styled.div`
  position: relative;
`;

const UserDropdownMenuStyled = styled.div`
  position: absolute;
  top: calc(100% + 20px); /* More space from icon */
  right: 0;
  background-color: #222222;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: 220px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1010;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
`;

const UserDropdownLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  display: block;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 0.9rem;
  &:hover { background-color: #333333; color: #b19cd9; }
`;

const UserDropdownButton = styled.button`
  background: none;
  border: none;
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  display: block;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  &:hover { background-color: #333333; color: #b19cd9; }
`;

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <UserDropdownContainer 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <NavIcon onClick={() => setIsOpen(prev => !prev)}>
        <img src={UserIconImg} alt="User icon" />
      </NavIcon>
      
      {isOpen && (
        <UserDropdownMenuStyled>
          {currentUser ? (
            <>
              <UserDropdownLink to="/profile">My Profile</UserDropdownLink>
              <UserDropdownButton onClick={handleLogout}>Logout</UserDropdownButton>
            </>
          ) : (
            <>
              <UserDropdownLink to="/login">Sign In</UserDropdownLink>
              <UserDropdownLink to="/signup">Create an Account</UserDropdownLink>
            </>
          )}
        </UserDropdownMenuStyled>
      )}
    </UserDropdownContainer>
  );
}

// --- Main Navbar Component ---
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDesktopProductsDropdown, setShowDesktopProductsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileProductCategories, setShowMobileProductCategories] = useState(false);
  const { currentUser } = useAuth();
  
  const productCategories = [
    { name: 'All Products', path: '/products' },
    { name: 'Skimboards', path: '/products/category/Skimboards' },
    { name: 'T-Shirts', path: '/products/category/T-Shirts' },
    { name: 'Board Shorts', path: '/products/category/Boardshorts' },
    { name: 'Accessories', path: '/products/category/Accessories' },
    { name: 'Beach Bags', path: '/products/category/Beach Bags' },
    { name: 'Jackets', path: '/products/category/Jackets' }
  ];

  const closeMobileMenuAndNavigate = (path) => {
    setIsMobileMenuOpen(false);
    setShowMobileProductCategories(false);
    navigate(path);
  };
 
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowMobileProductCategories(false);
  }, [location.pathname]);

  return (
    <NavContainer>
      <LogoLink to="/">
        <img src={TSULogo} alt="This Side Up logo" />
      </LogoLink>

      <DesktopNavLinks>
        <NavItemDesktop
          onMouseEnter={() => setShowDesktopProductsDropdown(true)}
          onMouseLeave={() => setShowDesktopProductsDropdown(false)}
        >
          <StyledNavLink 
            to="/products" 
            className={location.pathname.startsWith('/products') ? 'active' : ''}
          >
            Products
          </StyledNavLink>
          <ProductsDropdownDesktop show={showDesktopProductsDropdown}>
            <DropdownTitleDesktop>Shop by Category</DropdownTitleDesktop>
            <DropdownGridDesktop>
              {productCategories.map((category) => (
                <CategoryLinkDesktop key={category.name} to={category.path}>
                  {category.name}
                </CategoryLinkDesktop>
              ))}
            </DropdownGridDesktop>
          </ProductsDropdownDesktop>
        </NavItemDesktop>
        
        {currentUser && (
          <NavItemDesktop>
            <StyledNavLink to="/design-skimboard" className={location.pathname === '/design-skimboard' ? 'active' : ''}>
              Customise
            </StyledNavLink>
          </NavItemDesktop>
        )}

        <NavItemDesktop>
          <StyledNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About
          </StyledNavLink>
        </NavItemDesktop>
        <NavItemDesktop>
          <StyledNavLink to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>
            FAQ
          </StyledNavLink>
        </NavItemDesktop>
      </DesktopNavLinks>

      <NavRightSection>
        <IconsGroup>
          <SearchBar />
          <Link to={currentUser ? "/shoppingCart" : "/login"}>
            <NavIcon>
                <img src={CartIconImg} alt='Cart icon'/>
            </NavIcon>
          </Link>
          <UserDropdown />
        </IconsGroup>
        
        <MobileMenuIcon onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuIcon>
      </NavRightSection>

      <MobileNavMenu isOpen={isMobileMenuOpen}>
          <MobileNavItem>
            <MobileButtonLink
                onClick={() => setShowMobileProductCategories(prev => !prev)}
                className={location.pathname.startsWith('/products') ? 'active' : ''}
            >
              Products 
              {showMobileProductCategories ? <FaChevronUp/> : <FaChevronDown/>}
            </MobileButtonLink>
            {showMobileProductCategories && (
              <MobileSubMenu>
                {productCategories.map((category) => (
                  <StyledNavLink
                    key={category.name}
                    to={category.path}
                    className={location.pathname === category.path ? 'active' : ''}
                  >
                    {category.name}
                  </StyledNavLink>
                ))}
              </MobileSubMenu>
            )}
          </MobileNavItem>

          {currentUser && (
            <MobileNavItem>
              <MobileStyledNavLink to="/design-skimboard" className={location.pathname === '/design-skimboard' ? 'active' : ''}>
                Customise
              </MobileStyledNavLink>
            </MobileNavItem>
          )}

          <MobileNavItem>
            <MobileStyledNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </MobileStyledNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileStyledNavLink to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>
              FAQ
            </MobileStyledNavLink>
          </MobileNavItem>
      </MobileNavMenu>
    </NavContainer>
  );
};

export default Navbar;