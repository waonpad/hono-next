import { postSchema } from "@/app/api/[[...route]]/_/posts/schemas";
import { userSchema } from "@/app/api/[[...route]]/_/users/shcemas";
import { type FakerFunction, generateMock } from "@anatine/zod-mock";
import type { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const generateUniqueRandomNumbers = (count: number, min: number, max: number) => {
  const uniqueNumbers = new Set<number>();

  while (uniqueNumbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
};

const processSeed = async () => {
  /**
   * ユーザーを作成
   */
  const githubIds = generateUniqueRandomNumbers(1000, 1, 100000000);

  const users = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 1000 }, (_, i) =>
      generateMock(userSchema.omit({ id: true }).merge(z.object({ githubId: z.literal(githubIds[i]) }))),
    ),
  });

  console.log("ユーザーのシーディングをしました");

  /**
   * 投稿を作成
   */
  await prisma.post.createMany({
    data: Array.from({ length: 10000 }, () =>
      generateMock(
        postSchema.omit({
          id: true,
        }),
        {
          stringMap: {
            authorId: () => users[Math.floor(Math.random() * users.length)].id,
          },
          mockeryMapper: (keyName: string, fakerInstance: Faker): FakerFunction | undefined => {
            const map = {
              title: fakerInstance.lorem.words,
              body: fakerInstance.lorem.paragraphs,
            };

            // @ts-ignore
            if (keyName in map) return map[keyName];

            return undefined;
          },
        },
      ),
    ),
  });

  console.log("投稿のシーディングをしました");
};

const main = async () => {
  try {
    await processSeed();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

main();
