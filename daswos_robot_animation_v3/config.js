// Configuration file for Daswos Robot Animation
// Contains Supabase configuration and API settings

// Supabase Configuration
// Note: Replace these with your actual Supabase project credentials
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL', // Replace with your Supabase project URL
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
  
  // Database table names
  tables: {
    products: 'products'
  }
};

// AI Configuration
const AI_CONFIG = {
  // For demo purposes, we'll use a mock AI response
  // In production, you would integrate with OpenAI, Claude, or another AI service
  mockMode: true,
  
  // If using OpenAI (set mockMode to false and add your API key)
  openai: {
    apiKey: 'YOUR_OPENAI_API_KEY',
    model: 'gpt-3.5-turbo',
    maxTokens: 150
  }
};

// Chat Configuration
const CHAT_CONFIG = {
  maxMessages: 50, // Maximum number of messages to keep in chat history
  typingDelay: 1000, // Delay before robot responds (ms)
  maxProductResults: 5, // Maximum number of products to show in response
  
  // Default responses for various scenarios
  responses: {
    greeting: [
      "Hello! I'm here to help you find products. What are you looking for?",
      "Hi there! Tell me what you need and I'll search our products for you!",
      "Welcome! I can help you discover amazing products. What interests you?"
    ],
    noResults: [
      "I couldn't find any products matching that description. Try being more specific!",
      "Hmm, no matches found. Could you describe what you're looking for differently?",
      "Sorry, I don't see any products like that. What else can I help you find?"
    ],
    error: [
      "Oops! Something went wrong. Please try again.",
      "I'm having trouble right now. Could you try that again?",
      "Technical difficulties! Give me a moment and try again."
    ],
    thinking: [
      "Let me search for that...",
      "Searching our products...",
      "Looking for the best matches...",
      "Checking our inventory..."
    ]
  }
};

// Sample product data for demo purposes
// In production, this would come from your Supabase database
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "electronics",
    tags: ["audio", "wireless", "bluetooth", "headphones", "music"]
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.",
    category: "wearables",
    tags: ["fitness", "watch", "smart", "health", "tracking", "gps"]
  },
  {
    id: 3,
    name: "Portable Phone Charger",
    price: 29.99,
    description: "Compact 10,000mAh power bank with fast charging and multiple USB ports.",
    category: "accessories",
    tags: ["charger", "portable", "battery", "phone", "power bank", "usb"]
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 299.99,
    description: "Comfortable office chair with lumbar support, adjustable height, and breathable mesh.",
    category: "furniture",
    tags: ["chair", "office", "ergonomic", "furniture", "comfort", "work"]
  },
  {
    id: 5,
    name: "LED Desk Lamp",
    price: 45.99,
    description: "Adjustable LED desk lamp with multiple brightness levels and USB charging port.",
    category: "lighting",
    tags: ["lamp", "led", "desk", "lighting", "adjustable", "usb"]
  },
  {
    id: 6,
    name: "Wireless Gaming Mouse",
    price: 89.99,
    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
    category: "gaming",
    tags: ["mouse", "gaming", "wireless", "rgb", "precision", "programmable"]
  },
  {
    id: 7,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    description: "Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    category: "lifestyle",
    tags: ["water bottle", "insulated", "stainless steel", "drinks", "cold", "hot"]
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 59.99,
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
    category: "electronics",
    tags: ["speaker", "bluetooth", "portable", "waterproof", "audio", "music"]
  },
  {
    id: 9,
    name: "Laptop Stand",
    price: 39.99,
    description: "Adjustable aluminum laptop stand for better ergonomics and cooling.",
    category: "accessories",
    tags: ["laptop", "stand", "aluminum", "ergonomic", "cooling", "adjustable"]
  },
  {
    id: 10,
    name: "Plant-Based Protein Powder",
    price: 34.99,
    description: "Organic plant-based protein powder with 25g protein per serving and natural flavors.",
    category: "health",
    tags: ["protein", "plant-based", "organic", "health", "fitness", "nutrition"]
  }
];

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_CONFIG,
    AI_CONFIG,
    CHAT_CONFIG,
    SAMPLE_PRODUCTS
  };
}
