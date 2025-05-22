import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const wallRouter = createTRPCRouter({
  getWallId: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        groupName: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.userId) {
        const getWallIdWithUserInput = ctx.db.user.findUnique({
          select: {
            wallId: true,
          },
          where: {
            id: input.userId,
          },
        });
        if ((await getWallIdWithUserInput) === undefined) return;

        return await getWallIdWithUserInput;
      }
      if (input.groupName) {
        const getWallIdWithGroupName = ctx.db.group.findUnique({
          select: {
            wallId: true,
          },
          where: {
            groupName: input.groupName,
          },
        });

        if ((await getWallIdWithGroupName) === undefined) return;

        return await getWallIdWithGroupName;
      }
    }),
  createWall: protectedProcedure
    .input(
      z.object({
        groupName: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const images = ctx.db.wall.create({
        data: {
          Group: {
            create: {
              groupName: input.groupName,
            },
          },
        },
      });
      return images;
    }),
  isUsersWall: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        wallId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const images = ctx.db.user.findFirst({
        where: {
          id: input.userId,
          wallId: input.wallId,
        },
      });
      return images;
    }),
});
