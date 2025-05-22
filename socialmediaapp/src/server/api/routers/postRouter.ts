import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userProcedure } from "./userRouter";

export const postRouter = createTRPCRouter({
  getRecentPosts: protectedProcedure
    .input(z.object({ wallId: z.string(), count: z.number() }))
    .query(({ ctx, input }) => {
      const posts = ctx.db.post.findMany({
        where: {
          wallId: input.wallId,
        },
        take: input.count,
        orderBy: {
          createdAt: "desc",
        },
      });
      return posts;
    }),
  createPost: userProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        wallId: z.string(),
        images: z.array(
          z.object({
            path: z.string(),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) => {
      const createPost = ctx.db.tag.create({
        data: {
          Post: {
            create: {
              title: input.title,
              content: input.content,
              userId: input.id,
              wallId: input.wallId,
              images: {
                createMany: {
                  data: input.images,
                },
              },
            },
          },
        },
      });
      return createPost;
    }),
  isUsers: userProcedure
    .input(
      z.object({
        tagId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isUsersPost = ctx.db.post.findUnique({
        select: {
          createdAt: true,
        },
        where: {
          tagId: input.tagId,
          userId: input.id,
        },
      });

      if (await isUsersPost) return isUsersPost;

      const isUsersComment = ctx.db.comment.findUnique({
        select: {
          createdAt: true,
        },
        where: {
          tagId: input.tagId,
          userId: input.id,
        },
      });

      return isUsersComment;
    }),
  getImages: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const images = ctx.db.image.findMany({
        select: {
          path: true,
        },
        where: {
          postId: input.postId,
        },
      });
      return images;
    }),
  getPostCount: publicProcedure
    .input(z.object({ wallId: z.string() }))
    .query(({ ctx, input }) => {
      const postCount = ctx.db.post.findMany({
        select: {
          id: true,
        },
        where: {
          wallId: input.wallId,
        },
      });
      return postCount;
    }),
});
