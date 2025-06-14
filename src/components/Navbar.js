import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import styled from 'styled-components';
import TSULogo from '../icons/this-side-up-logo_white.png';
import SearchPNG from '../icons/icons8-search.png';
import CloseIcon from '../icons/icons8-close.png';
import CartIcon from '../icons/icons8-cart.png';
import UserIcon from '../icons/icons8-user.png';
import { queryAllByAltText } from '@testing-library/react';

// Search Bar
function SearchIcon() {
  const [isVisible, setIsVisible] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleClick = () => {
    setIsVisible(prev => !prev);
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      Navigate(`/search?q={encodeURIComponent(query)}`);
      setIsVisible(false);
    }
  }

  return (
    <div>
      <div style={{ alignItems: 'center' }}>
        {isVisible ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <form>
              <input
                id="search"
                type="text"
                placeholder="Search"
                value={keyword}
                onChange={handleInputChange}
              />
              <img
                src={CloseIcon}
                width="30px"
                height="30px"
                alt="Close icon"
                onClick={handleClick}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '45%',
                  cursor:'pointer'
                }}
              />
            </form>
          </div>
        ) : (
          <img
            id="icon"
            src={SearchPNG}
            width="40px"
            height="40px"
            alt="Search icon"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </div>
  );
}


// User Dropdown
function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick2 = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* User Icon (always visible) */}
      <img
        id="icon"
        src={UserIcon}
        width="40px"
        height="40px"
        alt="User icon"
        onClick={handleClick2}
        style={{ cursor: 'pointer', position: 'relative' }}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '75px',
            right: 0,
            backgroundColor: '#222222',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: '260px',
            height: '100px',
            padding: '0.5rem 0',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Link
            to="/signin"
            id='link'
            
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            id='link'
            
          >
            Create an Account
          </Link>
        </div>
      )}
    </div>
  );
}



const Nav = styled.nav`
  background: #222;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  height: 106px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 3rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
`;

const NavItem = styled.div`
  position: relative;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.3rem;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  
  &:hover {
    color: #b19cd9;
  }

  &.active {
    color: #b19cd9;
    font-weight: bold;
  }
`;

const ProductsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 0.5rem;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  min-width: 200px;
  z-index: 1001;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 2px;
  }
`;

const DropdownGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
`;

const CategoryLink = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  display: block;

  &:hover {
    background: #f8f9fa;
    color: #b19cd9;
    transform: translateX(4px);
  }
`;

const DropdownTitle = styled.h3`
  color: #333;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  padding: 0 1rem;
  font-weight: 600;
  font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
`;
// a
const Navbar = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const productCategories = [
    { name: 'All Products', path: '/products' },
    { name: 'Skimboards', path: '/products/category/Skimboards' },
    { name: 'T-Shirts', path: '/products/category/T-Shirts' },
    { name: 'Boardshorts', path: '/products/category/Boardshorts' },
    { name: 'Accessories', path: '/products/category/Accessories' },
    { name: 'Beach Bags', path: '/products/category/Beach Bags' },
    { name: 'Towels', path: '/products/category/Towels' }
  ];

  return (
    <Nav id='font1'>
      <StyledLink to="/">
        <img 
          src={TSULogo} 
          alt="This Side Up logo" 
          style={{padding: '13px 10px 13px 90px'}} 
          width="290px"
        />
      </StyledLink>
      <NavLinks>
        <NavItem
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <StyledLink 
            to="/products" 
            className={location.pathname.includes('/products') ? 'active' : ''}
          >
            Products
          </StyledLink>
          <ProductsDropdown show={showDropdown}>
            <DropdownTitle>Shop by Category</DropdownTitle>
            <DropdownGrid>
              {productCategories.map((category, index) => (
                <CategoryLink 
                  key={index}
                  to={category.path}
                  onClick={() => setShowDropdown(false)}
                >
                  {category.name}
                </CategoryLink>
              ))}
            </DropdownGrid>
          </ProductsDropdown>
        </NavItem>
        <NavItem>
          <StyledLink 
            to="/design-skimboard" 
            className={location.pathname === '/design-skimboard' ? 'active' : ''}
          >
            Customise
          </StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink 
            to="/about" 
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About
          </StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink 
            to="/faq" 
            className={location.pathname === '/faq' ? 'active' : ''}
          >
            FAQ
          </StyledLink>
        </NavItem>
      </NavLinks>
      <div style={{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginRight: '20px',
    width: 'auto',
    height:'500px',
    alignItems: 'center',
    overflow: 'hidden',
  }}>
        <div 
            id='icon'
            style={{marginLeft:'35px'}}
          >
            <SearchIcon />
        </div>
        <Link 
            id='icon'
            to="/shoppingCart" 
            className={location.pathname === '/shoppingCart' ? 'active' : ''}
            style={{marginLeft:'35px', cursor: 'pointer'}}
          >
            <img id='icon' src={CartIcon}
            width='40px'
            height='40px'
            alt='Cart icon'
            ></img>
        </Link>
        <div 
            id='icon'
            style={{marginLeft:'35px'}}
          >
            <UserDropdown />
        </div>
      </div>
    </Nav>
  );
};

export default Navbar;
