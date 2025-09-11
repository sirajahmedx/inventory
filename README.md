# Inventory Pro - Modern Inventory Management System

A comprehensive, full-stack inventory management solution built with Next.js, Mongoose, and modern web technologies for efficient product tracking and business operations.

## Key Features

### Core Functionality

- **Complete Product Management**: Full CRUD operations with advanced filtering and search
- **Real-time Analytics Dashboard**: Comprehensive statistics and reporting with interactive charts
- **Multi-format Export**: CSV and Excel export capabilities with applied filters
- **Smart Inventory Tracking**: Automatic status calculation (Available, Stock Low, Stock Out)
- **QR Code Integration**: Instant QR code generation for product identification

### Organization & Data Management

- **Category Management**: Organize products by customizable categories
- **Supplier Tracking**: Complete vendor management with contact information
- **Advanced Filtering**: Filter by category, supplier, status, and custom search terms
- **User-specific Data**: Isolated data per user with secure access controls

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Seamless theme switching with persistent preferences
- **Modern UI Components**: Clean, professional interface with consistent design system
- **Real-time Updates**: Live data synchronization and instant feedback

### Technical Features

- **Secure Authentication**: JWT-based login system with session management
- **API Documentation**: Interactive API reference with testing capabilities
- **System Monitoring**: Real-time API health status and performance metrics
- **Database Seeding**: Automated sample data generation for testing and demos

## Demo Credentials

> **Use these credentials to explore the application:**

```
📧 Email:    user@email.com
🔑 Password: user@123
```

**Quick Access:** Visit [http://localhost:3000](http://localhost:3000) and use the credentials above to login.

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Mongoose ODM
- **Database**: MongoDB with connection pooling
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: Zustand for client state
- **Authentication**: Custom JWT implementation
- **Charts & Analytics**: Recharts for data visualization
- **Export Libraries**: PapaParse (CSV), XLSX (Excel)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sirajahmedx/inventory.git
   cd inventory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL=mongodb://localhost:27017/inventory
   JWT_SECRET=your_super_secret_jwt_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**

   ```bash
   # Ensure MongoDB is running
   mongod
   ```

5. **Seed Database (Optional)**
   Populate with sample data:

   ```bash
   npm run seed
   ```

   This creates 10 categories, 5 suppliers, and 100+ products.

6. **Start Development Server**

   ```bash
   npm run dev
   ```

7. **Access Application**
   Open [http://localhost:3000](http://localhost:3000) and login with demo credentials.

## Application Structure

```
inventory/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD operations
│   │   ├── categories/   # Category management
│   │   └── suppliers/    # Supplier management
│   ├── analytics/        # Analytics dashboard
│   ├── api-docs/         # API documentation
│   ├── api-status/       # System monitoring
│   └── components/       # Reusable UI components
├── models/               # Mongoose schemas
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Populate database with sample data
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Session validation

### Products

- `GET /api/products` - List products with filtering
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Suppliers

- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/[id]` - Update supplier
- `DELETE /api/suppliers/[id]` - Delete supplier

## Key Highlights

### Analytics Dashboard

- Interactive charts and graphs
- Real-time inventory statistics
- Forecasting and trend analysis
- Category-wise distribution
- Supplier performance metrics

### Export Capabilities

- CSV export with custom formatting
- Excel export with multiple sheets
- Filtered data export
- Bulk operations support

### Advanced Filtering

- Multi-select category filtering
- Status-based filtering
- Supplier-based filtering
- Real-time search across all fields
- Combined filter application

### Security Features

- JWT token-based authentication
- Secure API endpoints
- User session management
- Data isolation per user
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Siraj Ahmed**

- GitHub: [@sirajahmedx](https://github.com/sirajahmedx)

---

Built with modern web technologies for scalable inventory management solutions.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sirajahmedx/inventory.git
   cd inventory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL=mongodb://localhost:27017/inventory
   JWT_SECRET=your_super_secret_jwt_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**

   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Seed the Database (Optional)**
   Populate your database with sample data:

   ```bash
   npm run seed
   ```

   This will create:

   - 10 categories (Electronics, Clothing, Home & Garden, etc.)
   - 5 suppliers with contact information
   - 100+ products with complete details across all categories

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Application Structure

```
inventory/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD operations
│   │   ├── categories/   # Category management
│   │   └── suppliers/    # Supplier management
│   ├── analytics/        # Analytics dashboard
│   ├── api-docs/         # API documentation
│   ├── api-status/       # System monitoring
│   └── components/       # Reusable UI components
├── models/               # Mongoose schemas
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Populate database with sample data
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Session validation

### Products

- `GET /api/products` - List products with filtering
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Suppliers

- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/[id]` - Update supplier
- `DELETE /api/suppliers/[id]` - Delete supplier

## Key Highlights

### Analytics Dashboard

- Interactive charts and graphs
- Real-time inventory statistics
- Forecasting and trend analysis
- Category-wise distribution
- Supplier performance metrics

### Export Capabilities

- CSV export with custom formatting
- Excel export with multiple sheets
- Filtered data export
- Bulk operations support

### Advanced Filtering

- Multi-select category filtering
- Status-based filtering
- Supplier-based filtering
- Real-time search across all fields
- Combined filter application

### Security Features

- JWT token-based authentication
- Secure API endpoints
- User session management
- Data isolation per user
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Siraj Ahmed**

- GitHub: [@sirajahmedx](https://github.com/sirajahmedx)

---

Built with modern web technologies for scalable inventory management solutions.
