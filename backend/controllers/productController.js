const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, q, minPrice, maxPrice, minRating, sortBy = '-createdAt', page = 1, limit = 12 } = req.query;
    
    const filter = { isActive: true };
    
    // Category filter
    if (category && category !== 'all') {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        filter.category = cat._id;
      }
    }

    // Search query
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug icon')
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug icon')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug icon')
      .limit(8);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching featured products' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categorySlug
exports.getProductsByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 12, sortBy = '-createdAt' } = req.query;
    
    const category = await Category.findOne({ slug: req.params.categorySlug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments({ category: category._id, isActive: true });
    
    const products = await Product.find({ category: category._id, isActive: true })
      .populate('category', 'name slug icon')
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      category: { name: category.name, slug: category.slug },
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    // Convert category name to slug if needed
    if (req.body.category && !req.body.category.match(/^[0-9a-f]{24}$/i)) {
      const category = await Category.findOne({ slug: req.body.category });
      if (category) {
        req.body.category = category._id;
      }
    }

    const product = await Product.create(req.body);
    await product.populate('category', 'name slug icon');

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.category && !req.body.category.match(/^[0-9a-f]{24}$/i)) {
      const category = await Category.findOne({ slug: req.body.category });
      if (category) {
        req.body.category = category._id;
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug icon');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};

// @desc    Create category (Admin)
// @route   POST /api/products/categories
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();
    await product.populate('reviews.user', 'name');

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
