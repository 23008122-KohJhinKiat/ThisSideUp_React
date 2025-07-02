// File: src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaShoppingCart,
  FaStar,
} from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import ProductCard from './ProductCard';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background-color: var(--color-background-dark, #121212); /* Very dark background */
  color: var(--color-text-light, #FFFFFF);
  min-height: 100vh;
  padding: var(--spacing-m, 16px) var(--spacing-l, 24px) var(--spacing-xl, 32px);
  font-family: var(--font-body, 'Arial', sans-serif);
`;

// BackButton: Styles the back arrow button for navigation.
const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-light, #FFFFFF);
  font-size: var(--font-size-xlarge, 24px); /* Larger icon */
  cursor: pointer;
  margin-bottom: var(--spacing-m, 16px);
  display: flex;
  align-items: center;

  &:hover {
    color: var(--color-secondary-peach, #FFDAB9);
  }
`;



// ProductContentWrapper: A container for the main product information (image and details).
// It uses a purple background and flexbox for a two-column layout.
const ProductContentWrapper = styled.div`
  background-color: var(--color-primary-purple, #5D3FD3); /* Purple background */
  padding: var(--spacing-xl, 32px);
  border-radius: var(--border-radius-l, 12px);
  display: flex;
  gap: var(--spacing-xl, 32px);
  margin-bottom: var(--spacing-xxl, 48px);

  @media (max-width: 768px) { // Responsive: stacks columns on smaller screens
    flex-direction: column;
    padding: var(--spacing-l, 24px);
  }
`;

// ImageColumn: The left column containing the product image and social action buttons.
const ImageColumn = styled.div`
  flex: 0 0 40%; /* Takes up 40% of the width, doesn't grow or shrink excessively */
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    flex: 1; /* Takes full width when stacked */
  }
`;

// Rename ProductImage to MainProductImage since that's what we use in the component
const MainProductImage = styled.img`
  width: 100%;
  max-width: 350px; /* Max width for the image */
  height: auto;
  object-fit: contain;
  background-color: white; /* Background for the image container itself */
  border-radius: var(--border-radius-m, 8px);
  margin-bottom: var(--spacing-l, 24px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

// SocialActions: Container for the "Share" and "Likes" buttons.
const SocialActions = styled.div`
  display: flex;
  justify-content: space-around; /* Spreads out Share and Likes */
  width: 100%;
  max-width: 350px;
  margin-top: var(--spacing-m, 16px);
`;

// BaseSocialButton: A common base for Share and Like buttons.
const BaseSocialButton = styled.button`
  background-color: var(--color-secondary-peach, #FFDAB9);
  color: var(--color-primary-purple-dark, #4B0082); /* Dark text for contrast */
  border: none;
  border-radius: var(--border-radius-m, 8px);
  padding: var(--spacing-s, 10px) var(--spacing-m, 16px);
  font-size: var(--font-size-medium, 16px);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 8px);
  transition: background-color 0.2s ease, color 0.2s ease; /* Added color transition */

  &:hover {
    background-color: var(--color-secondary-peach-dark, #FFA07A);
  }

  svg {
    font-size: var(--font-size-large, 18px);
    transition: color 0.2s ease; /* For smooth color change on icon */
  }
`;

// DetailsColumn: The right column containing product name, price, description, etc.
const DetailsColumn = styled.div`
  flex: 1; /* Takes remaining space */
  color: var(--color-text-light, #FFFFFF);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s, 10px); /* Spacing between detail items */
`;

// ProductName: Styles the product's name.
const ProductName = styled.h1`
  color: var(--color-text-light, #FFFFFF);
  font-size: var(--font-size-xxlarge, 28px);
  font-weight: bold;
  margin-bottom: var(--spacing-xs, 4px);
  font-family: var(--font-heading, 'Georgia', serif);
`;

// ProductPrice: Styles the product's price.
const ProductPrice = styled.p`
  font-size: var(--font-size-xlarge, 22px);
  color: var(--color-secondary-peach, #FFDAB9); /* Peach color for price */
  font-weight: 600;
  margin-bottom: var(--spacing-s, 8px);
`;

// RatingContainer: Holds the star icons and rating text.
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 8px);
  margin-bottom: var(--spacing-m, 16px);
  font-size: var(--font-size-medium, 16px);

  svg {
    color: #FFD700; /* Gold color for stars */
  }
`;

// ProductDescription: Styles the product description text.
const ProductDescription = styled.p`
  font-size: var(--font-size-small, 14px);
  line-height: 1.6;
  color: var(--color-neutral-gray-light, #E0E0E0); /* Lighter text for description */
  margin-bottom: var(--spacing-m, 16px);
`;

// InfoRow: A row for displaying structured info like "Bundle Deals", "Shipping".
const InfoRow = styled.div`
  display: flex;
  align-items: flex-start; /* Align items to the start if text wraps */
  gap: var(--spacing-m, 16px);
  margin-bottom: var(--spacing-s, 10px);
  font-size: var(--font-size-medium, 16px);
`;

// InfoLabel: Styles the label part (e.g., "Shipping:").
const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-text-light, #FFFFFF);
  min-width: 130px; /* Ensures alignment */
`;

// InfoValue: Styles the value part (e.g., "Within 1 Week...").
const InfoValue = styled.span`
  color: var(--color-neutral-gray-light, #E0E0E0);
  .highlight { /* For highlighting parts like shipping fee */
    color: var(--color-secondary-peach, #FFDAB9);
    font-weight: 600;
  }
`;

// QuantityControl: Container for the quantity adjuster.
const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-s, 12px);
  margin: var(--spacing-m, 16px) 0;
`;

// QuantityButton: Styles the "+" and "-" buttons for quantity.
const QuantityButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--color-text-light, #FFFFFF);
  border: none;
  border-radius: var(--border-radius-s, 4px);
  width: 30px;
  height: 30px;
  font-size: var(--font-size-large, 18px);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
    & svg {
    color: #fff;
    font-size: 18px;
  }
`;

// QuantityDisplay: Shows the current quantity number.
const QuantityDisplay = styled.span`
  font-size: var(--font-size-large, 18px);
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

// ActionButtonsContainer: Holds "Add to cart" and "Buy Now" buttons.
const ActionButtonsContainer = styled.div`
  display: flex;
  gap: var(--spacing-m, 16px);
  margin-top: var(--spacing-l, 24px);

  @media (max-width: 480px) { // Stacks buttons on very small screens
    flex-direction: column;
  }
`;

// BaseActionButton: Common styles for action buttons.
const BaseActionButton = styled.button`
  flex-grow: 1; /* Buttons share space equally */
  padding: var(--spacing-m, 14px);
  border: none;
  border-radius: var(--border-radius-m, 8px);
  font-size: var(--font-size-medium, 16px);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-s, 8px);

  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

// AddToCartButton: Specific style for the "Add to cart" button.
const AddToCartButton = styled(BaseActionButton)`
  background-color: var(--color-primary-purple-dark, #4B0082); /* Darker purple */
  color: var(--color-text-light, #FFFFFF);

  &:hover {
    background-color: var(--color-primary-purple-darker, #3A006A); /* Even darker on hover */
  }
`;

// BuyNowButton: Specific style for the "Buy Now" button.
const BuyNowButton = styled(BaseActionButton)`
  background-color: var(--color-neutral-gray-light, #E0E0E0);
  color: var(--color-primary-purple-dark, #4B0082); /* Dark text for contrast */

  &:hover {
    background-color: var(--color-neutral-gray, #BDBDBD);
  }
`;

// SimilarProductsSection: Container for the "Similar Products" area.
const SimilarProductsSection = styled.section`
  margin-top: var(--spacing-xxl, 48px);
  padding: var(--spacing-l, 24px) 0; /* Padding only top/bottom */
`;

// SimilarProductsTitle: Title for the "Similar Products" section.
const SimilarProductsTitle = styled.h2`
  font-size: var(--font-size-xlarge, 24px);
  font-weight: 600;
  margin-bottom: var(--spacing-l, 24px);
  color: var(--color-text-light, #FFFFFF);
  font-family: var(--font-heading, 'Georgia', serif);
`;

// SimilarProductsGrid: A scrollable grid for similar product cards.
const SimilarProductsGrid = styled.div`
  display: flex;
  gap: var(--spacing-l, 24px);
  overflow-x: auto; /* Enables horizontal scrolling */
  padding-bottom: var(--spacing-m, 16px); /* Space for scrollbar if needed */

  /* Hide scrollbar for a cleaner look, but still scrollable */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;


// --- REACT COMPONENT ---
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const { getProductById, filteredProducts, loading: contextLoading, error: contextError } = useProducts();
  const { currentUser } = useAuth(); // Get current user

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');

  // States for Likes functionality
  const [displayLikes, setDisplayLikes] = useState(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);

  useEffect(() => {
    const loadProductDetails = async () => {
      if (!id) {
        setError("No product ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Initialize likes from product data
          setDisplayLikes(fetchedProduct.likes !== undefined ? fetchedProduct.likes : 0);

          // Check localStorage if current user has liked this product
          if (currentUser && fetchedProduct._id) {
            const likedStatus = localStorage.getItem(`liked_${currentUser._id}_${fetchedProduct._id}`);
            if (likedStatus === 'true') {
              setIsLikedByCurrentUser(true);
            } else {
              setIsLikedByCurrentUser(false); // Ensure it's explicitly false if not found or not 'true'
            }
          } else {
            setIsLikedByCurrentUser(false); // No user or product ID, so cannot be liked by current user
          }
          
          if (filteredProducts && filteredProducts.length > 0) {
            const related = filteredProducts
              .filter(p => p.category === fetchedProduct.category && p._id !== fetchedProduct._id)
              .slice(0, 5);
            setSimilarProducts(related);
          }
        } else {
          setError(`Product with ID ${id} not found.`);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || "An error occurred while fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [id, getProductById, filteredProducts, currentUser]);

  const handleIncrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product) {
      if (cart?.addItemToCart) {
        cart.addItemToCart(product._id, quantity);
        setCartMessage(`Added to cart.`);
        setTimeout(() => setCartMessage(''), 3000);
      } else {
        setCartMessage('Cart functionality is currently unavailable');
        setTimeout(() => setCartMessage(''), 3000);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (cart?.addItemToCart) {
        cart.addItemToCart(product._id, quantity);
        navigate('/checkout');
      } else {
        setCartMessage('Cart functionality is currently unavailable');
        setTimeout(() => setCartMessage(''), 3000);
      }
    }
  };

  const handleLike = () => {
    if (!currentUser) {
      setCartMessage("Please log in to like products");
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }
    if (!product || !product._id) {
      console.error("Product data or ID is missing for like action");
      setCartMessage("Cannot like product at this time");
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }

    const localStorageKey = `liked_${currentUser._id}_${product._id}`;

    if (isLikedByCurrentUser) {
      // Unliking
      setDisplayLikes(prevLikes => Math.max(0, prevLikes - 1));
      setIsLikedByCurrentUser(false);
      localStorage.removeItem(localStorageKey);
    } else {
      // Liking
      setDisplayLikes(prevLikes => prevLikes + 1);
      setIsLikedByCurrentUser(true);
      localStorage.setItem(localStorageKey, 'true');
    }
    setTimeout(() => setCartMessage(''), 2000);
  };

  const handleShare = () => {
    if (product && navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => setCartMessage('Product shared!'))
      .catch((error) => {
          console.log('Error sharing:', error);
          setCartMessage('Could not share product.');
      });
    } else if (product) {
      // Fallback for browsers that don't support navigator.share
      // You could copy to clipboard or show a share dialog
      navigator.clipboard.writeText(window.location.href)
        .then(() => setCartMessage('Link copied to clipboard!'))
        .catch(() => setCartMessage('Could not copy link.'));
    } else {
        setCartMessage('Product data not available for sharing.');
    }
    setTimeout(() => setCartMessage(''), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return null; // Handle cases where rating might not be a number

    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={`star-${i}`}
          style={{ opacity: i < Math.round(numRating) ? 1 : 0.3 }}
        />
      );
    }
    return stars;
  };

  // Helper function to safely render HTML (use with caution, ensure source is trusted)
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };


  if (loading || contextLoading) {
    return <PageWrapper><p>Loading product details...</p></PageWrapper>;
  }

  if (error || contextError) {
    return <PageWrapper><p>Error: {error || contextError}</p></PageWrapper>;
  }

  if (!product) {
    return <PageWrapper><p>Product not found.</p></PageWrapper>;
  }

  // Prepare shipping info with highlight
  const highlightedShippingInfo = product.shippingInfo?.replace(
    /\$(\d+\.\d{2})/g, // Regex to find dollar amounts like $0.20
    '<span class="highlight">$$$1</span>' // $$ for literal $, $1 for captured group
  ) || 'Standard shipping available';


  return (
    <div className="product-detail-page"> {/* This class is for global page-specific background from index.css */}
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>

        <ProductContentWrapper>
          <ImageColumn>
            <MainProductImage src={product.imageUrl || '/placeholder.png'} alt={product.name} />
            <SocialActions>
              <BaseSocialButton onClick={handleShare}>
                <FaShareAlt /> Share
              </BaseSocialButton>
              <BaseSocialButton
                onClick={handleLike}
                title={isLikedByCurrentUser ? "Unlike this product" : "Like this product"}
                style={{
                  color: isLikedByCurrentUser ? 'var(--color-error-red, #D32F2F)' : 'var(--color-primary-purple-dark, #4B0082)',
                }}
              >
                <FaHeart style={{ color: isLikedByCurrentUser ? 'var(--color-error-red, #D32F2F)' : 'inherit' }} />
                Favorite ({displayLikes})
              </BaseSocialButton>
            </SocialActions>
          </ImageColumn>

          <DetailsColumn>
            <ProductName>{product.name || "Unnamed Product"}</ProductName>
            <ProductPrice>${product.price ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
            <RatingContainer>
              {renderStars(product.rating)}
              {/* Corrected to use numRatings as per Data.js */}
              <span>{product.numRatings || 0} Ratings</span>
            </RatingContainer>
            <ProductDescription>{product.description}</ProductDescription>
            
            <InfoRow>
              <InfoLabel>Bundle Deals:</InfoLabel>
              <InfoValue>{product.bundleDeals || 'None currently'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Shipping:</InfoLabel>
              {/* Using dangerouslySetInnerHTML for the highlight. Ensure shippingInfo is safe. */}
              <InfoValue dangerouslySetInnerHTML={createMarkup(highlightedShippingInfo)}>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel></InfoLabel> {/* Empty label for alignment with the line below */}
              <InfoValue>
                <span style={{fontSize: 'var(--font-size-small, 12px)', color: 'var(--color-neutral-gray, #BDBDBD)'}}>
                  {product.shippingVoucher || 'Check for shipping vouchers at checkout.'}
                </span>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Guarantee:</InfoLabel> {/* Changed from Shopping Guarantee for brevity */}
              <InfoValue>{product.shoppingGuarantee || 'Standard buyer protection.'}</InfoValue>
            </InfoRow>

            <QuantityControl>
              <InfoLabel>Quantity:</InfoLabel>
              <QuantityButton onClick={handleDecrementQuantity} disabled={quantity <= 1}> -
              </QuantityButton>
              <QuantityDisplay>{quantity}</QuantityDisplay>
              <QuantityButton onClick={handleIncrementQuantity} disabled={product.stock <=0 || quantity >= product.stock}> +

              </QuantityButton>
              {product.stock <= 0 && <span style={{color: 'var(--color-error-red)', marginLeft: '10px', fontSize: 'var(--font-size-small)'}}>Out of stock</span>}
              {product.stock > 0 && <span style={{fontSize: 'var(--font-size-small)', marginLeft: '10px', color: 'var(--color-neutral-gray-light)'}}>{product.stock} left</span>}

            </QuantityControl>
            <ActionButtonsContainer>
              <AddToCartButton onClick={handleAddToCart} disabled={product.stock <= 0}>
                <FaShoppingCart /> Add to cart
              </AddToCartButton>
              <BuyNowButton onClick={handleBuyNow} disabled={product.stock <= 0}>
                Buy Now
              </BuyNowButton>
            </ActionButtonsContainer>
            {cartMessage && (
              <div style={{
                color: 'var(--color-secondary-peach, #FFDAB9)',
                textAlign: 'center',
                marginTop: 'var(--spacing-m, 16px)',
                padding: 'var(--spacing-s, 8px)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--border-radius-s, 4px)'
              }}>
                {cartMessage}
              </div>
            )}
          </DetailsColumn>
        </ProductContentWrapper>

        {similarProducts.length > 0 && (
          <SimilarProductsSection>
            <SimilarProductsTitle>Similar Products</SimilarProductsTitle>
            <SimilarProductsGrid>
              {similarProducts.map(sp => (
                <ProductCard key={sp._id} product={sp} />
              ))}
            </SimilarProductsGrid>
          </SimilarProductsSection>
        )}
      </PageWrapper>
    </div>
  );
};

export default ProductDetailPage;