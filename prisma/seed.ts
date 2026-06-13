import prisma from '../src/lib/prisma.js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('🌱 Seeding database with real Simba products...');

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

  console.log(`✓ Created ${departments.length} categories`);

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
      if (created % 100 === 0) {
        console.log(`  Imported ${created} products...`);
      }
    } catch (error) {
      // Skip duplicates
    }
  }

  console.log(`✓ Created ${created} products`);

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

  console.log('✓ Created sample user');
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
