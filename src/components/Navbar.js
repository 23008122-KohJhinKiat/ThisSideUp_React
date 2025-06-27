import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import icons

import TSULogo from '../icons/this-side-up-logo_white.png';
import SearchPNG from '../icons/icons8-search.png';
import CloseIcon from '../icons/icons8-close.png';
import CartIconImg from '../icons/icons8-cart.png';
import UserIconImg from '../icons/icons8-user.png';
import { useAuth } from '../contexts/AuthContext';


const NavContainer = styled.nav`
  background: #222;
  color: white;
  padding: 0 1.5rem; /* Default padding */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  height: 106px; /* Adjusted height for better spacing */
  font-family: 'Inria Serif', serif;

  @media (max-width: 992px) { /* Tablet and mobile */
    height: 70px;
    padding: 0 1rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  
  z-index: 1005; /* Ensure logo is above mobile menu if it slides from top */
  img {
    padding: 13px 10px 13px 90px;
    height: 85px; /* Adjust as needed */
    width: auto;
    @media (max-width: 992px) {
      height: 40px;
    }
    @media (max-width: 480px) {
      height: 35px;
    }
  }
`;

// Desktop Navigation Links
const DesktopNavLinks = styled.div`
  display: flex;
  gap: 2.5rem; /* Adjust gap as needed */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;

  @media (max-width: 992px) { /* Breakpoint to hide desktop links */
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
  
  &:hover {
    color: #b19cd9;
  }

  &.active {
    color: #b19cd9;
    font-weight: bold;
  }
`;

// Right side of the Navbar (Icons + Mobile Menu Toggle)
const NavRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Gap between icon group and mobile toggle */
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
   @media (max-width: 480px) {
    gap: 0.75rem; /* Reduce gap for very small screens */
    /* Individual icons might need size adjustments via their own styled components */
  }
`;

// Mobile Menu
const MobileMenuIcon = styled.div`
  display: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  z-index: 1005; /* Ensure it's above other elements */

  @media (max-width: 992px) { /* Show hamburger at the same breakpoint desktop links hide */
    display: block;
  }
`;

const MobileNavMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed; /* Or absolute if NavContainer is not fixed */
  top: 0; /* Start from the top */
  left: 0;
  width: 100%;
  height: 100vh; /* Full viewport height */
  background-color: #1e1e1e; /* Slightly different dark shade for distinction */
  padding-top: 80px; /* Space for navbar height + a bit more */
  z-index: 1001; /* Below hamburger icon but above page content */
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;
  overflow-y: auto; /* Allow scrolling if content exceeds viewport */
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
`;

const MobileNavItem = styled.div`
  width: 100%;
  border-bottom: 1px solid #333; /* Separator for items */
  &:last-child {
    border-bottom: none;
  }
`;

const commonMobileLinkStyles = css`
  display: flex; /* For aligning icon with text */
  justify-content: space-between; /* For chevron */
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
  background-color: #2a2a2a; /* Slightly lighter for sub-menu */
  padding-left: 1rem; /* Indent sub-menu items */
  
  ${StyledNavLink} { /* Re-use StyledNavLink for consistency but adjust for mobile */
    padding: 0.8rem 1.5rem 0.8rem 2.5rem; /* More padding for tap, deeper indent */
    font-size: 1rem;
    color: #ccc;
    display: block; /* Ensure it takes full width */
    border-bottom: 1px solid #383838;
    &:last-child { border-bottom: none; }
    &:hover, &.active { background: #383838; color: #b19cd9; }
  }
`;


// Products Dropdown (Desktop - from your original code, minor style tweaks for context)
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
    background: #4a4a4a; /* Darker hover for dark theme */
    color: #b19cd9;
  }
`;

const DropdownTitleDesktop = styled.h3`
  color: #000000;
  font-size: 0.9rem;
  margin: 0 0 0.8rem 0;
  padding: 0 0.5rem 0.5rem;
  font-weight: 600;
  font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  border-bottom: 1px solid #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;



const SearchBarContainer = styled.div`
  input {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #555;
    background-color: white;
    color: black;
    min-width: 150px; /* Base width */

    @media (max-width: 480px) {
        min-width: 100px; /* Smaller on very small screens if visible */
        font-size: 0.9rem;
    }
  }
  /* Style the close icon within search if needed */
  img[alt="Close icon"] { 
    width: 30px !important; height: 30px !important;
    margin-top: 5px; 
    top: 50% !important; transform: translateY(-50%) !important; 
  }
  img[alt="Search icon"] { 
    width: 40px !important; height: 40px !important; 
    @media (max-width: 768px) { width: 26px !important; height: 26px !important; }
    @media (max-width: 480px) { width: 24px !important; height: 24px !important; }
  }
`;


// SEARCH BAR
function SearchBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleClick = () => setIsVisible(prev => !prev);
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
      <div>
        {isVisible ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <form onSubmit={handleSubmit}>
              <input
                id="search"
                type="text"
                placeholder="Search"
                value={keyword}
                onChange={handleInputChange}
                autoFocus
              />
              <img
                src={CloseIcon}
                alt="Close icon"
                onClick={handleClick}
                style={{ position: 'absolute', right: '8px', cursor:'pointer' }}
              />
            </form>
          </div>
        ) : (
          <img
            src={SearchPNG}
            alt="Search icon"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </SearchBarContainer>
  );
}

// User Dropdown
const UserDropdownContainer = styled.div`
  position: relative;
  margin-right: 15px;
  img[alt="User icon"] { 
    width: 40px !important; height: 40px !important; cursor: 'pointer';
    @media (max-width: 768px) { width: 26px !important; height: 26px !important; }
    @media (max-width: 480px) { width: 24px !important; height: 24px !important; }
  }
`;

const UserDropdownMenuStyled = styled.div`
  position: absolute;
  top: calc(100% + 15px); /* Position below the icon */
  right: 0;
  background-color: #222222;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: 220px; /* Adjust as needed */
  border-radius: 8px;
  overflow: hidden;
  z-index: 1010;
  display: flex;
  flex-direction: column;
`;

const UserDropdownLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px 20px; /* Adjust padding */
  display: block;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 0.9rem; /* Adjust font size */

  &:hover {
    background-color: #333333;
    color: #b19cd9;
  }
`;

const UserDropdownButton = styled.button`
  background: none;
  border: none;
  color: white;
  text-decoration: none;
  padding: 10px 20px; /* Adjust padding */
  display: block;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 0.9rem; /* Adjust font size */
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background-color: #333333;
    color: #b19cd9;
  }
`;

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(prev => !prev);


  const closeAndNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };
  

  return (
    <UserDropdownContainer>
      <img
        src={UserIconImg}
        alt="User icon"
        onClick={toggleDropdown}
        style={{cursor: 'pointer'}}
      />
      {isOpen && (
        <UserDropdownMenuStyled>
          {currentUser ? (
            <>
              {/* Use closeAndNavigate here */}
              <UserDropdownLink to="/profile" onClick={(e) => { e.preventDefault(); closeAndNavigate('/profile'); }}>
                My Profile
              </UserDropdownLink>
              <UserDropdownButton onClick={handleLogout}>
                Logout
              </UserDropdownButton>
            </>
          ) : (
            <>
              {/* Use closeAndNavigate here */}
              <UserDropdownLink to="/login" onClick={(e) => { e.preventDefault(); closeAndNavigate('/login'); }}>
                Sign In
              </UserDropdownLink>
              {/* Use closeAndNavigate here */}
              <UserDropdownLink to="/signup" onClick={(e) => { e.preventDefault(); closeAndNavigate('/signup'); }}>
                Create an Account
              </UserDropdownLink>
            </>
          )}
        </UserDropdownMenuStyled>
      )}
    </UserDropdownContainer>
  );
}

// Cart Icon
const CartLinkStyled = styled(Link)`
 display: flex; /* To align icon properly if text is added later */
  img {
    width: 40px !important; height: 40px !important; cursor: 'pointer';
    @media (max-width: 768px) { width: 26px !important; height: 26px !important; }
    @media (max-width: 480px) { width: 24px !important; height: 24px !important; }
  }
`;

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
    { name: 'Towels', path: '/products/category/Towels' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) { 
        setShowMobileProductCategories(false);
    }
  };
  
  const handleMobileProductsClick = (e) => {
    e.preventDefault(); 
    setShowMobileProductCategories(!showMobileProductCategories);
  };

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
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <NavContainer>
      <LogoLink to="/" onClick={() => isMobileMenuOpen && closeMobileMenuAndNavigate('/')}>
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
          </StyledNavLink>          <ProductsDropdownDesktop show={showDesktopProductsDropdown ? 1 : 0}>
            <DropdownTitleDesktop>Shop by Category</DropdownTitleDesktop>
            <DropdownGridDesktop>
              {productCategories.map((category) => (
                <CategoryLinkDesktop 
                  key={category.name}
                  to={category.path}
                  onClick={() => setShowDesktopProductsDropdown(false)}
                >
                  {category.name}
                </CategoryLinkDesktop>
              ))}
            </DropdownGridDesktop>
          </ProductsDropdownDesktop>
        </NavItemDesktop>

          
          { currentUser ? 
             <NavItemDesktop>
               <StyledNavLink 
               to="/design-skimboard" 
               className={location.pathname === '/design-skimboard' ? 'active' : ''}>
              Customise
              </StyledNavLink>
             </NavItemDesktop>
           : '' }

        <NavItemDesktop>
          <StyledNavLink 
            to="/about" 
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About
          </StyledNavLink>
        </NavItemDesktop>
        <NavItemDesktop>
          <StyledNavLink 
            to="/faq" 
            className={location.pathname === '/faq' ? 'active' : ''}
          >
            FAQ
          </StyledNavLink>
        </NavItemDesktop>
      </DesktopNavLinks>

      <NavRightSection>
        <IconsGroup>
          <SearchBar />
          <CartLinkStyled
            to="/shoppingCart"
            onClick={() => isMobileMenuOpen && closeMobileMenuAndNavigate('/shoppingCart')}
          >
            <img src={CartIconImg} alt='Cart icon'/>
          </CartLinkStyled>
          <UserDropdown />
        </IconsGroup>

        <MobileMenuIcon onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuIcon>
      </NavRightSection>

      {/* Mobile Menu - Rendered based on state, styled for animation */}
      <MobileNavMenu isOpen={isMobileMenuOpen}>
          <MobileNavItem>
            <MobileButtonLink
                onClick={handleMobileProductsClick}
                className={location.pathname.startsWith('/products') ? 'active' : ''}
            >
              Products 
              {showMobileProductCategories ? <FaChevronUp style={{fontSize: '0.9em'}}/> : <FaChevronDown style={{fontSize: '0.9em'}}/>}
            </MobileButtonLink>
            {showMobileProductCategories && (
              <MobileSubMenu>
                {productCategories.map((category) => (
                  <StyledNavLink /* Re-using StyledNavLink here, might need specific MobileCategoryLink */
                    key={category.name}
                    to={category.path}
                    onClick={() => closeMobileMenuAndNavigate(category.path)}
                    className={location.pathname === category.path ? 'active' : ''}
                  >
                    {category.name}
                  </StyledNavLink>
                ))}
              </MobileSubMenu>
            )}
          </MobileNavItem>
          <MobileNavItem>
            <MobileStyledNavLink 
                to="/design-skimboard" 
                className={location.pathname === '/design-skimboard' ? 'active' : ''}
                onClick={() => closeMobileMenuAndNavigate('/design-skimboard')}
            >
              Customise
            </MobileStyledNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileStyledNavLink 
                to="/about" 
                className={location.pathname === '/about' ? 'active' : ''}
                onClick={() => closeMobileMenuAndNavigate('/about')}
            >
              About
            </MobileStyledNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileStyledNavLink 
                to="/faq" 
                className={location.pathname === '/faq' ? 'active' : ''}
                onClick={() => closeMobileMenuAndNavigate('/faq')}
            >
              FAQ
            </MobileStyledNavLink>
          </MobileNavItem>
      </MobileNavMenu>
    </NavContainer>
  );
};

export default Navbar;