// Chat functionality for Daswos Robot Animation
// Handles AI chat, product search, and Supabase integration

class DaswosChat {
  constructor() {
    this.supabase = null;
    this.chatMessages = [];
    this.isProcessing = false;
    this.currentThinkingMessage = null;

    this.init();
  }

  async init() {
    // Initialize Supabase client
    if (!AI_CONFIG.mockMode && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
      try {
        this.supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase client initialized');
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
      }
    }

    // Set up event listeners
    this.setupEventListeners();

    // Initialize chat interface
    this.setupChatInterface();
  }

  setupEventListeners() {
    const headerInput = document.getElementById('headerQueryInput');
    const headerSendBtn = document.getElementById('headerSendBtn');

    // Send message on button click
    headerSendBtn.addEventListener('click', () => this.sendMessage());

    // Send message on Enter key press
    headerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Enable/disable send button based on input
    headerInput.addEventListener('input', () => {
      const hasText = headerInput.value.trim().length > 0;
      headerSendBtn.disabled = !hasText || this.isProcessing;
    });
  }

  setupChatInterface() {
    const chatMessages = document.getElementById('chatMessages');

    // Scroll to bottom of chat
    this.scrollToBottom();
  }

  async sendMessage() {
    const headerInput = document.getElementById('headerQueryInput');
    const message = headerInput.value.trim();

    if (!message || this.isProcessing) return;

    // Clear input and disable controls
    headerInput.value = '';
    this.setProcessing(true);

    // Show response bubble and clear previous messages
    this.showResponseBubble();
    this.clearMessages();

    // Trigger robot thinking animation
    if (typeof setRobotState === 'function') {
      setRobotState('thinking');
    }

    // Show thinking message
    this.showThinkingMessage();

    try {
      // Process the message and get response
      const response = await this.processMessage(message);

      // Remove thinking message and switch to responding animation
      this.removeThinkingMessage();

      if (typeof setRobotState === 'function') {
        setRobotState('responding');
      }

      // Add robot response
      this.addMessage(response.text, 'robot');

      // Add product recommendations if any
      if (response.products && response.products.length > 0) {
        this.addProductRecommendations(response.products);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      this.removeThinkingMessage();
      this.addMessage(this.getRandomResponse('error'), 'robot');
    } finally {
      this.setProcessing(false);

      // Return robot to idle state
      setTimeout(() => {
        if (typeof setRobotState === 'function') {
          setRobotState('idle');
        }
      }, 2000);
    }
  }

  async processMessage(message) {
    // Simulate processing delay
    await this.delay(CHAT_CONFIG.typingDelay);

    if (AI_CONFIG.mockMode) {
      return this.processMockMessage(message);
    } else {
      return this.processAIMessage(message);
    }
  }

  processMockMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Search for products based on keywords
    const products = this.searchProducts(lowerMessage);

    let responseText;
    if (products.length > 0) {
      responseText = `I found ${products.length} product${products.length > 1 ? 's' : ''} that might interest you:`;
    } else {
      responseText = this.getRandomResponse('noResults');
    }

    return {
      text: responseText,
      products: products.slice(0, CHAT_CONFIG.maxProductResults)
    };
  }

  async processAIMessage(message) {
    // This would integrate with OpenAI or another AI service
    // For now, fall back to mock processing
    return this.processMockMessage(message);
  }

  searchProducts(query) {
    const products = SAMPLE_PRODUCTS.filter(product => {
      const searchText = `${product.name} ${product.description} ${product.category} ${product.tags.join(' ')}`.toLowerCase();

      // Split query into words and check if any match
      const queryWords = query.split(' ').filter(word => word.length > 2);
      return queryWords.some(word => searchText.includes(word));
    });

    // Sort by relevance (simple scoring based on name matches)
    return products.sort((a, b) => {
      const aScore = a.name.toLowerCase().includes(query) ? 1 : 0;
      const bScore = b.name.toLowerCase().includes(query) ? 1 : 0;
      return bScore - aScore;
    });
  }

  addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    chatMessages.appendChild(messageDiv);
    this.scrollToBottom();

    // Store message in history
    this.chatMessages.push({ text, type, timestamp: Date.now() });

    // Limit message history
    if (this.chatMessages.length > CHAT_CONFIG.maxMessages) {
      this.chatMessages.shift();
      // Remove oldest message from DOM
      const firstMessage = chatMessages.querySelector('.message');
      if (firstMessage) firstMessage.remove();
    }
  }

  addProductRecommendations(products) {
    const chatMessages = document.getElementById('chatMessages');

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'message robot';
      productDiv.innerHTML = `
        <div class="product-card">
          <div class="product-name">${product.name}</div>
          <div class="product-price">$${product.price}</div>
          <div class="product-description">${product.description}</div>
        </div>
      `;

      chatMessages.appendChild(productDiv);
    });

    this.scrollToBottom();
  }

  showThinkingMessage() {
    const thinkingText = this.getRandomResponse('thinking');
    const chatMessages = document.getElementById('chatMessages');

    this.currentThinkingMessage = document.createElement('div');
    this.currentThinkingMessage.className = 'message thinking';
    this.currentThinkingMessage.textContent = thinkingText;

    chatMessages.appendChild(this.currentThinkingMessage);
    this.scrollToBottom();
  }

  removeThinkingMessage() {
    if (this.currentThinkingMessage) {
      this.currentThinkingMessage.remove();
      this.currentThinkingMessage = null;
    }
  }

  setProcessing(processing) {
    this.isProcessing = processing;
    const headerInput = document.getElementById('headerQueryInput');
    const headerSendBtn = document.getElementById('headerSendBtn');

    headerInput.disabled = processing;
    headerSendBtn.disabled = processing || headerInput.value.trim().length === 0;
  }

  showResponseBubble() {
    const responseBubble = document.getElementById('responseBubble');
    responseBubble.style.display = 'flex';
  }

  hideResponseBubble() {
    const responseBubble = document.getElementById('responseBubble');
    responseBubble.style.display = 'none';
  }

  clearMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
  }

  scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  getRandomResponse(type) {
    const responses = CHAT_CONFIG.responses[type] || ['Hello!'];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Daswos Chat...');
  window.daswosChat = new DaswosChat();
  console.log('Daswos Chat initialized successfully!');
});
