# 📦 Stocky - Modern Inventory Management System

**A comprehensive, full-stack inventory management solution built with Next.js, Mongoose, and modern web technologies for efficient product tracking and business operations.**

## ✨ Features

### 🔐 **Authentication & Security**

- Secure user authentication with JWT tokens
- Session-based login/logout system
- Protected routes and API endpoints

### 📊 **Product Management**

- Complete CRUD operations for products
- Advanced filtering by category, supplier, and status
- Real-time search functionality
- Bulk export to CSV and Excel formats
- QR code generation for each product

### 🏷️ **Organization**

- Category management system
- Supplier/vendor tracking
- Status-based inventory monitoring (Available, Stock Low, Stock Out)
- User-specific data isolation

### 🎨 **Modern UI/UX**

- Responsive design for all devices
- Dark/Light mode toggle
- Beautiful gradient headers and modern styling
- Intuitive navigation and user experience
- Real-time data updates

### 🔧 **Technical Stack**

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Mongoose ODM
- **Database**: MongoDB with connection pooling
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: Zustand for client state
- **Authentication**: Custom JWT implementation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)

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

## 📁 Project Structure

```
inventory/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD operations
│   │   ├── categories/   # Category management
│   │   └── suppliers/    # Supplier management
│   ├── components/       # Reusable UI components
│   ├── globals.css       # Global styles
│   └── page.tsx          # Main dashboard
├── models/               # Mongoose schemas
│   ├── User.ts          # User model
│   ├── Product.ts       # Product model
│   ├── Category.ts      # Category model
│   └── Supplier.ts      # Supplier model
├── lib/                 # Utility functions
└── public/              # Static assets
```

## 🎯 Key Components

### Dashboard Features

- **Statistics Cards**: Total products, available stock, low stock alerts
- **Advanced Table**: Sortable, filterable product listing
- **Quick Actions**: Add products, categories, and suppliers
- **Export Tools**: CSV and Excel export with filters applied

### Product Management

- **Smart Status Tracking**: Automatic status calculation based on quantity
- **Comprehensive Details**: SKU, price, quantity, category, supplier
- **Visual Indicators**: Color-coded status badges and alerts
- **QR Integration**: Instant QR code generation for products

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌟 Highlights

- **⚡ Performance**: Optimized with React.memo, useMemo, and efficient data fetching
- **🎨 Design**: Modern UI with consistent design system and smooth animations
- **📱 Responsive**: Mobile-first approach with adaptive layouts
- **🔒 Security**: JWT-based authentication with secure API endpoints
- **📊 Analytics**: Built-in statistics and reporting capabilities
- **🔄 Real-time**: Live updates and instant feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Siraj Ahmed**

- GitHub: [@sirajahmedx](https://github.com/sirajahmedx)
- LinkedIn: [Your LinkedIn Profile]

---

**Built with ❤️ using Next.js, Mongoose, and modern web technologies**
