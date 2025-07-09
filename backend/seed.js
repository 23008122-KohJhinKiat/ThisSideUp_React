require('dotenv').config();
const mongoose = require('mongoose');
const { initialProducts} = require('../ThisSideUp_React_test/src/Data/ProductData'); // Adjust path if needed

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

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding.");

    // Clear existing products to avoid duplicates
    await Product.deleteMany({});
    console.log("Existing products cleared.");

    // Mongoose doesn't need _id, it will be generated automatically.
    // The generateId function is no longer needed here.
    const productsToInsert = initialProducts.map(({ _id, ...rest }) => rest);

    // Insert the new products
    await Product.insertMany(productsToInsert);
    console.log("Database seeded successfully with new products!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

seedDatabase();