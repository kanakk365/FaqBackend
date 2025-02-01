# FAQ Management System

## Overview
A RESTful API service for managing FAQs with multi-language support and caching.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Redis
- OpenAI API (for translations)


## Installation

```bash
# Install dependencies
npm install

# Start Redis server (Windows)
redis-server

# Start application
npm start

# Run tests
npm test

Environment Variables
Create .env file:

MONGO_URI=your_mongodb_uri
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key
MONGO_URI_TEST=mongodb://localhost:27017/faq-test