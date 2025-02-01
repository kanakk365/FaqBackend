# FAQ Management System


A comprehensive system for managing FAQs with multi-language support, real-time caching, and AI-powered translations.

# Demo 


## Features ✨
- Multi-language Support (Auto-translation via OpenAI)
- Real-time Caching with Redis
- CRUD Operations for FAQs
- Pagination & Search
- Responsive Frontend
- API Documentation
- Unit & Integration Tests

---

# Frontend


## Installation


## Install dependencies
```bash
npm install
```

## Start development server
```bash
npm run dev
```

## Build for production
```build
npm run build
```


## Backend 🚀

### Tech Stack
| Component        | Technology                |
|------------------|---------------------------|
| Runtime          | Node.js 18+               |
| Framework        | Express.js                |
| Database         | MongoDB Atlas             |
| Cache            | Redis                     |
| Translation      | OpenAI GPT                |
| Testing          | Jest + SuperTest          |

## Installation

# Clone repository
git clone https://github.com/kanakk365/FaqBackend.git

cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env file with your credentials

```bash
MONGO_URI=your_mongodb_uri
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key
MONGO_URI_TEST=mongodb://localhost:27017/faq-test
```

# Start services
redis-server --service-start  
brew services start mongodb-community  
npm run dev
## Environment Variables
```bash
MONGO_URI=your_mongodb_uri
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key
MONGO_URI_TEST=mongodb://localhost:27017/faq-test
```

## Api Endpoint
Faq Routes:
- GET /api/v1/faqs - Get all FAQs
  - Query params: lang (default: 'en')
- POST /api/v1/faqs - Create new FAQ
- PUT /api/v1/faqs/:id - Update FAQ
- DELETE /api/v1/faqs/:id - Delete FAQ

Example Request: 
```bash
curl -X GET "http://localhost:5000/api/v1/faqs?lang=fr"
```
Example Response:

```bash
{
  "faqs": [
    {
      "id": "123",
      "question": "What is Node.js?",
      "answer": "Node.js is a JavaScript runtime...",
      "translations": {
        "question_fr": { "text": "Qu'est-ce que Node.js?" }
      }
    }
  ],
  "total": 1
}
```
## Testing
```bash
# Run tests
npm test

# Run specific test file
npm test tests/integrations/faq.test.js

```

## Docker 
You can also deploy the application using Docker by running the following command:

```bash
docker compose up --build
```

