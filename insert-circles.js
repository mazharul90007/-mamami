const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const circles = [
  {
    name: "joyfulSouls",
    description: "A community for happy souls to share joy and positive vibes"
  },
  {
    name: "creativeSouls", 
    description: "Connect with creative minds and share your artistic journey"
  },
  {
    name: "breakupSupport",
    description: "A supportive space for healing and moving forward after breakups"
  },
  {
    name: "feelingRomantic",
    description: "Share romantic thoughts and experiences with like-minded people"
  }
];

async function insertCircles() {
  try {
    console.log('🔄 Inserting circles...');
    
    for (const circle of circles) {
      const result = await prisma.circle.upsert({
        where: { name: circle.name },
        update: {},
        create: circle
      });
      console.log(`✅ Created/Updated circle: ${result.name} (ID: ${result.id})`);
    }
    
    console.log('🎉 All circles inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting circles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertCircles(); 