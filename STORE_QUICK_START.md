# DFC Store - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- MongoDB connected and running

---

## Step 1: Seed Products to Database ⚡

In your backend terminal:

```bash
cd backend
npm run seed:products
```

**What this does:**
- Creates 7 product categories
- Adds 25+ DFC-branded products
- Sets up pricing, stock, and images
- Configures colors, sizes, and features

✅ You should see:
```
🏪 Starting DFC Store Seed...
✅ Created 7 categories
✅ Created 25 products
🎉 Store seeding completed successfully!
```

---

## Step 2: Start Your Application 🎬

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Step 3: Visit Your Store 🛍️

Open your browser and go to:
```
http://localhost:5173
```

Click **"Store"** in the navigation bar!

---

## 📍 What You'll See

### Store Page (`/store`)
- Grid of 12 products per page
- Filter sidebar with:
  - Search bar
  - Category selection
  - Price range filter
  - Sort options
- Product cards showing:
  - Product image
  - Name and category
  - Price with discount
  - Rating
  - Stock status

### Product Detail Page (`/store/:slug`)
- Full product information
- Product images
- Color and size selection
- Quantity control
- Add to cart button
- Add to wishlist button
- Share button
- Related products below

---

## 🎮 Try These Actions

### 1. Browse Products
- Click "Store" in navbar
- See all products listed
- Use filters to narrow down

### 2. Search for Products
- Type in the search box
- Example: "dumbbell", "yoga", "shirt"
- Results update in real-time

### 3. Filter by Category
- Click a category button
- Only products in that category show
- Try: "Dumbbells & Weights", "Women's Wear"

### 4. Filter by Price
- Select minimum price
- Select maximum price
- Products update automatically

### 5. Sort Products
- Click dropdown in sidebar
- Options: Newest, Price (Low to High), Price (High to Low), Rating, Name
- Try different sorts

### 6. View Product Details
- Click any product card
- See full description
- View all images
- Read features
- Check stock status

### 7. Add to Cart (Login Required)
- Click "Add to Cart" button
- Select color (if available)
- Select size (if available)
- Choose quantity
- Product added to cart

### 8. Add to Wishlist (Login Required)
- Click heart icon on product
- Product saved to wishlist
- Heart becomes filled

### 9. Share Product
- Click share button
- Share link with friends/social media

### 10. View Related Products
- Scroll to bottom of product page
- See similar products from same category
- Click to view

---

## 🔍 Product Categories to Explore

### 1. Women's Wear 👩‍🦰
- Performance T-Shirt
- Sport Shorts
- Sports Bra
- Leggings

### 2. Men's Wear 👨
- Performance T-Shirt
- Athletic Shorts
- Joggers

### 3. Footwear 👟
- Running Shoes
- Gym Shoes

### 4. Dumbbells & Weights 🏋️
- Adjustable Dumbbell Set
- Rubber Coated Dumbbells
- Weight Plate Sets

### 5. Gym Equipment ⚙️
- Weight Bench
- Treadmill Pro
- Stationary Cycle
- Crossover Machine

### 6. Weighing Scales ⚖️
- Digital Scale
- Body Composition Analyzer

### 7. Accessories ✨
- Yoga Mat
- Resistance Bands
- Water Bottle
- Gym Bag
- Wrist Wraps

---

## 💡 Common Tasks

### Test Add to Cart
1. Navigate to Store
2. Click any product
3. Login if not already
4. Select color/size
5. Click "Add to Cart"
6. Go to /cart to verify

### Test Wishlist
1. On product page, click heart button
2. Login if needed
3. Go to /wishlist
4. See product in wishlist

### Test Filters
1. Go to Store
2. Select "Dumbbells & Weights" category
3. Set price range: ₹10,000 - ₹20,000
4. Sort by "Price: High to Low"
5. See filtered results

### Test Search
1. Go to Store
2. Type "DFC" in search
3. See all DFC products (all of them!)
4. Try "yoga" to find yoga mats
5. Try "tshirt" to find clothing

---

## 🔧 Troubleshooting

### Products Not Showing?
**Problem:** Store page shows "No products found"
**Solution:** 
1. Run seed script: `npm run seed:products`
2. Check MongoDB is running
3. Refresh page (Ctrl+R)

### Images Not Loading?
**Problem:** Products show placeholder images
**Solution:**
- This is normal - placeholder URLs are used
- To add real images, update product URLs in MongoDB
- Or upload to CDN and update

### Can't Add to Cart?
**Problem:** "Not authorized" error
**Solution:**
- You must be logged in to add to cart
- Login first, then try again

### Pagination Not Working?
**Problem:** Page buttons don't change products
**Solution:**
- Check browser console for errors
- Ensure backend is running
- Refresh page

### Filters Not Working?
**Problem:** Filters don't update results
**Solution:**
- Ensure backend seed completed
- Check network tab in browser DevTools
- Verify backend is running

---

## 📊 Database Check

### Verify Seeding Worked

**In MongoDB:**
```javascript
// Check categories created
db.categories.find().pretty()

// Check products created
db.products.find().count()  // Should be 25+

// Check a sample product
db.products.findOne()
```

---

## 🎓 Next Steps

### For Development
- [ ] Add real product images
- [ ] Update product descriptions
- [ ] Add more products
- [ ] Create admin panel for product management
- [ ] Set up CDN for images
- [ ] Add product reviews display

### For Features
- [ ] Build inventory management
- [ ] Add product recommendations
- [ ] Create admin dashboard
- [ ] Add product import/export
- [ ] Build customer reviews section
- [ ] Add size guide
- [ ] Create product comparison

### For Production
- [ ] Replace placeholder images
- [ ] Move images to CDN
- [ ] Optimize database queries
- [ ] Add caching layer
- [ ] Set up analytics
- [ ] Add SEO metadata
- [ ] Implement API rate limiting

---

## 📱 Mobile Testing

Store is fully responsive! Test on:
- Desktop browsers
- Tablets (768px+)
- Mobile phones (320px+)
- Different orientations

All filters, search, and pagination work on mobile!

---

## 🎯 Sample Products Pricing

| Product | Category | Price | Discount | Final |
|---------|----------|-------|----------|-------|
| Women's T-Shirt | Women's Wear | ₹599 | 15% | ₹509 |
| Sports Bra | Women's Wear | ₹1,299 | 12% | ₹1,143 |
| Weight Bench | Gym Equipment | ₹8,999 | 18% | ₹7,379 |
| Treadmill | Gym Equipment | ₹34,999 | 20% | ₹27,999 |
| Dumbbells Set | Weights | ₹14,999 | 15% | ₹12,749 |
| Yoga Mat | Accessories | ₹1,299 | 10% | ₹1,169 |

---

## ✨ Features Highlight

✅ **Search & Filter:** Real-time product search
✅ **Categories:** 7 organized categories
✅ **Price Range:** Filter by budget
✅ **Sorting:** Multiple sort options
✅ **Pagination:** Browse 12 items at a time
✅ **Variants:** Choose colors and sizes
✅ **Stock Management:** See availability
✅ **Responsive:** Works on all devices
✅ **Wishlist:** Save favorite products
✅ **Reviews:** Product ratings system
✅ **Related Products:** See similar items
✅ **Share:** Share with friends

---

## 🎉 You're All Set!

Your DFC store is now fully functional with:
- 25+ products
- 7 categories
- Complete filtering
- Cart integration
- Wishlist support
- Mobile responsive design

**Enjoy your new fitness gear store! 💪**

---

## 📞 Need Help?

Check these files for more info:
- `STORE_SETUP_GUIDE.md` - Detailed setup guide
- `STORE_FILES_REFERENCE.md` - File structure and modifications
- Backend API endpoints in `backend/routes/products.js`
- Frontend implementation in `frontend/src/pages/Store.jsx`
