const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: { db: { url: "mysql://root:shreetech@123@127.0.0.1:3306/decathlon" } }
});

// GET: Fetch all storefront layout modules dynamically from the database
router.get('/layout', async (req, res) => {
  try {
    const [banner, coupons, links, products, heroes, trendCards, priceTiers, afterSalesServices] = await prisma.$transaction([
      prisma.$queryRaw`SELECT * FROM AlertBanner LIMIT 1`,
      prisma.$queryRaw`SELECT * FROM Coupon`,
      prisma.$queryRaw`SELECT * FROM QuickLink`,
      prisma.$queryRaw`SELECT * FROM Product ORDER BY id ASC`,
      prisma.$queryRaw`SELECT * FROM HeroBanner ORDER BY id ASC`,
      prisma.$queryRaw`SELECT * FROM TrendCard ORDER BY sortOrder ASC`,
      prisma.$queryRaw`SELECT * FROM PriceTier ORDER BY sortOrder ASC`,
      prisma.$queryRaw`SELECT * FROM AfterSalesService ORDER BY sortOrder ASC`
    ]);

    res.json({
      banner: banner[0] || null,
      coupons,
      quickLinks: links,
      products,
      heroBanners: heroes,
      trendCards,
      priceTiers,
      afterSalesServices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;