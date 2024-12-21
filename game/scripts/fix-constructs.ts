const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function fixConstructs() {
  try {
    // Get all users
    const users = await prisma.paUsers.findMany({
      include: {
        construction: true,
      },
    });

    console.log(`Found ${users.length} users`);

    // Process each user
    for (const user of users) {
      if (!user.construction) {
        console.log(`Creating PaConstruct for user ${user.nick} (ID: ${user.id})`);
        
        // Create new PaConstruct and link it to user
        await prisma.paUsers.update({
          where: { id: user.id },
          data: {
            construction: {
              create: {}, // Creates with default values
            },
          },
        });

        console.log(`Created PaConstruct for user ${user.nick}`);
      } else {
        console.log(`User ${user.nick} already has PaConstruct ID: ${user.construction.id}`);
      }
    }

    console.log('Finished processing all users');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixConstructs().catch(console.error);
