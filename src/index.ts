import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/seed', async (req, res) => {
  try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const productsData = JSON.parse(
      readFileSync(join(process.cwd(), 'simba_products.json'), 'utf-8')
    );

    const departments = [...new Set(productsData.products.map((p: any) => p.department))];
    const categoryMap: Record<string, string> = {};
    
    for (const dept of departments) {
      const slug = dept.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
      const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: dept,
          slug,
          description: `${dept} products`,
          active: true
        }
      });
      categoryMap[dept] = category.id;
    }

    let created = 0;
    for (const product of productsData.products) {
      try {
        await prisma.product.create({
          data: {
            name: product.name,
            slug: `${product.id}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            description: product.name,
            shortDescription: product.name.substring(0, 100),
            price: product.price,
            sku: `PRD-${product.id}`,
            stock: product.inStock ? 100 : 0,
            lowStockAlert: 20,
            images: product.image,
            categoryId: categoryMap[product.department],
            tags: `${product.subcategory},${product.unit}`,
            featured: false,
            active: product.inStock,
            isAlcohol: false,
            unit: product.unit
          }
        });
        created++;
      } catch (error) {
        // Skip duplicates
      }
    }

    await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        emailVerified: true
      }
    });

    res.json({ success: true, message: `Seeded ${created} products, ${departments.length} categories, and 1 user` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
