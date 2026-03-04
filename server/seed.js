const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./models/Plan');

dotenv.config();

const plans = [
  {
    name: 'Gym Workout Plan',
    slug: 'gym-workout',
    description: 'Transform your body with our comprehensive gym workout plan designed by certified fitness professionals. Get personalized exercise routines, progressive overload schedules, and form guidance tailored to your fitness level and goals. Our expert-curated program adapts as you grow stronger, ensuring continuous progress whether you are a beginner or advanced lifter.',
    shortDescription: 'Personalized gym routines with progressive overload tracking and expert guidance.',
    category: 'gym',
    icon: '🏋️',
    pricing: {
      monthly: 999,
      quarterly: 2499,
      halfYearly: 4499,
      yearly: 7999
    },
    features: [
      'Personalized workout split based on your goals',
      'Progressive overload tracking',
      'Exercise video demonstrations',
      'Weekly plan adjustments',
      'WhatsApp support from certified trainer',
      'Warm-up and cool-down routines',
      'Rest day activity suggestions',
      'Monthly progress assessment'
    ],
    highlights: [
      { title: 'Custom Splits', description: 'Push-Pull-Legs, Upper-Lower, or Full Body based on your schedule' },
      { title: 'Progressive Plans', description: 'Automatically adjusted intensity as you progress' },
      { title: 'Video Guides', description: 'Detailed form guides for every exercise' }
    ],
    personalTrainerAvailable: true,
    personalTrainerPrice: 2000,
    isPopular: true,
    color: '#14b8a6'
  },
  {
    name: 'Yoga & Mindfulness Plan',
    slug: 'yoga-mindfulness',
    description: 'Achieve inner peace and physical flexibility with our holistic yoga plan. From Hatha to Vinyasa, our certified yoga instructors design sequences perfect for your experience level. Includes meditation practices, breathing exercises (pranayama), and mindfulness techniques to create a complete mind-body wellness experience.',
    shortDescription: 'Holistic yoga sessions with meditation and breathing exercises for mind-body wellness.',
    category: 'yoga',
    icon: '🧘',
    pricing: {
      monthly: 799,
      quarterly: 1999,
      halfYearly: 3499,
      yearly: 5999
    },
    features: [
      'Personalized yoga sequences',
      'Guided meditation sessions',
      'Pranayama breathing exercises',
      'Flexibility progression tracking',
      'WhatsApp support from yoga instructor',
      'Morning and evening routines',
      'Stress management techniques',
      'Weekly live session access'
    ],
    highlights: [
      { title: 'All Levels', description: 'From beginner sun salutations to advanced inversions' },
      { title: 'Meditation', description: 'Guided mindfulness and meditation practices' },
      { title: 'Flexibility', description: 'Progressive stretching routines for lasting flexibility' }
    ],
    personalTrainerAvailable: true,
    personalTrainerPrice: 1500,
    isPopular: false,
    color: '#8b5cf6'
  },
  {
    name: 'Nutrition & Diet Plan',
    slug: 'nutrition-diet',
    description: 'Fuel your body right with our scientifically crafted nutrition plans. Our certified dietitians create personalized meal plans considering your dietary preferences, allergies, cultural foods, and fitness goals. Whether you want to lose fat, build muscle, or maintain a healthy lifestyle, we have the perfect nutrition strategy for you.',
    shortDescription: 'Scientifically crafted meal plans personalized to your goals and dietary preferences.',
    category: 'diet',
    icon: '🥗',
    pricing: {
      monthly: 599,
      quarterly: 1499,
      halfYearly: 2499,
      yearly: 3999
    },
    features: [
      'Customized meal plans (veg/non-veg/vegan)',
      'Macro and calorie tracking guidance',
      'Grocery shopping lists',
      'Simple recipe suggestions',
      'WhatsApp support from nutritionist',
      'Supplement recommendations',
      'Cheat meal strategies',
      'Bi-weekly plan updates'
    ],
    highlights: [
      { title: 'Custom Meals', description: 'Plans that respect your food preferences and allergies' },
      { title: 'Macro Balanced', description: 'Scientifically calculated macros for your goals' },
      { title: 'Easy Recipes', description: 'Simple, delicious recipes with local ingredients' }
    ],
    personalTrainerAvailable: true,
    personalTrainerPrice: 1500,
    isPopular: false,
    color: '#f97316'
  },
  {
    name: 'Gym + Diet Combo',
    slug: 'gym-diet-combo',
    description: 'The perfect combination of workout and nutrition! Get our comprehensive gym workout plan paired with a personalized diet plan for maximum results. This combo ensures your training and nutrition work in perfect synergy to help you reach your fitness goals faster and more efficiently.',
    shortDescription: 'Complete gym workouts paired with personalized diet plans for maximum results.',
    category: 'combo',
    icon: '💪',
    pricing: {
      monthly: 1399,
      quarterly: 3499,
      halfYearly: 5999,
      yearly: 9999
    },
    features: [
      'Everything in Gym Workout Plan',
      'Everything in Nutrition & Diet Plan',
      'Synchronized workout-nutrition timing',
      'Pre and post-workout nutrition guide',
      'Dedicated WhatsApp support group',
      'Weekly progress review calls',
      'Body composition analysis guidance',
      'Priority support response'
    ],
    highlights: [
      { title: 'Best Value', description: 'Save up to 15% compared to buying separately' },
      { title: 'Synced Plans', description: 'Workout and diet plans designed to work together' },
      { title: 'Faster Results', description: 'Achieve your goals up to 2x faster with the combo approach' }
    ],
    personalTrainerAvailable: true,
    personalTrainerPrice: 2000,
    isPopular: true,
    color: '#06b6d4'
  },
  {
    name: 'Complete Transformation Package',
    slug: 'complete-transformation',
    description: 'Our ultimate all-in-one package combining gym workouts, yoga sessions, and nutrition planning for a complete body and mind transformation. This premium package is designed for those who want the best holistic approach to health and fitness, with dedicated support across all aspects of your wellness journey.',
    shortDescription: 'Ultimate all-in-one package: gym, yoga & diet for complete body-mind transformation.',
    category: 'complete',
    icon: '⭐',
    pricing: {
      monthly: 1999,
      quarterly: 4999,
      halfYearly: 8999,
      yearly: 14999
    },
    features: [
      'Everything in Gym Workout Plan',
      'Everything in Yoga & Mindfulness Plan',
      'Everything in Nutrition & Diet Plan',
      'Dedicated personal wellness coordinator',
      'Priority WhatsApp support (24/7)',
      'Monthly video consultation',
      'Comprehensive body assessment',
      'Lifestyle and sleep optimization',
      'Stress management program',
      'Exclusive community access'
    ],
    highlights: [
      { title: 'All-Inclusive', description: 'Every service we offer in one comprehensive package' },
      { title: 'VIP Support', description: '24/7 priority access to our wellness team' },
      { title: 'Holistic Health', description: 'Body, mind, and nutrition - the complete transformation' }
    ],
    personalTrainerAvailable: true,
    personalTrainerPrice: 2500,
    isPopular: true,
    color: '#ec4899'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await Plan.deleteMany({});
    console.log('Cleared existing plans...');

    await Plan.insertMany(plans);
    console.log(`Seeded ${plans.length} plans successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
