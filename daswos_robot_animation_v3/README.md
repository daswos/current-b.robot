# Daswos Robot Animation with AI Chat

An interactive robot animation with AI-powered chat functionality that can search and recommend products from a Supabase database.

## Features

🤖 **Interactive Robot Animation**
- Multiple animation states (idle, talk, dance, roll, search, thinking, responding)
- Mouse interaction and touch support
- Scalable robot size controls
- Smooth transitions between different views

💬 **AI Chat Interface**
- Natural language product search
- Real-time chat with animated responses
- Product recommendations with details
- Thinking and responding animations

🗄️ **Database Integration**
- Supabase database support
- Product search and filtering
- Mock data for demo purposes

## Quick Start

1. **Run the Animation**
   ```bash
   cd daswos_robot_animation_v3
   python -m http.server 8000
   ```
   
2. **Open in Browser**
   Navigate to `http://localhost:8000`

3. **Try the Chat**
   - Type product queries like "headphones", "fitness watch", or "office chair"
   - Watch the robot animate while thinking and responding
   - See product recommendations appear in the chat

## Supabase Setup (Optional)

To connect to your own Supabase database:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Create Products Table
Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO products (name, price, description, category, tags) VALUES
('Wireless Bluetooth Headphones', 79.99, 'High-quality wireless headphones with noise cancellation and 30-hour battery life.', 'electronics', ARRAY['audio', 'wireless', 'bluetooth', 'headphones', 'music']),
('Smart Fitness Watch', 199.99, 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.', 'wearables', ARRAY['fitness', 'watch', 'smart', 'health', 'tracking', 'gps']),
('Portable Phone Charger', 29.99, 'Compact 10,000mAh power bank with fast charging and multiple USB ports.', 'accessories', ARRAY['charger', 'portable', 'battery', 'phone', 'power bank', 'usb']);
```

### 3. Configure the App
1. Open `config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'YOUR_SUPABASE_URL', // Your project URL
     anonKey: 'YOUR_SUPABASE_ANON_KEY', // Your anon key
   };
   ```
3. Set `mockMode: false` in `AI_CONFIG` to use real database

## AI Integration (Optional)

To add real AI responses:

1. **OpenAI Setup**
   - Get an API key from [OpenAI](https://openai.com)
   - Add it to `config.js`:
     ```javascript
     const AI_CONFIG = {
       mockMode: false,
       openai: {
         apiKey: 'YOUR_OPENAI_API_KEY',
         model: 'gpt-3.5-turbo'
       }
     };
     ```

2. **Implement AI Processing**
   - Modify `processAIMessage()` in `chat.js`
   - Add OpenAI API calls for natural language processing

## File Structure

```
daswos_robot_animation_v3/
├── index.html          # Main HTML file with UI
├── robot.js           # Robot animation logic
├── chat.js            # Chat functionality and AI integration
├── config.js          # Configuration and sample data
├── README.md          # This file
└── images/            # Robot view images
    ├── robot_front_view.png
    ├── robot_side_view.png
    ├── robot_three_quarter_view.png
    ├── robot_back_view.png
    └── robot_top_view.png
```

## Controls

**Animation Controls:**
- **Idle**: Default calm state
- **Talk**: Speaking animation
- **Dance**: Rhythmic dancing
- **Roll**: Move to random location
- **Search**: Looking around animation
- **Center**: Return robot to center

**Chat Interface:**
- Type messages in the chat box
- Press Enter or click Send
- Watch robot animations during thinking/responding

**Robot Interaction:**
- Click anywhere to make robot roll there
- Hold and drag to spin the robot
- Use scale controls to resize robot

## Customization

**Adding New Products:**
- Modify `SAMPLE_PRODUCTS` in `config.js`
- Or add to your Supabase database

**Robot Animations:**
- Edit animation states in `robot.js`
- Modify timing and effects in `updateAnimation()`

**Chat Responses:**
- Customize responses in `CHAT_CONFIG.responses`
- Modify search logic in `searchProducts()`

## Dependencies

- **p5.js**: Animation framework
- **Supabase**: Database (optional)
- **Modern Browser**: ES6+ support required

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers supported

## License

MIT License - Feel free to use and modify!
