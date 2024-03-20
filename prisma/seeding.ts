// seeding.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.inventory.createMany({
    data: Array.from({ length: 200 }, (_) => {
      return {
        SKU: `${crypto.randomUUID()}`,
        price: 15000,
        quantity: 5,
        pictureUrl:
          'https://res.cloudinary.com/dynscts1t/image/upload/v1710906520/openMarket/Kawasaki-z900-grisnegro-2023-foto1_ofkf4a.png',
        productName: 'Kawasaki Z900',
        cloudinaryId: `${crypto.randomUUID()}`,
        ownerId: 1,
      };
    }),
  });

  console.log('Seeding completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
