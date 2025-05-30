-- Supabase Database Setup for Daswos Robot Animation
-- Run this SQL in your Supabase SQL editor to create the products table and sample data

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  image_url VARCHAR(500),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create an index on tags for faster searching
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create an index on name for text search
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Insert sample product data
INSERT INTO products (name, price, description, category, tags, image_url) VALUES
('Wireless Bluetooth Headphones', 79.99, 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.', 'electronics', ARRAY['audio', 'wireless', 'bluetooth', 'headphones', 'music', 'noise cancellation'], 'https://example.com/headphones.jpg'),

('Smart Fitness Watch', 199.99, 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration. Track your workouts and health metrics.', 'wearables', ARRAY['fitness', 'watch', 'smart', 'health', 'tracking', 'gps', 'heart rate'], 'https://example.com/fitness-watch.jpg'),

('Portable Phone Charger', 29.99, 'Compact 10,000mAh power bank with fast charging and multiple USB ports. Never run out of battery again.', 'accessories', ARRAY['charger', 'portable', 'battery', 'phone', 'power bank', 'usb', 'fast charging'], 'https://example.com/power-bank.jpg'),

('Ergonomic Office Chair', 299.99, 'Comfortable office chair with lumbar support, adjustable height, and breathable mesh. Perfect for long work sessions.', 'furniture', ARRAY['chair', 'office', 'ergonomic', 'furniture', 'comfort', 'work', 'lumbar support'], 'https://example.com/office-chair.jpg'),

('LED Desk Lamp', 45.99, 'Adjustable LED desk lamp with multiple brightness levels and USB charging port. Eye-friendly lighting for work and study.', 'lighting', ARRAY['lamp', 'led', 'desk', 'lighting', 'adjustable', 'usb', 'brightness'], 'https://example.com/desk-lamp.jpg'),

('Wireless Gaming Mouse', 89.99, 'High-precision gaming mouse with customizable RGB lighting and programmable buttons. Enhance your gaming experience.', 'gaming', ARRAY['mouse', 'gaming', 'wireless', 'rgb', 'precision', 'programmable', 'buttons'], 'https://example.com/gaming-mouse.jpg'),

('Stainless Steel Water Bottle', 24.99, 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Eco-friendly and durable.', 'lifestyle', ARRAY['water bottle', 'insulated', 'stainless steel', 'drinks', 'cold', 'hot', 'eco-friendly'], 'https://example.com/water-bottle.jpg'),

('Bluetooth Speaker', 59.99, 'Portable Bluetooth speaker with 360-degree sound and waterproof design. Perfect for outdoor adventures.', 'electronics', ARRAY['speaker', 'bluetooth', 'portable', 'waterproof', 'audio', 'music', '360-degree'], 'https://example.com/bluetooth-speaker.jpg'),

('Laptop Stand', 39.99, 'Adjustable aluminum laptop stand for better ergonomics and cooling. Reduce neck strain and improve productivity.', 'accessories', ARRAY['laptop', 'stand', 'aluminum', 'ergonomic', 'cooling', 'adjustable', 'productivity'], 'https://example.com/laptop-stand.jpg'),

('Plant-Based Protein Powder', 34.99, 'Organic plant-based protein powder with 25g protein per serving and natural flavors. Fuel your fitness goals.', 'health', ARRAY['protein', 'plant-based', 'organic', 'health', 'fitness', 'nutrition', 'natural'], 'https://example.com/protein-powder.jpg'),

('Mechanical Keyboard', 129.99, 'RGB mechanical keyboard with tactile switches and customizable backlighting. Perfect for gaming and typing.', 'gaming', ARRAY['keyboard', 'mechanical', 'rgb', 'gaming', 'tactile', 'switches', 'backlighting'], 'https://example.com/mechanical-keyboard.jpg'),

('Wireless Earbuds', 149.99, 'True wireless earbuds with active noise cancellation and 8-hour battery life. Premium sound quality.', 'electronics', ARRAY['earbuds', 'wireless', 'noise cancellation', 'audio', 'music', 'premium', 'battery'], 'https://example.com/wireless-earbuds.jpg'),

('Smart Home Hub', 99.99, 'Central hub for controlling all your smart home devices. Voice control and app integration included.', 'smart home', ARRAY['smart home', 'hub', 'voice control', 'automation', 'app', 'devices'], 'https://example.com/smart-hub.jpg'),

('Yoga Mat', 29.99, 'Non-slip yoga mat with extra cushioning and eco-friendly materials. Perfect for yoga and exercise.', 'fitness', ARRAY['yoga', 'mat', 'non-slip', 'exercise', 'fitness', 'eco-friendly', 'cushioning'], 'https://example.com/yoga-mat.jpg'),

('Coffee Maker', 79.99, 'Programmable coffee maker with thermal carafe and auto-brew feature. Start your day with perfect coffee.', 'kitchen', ARRAY['coffee', 'maker', 'programmable', 'thermal', 'auto-brew', 'kitchen', 'morning'], 'https://example.com/coffee-maker.jpg');

-- Create a function to search products by text
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE(
  id INTEGER,
  name VARCHAR(255),
  price DECIMAL(10,2),
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  image_url VARCHAR(500),
  relevance_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.price,
    p.description,
    p.category,
    p.tags,
    p.image_url,
    (
      CASE WHEN LOWER(p.name) LIKE LOWER('%' || search_term || '%') THEN 3 ELSE 0 END +
      CASE WHEN LOWER(p.description) LIKE LOWER('%' || search_term || '%') THEN 2 ELSE 0 END +
      CASE WHEN LOWER(p.category) LIKE LOWER('%' || search_term || '%') THEN 2 ELSE 0 END +
      CASE WHEN EXISTS(SELECT 1 FROM unnest(p.tags) AS tag WHERE LOWER(tag) LIKE LOWER('%' || search_term || '%')) THEN 1 ELSE 0 END
    ) AS relevance_score
  FROM products p
  WHERE 
    p.in_stock = true AND
    (
      LOWER(p.name) LIKE LOWER('%' || search_term || '%') OR
      LOWER(p.description) LIKE LOWER('%' || search_term || '%') OR
      LOWER(p.category) LIKE LOWER('%' || search_term || '%') OR
      EXISTS(SELECT 1 FROM unnest(p.tags) AS tag WHERE LOWER(tag) LIKE LOWER('%' || search_term || '%'))
    )
  ORDER BY relevance_score DESC, p.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (optional, for production)
-- CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Grant permissions (adjust as needed for your use case)
-- GRANT SELECT ON products TO anon;
-- GRANT SELECT ON products TO authenticated;
