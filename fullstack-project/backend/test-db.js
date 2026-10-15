require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing alertBanner...');
    const b = await prisma.alertBanner.findFirst();
    console.log('Banner:', b);
    console.log('Testing product...');
    const p = await prisma.product.findMany();
    console.log('Products count:', p.length);
  } catch (err) {
    console.error('ERROR OCCURRED:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
