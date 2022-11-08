import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      googleId: process.env.GOOGLE_ACCESS_TOKEN,
      avatarUrl: 'https://github.com/bonizario.png',
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: 'Example Poll',
      code: 'ABC123',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  const date = new Date();
  date.setDate(date.getDate() + 1);
  await prisma.game.create({
    data: {
      date: date.toISOString(),
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    },
  });

  date.setDate(date.getDate() + 1);
  await prisma.game.create({
    data: {
      date: date.toISOString(),
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: poll.id,
              },
            },
          },
        },
      },
    },
  });
}

main().catch(console.error);
