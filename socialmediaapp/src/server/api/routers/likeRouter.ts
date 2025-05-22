import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { userProcedure } from "./userRouter";

export const likeRouter = createTRPCRouter({
  getLikeCount: publicProcedure
    .input(z.object({ tag: z.string() }))
    .query(({ ctx, input }) => {
      const likeCount = ctx.db.tag.findFirst({
        where: {
          id: input.tag,
        },
        select: {
          _count: {
            select: { like: true },
          },
        },
      });
      return likeCount;
    }),
  isLiked: userProcedure
    .input(z.object({ tag: z.string() }))
    .query(({ ctx, input }) => {
      const liked = ctx.db.like.findFirst({
        select: {
          userId: true,
        },
        where: {
          userId: input.id,
          tagId: input.tag,
        },
      });
      return liked;
    }),
  createLike: userProcedure
    .input(z.object({ tag: z.string() }))
    .mutation(({ ctx, input }) => {
      const createLike = ctx.db.like.create({
        data: {
          userId: input.id,
          tagId: input.tag,
        },
      });
      return createLike;
    }),
  deleteLike: userProcedure
    .input(z.object({ tag: z.string() }))
    .mutation(({ ctx, input }) => {
      const deteleLike = ctx.db.like.deleteMany({
        where: {
          tagId: input.tag,
          userId: input.id,
        },
      });
      return deteleLike;
    }),
});
