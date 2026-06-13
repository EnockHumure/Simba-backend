# Simba Backend - Quick Start Guide

## ✅ What's Been Created

A complete backend API with:
- Product management (CRUD operations)
- Category management
- Order processing with status tracking
- User reviews & ratings
- Blog system with likes & comments
- Banner management
- Database seeding with sample data
- Full TypeScript support

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── controllers/       # Business logic
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── order.controller.ts
│   │   ├── review.controller.ts
│   │   ├── blog.controller.ts
│   │   └── banner.controller.ts
│   ├── routes/            # API routes
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── order.routes.ts
│   │   ├── review.routes.ts
│   │   ├── blog.routes.ts
│   │   └── banner.routes.ts
│   ├── lib/
│   │   └── prisma.ts      # Database client
│   └── index.ts           # Main server file
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### 1. Setup Database

You need PostgreSQL installed. Then update `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/simba_db"
PORT=5000
```

### 2. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 3. Start Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

Server will run at: `http://localhost:5000`

## 📡 Test the API

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Single Product
```bash
curl http://localhost:5000/api/products/{id}
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "slug": "new-product",
    "description": "Product description",
    "price": 1500,
    "stock": 100,
    "categoryId": "category-uuid",
    "images": ["/path/to/image.jpg"],
    "tags": ["new"],
    "isFeatured": false,
    "isActive": true,
    "isAlcohol": false,
    "lowStockAlert": 10
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "items": [
      {
        "productId": "product-uuid",
        "quantity": 2
      }
    ],
    "deliveryFee": 2000,
    "fulfillmentType": "delivery",
    "deliveryStreet": "KN 5 Ave",
    "deliveryDistrict": "Gasabo",
    "deliverySector": "Remera"
  }'
```

## 🔑 Key Endpoints

### Products
- `GET /api/products` - List products (pagination: ?page=1&limit=20)
- `GET /api/products?search=name` - Search products
- `GET /api/products?categoryId=uuid` - Filter by category
- `GET /api/products/featured` - Featured products
- `GET /api/products/top` - Top selling products

### Orders
- `GET /api/orders?userId=uuid` - Get user orders
- `GET /api/orders?status=pending` - Filter by status
- `PUT /api/orders/{id}/status` - Update status: pending → confirmed → packaged → on_the_way → delivered
- `PUT /api/orders/{id}/payment` - Update payment: pending → paid

### Reviews
- `POST /api/reviews` - Add review (updates product rating)
- `DELETE /api/reviews/{id}` - Delete review (recalculates rating)

## 📊 Sample Data

After seeding, you'll have:
- 2 categories (Beverages, Food)
- 3 products (Coca Cola, Rice, Beer)
- 1 user (john@example.com)
- 1 banner

## 🔧 Database Commands

```bash
# Reset database (delete all data)
npx prisma db push --force-reset

# Open Prisma Studio (GUI for database)
npx prisma studio

# Generate new migration
npx prisma migrate dev --name migration_name
```

## 🌐 Connect to Frontend

Update your frontend API calls to point to:
```
http://localhost:5000/api
```

Example:
```typescript
// Frontend API call
const products = await fetch('http://localhost:5000/api/products');
const data = await products.json();
```

## 📝 Next Steps

1. ✅ Test all endpoints with Postman or curl
2. ✅ Add authentication (JWT or session-based)
3. ✅ Add file upload for product images
4. ✅ Add input validation with Zod
5. ✅ Add rate limiting
6. ✅ Deploy to production (Render, Railway, or DigitalOcean)

## 🐛 Troubleshooting

**Database connection error?**
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb simba_db`

**Port already in use?**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill`

**Module errors?**
- Run: `npm install`
- Delete node_modules and reinstall

## 📞 Support

For issues, check:
- Logs in terminal
- Prisma docs: https://www.prisma.io/docs
- Express docs: https://expressjs.com

---

**Backend is ready! 🎉**
Start the server with `npm run dev` and test the endpoints!
