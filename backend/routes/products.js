const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Product = require('../models/Product');

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      minRating, 
      search,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (category) query.category = category.toLowerCase();
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.rating = { $gte: Number(minRating) };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOptions.price = 1;
          break;
        case 'price-desc':
          sortOptions.price = -1;
          break;
        case 'newest':
          sortOptions.createdAt = -1;
          break;
        case 'oldest':
          sortOptions.createdAt = 1;
          break;
        case 'rating-desc':
          sortOptions.rating = -1;
          break;
        case 'rating-asc':
          sortOptions.rating = 1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || !price || !category || !image || !stock) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    
    const validCategories = ['electronics', 'clothing', 'books', 'home', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid category' 
      });
    }

    if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price and stock must be positive numbers' 
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category: category.toLowerCase(),
      image,
      stock: Number(stock),
      rating: 0,
      numReviews: 0
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating product',
      error: error.message 
    });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, category, price, stock, image } = req.body;
    
    if (category) {
      const validCategories = ['electronics', 'clothing', 'books', 'home', 'other'];
      if (!validCategories.includes(category.toLowerCase())) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid category' 
        });
      }
    }

    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({ 
        success: false,
        message: 'Price must be a positive number' 
      });
    }
    if (stock && (isNaN(stock) || stock < 0)) {
      return res.status(400).json({ 
        success: false,
        message: 'Stock must be a positive number' 
      });
    }

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(category && { category: category.toLowerCase() }),
      ...(price && { price: Number(price) }),
      ...(stock && { stock: Number(stock) }),
      ...(image && { image })
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;
