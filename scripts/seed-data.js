/**
 * Seed script — populates sample articles and pages for screenshots.
 * Run with: node scripts/seed-data.js
 *
 * Uses Strapi's programmatic API (no auth needed).
 */

const strapi = require('@strapi/strapi');

async function seed() {
  console.log('Starting Strapi for seeding...');
  const app = await strapi.createStrapi({ appDir: process.cwd() }).load();

  const articles = [
    {
      title: 'AI Trends Reshaping Enterprise Software in 2024',
      content:
        'Artificial intelligence continues to transform how enterprises build and deploy software. From automated code review to intelligent monitoring, AI-powered tools are becoming essential...',
      slug: 'ai-trends-enterprise-2024',
      tenant_id: 'tenant-a',
      author: 'Sarah Chen',
    },
    {
      title: 'Cloud Migration Strategy: A Step-by-Step Guide',
      content:
        'Migrating legacy applications to the cloud requires careful planning. This guide covers assessment, architecture redesign, data migration, and post-migration optimization...',
      slug: 'cloud-migration-guide',
      tenant_id: 'tenant-a',
      author: 'James Rodriguez',
    },
    {
      title: 'Building Scalable APIs with Node.js',
      content:
        'Learn how to design and implement APIs that handle millions of requests. We cover rate limiting, caching strategies, database optimization, and horizontal scaling patterns...',
      slug: 'scalable-apis-nodejs',
      tenant_id: 'tenant-a',
      author: 'Sarah Chen',
    },
    {
      title: 'E-Commerce Platform Best Practices',
      content:
        'Running a successful e-commerce platform demands attention to performance, security, and user experience. This article covers payment integration, inventory management, and conversion optimization...',
      slug: 'ecommerce-best-practices',
      tenant_id: 'tenant-b',
      author: 'Maria Lopez',
    },
    {
      title: 'Mobile App Development: React Native vs Flutter',
      content:
        'Choosing the right cross-platform framework is crucial. We compare React Native and Flutter across performance benchmarks, developer experience, and ecosystem maturity...',
      slug: 'react-native-vs-flutter',
      tenant_id: 'tenant-b',
      author: 'David Kim',
    },
    {
      title: 'Cybersecurity Fundamentals for Startups',
      content:
        'Startups often overlook security until it is too late. This guide covers essential security practices including authentication, encryption, vulnerability scanning, and incident response...',
      slug: 'cybersecurity-startups',
      tenant_id: 'tenant-b',
      author: 'Maria Lopez',
    },
  ];

  const pages = [
    {
      title: 'About Us',
      content:
        'We are a technology consultancy focused on digital transformation. Our team of experts helps businesses modernize their infrastructure, adopt cloud-native architectures, and build scalable products.',
      slug: 'about-us',
      tenant_id: 'tenant-a',
      seo_title: 'About TechCorp Solutions',
      seo_description:
        'Learn about our mission, team, and approach to digital transformation.',
      template: 'about',
    },
    {
      title: 'Contact',
      content:
        'Get in touch with our team. Email: hello@techcorp.io | Phone: +1 (555) 123-4567 | Address: 100 Innovation Drive, San Francisco, CA 94105',
      slug: 'contact',
      tenant_id: 'tenant-a',
      seo_title: 'Contact TechCorp Solutions',
      seo_description: 'Reach out to discuss your next project.',
      template: 'contact',
    },
    {
      title: 'Digital Commerce Solutions',
      content:
        'Transform your online business with our comprehensive e-commerce platform. Features include multi-currency support, AI-powered recommendations, and real-time analytics dashboard.',
      slug: 'digital-commerce',
      tenant_id: 'tenant-b',
      seo_title: 'Digital Commerce - ShopFlow',
      seo_description:
        'End-to-end e-commerce solutions for modern businesses.',
      template: 'landing',
    },
    {
      title: 'About ShopFlow',
      content:
        'ShopFlow is a leading e-commerce solutions provider serving over 500 businesses worldwide. Founded in 2019, we specialize in headless commerce architectures.',
      slug: 'about-shopflow',
      tenant_id: 'tenant-b',
      seo_title: 'About ShopFlow',
      seo_description:
        'Discover how ShopFlow powers modern e-commerce experiences.',
      template: 'about',
    },
  ];

  console.log('\nSeeding articles...');
  for (const article of articles) {
    try {
      await app.documents('api::article.article').create({ data: article });
      console.log(`  ✓ Article: "${article.title}" (${article.tenant_id})`);
    } catch (err) {
      console.log(`  ✗ Article: "${article.title}" — ${err.message}`);
    }
  }

  console.log('\nSeeding pages...');
  for (const page of pages) {
    try {
      await app.documents('api::page.page').create({ data: page });
      console.log(`  ✓ Page: "${page.title}" (${page.tenant_id})`);
    } catch (err) {
      console.log(`  ✗ Page: "${page.title}" — ${err.message}`);
    }
  }

  console.log('\nSeeding complete!');
  await app.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
