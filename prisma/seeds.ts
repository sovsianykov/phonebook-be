import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const USERS_COUNT = 10;
const CONTACTS_COUNT = 1000;
const PASSWORD_HASH = await bcrypt.hash('password123', 10);

async function main() {
  console.log('Clearing existing data...');
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  console.log(`Seeding ${USERS_COUNT} users...`);
  const users = await Promise.all(
    Array.from({ length: USERS_COUNT }, (_, i) =>
      prisma.user.create({
        data: {
          email: i === 0 ? 'admin@example.com' : faker.internet.email(),
          password: PASSWORD_HASH,
          role: i === 0 ? 'Admin' : 'User',
        },
      }),
    ),
  );

  console.log(`Seeding ${CONTACTS_COUNT} contacts...`);
  await prisma.contact.createMany({
    data: Array.from({ length: CONTACTS_COUNT }, () => ({
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.datatype.boolean(0.7) ? faker.internet.email() : null,
      address: faker.datatype.boolean(0.5) ? faker.location.streetAddress(true) : null,
      notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
      photoUrl: faker.datatype.boolean(0.4)
        ? `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/200`
        : null,
      userId: users[Math.floor(Math.random() * users.length)].id,
    })),
  });

  console.log('Done!');
  console.log(`  Users:    ${USERS_COUNT} (admin@example.com / password123)`);
  console.log(`  Contacts: ${CONTACTS_COUNT}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
