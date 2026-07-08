const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Aggregated Storefront API Route
app.get('/api/layout', async (req, res) => {
  try {
    const banner = await prisma.alertBanner.findFirst();
    const coupons = await prisma.coupon.findMany();
    const quickLinks = await prisma.quickLink.findMany();
    const products = await prisma.product.findMany();
    const heroBanners = await prisma.heroBanner.findMany();
    
    // Fetch live AfterSalesService rows dynamically from database
    let services = [];
    try {
      services = await prisma.afterSalesService.findMany({
        orderBy: { sortOrder: 'asc' }
      });
    } catch (e) {
      console.log("AfterSalesService model missing from schema.prisma config.");
    }

    res.json({
      banner: banner || null,
      coupons: coupons || [],
      quickLinks: quickLinks || [],
      products: products || [],
      heroBanners: heroBanners || [],
      services: services || []
    });
  } catch (error) {
    console.error("Layout API Engine Error:", error);
    res.status(500).json({ error: "Failed to assemble storefront dynamic components" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Store API Backend listening live on http://localhost:${PORT}`);
});