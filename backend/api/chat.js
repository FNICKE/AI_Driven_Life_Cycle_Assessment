const express = require('express');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Middleware for CORS
router.use(cors());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// LCA-specific system prompt for mining and metallurgy
const LCA_SYSTEM_PROMPT = `You are an expert LCA (Life Cycle Assessment) assistant specialized in mining and metallurgy. You provide detailed analysis on:

1. Material Extraction & Mining Operations
2. Energy Consumption & Efficiency
3. Carbon & Emission Tracking
4. Waste & Byproduct Management
5. Recycling & Reuse Pathways
6. Circular Economy Strategies
7. Sustainability Performance Metrics
8. Environmental Impact Hotspots
9. Optimization & Eco-Design Recommendations

Always provide practical, data-driven responses with specific numbers, recommendations, and actionable insights. Focus on environmental impact, cost analysis, and sustainability improvements for mining and metallurgical processes.`;

// Chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        reply: 'I apologize, but the AI service is currently unavailable. Please check the API configuration.' 
      });
    }

    // Prepare the request to OpenAI
    const openaiRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: LCA_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    // Make request to OpenAI
    const openaiResponse = await axios.post(OPENAI_API_URL, openaiRequest, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const aiReply = openaiResponse.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Log the interaction (optional - for monitoring)
    console.log(`User ${req.user.id}: ${message}`);
    console.log(`AI Reply: ${aiReply.substring(0, 100)}...`);

    res.json({
      reply: aiReply,
      timestamp: new Date().toISOString(),
      tokens_used: openaiResponse.data.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);

    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        error: 'Request timeout',
        reply: 'The request took too long to process. Please try again.'
      });
    }

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: 'Invalid API key',
        reply: 'There is an issue with the API configuration. Please contact support.'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        reply: 'Too many requests. Please wait a moment before trying again.'
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        error: 'Invalid request',
        reply: 'There was an issue with your request. Please try rephrasing your question.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      reply: 'I apologize, but I encountered an error processing your request. Please try again later.'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LCA Chat API',
    timestamp: new Date().toISOString(),
    openai_configured: !!process.env.OPENAI_API_KEY
  });
});

// Get chat history (if you want to implement chat history storage)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // This would typically fetch from a database
    // For now, return empty array
    res.json({
      messages: [],
      message: 'Chat history feature not yet implemented'
    });
  } catch (error) {
    console.error('History API Error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch chat history'
    });
  }
});

// Clear chat session (optional)
router.delete('/session', authenticateToken, async (req, res) => {
  try {
    // This would clear user's chat session from database
    res.json({
      message: 'Chat session cleared successfully'
    });
  } catch (error) {
    console.error('Clear session error:', error.message);
    res.status(500).json({
      error: 'Failed to clear chat session'
    });
  }
});

module.exports = router;

// Example usage in your main app.js:
/*
const express = require('express');
const chatRoutes = require('./api/chat');

const app = express();
app.use(express.json());
app.use('/api', chatRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
*/