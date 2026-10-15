const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', server: 'running', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', server: 'running', database: 'disconnected', error: error.message });
  }
});

// ---------------------------------------------------------------------------
// AUTH: REGISTER — saves a new user row into the "User" table in MySQL
// ---------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Something went wrong while creating your account.' });
  }
});

// ---------------------------------------------------------------------------
// AUTH: LOGIN — reads the user row from the database and checks the password
// ---------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong while logging you in.' });
  }
});

// ---------------------------------------------------------------------------
// Middleware to protect routes that need a logged-in user
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
}

// GET /api/auth/me — protected route, proves the database read works
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Something went wrong fetching your profile.' });
  }
});

// ---------------------------------------------------------------------------
// Your existing storefront routes (unchanged)
// ---------------------------------------------------------------------------
app.get('/api/layout', async (req, res) => {
  try {
    const banner = await prisma.alertBanner.findFirst();
    const coupons = await prisma.coupon.findMany();
    const quickLinks = await prisma.quickLink.findMany();
    const products = await prisma.product.findMany();
    const heroBanners = await prisma.heroBanner.findMany();

    let services = [];
    try {
      services = await prisma.afterSalesService.findMany({
        orderBy: { sortOrder: 'asc' }
      });
    } catch (e) {
      console.log("AfterSalesService table structure is missing from your database schema.");
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
    console.error("Express API Engine Pipeline Failure:", error);
    res.status(500).json({ error: "Failed to assemble aggregated layout models" });
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const related = await prisma.product.findMany({
      where: { category: product.category, NOT: { id: product.id } },
      take: 4
    });

    res.json({ product, related });
  } catch (error) {
    console.error("Product detail fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch product detail" });
  }
});

// GET /api/search?q=query — instant product search
app.get('/api/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ products: [] });
    }
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { brand: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 8,
    });
    res.json({ products });
  } catch (error) {
    console.error("Search API failed:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
});

// ---------------------------------------------------------------------------
// CART: uses ownerId (either "user-<id>" for logged-in users, or "guest-..."
// for anonymous visitors) so every cart is saved to MySQL and survives refresh
// ---------------------------------------------------------------------------

function computeCartTotals(items) {
  let totalMRP = 0;
  let totalPrice = 0;
  for (const item of items) {
    totalMRP += item.product.mrp * item.quantity;
    totalPrice += item.product.price * item.quantity;
  }
  return { totalMRP, totalPrice, discount: totalMRP - totalPrice };
}

// POST /api/cart — add an item (or bump quantity if it's already in the cart)
app.post('/api/cart', async (req, res) => {
  try {
    const { ownerId, productId, quantity } = req.body;
    if (!ownerId || !productId) {
      return res.status(400).json({ error: 'ownerId and productId are required.' });
    }
    const qty = quantity && quantity > 0 ? quantity : 1;

    const existing = await prisma.cartItem.findUnique({
      where: { ownerId_productId: { ownerId, productId } },
    });

    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + qty },
          include: { product: true },
        })
      : await prisma.cartItem.create({
          data: { ownerId, productId, quantity: qty },
          include: { product: true },
        });

    res.status(201).json(item);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// GET /api/cart/:ownerId — full cart with totals
app.get('/api/cart/:ownerId', async (req, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { ownerId: req.params.ownerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ items, ...computeCartTotals(items) });
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

// PUT /api/cart/:ownerId/:productId — set an exact quantity
app.put('/api/cart/:ownerId/:productId', async (req, res) => {
  try {
    const { ownerId, productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be at least 1.' });
    }

    const updated = await prisma.cartItem.update({
      where: { ownerId_productId: { ownerId, productId: parseInt(productId) } },
      data: { quantity },
      include: { product: true },
    });
    res.json(updated);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update quantity.' });
  }
});

// DELETE /api/cart/:ownerId/:productId — remove one line item
app.delete('/api/cart/:ownerId/:productId', async (req, res) => {
  try {
    const { ownerId, productId } = req.params;
    await prisma.cartItem.delete({
      where: { ownerId_productId: { ownerId, productId: parseInt(productId) } },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// DELETE /api/cart/:ownerId — clear the whole cart
app.delete('/api/cart/:ownerId', async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { ownerId: req.params.ownerId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
});

// ---------------------------------------------------------------------------
// WISHLIST: same ownerId pattern as the cart, saved to MySQL via Prisma
// ---------------------------------------------------------------------------

// POST /api/wishlist — add an item (no-op if it's already saved)
app.post('/api/wishlist', async (req, res) => {
  try {
    const { ownerId, productId } = req.body;
    if (!ownerId || !productId) {
      return res.status(400).json({ error: 'ownerId and productId are required.' });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: { ownerId_productId: { ownerId, productId } },
    });

    const item = existing
      ? existing
      : await prisma.wishlistItem.create({
          data: { ownerId, productId },
          include: { product: true },
        });

    res.status(201).json(item);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist.' });
  }
});

// GET /api/wishlist/:ownerId — full wishlist
app.get('/api/wishlist/:ownerId', async (req, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { ownerId: req.params.ownerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ items });
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist.' });
  }
});

// DELETE /api/wishlist/:ownerId/:productId — remove one saved item
app.delete('/api/wishlist/:ownerId/:productId', async (req, res) => {
  try {
    const { ownerId, productId } = req.params;
    await prisma.wishlistItem.delete({
      where: { ownerId_productId: { ownerId, productId: parseInt(productId) } },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Remove wishlist item error:', error);
    res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// DELETE /api/wishlist/:ownerId — clear the whole wishlist
app.delete('/api/wishlist/:ownerId', async (req, res) => {
  try {
    await prisma.wishlistItem.deleteMany({ where: { ownerId: req.params.ownerId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Failed to clear wishlist.' });
  }
});

// ---------------------------------------------------------------------------
// MERGE ON LOGIN: moves a guest's cart/wishlist rows onto the logged-in
// user's ownerId, so items added before login aren't lost.
// ---------------------------------------------------------------------------

// POST /api/cart/merge — { guestOwnerId, userOwnerId }
app.post('/api/cart/merge', async (req, res) => {
  try {
    const { guestOwnerId, userOwnerId } = req.body;
    if (!guestOwnerId || !userOwnerId || guestOwnerId === userOwnerId) {
      return res.json({ success: true, merged: 0 });
    }

    const guestItems = await prisma.cartItem.findMany({ where: { ownerId: guestOwnerId } });

    for (const guestItem of guestItems) {
      const existing = await prisma.cartItem.findUnique({
        where: { ownerId_productId: { ownerId: userOwnerId, productId: guestItem.productId } },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + guestItem.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { ownerId: userOwnerId, productId: guestItem.productId, quantity: guestItem.quantity },
        });
      }
    }

    await prisma.cartItem.deleteMany({ where: { ownerId: guestOwnerId } });

    res.json({ success: true, merged: guestItems.length });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({ error: 'Failed to merge cart.' });
  }
});

// POST /api/wishlist/merge — { guestOwnerId, userOwnerId }
app.post('/api/wishlist/merge', async (req, res) => {
  try {
    const { guestOwnerId, userOwnerId } = req.body;
    if (!guestOwnerId || !userOwnerId || guestOwnerId === userOwnerId) {
      return res.json({ success: true, merged: 0 });
    }

    const guestItems = await prisma.wishlistItem.findMany({ where: { ownerId: guestOwnerId } });

    for (const guestItem of guestItems) {
      const existing = await prisma.wishlistItem.findUnique({
        where: { ownerId_productId: { ownerId: userOwnerId, productId: guestItem.productId } },
      });

      if (!existing) {
        await prisma.wishlistItem.create({
          data: { ownerId: userOwnerId, productId: guestItem.productId },
        });
      }
    }

    await prisma.wishlistItem.deleteMany({ where: { ownerId: guestOwnerId } });

    res.json({ success: true, merged: guestItems.length });
  } catch (error) {
    console.error('Merge wishlist error:', error);
    res.status(500).json({ error: 'Failed to merge wishlist.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Store API Backend listening live on http://localhost:${PORT}`);
  prisma.$connect()
    .then(() => {
      console.log('✅ Connected to MySQL database successfully.');
    })
    .catch((err) => {
      console.error('❌ Database connection failed! Please ensure MySQL is running in XAMPP (Port 3306).');
      console.error('   Details:', err.message);
    });
});