# DFC Store Setup Guide

## ✅ What's Been Added

Your DFC website now has a complete product-based store system with:

### Backend Features
- **Product Model**: Comprehensive product management with colors, sizes, stock, pricing, reviews
- **Category System**: 7 product categories (Women's Wear, Men's Wear, Footwear, Dumbbells & Weights, Gym Equipment, Weighing Scales, Accessories)
- **Product API Endpoints**: Full CRUD operations with filtering, sorting, and search
- **Cart Enhancement**: Extended to support both plans and products with variants (color, size)
- **Wishlist Enhancement**: Updated to support products alongside plans
- **25+ Sample Products**: All branded as "DFC" with realistic data

### Frontend Features
- **Store Page**: Browse all products with advanced filters, search, and pagination
- **Product Detail Page**: Full product information, image gallery, reviews, and recommendations
- **Cart Integration**: Add products with selected colors/sizes and quantities
- **Wishlist Support**: Save products for later
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🚀 How to Set Up

### Step 1: Seed the Products to Database

Run this command in your backend directory to populate the database with DFC products:

```bash
npm run seed:products
```

This will create:
- 7 product categories
- 25+ products across all categories
- All configured with images, prices, discounts, and stock

### Step 2: Start Your Application

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
npm run dev
```

### Step 3: Access the Store

1. Navigate to your website
2. Click "Store" in the navigation bar
3. Browse products by category or search
4. Click on any product to see full details
5. Add to cart or wishlist

## 📋 Product Categories & Items

### 1. **Women's Wear** (👩‍🦰)
- DFC Women's Performance T-Shirt - ₹599 (15% off → ₹509)
- DFC Women's Sport Shorts - ₹799 (10% off → ₹719)
- DFC Women's Sports Bra - ₹1,299 (12% off → ₹1,143)
- DFC Women's Leggings - ₹999 (20% off → ₹799)

### 2. **Men's Wear** (👨)
- DFC Men's Performance T-Shirt - ₹599 (15% off → ₹509)
- DFC Men's Athletic Shorts - ₹799 (10% off → ₹719)
- DFC Men's Joggers - ₹999 (18% off → ₹819)

### 3. **Footwear** (👟)
- DFC Professional Running Shoes - ₹3,999 (25% off → ₹2,999)
- DFC Training Gym Shoes - ₹2,999 (20% off → ₹2,399)

### 4. **Dumbbells & Weights** (🏋️)
- DFC Adjustable Dumbbell Set (10-50 lbs) - ₹14,999 (15% off → ₹12,749)
- DFC Rubber Coated Dumbbell 20kg - ₹1,999 (10% off → ₹1,799)
- DFC Weight Plate Set (50 kg) - ₹9,999 (12% off → ₹8,799)

### 5. **Gym Equipment** (⚙️)
- DFC Adjustable Weight Bench - ₹8,999 (18% off → ₹7,379)
- DFC Treadmill Pro 3000 - ₹34,999 (20% off → ₹27,999)
- DFC Stationary Cycle Pro - ₹12,999 (15% off → ₹11,049)
- DFC Crossover Machine - ₹19,999 (12% off → ₹17,599)

### 6. **Weighing Scales** (⚖️)
- DFC Digital Body Weighing Scale - ₹999 (5% off → ₹949)
- DFC Body Composition Analyzer Scale - ₹2,999 (15% off → ₹2,549)

### 7. **Accessories** (✨)
- DFC Premium Yoga Mat - ₹1,299 (10% off → ₹1,169)
- DFC Resistance Bands Set - ₹799 (12% off → ₹703)
- DFC Water Bottle 1L - ₹699 (8% off → ₹643)
- DFC Sports Gym Bag - ₹1,499 (10% off → ₹1,349)
- DFC Wrist Wraps Support Pair - ₹599

## 🛒 Store Features

### For Customers
- ✅ Browse products by category
- ✅ Search for specific products
- ✅ Filter by price range
- ✅ Sort by newest, price, rating, name
- ✅ View detailed product information
- ✅ Select colors and sizes
- ✅ Control quantity before adding to cart
- ✅ Add to cart or wishlist
- ✅ View related products
- ✅ Share products with others
- ✅ Responsive mobile design

### For Admin (Future Enhancement)
- Create new products
- Update product details
- Manage inventory/stock
- Delete products
- View product reviews
- Set featured products
- Create categories

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:categorySlug` - Get products by category
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add product review (protected)

### Cart (Updated)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add plan or product to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear all cart

### Wishlist (Updated)
- `GET /api/wishlist` - Get user's wishlist (plans + products)
- `POST /api/wishlist` - Add plan or product to wishlist
- `DELETE /api/wishlist/:id?type=plan|product` - Remove from wishlist

## 📝 Database Models

### Product Schema
```
- name, slug, description, shortDescription
- category (reference to Category)
- price, discountPrice, discount
- images, color, size options
- stock, SKU
- material, dimensions, weight
- rating, reviews
- features, tags
- isFeatured, isActive
```

### Category Schema
```
- name, slug, description
- icon, image
- isActive
```

### Cart Item (Extended)
```
- Supports both:
  - Plans (with duration, personalTrainer option)
  - Products (with quantity, color, size, price)
```

### Wishlist (Extended)
```
- plans: Array of Plan references
- products: Array of Product references
```

## 🎨 Frontend Routes

- `/store` - Store main page with filtering
- `/store/:slug` - Product detail page

## 📊 Key Features

### Store Page
- Grid display with loading states
- Search bar for quick product finding
- Category sidebar filter
- Price range filter
- Sort dropdown
- Pagination for browsing
- Product cards showing:
  - Product image
  - Name and category
  - Price and discount
  - Rating and availability
  - Stock indicator

### Product Detail Page
- Large product image
- Detailed product information
- Color selection
- Size selection
- Quantity selector
- In-stock/Out-of-stock status
- Add to cart button
- Add to wishlist button
- Share button
- Related products section
- Product metadata (SKU, brand, material)

## 🔐 Authentication

- Store is public (browsable without login)
- Cart/Wishlist operations require authentication
- Admin functions require admin role
- Reviews require user authentication

## 💰 Pricing Features

- Base price and discounted price
- Discount percentage display
- Savings calculation
- Stock-based availability

## 🎯 Customization Tips

### To Add More Products
1. Create new product entries similar to the seed file
2. Run seed script again, or
3. Use admin API to create products programmatically

### To Modify Existing Products
1. Use admin dashboard (to be built)
2. Update MongoDB documents directly
3. Use admin API endpoints

### To Update Product Images
1. Upload images to your uploads folder
2. Update product image URLs
3. Store product images on CDN for production

### To Add New Categories
1. Create category via API or admin panel
2. Reference category in products
3. Categories appear automatically in filters

## 🚨 Important Notes

### Default Placeholder Images
All products have placeholder image URLs. For production:
1. Replace with real product images
2. Upload to CDN (AWS S3, Cloudinary, etc.)
3. Update product URLs in database

### Stock Management
- Stock quantities are pre-set in seed data
- Update as needed for your inventory
- Out-of-stock products are automatically disabled

### Pricing
- All prices are in INR (₹)
- Adjust discounts and prices as needed
- Discounts are automatic in cart

## ✨ Next Steps

### Optional Enhancements
1. **Admin Dashboard**: Create admin panel to manage products
2. **Product Images**: Upload real product images
3. **Customer Reviews**: Build review display component
4. **Inventory Management**: Real-time stock updates
5. **Product Variants**: More detailed variant handling
6. **Recommendations**: ML-based product recommendations
7. **Wishlist Sharing**: Share wishlist with friends
8. **Bulk Operations**: Import/export products via CSV

## 🎓 Learning Resources

- Product filtering and pagination patterns
- Component composition for reusable UI
- API design for e-commerce
- State management with React hooks
- Responsive design patterns

---

**Store is now ready to use with 25+ DFC-branded fitness products!** 🎉
