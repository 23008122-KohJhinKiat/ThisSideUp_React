import { initialProducts, generateId as productGenerateId } from "./ProductData";
import { initialUsers, generateId as accountGenerateId } from "./Accounts";
 
export { initialProducts } from "./ProductData";
export { initialUsers } from "./Accounts";
 
// Use a single generateId function to avoid conflicts
export const generateId = (prefix = 'id') => {
  // A simple way to differentiate, could be more robust
  // This logic assumes prefixes 'prod', 'user', 'custom', 'order', 'design'
  if (prefix.startsWith('prod')) return productGenerateId(prefix);
  if (prefix.startsWith('user')) return accountGenerateId(prefix);
  if (prefix.startsWith('custom') || prefix.startsWith('design')) return `dsgn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`; // Example for design IDs
  if (prefix.startsWith('order')) return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`; // Example for order IDs
  // Fallback or more specific logic for other prefixes
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
};
 
 
export const initialCustomDesigns = [
  {
    _id: generateId('custom'),
    userId: "user123",
    designName: "Custom Wave Design",
    basePrice: 300,
    description: "Custom designed skimboard with wave patterns",
  }
];
 
export const initialOrders = [];
 
// Define product categories (already defined in Navbar, ensure consistency or centralize)
export const productCategories = [ // This might be redundant if defined elsewhere (e.g. Navbar)
   'All',
   'Skimboards',
   'T-Shirts',
   'Boardshorts',
   'Accessories',  
   'Beach Bags',
   'Towels',
 ];
 
// --- Mock API Functions ---
 
// PRODUCTS API Functions
export const fetchProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...initialProducts];
};
 
export const fetchProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const product = initialProducts.find(p => p._id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return {...product};
};
 
export const searchProductsAPI = async (searchTerm, category, sortBy = 'name_asc') => {
  await new Promise(resolve => setTimeout(resolve, 200));
 
  let filteredProducts = [...initialProducts];
 
  if (searchTerm && searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term)) // Added check for product.description
    );
  }
 
  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(product =>
      product.category === category
    );
  }
 
  switch (sortBy) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name_desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'name_asc':
    default:
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
 
  return filteredProducts;
};
 
 
// USERS & AUTH
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
 
const validatePassword = (password) => {
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return re.test(password);
};
 
export const loginAPI = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 300));
 
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
 
  const user = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
 
  if (!user) {
    console.log("Login attempt: User not found for email:", email);
    throw new Error('Invalid email or password');
  }
 
  // NOTE: Comparing raw password with passwordHash for demo. In real app, compare hashes.
  if (user.passwordHash !== password) {
    console.log("Login attempt: Password mismatch for email:", email);
    throw new Error('Invalid email or password');
  }
 
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
 
export const signupAPI = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
 
  if (!userData.email || !userData.password || !userData.name) {
    throw new Error("Name, email and password are required");
  }
  if (!userData.name.trim()) { // Added check for blank name
      throw new Error("Name cannot be empty");
  }
 
 
  if (!validateEmail(userData.email)) {
    throw new Error("Invalid email format");
  }
 
  if (!validatePassword(userData.password)) {
    throw new Error("Password must be at least 8 characters long and contain at least one number and one special character (e.g., !@#$%^&*)");
  }
 
  if (initialUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error("Email already in use");
  }
 
  const newUser = {
    _id: generateId('user'), // generateId was re-defined, ensure it works for users
    name: userData.name,
    email: userData.email,
    passwordHash: userData.password, // In real app, HASH THIS PASSWORD
    role: userData.role || "customer",
    createdAt: new Date().toISOString()
  };
 
  initialUsers.push(newUser);
  console.log("User signed up and added to initialUsers:", newUser);
  console.log("Current initialUsers:", initialUsers);
 
 
  const { passwordHash, ...userWithoutPassword } = newUser;
  return {
    ...userWithoutPassword,
    // token: `mock_token_${Date.now()}` // Token not strictly needed if session managed by currentUser
  };
};
 
// CUSTOM DESIGNS
export const saveCustomDesignAPI = async (designData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const newDesign = {
    _id: generateId('design'),
    userId: designData.userId,
    name: designData.name || `Custom Design ${initialCustomDesigns.length + 1}`,
    ...designData,
    price: designData.price || 200.00,
    createdAt: new Date().toISOString(),
  };
  initialCustomDesigns.push(newDesign);
  return { ...newDesign };
};
 
// --- NEW DATA FOR SHOPPING CART PAGE ---
export const initialShoppingCartPageItems = [
  { _id: 'cartItem_1', name: 'Snorkeling Gear for Adults, Dry-Top Snorkel Set...', price: 57.39, imageUrl: 'https://picsum.photos/seed/snorkeling_gear/80/80', quantity: 2, selected: false },
  { _id: 'cartItem_2', name: 'Tahe sup-yak Air 10\'6 Beach pack, Inflatable Kayak...', price: 745.00, imageUrl: 'https://picsum.photos/seed/sup_yak/80/80', quantity: 1, selected: true },
  { _id: 'cartItem_3', name: 'Mesh Duffel Bag, Dive Bags Travel Beach Gear Bag...', price: 65.14, imageUrl: 'https://picsum.photos/seed/duffel_bag/80/80', quantity: 1, selected: true },
];
 
// ORDERS
export const createOrderAPI = async (orderData) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newOrder = {
    _id: generateId('order'), // generateId was re-defined, ensure it works for orders
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  initialOrders.push(newOrder);
  return { ...newOrder };
};
 
export const fetchOrdersForUserAPI = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return initialOrders.filter(order => order.userId === userId);
};
 
export const topSearchTerms = [
    "Skimboards", "Hats", "Towels", "Sandals", "Traction Pads", "Sunscreen", "Beach Bags", "Flip-Flops", "Boardshorts"
];
 
export const toggleProductLikeAPI = async (productId, userId) => {
  try {
    const productIndex = initialProducts.findIndex(p => p._id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
 
    const product = initialProducts[productIndex];
    const likes = product.likes || []; // Ensure likes array exists
    const userLikedIndex = likes.indexOf(userId);
 
    if (userLikedIndex === -1) {
      likes.push(userId);
    } else {
      likes.splice(userLikedIndex, 1);
    }
 
    initialProducts[productIndex] = {
      ...product,
      likes: likes
    };
 
    return {
      liked: likes.includes(userId),
      likesCount: likes.length
    };
  } catch (error) {
    console.error('Error in toggleProductLikeAPI:', error);
    throw error;
  }
};