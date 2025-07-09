require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow server to accept JSON in request body

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// --- Product Schema and Model ---
// This defines the structure of a product document in MongoDB
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: Number,
  tags: [String],
  rating: Number,
  numRatings: Number,
  likes: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

// --- API Routes (Endpoints) ---

// GET all products or products by category
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}); // Find all products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

app.get('/api/products/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products for category ${req.params.categoryName}:`, error);
    res.status(500).json({ message: "Server error fetching products by category" });
  }
});


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});