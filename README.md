# Simba Backend API

Full-featured REST API for Simba e-commerce platform built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

- ✅ Product management with categories
- ✅ Order processing & tracking
- ✅ User reviews & ratings
- ✅ Blog system with likes & comments
- ✅ Banner management
- ✅ Full CRUD operations
- ✅ Pagination support
- ✅ Database seeding

## 📦 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/top` - Get top selling products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with products
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Toggle like
- `POST /api/blogs/:id/comment` - Add comment

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

## 📊 Product JSON Format

```json
{
  "id": "uuid",
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Full description",
  "shortDescription": "Brief description",
  "price": 1500,
  "comparePrice": 2000,
  "sku": "PROD-001",
  "stock": 100,
  "lowStockAlert": 20,
  "images": ["/path/to/image.jpg"],
  "categoryId": "uuid",
  "tags": ["tag1", "tag2"],
  "isFeatured": true,
  "isActive": true,
  "isAlcohol": false,
  "weight": 500,
  "unit": "ml",
  "viewCount": 0,
  "salesCount": 0,
  "rating": 4.5,
  "reviewCount": 10,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🌱 Database Schema

The backend uses Prisma with PostgreSQL. Key models:
- Product
- Category
- User
- Cart & CartItem
- Order, OrderItem, OrderStatusLog
- Review
- Blog, BlogComment, BlogLike
- Banner

## 🔧 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run db:push   # Push schema to database
npm run db:generate # Generate Prisma client
npm run db:seed   # Seed database with sample data
```

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/simba_db"
PORT=5000
NODE_ENV=development
UPLOAD_PATH=./uploads
```

## 📝 License

ISC
