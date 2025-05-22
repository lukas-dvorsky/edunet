import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/userRouter";
import { postRouter } from "./routers/postRouter";
import { likeRouter } from "./routers/likeRouter";
import { commentRouter } from "./routers/commentRouter";
import { wallRouter } from "./routers/wallRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  like: likeRouter,
  comment: commentRouter,
  wall: wallRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
