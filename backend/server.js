const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));


app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    if (!collectionNames.includes('users')) {
      await mongoose.connection.createCollection('users');
      console.log('Created users collection');
    }
    
    if (!collectionNames.includes('products')) {
      await mongoose.connection.createCollection('products');
      console.log('Created products collection');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});