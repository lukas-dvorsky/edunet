import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userProcedure } from "./userRouter";
import path from "path";
import fs, { type PathLike } from "fs";

export const commentRouter = createTRPCRouter({
  getComments: protectedProcedure
    .input(z.object({ parentTag: z.string(), count: z.number() }))
    .query(({ ctx, input }) => {
      const comments = ctx.db.comment.findMany({
        where: {
          parentTag: input.parentTag,
        },
        take: input.count,
      });
      return comments;
    }),
  getCommentCount: publicProcedure
    .input(z.object({ tag: z.string() }))
    .query(({ ctx, input }) => {
      const commentCount = ctx.db.comment.findMany({
        select: {
          id: true,
        },
        where: {
          parentTag: input.tag,
        },
      });
      return commentCount;
    }),
  createComment: userProcedure
    .input(
      z.object({
        parentTag: z.string(),
        message: z.string(),
        nestIndex: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const createComment = ctx.db.tag.create({
        data: {
          Comment: {
            create: {
              message: input.message,
              userId: input.id,
              parentTag: input.parentTag,
              nestIndex: input.nestIndex,
            },
          },
        },
      });
      return createComment;
    }),
  isUsers: userProcedure
    .input(
      z.object({
        tagId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const isUsers = ctx.db.comment.findUnique({
        select: {
          createdAt: true,
        },
        where: {
          tagId: input.tagId,
          userId: input.id,
        },
      });
      return isUsers;
    }),
  deleteByTag: protectedProcedure
    .input(z.object({ tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let forDelete: string[] = [];
      let loopSwitch = true;
      const countFromZero = true;
      let position = 0;

      const parentObj = ctx.db.tag.findFirst({
        where: {
          id: input.tag,
        },
      });

      const parent = await parentObj;
      if (!parent) return;
      forDelete.push(parent?.id);

      while (loopSwitch) {
        let newComments: string[] = [];

        if (!countFromZero) {
          position = forDelete.length - 1;
        }

        for (position; position < forDelete.length; position++) {
          const current = forDelete[position];
          const fetchedComments = ctx.db.comment.findMany({
            select: {
              tagId: true,
            },
            where: {
              parentTag: current,
            },
          });
          if ((await fetchedComments).length != 0) {
            (await fetchedComments).forEach((comment) => {
              newComments.push(comment.tagId);
            });
          }
        }
        if (newComments.length == 0) {
          loopSwitch = false;
        }
        forDelete = forDelete.concat(newComments);
        newComments = [];
      }

      //Zda je to prispevek, najde si vsechny jeho obrazky a smaze je, jak z databaze, tak ze slozky
      const isPost = ctx.db.post.findUnique({
        select: {
          id: true,
        },
        where: {
          tagId: input.tag,
        },
      });

      if ((await isPost) !== null) {
        //ulozit do promenne, jinak neni pristup k id
        const data = await isPost;
        const getImages = ctx.db.post.findMany({
          select: {
            images: true,
          },
          where: {
            id: data?.id,
          },
        });
        const images = await getImages;
        const array = images[0]?.images;
        array?.forEach((image) => {
          const filePath: PathLike = path.join(
            process.cwd(),
            `/public/images/${image.path}`,
          );
          fs.unlinkSync(filePath);
        });
      }

      const deleteComments = ctx.db.tag.deleteMany({
        where: {
          id: {
            in: forDelete,
          },
        },
      });

      return deleteComments;
    }),
});
