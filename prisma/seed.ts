import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/personal_constitution?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SYSTEM_VALUES = [
  {
    name: "Integrity",
    slug: "integrity",
    description: "Aligning actions with spoken principles, maintaining honesty and moral consistency.",
  },
  {
    name: "Curiosity",
    slug: "curiosity",
    description: "Seeking to understand deeply, asking hard questions, and remaining open to new perspectives.",
  },
  {
    name: "Freedom",
    slug: "freedom",
    description: "Preserving autonomy in thought and action; choosing one's commitments deliberately.",
  },
  {
    name: "Discipline",
    slug: "discipline",
    description: "Doing what is necessary consistently, especially when motivation wanes.",
  },
  {
    name: "Compassion",
    slug: "compassion",
    description: "Treating oneself and others with empathy, kindness, and active care.",
  },
  {
    name: "Family",
    slug: "family",
    description: "Prioritizing the nurture, presence, and lifelong bonds with loved ones.",
  },
  {
    name: "Courage",
    slug: "courage",
    description: "Acting in the presence of fear, standing for convictions, and embracing vulnerability.",
  },
  {
    name: "Creativity",
    slug: "creativity",
    description: "Bringing original thought, craftsmanship, and aesthetic care into the world.",
  },
  {
    name: "Health",
    slug: "health",
    description: "Honoring physical vitality, emotional balance, and mental clarity as foundations.",
  },
  {
    name: "Growth",
    slug: "growth",
    description: "Continuously learning, evolving beyond past limitations, and pursuing excellence.",
  },
  {
    name: "Responsibility",
    slug: "responsibility",
    description: "Owning outcomes, keeping promises, and caring for what is within one's sphere of influence.",
  },
  {
    name: "Loyalty",
    slug: "loyalty",
    description: "Standing reliably beside trusted relationships, communities, and commitments.",
  },
  {
    name: "Justice",
    slug: "justice",
    description: "Treating all persons fairly, defending equity, and resisting bias and favoritism.",
  },
  {
    name: "Simplicity",
    slug: "simplicity",
    description: "Cutting through excess to protect mental clarity, peace, and meaningful focus.",
  },
  {
    name: "Independence",
    slug: "independence",
    description: "Developing self-reliance in judgment, thought, and essential capabilities.",
  },
];

async function main() {
  console.log("Seeding system values...");

  for (const item of SYSTEM_VALUES) {
    await prisma.value.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        isSystem: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        isSystem: true,
      },
    });
  }

  console.log(`Seeded ${SYSTEM_VALUES.length} curated system values successfully.`);
}

main()
  .catch((e) => {
    console.error("Error seeding values:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

