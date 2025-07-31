# Altibbe | Hedamo - Product Transparency Platform

A comprehensive full-stack web application that collects detailed information about products through dynamic, intelligent follow-up questions and generates structured Product Transparency Reports. The platform empowers ethical, health-first decision-making through advanced product analysis.

## 🌟 Features

### Intelligent Questionnaire System
- **Dynamic Follow-up Questions**: AI-powered question selection based on previous responses
- **Category-Specific Questions**: Tailored question sets for different product categories
- **Confidence Tracking**: Users can indicate their confidence level in responses
- **Source Attribution**: Track where information comes from

### Product Categories Supported
- **Food & Beverages**: Nutrition facts, allergens, processing levels, dietary compatibility
- **Personal Care & Beauty**: Skin safety, ingredient analysis, animal testing status
- **Electronics**: Conflict minerals, repairability, energy efficiency, end-of-life management
- **Clothing & Textiles**: Fabric composition, labor standards, durability assessment
- **Household & Cleaning**: Safety profiles, environmental impact
- **And more...**

### Comprehensive Analysis
- **Multi-dimensional Scoring**: Health, Sustainability, Ethics, Safety scores
- **Detailed Reports**: Ingredient analysis, sustainability assessment, ethical evaluation
- **Recommendations**: Actionable insights and alternative product suggestions
- **Data Completeness Tracking**: Monitor how much information has been gathered

### Modern UI/UX
- **Clean, Intuitive Design**: Modern interface built with Tailwind CSS
- **Responsive Layout**: Works seamlessly across desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for delightful user interactions
- **Progress Tracking**: Visual progress indicators throughout the process

## 🚀 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Robust relational database
- **UUID**: Unique identifier generation

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Hot Reload**: Development server with hot reloading

## 📋 Prerequisites

- Node.js 18.0 or higher
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd altibbe-hedamo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/altibbe_hedamo
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Set up the database**
   ```bash
   # Generate and run database migrations
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

The application uses a comprehensive database schema designed for scalability and flexibility:

### Core Tables
- **products**: Product information and metadata
- **users**: User accounts and preferences
- **question_templates**: Intelligent question system
- **questionnaire_sessions**: User session tracking
- **question_responses**: Individual question responses
- **transparency_reports**: Generated analysis reports
- **product_categories**: Hierarchical category system

### Key Features
- **UUID Primary Keys**: For security and scalability
- **JSONB Fields**: Flexible data storage for complex structures
- **Timestamp Tracking**: Created/updated timestamps on all records
- **Relational Integrity**: Foreign key constraints and cascading deletes

## 🎯 How It Works

### 1. Product Input
Users provide basic product information:
- Product name and brand
- Category selection
- Optional barcode scanning
- Product image upload
- Additional details

### 2. Intelligent Questionnaire
The system generates questions based on:
- **Product Category**: Category-specific question sets
- **Previous Responses**: Dynamic follow-up questions
- **Priority Scoring**: High-priority questions asked first
- **Conditional Logic**: Questions triggered by specific responses

### 3. Response Collection
For each question, users can provide:
- **Primary Answer**: Text, selection, or multi-choice responses
- **Confidence Level**: How certain they are about the answer
- **Information Source**: Where they got the information
- **Additional Notes**: Extra context or details

### 4. Analysis Generation
The system processes responses to create:
- **Transparency Scores**: Overall and category-specific ratings
- **Detailed Analysis**: Comprehensive breakdown by category
- **Recommendations**: Actionable insights and suggestions
- **Alternative Products**: Better options when available

## 🔧 API Endpoints

### Products
- `POST /api/products` - Create new product
- `GET /api/products` - List products with pagination
- `GET /api/products/[id]` - Get specific product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Questionnaire
- `POST /api/questionnaire/sessions` - Create questionnaire session
- `GET /api/questionnaire/sessions` - Get sessions by user/product

### Reports
- `POST /api/reports/generate` - Generate transparency report
- `GET /api/reports/[id]` - Get specific report

## 🎨 Design System

The application uses a consistent design system with:

### Colors
- **Primary**: Blue (#3B82F6) - Actions and highlights
- **Secondary**: Gray (#6B7280) - Supporting elements
- **Success**: Green (#10B981) - Positive states
- **Warning**: Yellow (#F59E0B) - Caution states
- **Error**: Red (#EF4444) - Error states

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold weights (600-800)
- **Body Text**: Regular (400) and medium (500) weights
- **Captions**: Smaller sizes for supporting information

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Clean inputs with focus states
- **Progress**: Visual progress indicators

## 🔒 Security Considerations

- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Next.js built-in CSRF protection
- **Environment Variables**: Sensitive data in environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker
```dockerfile
# Dockerfile example for containerized deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
Ensure these environment variables are set in production:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📈 Future Enhancements

### Planned Features
- **AI-Powered Analysis**: Advanced ML for automatic ingredient analysis
- **Community Reviews**: User-generated content and reviews
- **Barcode Integration**: Real-time product lookup via barcode scanning
- **Mobile App**: Native mobile applications
- **API Access**: Public API for third-party integrations
- **Certification Tracking**: Integration with certification bodies
- **Supply Chain Mapping**: Detailed supply chain transparency

### Technical Improvements
- **Performance Optimization**: Caching, CDN integration
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: User behavior tracking and insights
- **Internationalization**: Multi-language support
- **Accessibility**: Enhanced WCAG compliance

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📞 Support

For support, feature requests, or bug reports:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Designed for ethical consumption and transparency
- Inspired by the need for better product information access

---

**Altibbe | Hedamo** - Empowering ethical consumption through product transparency.