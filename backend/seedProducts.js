const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const seedProducts = async () => {
  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Cleared old data');

    console.log('🏪 Starting DFC Store Seed...');

    // Create categories
    const categories = [
      {
        name: 'Women\'s Wear',
        slug: 'womens-wear',
        description: 'Premium women\'s fitness clothing and apparel',
        icon: '👩‍🦰',
        isActive: true
      },
      {
        name: 'Men\'s Wear',
        slug: 'mens-wear',
        description: 'Premium men\'s fitness clothing and apparel',
        icon: '👨',
        isActive: true
      },
      {
        name: 'Footwear',
        slug: 'footwear',
        description: 'High-performance fitness footwear',
        icon: '👟',
        isActive: true
      },
      {
        name: 'Dumbbells & Weights',
        slug: 'dumbbells-weights',
        description: 'Premium dumbbells and weight plates',
        icon: '🏋️',
        isActive: true
      },
      {
        name: 'Gym Equipment',
        slug: 'gym-equipment',
        description: 'Professional gym equipment and machines',
        icon: '⚙️',
        isActive: true
      },
      {
        name: 'Weighing Scales',
        slug: 'weighing-scales',
        description: 'Digital weighing scales and body composition analyzers',
        icon: '⚖️',
        isActive: true
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Fitness accessories and supplements',
        icon: '✨',
        isActive: true
      }
    ];

    const createdCategories = await Category.create(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Get categories by slug for reference
    const womensCat = await Category.findOne({ slug: 'womens-wear' });
    const mensCat = await Category.findOne({ slug: 'mens-wear' });
    const footwearCat = await Category.findOne({ slug: 'footwear' });
    const dumbbellsCat = await Category.findOne({ slug: 'dumbbells-weights' });
    const gymCat = await Category.findOne({ slug: 'gym-equipment' });
    const scalesCat = await Category.findOne({ slug: 'weighing-scales' });
    const accessoriesCat = await Category.findOne({ slug: 'accessories' });

    // Create products
    const products = [
      // Women's Wear
      {
        name: 'DFC Women\'s Performance T-Shirt',
        slug: 'dfc-womens-performance-tshirt',
        description: 'Breathable and comfortable t-shirt designed for intense workouts. Made with moisture-wicking fabric to keep you dry and cool.',
        shortDescription: 'Breathable workout t-shirt for women',
        category: womensCat._id,
        sku: 'DFC-WT-001',
        price: 599,
        discount: 15,
        discountPrice: 509,
        stock: 50,
        color: ['Black', 'White', 'Pink', 'Purple'],
        size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Polyester blend',
        features: ['Moisture-wicking', 'Breathable', 'Stretchy', 'UV protection'],
        tags: ['women', 'tshirt', 'workout', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Women\'s Sport Shorts',
        slug: 'dfc-womens-sport-shorts',
        description: 'High-waisted athletic shorts with built-in compression. Perfect for running, gym, or any fitness activity.',
        shortDescription: 'High-waisted athletic shorts',
        category: womensCat._id,
        sku: 'DFC-WS-001',
        price: 799,
        discount: 10,
        discountPrice: 719,
        stock: 40,
        color: ['Black', 'Navy', 'Grey', 'Maroon'],
        size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Nylon blend',
        features: ['Built-in compression', 'High-waisted', 'Pocket design', 'Breathable'],
        tags: ['women', 'shorts', 'gym', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Women\'s Sports Bra',
        slug: 'dfc-womens-sports-bra',
        description: 'High-support sports bra with adjustable straps and underwire support. Designed for maximum comfort during workouts.',
        shortDescription: 'High-support sports bra',
        category: womensCat._id,
        sku: 'DFC-WB-001',
        price: 1299,
        discount: 12,
        discountPrice: 1143,
        stock: 30,
        color: ['Black', 'White', 'Navy', 'Pink'],
        size: ['28A', '30B', '32C', '34D', '36E', '38F'],
        material: 'Nylon, Spandex',
        features: ['High-support', 'Underwire', 'Adjustable straps', 'Breathable fabric'],
        tags: ['women', 'sports-bra', 'support', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Women\'s Leggings',
        slug: 'dfc-womens-leggings',
        description: 'Comfortable and stylish leggings with high waist and pockets. Made with stretchy fabric for maximum mobility.',
        shortDescription: 'High-waist workout leggings',
        category: womensCat._id,
        sku: 'DFC-WL-001',
        price: 999,
        discount: 20,
        discountPrice: 799,
        stock: 45,
        color: ['Black', 'Grey', 'Navy', 'Purple', 'Olive'],
        size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Nylon, Spandex blend',
        features: ['High-waist', 'Pockets', 'Stretchy', 'Moisture-wicking'],
        tags: ['women', 'leggings', 'casual', 'dfc'],
        isFeatured: true,
        isActive: true
      },

      // Men's Wear
      {
        name: 'DFC Men\'s Performance T-Shirt',
        slug: 'dfc-mens-performance-tshirt',
        description: 'Premium quality t-shirt with advanced moisture management. Perfect for gym or casual wear.',
        shortDescription: 'High-performance gym t-shirt',
        category: mensCat._id,
        sku: 'DFC-MT-001',
        price: 599,
        discount: 15,
        discountPrice: 509,
        stock: 55,
        color: ['Black', 'White', 'Navy', 'Grey', 'Olive'],
        size: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        material: 'Cotton-Polyester blend',
        features: ['Moisture-wicking', 'Durable', 'Comfortable fit', 'UV protection'],
        tags: ['men', 'tshirt', 'workout', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Men\'s Athletic Shorts',
        slug: 'dfc-mens-athletic-shorts',
        description: 'Lightweight athletic shorts with mesh lining. Great for running, training, or everyday wear.',
        shortDescription: 'Lightweight athletic shorts',
        category: mensCat._id,
        sku: 'DFC-MS-001',
        price: 799,
        discount: 10,
        discountPrice: 719,
        stock: 50,
        color: ['Black', 'Grey', 'Navy', 'Royal Blue'],
        size: ['S', 'M', 'L', 'XL', 'XXL'],
        material: 'Polyester with mesh lining',
        features: ['Mesh lining', 'Lightweight', 'Adjustable waist', 'Pockets'],
        tags: ['men', 'shorts', 'athletic', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Men\'s Joggers',
        slug: 'dfc-mens-joggers',
        description: 'Comfortable joggers perfect for workouts or casual wear. Features tapered fit and elastic cuffs.',
        shortDescription: 'Comfortable workout joggers',
        category: mensCat._id,
        sku: 'DFC-MJ-001',
        price: 999,
        discount: 18,
        discountPrice: 819,
        stock: 40,
        color: ['Black', 'Grey', 'Navy', 'Charcoal'],
        size: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        material: 'Cotton-Polyester blend',
        features: ['Tapered fit', 'Elastic cuffs', 'Pockets', 'Breathable'],
        tags: ['men', 'joggers', 'casual', 'dfc'],
        isFeatured: false,
        isActive: true
      },

      // Footwear
      {
        name: 'DFC Professional Running Shoes',
        slug: 'dfc-professional-running-shoes',
        description: 'High-performance running shoes with advanced cushioning. Designed for comfort and durability.',
        shortDescription: 'Professional running shoes',
        category: footwearCat._id,
        sku: 'DFC-RS-001',
        price: 3999,
        discount: 25,
        discountPrice: 2999,
        stock: 30,
        color: ['Black', 'White', 'Blue', 'Red'],
        size: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
        material: 'Mesh and Rubber',
        features: ['Cushioned insole', 'Non-slip sole', 'Lightweight', 'Breathable mesh'],
        tags: ['footwear', 'running', 'shoes', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Training Gym Shoes',
        slug: 'dfc-training-gym-shoes',
        description: 'Versatile gym shoes for weightlifting and cross-training. Enhanced ankle support and grip.',
        shortDescription: 'Versatile training gym shoes',
        category: footwearCat._id,
        sku: 'DFC-GS-001',
        price: 2999,
        discount: 20,
        discountPrice: 2399,
        stock: 35,
        color: ['Black', 'White', 'Grey'],
        size: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
        material: 'Synthetic leather and mesh',
        features: ['Ankle support', 'Stable base', 'Breathable', 'Durable sole'],
        tags: ['footwear', 'gym', 'training', 'dfc'],
        isFeatured: true,
        isActive: true
      },

      // Dumbbells & Weights
      {
        name: 'DFC Adjustable Dumbbell Set (10-50 lbs)',
        slug: 'dfc-adjustable-dumbbell-set',
        description: 'Complete adjustable dumbbell set with weights ranging from 10 to 50 lbs. Save space with this compact solution.',
        shortDescription: 'Adjustable dumbbell set 10-50 lbs',
        category: dumbbellsCat._id,
        sku: 'DFC-AD-001',
        price: 14999,
        discount: 15,
        discountPrice: 12749,
        stock: 15,
        weight: { value: 50, unit: 'lbs' },
        material: 'Cast iron and rubber',
        features: ['Adjustable weights', 'Space-saving', 'Durable construction', 'Includes stand'],
        tags: ['dumbbells', 'weights', 'home-gym', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Rubber Coated Dumbbell 20kg',
        slug: 'dfc-rubber-coated-dumbbell-20kg',
        description: 'Heavy-duty 20kg rubber coated dumbbell. Perfect for serious strength training and conditioning.',
        shortDescription: '20kg rubber coated dumbbell',
        category: dumbbellsCat._id,
        sku: 'DFC-RD-001',
        price: 1999,
        discount: 10,
        discountPrice: 1799,
        stock: 50,
        weight: { value: 20, unit: 'kg' },
        material: 'Cast iron with rubber coating',
        features: ['Rubber coating protects floors', 'Ergonomic grip', 'Durable', 'Perfect balance'],
        tags: ['dumbbells', 'weights', 'strength', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Weight Plate Set (50 kg)',
        slug: 'dfc-weight-plate-set',
        description: 'Complete 50kg weight plate set with color-coded plates. Ideal for barbell training.',
        shortDescription: '50kg weight plate set',
        category: dumbbellsCat._id,
        sku: 'DFC-WP-001',
        price: 9999,
        discount: 12,
        discountPrice: 8799,
        stock: 20,
        weight: { value: 50, unit: 'kg' },
        material: 'Cast iron',
        features: ['Color-coded', '2-inch center hole', 'Durable cast iron', 'Set includes bar'],
        tags: ['weights', 'plates', 'barbell', 'dfc'],
        isFeatured: true,
        isActive: true
      },

      // Gym Equipment
      {
        name: 'DFC Adjustable Weight Bench',
        slug: 'dfc-adjustable-weight-bench',
        description: 'Multi-position adjustable weight bench for maximum versatility. Supports up to 300 lbs.',
        shortDescription: 'Adjustable weight bench',
        category: gymCat._id,
        sku: 'DFC-AB-001',
        price: 8999,
        discount: 18,
        discountPrice: 7379,
        stock: 12,
        dimensions: { length: 150, width: 60, height: 80, unit: 'cm' },
        weight: { value: 30, unit: 'kg' },
        material: 'Steel frame with vinyl padding',
        features: ['Adjustable backrest', 'High weight capacity', 'Durable construction', 'Compact storage'],
        tags: ['equipment', 'bench', 'strength', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Treadmill Pro 3000',
        slug: 'dfc-treadmill-pro-3000',
        description: 'Premium treadmill with digital display, multiple preset programs, and adjustable speed up to 15 km/h.',
        shortDescription: 'Premium digital treadmill',
        category: gymCat._id,
        sku: 'DFC-TM-001',
        price: 34999,
        discount: 20,
        discountPrice: 27999,
        stock: 8,
        dimensions: { length: 180, width: 80, height: 140, unit: 'cm' },
        weight: { value: 100, unit: 'kg' },
        material: 'Steel frame',
        features: ['Digital display', 'Speed up to 15 km/h', 'Multiple programs', 'Built-in speakers'],
        tags: ['equipment', 'cardio', 'treadmill', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Stationary Cycle Pro',
        slug: 'dfc-stationary-cycle-pro',
        description: 'Professional stationary cycle with smooth pedaling and adjustable resistance.',
        shortDescription: 'Professional stationary cycle',
        category: gymCat._id,
        sku: 'DFC-SC-001',
        price: 12999,
        discount: 15,
        discountPrice: 11049,
        stock: 10,
        dimensions: { length: 120, width: 60, height: 100, unit: 'cm' },
        weight: { value: 50, unit: 'kg' },
        material: 'Steel frame',
        features: ['Smooth pedaling', 'Adjustable resistance', 'Digital console', 'Comfortable seat'],
        tags: ['equipment', 'cardio', 'cycle', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Crossover Machine',
        slug: 'dfc-crossover-machine',
        description: 'Multi-function crossover machine for full-body workouts. Professional grade equipment.',
        shortDescription: 'Multi-function crossover machine',
        category: gymCat._id,
        sku: 'DFC-CM-001',
        price: 19999,
        discount: 12,
        discountPrice: 17599,
        stock: 6,
        weight: { value: 150, unit: 'kg' },
        material: 'Heavy-duty steel',
        features: ['Multiple workout stations', 'Professional grade', 'Durable cables', 'Weight stack included'],
        tags: ['equipment', 'crossover', 'strength', 'dfc'],
        isFeatured: true,
        isActive: true
      },

      // Weighing Scales
      {
        name: 'DFC Digital Body Weighing Scale',
        slug: 'dfc-digital-body-weighing-scale',
        description: 'Accurate digital weighing scale with LCD display. Maximum capacity 180 kg.',
        shortDescription: 'Digital weighing scale',
        category: scalesCat._id,
        sku: 'DFC-BS-001',
        price: 999,
        discount: 5,
        discountPrice: 949,
        stock: 60,
        dimensions: { length: 30, width: 30, height: 2, unit: 'cm' },
        weight: { value: 1.5, unit: 'kg' },
        material: 'Glass and plastic',
        features: ['Accurate readings', 'Large LCD display', 'Auto-shutdown', 'Battery powered'],
        tags: ['scale', 'weighing', 'health', 'dfc'],
        isFeatured: false,
        isActive: true
      },
      {
        name: 'DFC Body Composition Analyzer Scale',
        slug: 'dfc-body-composition-analyzer',
        description: 'Advanced scale that measures weight, BMI, muscle percentage, and fat percentage.',
        shortDescription: 'Body composition analyzer',
        category: scalesCat._id,
        sku: 'DFC-BCA-001',
        price: 2999,
        discount: 15,
        discountPrice: 2549,
        stock: 25,
        dimensions: { length: 32, width: 32, height: 2.5, unit: 'cm' },
        weight: { value: 2, unit: 'kg' },
        material: 'Tempered glass',
        features: ['BMI measurement', 'Body fat percentage', 'Muscle percentage', 'Bluetooth connectivity'],
        tags: ['scale', 'analysis', 'health', 'tracking', 'dfc'],
        isFeatured: true,
        isActive: true
      },

      // Accessories
      {
        name: 'DFC Premium Yoga Mat',
        slug: 'dfc-premium-yoga-mat',
        description: 'Non-slip yoga mat perfect for yoga, pilates, or floor exercises. 6mm thickness for comfort.',
        shortDescription: 'Premium non-slip yoga mat',
        category: accessoriesCat._id,
        sku: 'DFC-YM-001',
        price: 1299,
        discount: 10,
        discountPrice: 1169,
        stock: 40,
        color: ['Purple', 'Blue', 'Black', 'Pink', 'Green'],
        dimensions: { length: 183, width: 61, height: 0.6, unit: 'cm' },
        material: 'TPE (Thermoplastic Elastomer)',
        features: ['Non-slip surface', '6mm thick', 'Lightweight', 'Easy to clean', 'Includes carrying strap'],
        tags: ['accessories', 'yoga', 'mat', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Resistance Bands Set',
        slug: 'dfc-resistance-bands-set',
        description: 'Complete set of 5 resistance bands with different resistance levels. Perfect for home workouts.',
        shortDescription: 'Set of 5 resistance bands',
        category: accessoriesCat._id,
        sku: 'DFC-RB-001',
        price: 799,
        discount: 12,
        discountPrice: 703,
        stock: 50,
        material: 'Natural latex',
        features: ['5 resistance levels', 'Heavy-duty', 'Portable', 'Includes carrying bag', 'Non-slip handles'],
        tags: ['accessories', 'resistance', 'portable', 'dfc'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'DFC Water Bottle 1L',
        slug: 'dfc-water-bottle-1l',
        description: 'Stainless steel water bottle with insulation to keep water cold for 24 hours.',
        shortDescription: '1L insulated water bottle',
        category: accessoriesCat._id,
        sku: 'DFC-BO-001',
        price: 699,
        discount: 8,
        discountPrice: 643,
        stock: 100,
        color: ['Blue', 'Black', 'Red', 'Silver'],
        material: 'Stainless steel',
        features: ['Double-wall insulation', 'Keeps cold for 24hrs', 'Lightweight', 'Leakproof cap', 'Easy to carry'],
        tags: ['accessories', 'bottle', 'hydration', 'dfc'],
        isFeatured: false,
        isActive: true
      },
      {
        name: 'DFC Sports Gym Bag',
        slug: 'dfc-sports-gym-bag',
        description: 'Spacious gym bag with multiple compartments. Perfect for carrying gym essentials.',
        shortDescription: 'Multi-compartment gym bag',
        category: accessoriesCat._id,
        sku: 'DFC-GB-001',
        price: 1499,
        discount: 10,
        discountPrice: 1349,
        stock: 35,
        color: ['Black', 'Navy', 'Grey'],
        material: 'Polyester with reinforced handles',
        features: ['Multiple compartments', 'Shoe compartment', 'Water-resistant', 'Adjustable straps', 'Lightweight'],
        tags: ['accessories', 'bag', 'gym', 'dfc'],
        isFeatured: false,
        isActive: true
      },
      {
        name: 'DFC Wrist Wraps Support Pair',
        slug: 'dfc-wrist-wraps-support',
        description: 'Heavy-duty wrist wraps for weightlifting and strength training. Provides maximum wrist support.',
        shortDescription: 'Wrist support wraps pair',
        category: accessoriesCat._id,
        sku: 'DFC-WW-001',
        price: 599,
        discount: 0,
        stock: 45,
        color: ['Black', 'White', 'Red'],
        material: 'Cotton and Neoprene',
        features: ['Heavy-duty', 'Wrist support', 'Adjustable straps', 'Breathable', 'Professional grade'],
        tags: ['accessories', 'support', 'strength', 'dfc'],
        isFeatured: false,
        isActive: true
      }
    ];

    const productsWithImages = products.map((product) => {
      // Add image for resistance bands
      if (product.slug === 'dfc-resistance-bands-set') {
        return {
          ...product,
          image: '/products/resistance-bands.jpg',
          images: ['/products/resistance-bands.jpg'],
          colorImageMap: {}
        };
      }
      // Add image for wrist wraps
      if (product.slug === 'dfc-wrist-wraps-support') {
        return {
          ...product,
          image: '/products/wrist-wrap.png',
          images: ['/products/wrist-wrap.png'],
          colorImageMap: {}
        };
      }
      // Add image for water bottle
      if (product.slug === 'dfc-water-bottle-1l') {
        return {
          ...product,
          image: '/products/water-bottle.jpg',
          images: ['/products/water-bottle.jpg'],
          colorImageMap: {}
        };
      }
      // Add image for sports gym bag
      if (product.slug === 'dfc-sports-gym-bag') {
        return {
          ...product,
          image: '/products/bag.png',
          images: ['/products/bag.png'],
          colorImageMap: {}
        };
      }
      // Add image for premium yoga mat
      if (product.slug === 'dfc-premium-yoga-mat') {
        return {
          ...product,
          image: '/products/mat.png',
          images: ['/products/mat.png'],
          colorImageMap: {}
        };
      }
      // Add image for digital body weighing scale
      if (product.slug === 'dfc-digital-body-weighing-scale') {
        return {
          ...product,
          image: '/products/ws.png',
          images: ['/products/ws.png'],
          colorImageMap: {}
        };
      }
      // Add image for body composition analyzer scale
      if (product.slug === 'dfc-body-composition-analyzer') {
        return {
          ...product,
          image: '/products/ws.png',
          images: ['/products/ws.png'],
          colorImageMap: {}
        };
      }
      // Add image for crossover machine
      if (product.slug === 'dfc-crossover-machine') {
        return {
          ...product,
          image: '/products/cm.png',
          images: ['/products/cm.png'],
          colorImageMap: {}
        };
      }
      // All other products remain with empty images
      return {
        ...product,
        image: '',
        images: [],
        colorImageMap: {}
      };
    });

    const createdProducts = await Product.create(productsWithImages);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Store seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
