const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const productData = {
  _id: new mongoose.Types.ObjectId('67f610d5bab7e0a5ad8f2310'),
  name: "Sample Product",
  description: "This is a sample product description",
  price: 99.99,
  category: "electronics", 
  images: ["https://example.com/image.jpg"],
  stock: 50,
  rating: 4.5,
  user: new mongoose.Types.ObjectId('67f610d5bab7e0a5ad8f2310'), 
  createdAt: new Date(),
  updatedAt: new Date()
};


async function insertProduct() {
  try {
    const product = new Product(productData);
    await product.save();
    console.log('Product inserted successfully:', product);
  } catch (error) {
    console.error('Error inserting product:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertProduct(); 