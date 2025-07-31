# Product Transparency Platform

A comprehensive full-stack web application that empowers consumers to make informed, ethical, and health-conscious decisions through intelligent product analysis and transparency reporting.

## 🌟 Features

### Core Functionality
- **Intelligent Product Analysis**: AI-powered questioning system that adapts to product categories
- **Dynamic Follow-up Questions**: Context-aware questions based on previous responses
- **Comprehensive Transparency Reports**: Detailed analysis covering health, sustainability, ethics, and transparency
- **Health-First Scoring**: Advanced algorithms for health impact assessment
- **Sustainability Insights**: Environmental impact analysis including packaging and carbon footprint
- **Ethics Evaluation**: Assessment of labor practices, fair trade, and corporate responsibility

### Technical Features
- **Modern React Frontend**: Clean, responsive UI with smooth animations
- **RESTful API**: Comprehensive backend with intelligent questioning and report generation
- **AI Integration**: OpenAI-powered question generation and analysis
- **Database Design**: Robust MongoDB schemas for products, reports, and user data
- **Real-time Updates**: Live progress tracking and instant feedback
- **Export Capabilities**: Multiple report export formats (JSON, CSV, PDF-ready)

## 🏗️ Architecture

### Backend (Node.js/Express)
- **API Routes**: Products, Questions, Reports with full CRUD operations
- **Intelligent Services**: QuestioningService and ReportService with AI integration
- **Database Models**: Comprehensive schemas for Products and Reports
- **Validation**: Joi-based request validation and error handling
- **Security**: Helmet, CORS, and input sanitization

### Frontend (React)
- **Modern UI**: Styled-components with CSS variables for theming
- **State Management**: React Query for efficient API state management
- **Routing**: React Router with protected routes and lazy loading
- **Animations**: Framer Motion for smooth transitions and interactions
- **Responsive Design**: Mobile-first approach with modern CSS techniques

### Database (MongoDB)
- **Product Schema**: Comprehensive product information with ingredients, certifications, and sustainability data
- **Report Schema**: Detailed transparency reports with scoring and analysis
- **Indexing**: Optimized queries for search and filtering
- **Relationships**: Proper referencing between products and reports

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API key (for AI-powered features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-transparency-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/product_transparency
   OPENAI_API_KEY=your_openai_api_key_here
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # npm run server (backend only)
   # npm run client (frontend only)
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
product-transparency-platform/
├── server/                 # Backend application
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   ├── index.js           # Server entry point
│   └── .env               # Environment variables
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔧 API Documentation

### Products API
- `GET /api/products` - List products with filtering
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/completeness` - Analyze data completeness

### Questions API
- `POST /api/questions/generate` - Generate initial questions
- `POST /api/questions/follow-up` - Generate follow-up questions
- `POST /api/questions/answer` - Submit question answer
- `GET /api/questions/progress/:productId` - Get answering progress
- `GET /api/questions/categories` - Get question categories

### Reports API
- `POST /api/reports/generate` - Generate transparency report
- `GET /api/reports` - List reports with filtering
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/number/:reportNumber` - Get report by number
- `POST /api/reports/:id/regenerate` - Regenerate existing report
- `GET /api/reports/:id/export` - Export report in various formats

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette**: Primary blues, secondary greens, with health-focused accent colors
- **Typography**: Inter font family with defined font weights and sizes
- **Spacing System**: Consistent spacing scale using CSS custom properties
- **Component Library**: Reusable styled-components with consistent styling
- **Animation Guidelines**: Smooth transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with breakpoints

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test

# Run all tests
npm test
```

## 📦 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=your_production_domain
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI-powered analysis capabilities
- React and Node.js communities for excellent frameworks
- MongoDB for flexible data storage
- All contributors and users who help improve transparency in consumer products

## 📞 Support

For support, feature requests, or bug reports, please:
1. Check existing [Issues](https://github.com/your-repo/issues)
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ for a more transparent world** 🌍