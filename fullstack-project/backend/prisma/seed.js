const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Decathlon database...');

  // Alert Banner
  await prisma.alertBanner.deleteMany({});
  await prisma.alertBanner.create({
    data: {
      text: 'Notice! | Product Recall | Horse Riding Helmet 100 Fouganza | Contact us! on customer care: 7676798989 or ',
      linkText: 'care.india@decathlon.com',
      email: 'care.india@decathlon.com',
    },
  });

  // Coupons
  await prisma.coupon.deleteMany({});
  await prisma.coupon.createMany({
    data: [
      { code: 'NC100', discount: '₹100 OFF', minPurchase: 'above ₹1499', bgColor: 'bg-blue-600' },
      { code: 'NC200', discount: '₹200 OFF', minPurchase: 'above ₹2499', bgColor: 'bg-blue-700' },
      { code: 'NC300', discount: '₹300 OFF', minPurchase: 'above ₹3499', bgColor: 'bg-blue-800' },
    ],
  });

  // Quick Links
  await prisma.quickLink.deleteMany({});
  await prisma.quickLink.createMany({
    data: [
      { title: 'Monsoon Essentials', imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=300' },
      { title: 'Activewear', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300' },
      { title: 'Fitness Equipments', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=300' },
      { title: 'Cycling', imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=300' },
      { title: 'Hiking & Trekking', imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=300' },
      { title: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300' },
      { title: 'Bag & Backpacks', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300' },
      { title: 'Sports Accessories', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=300' },
    ],
  });

  // Hero Banners
  await prisma.heroBanner.deleteMany({});
  await prisma.heroBanner.createMany({
    data: [
      {
        title: 'Rain On. Kick Off.',
        subtitle: 'Shop Football Balls',
        priceTag: '₹129 onwards',
        imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1600',
        buttonLink: '/sports/football',
      },
      {
        title: 'Monsoon Gear Ready',
        subtitle: 'Explore Elite Rain Ponchos',
        priceTag: '₹799 onwards',
        imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1600',
        buttonLink: '/collection/monsoon',
      },
      {
        title: 'Elevate Your Workout Checklist',
        subtitle: 'Premium Gym Apparel & Equipment',
        priceTag: '₹399 onwards',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600',
        buttonLink: '/collection/fitness',
      },
    ],
  });

  // Products
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        brand: 'DECATHLON',
        name: 'Umbrella Unisex ProFilter Small Eco-Friendly',
        price: 799,
        mrp: 1299,
        rating: 4.3,
        reviews: '4.3k',
        discountTag: 'PRICE DROP',
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600',
        category: 'STORM PROOF.',
      },
      {
        id: 2,
        brand: 'INESIS',
        name: 'Umbrella Unisex MICROPLUS Lightweight',
        price: 699,
        mrp: 949,
        rating: 4.2,
        reviews: '127',
        discountTag: null,
        imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100083cd2c?q=80&w=600',
        category: 'STORM PROOF.',
      },
      {
        id: 3,
        brand: 'INESIS',
        name: 'Umbrella Unisex ProFilter Medium Eco-Friendly Red',
        price: 699,
        mrp: 1499,
        rating: 4.6,
        reviews: '2.9k',
        discountTag: '53% OFF',
        imageUrl: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=600',
        category: 'STORM PROOF.',
      },
      {
        id: 4,
        brand: 'INESIS',
        name: 'Umbrella Unisex ProFilter Medium Eco-Friendly Black',
        price: 999,
        mrp: 1499,
        rating: 4.6,
        reviews: '2.9k',
        discountTag: 'Buy 2 @ ₹1899 & Save ₹99',
        imageUrl: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600',
        category: 'STORM PROOF.',
      },
      {
        id: 5,
        brand: 'QUECHUA',
        name: 'Rain Poncho Unisex Hiking Lightweight Waterproof',
        price: 799,
        mrp: 1499,
        rating: 4.7,
        reviews: '4.2k',
        discountTag: null,
        imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600',
        category: 'STORM PROOF.',
      },
      {
        id: 6,
        brand: 'DOMYOS',
        name: 'Men Gym Trackpant Convertible, Jog Fit, Quick Dry',
        price: 999,
        mrp: 999,
        rating: 4.4,
        reviews: '8.1k',
        discountTag: 'Buy 3 @ 2847 and Save 150',
        imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600',
        category: 'Shop your Workout Checklist',
      },
      {
        id: 7,
        brand: 'DOMYOS',
        name: 'Men Fitness Tracksuit Jacket with Moisture Wicking',
        price: 999,
        mrp: 1699,
        rating: 4.5,
        reviews: '4.5k',
        discountTag: null,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
        category: 'Shop your Workout Checklist',
      },
      {
        id: 8,
        brand: 'DOMYOS',
        name: 'Men Gym Shorts, Stretchable, Quick Dry and Light',
        price: 399,
        mrp: 699,
        rating: 4.3,
        reviews: '17.2k',
        discountTag: null,
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600',
        category: 'Shop your Workout Checklist',
      },
      {
        id: 9,
        brand: 'DOMYOS',
        name: 'Men Gym Trackpants Slim Fit Jogger Style Breathable',
        price: 899,
        mrp: 1699,
        rating: 4.1,
        reviews: '5.1k',
        discountTag: null,
        imageUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=600',
        category: 'Shop your Workout Checklist',
      },
      {
        id: 10,
        brand: 'DECATHLON',
        name: 'Men Walking EVA Sole Lightweight and Ergonomic',
        price: 2299,
        mrp: 2299,
        rating: 4.5,
        reviews: '2.5k',
        discountTag: null,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
        category: 'Shop your Workout Checklist',
      },
    ],
  });

  // After Sales Services
  await prisma.afterSalesService.deleteMany({});
  await prisma.afterSalesService.createMany({
    data: [
      {
        title: 'Cycle Workshop & Tune-up',
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600',
        buttonText: 'Book Service',
        buttonLink: '#',
        sortOrder: 1,
      },
      {
        title: 'Equipment Maintenance',
        imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600',
        buttonText: 'Explore',
        buttonLink: '#',
        sortOrder: 2,
      },
      {
        title: 'Racket Restringing',
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600',
        buttonText: 'View Rates',
        buttonLink: '#',
        sortOrder: 3,
      },
      {
        title: 'Garment Personalization',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600',
        buttonText: 'Customize',
        buttonLink: '#',
        sortOrder: 4,
      },
    ],
  });

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
