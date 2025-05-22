import { Role, Specialization } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userProcedure = protectedProcedure.input(
  z.object({ id: z.string() }),
);

export const userRouter = createTRPCRouter({
  getUser: userProcedure.query(({ ctx, input }) => {
    const user = ctx.db.user.findUnique({
      select: {
        fname: true,
        lname: true,
      },
      where: {
        id: input.id,
      },
    });
    return user;
  }),
  getAllUserData: userProcedure.query(({ ctx, input }) => {
    const user = ctx.db.user.findUnique({
      /*       select: {
        fname: true,
        lname: true,
        email: true,
        role: true,
        group: true,
        posts: true,
      }, */
      where: {
        id: input.id,
      },
    });
    return user;
  }),
  getChangePassword: userProcedure.query(({ ctx, input }) => {
    const changePassword = ctx.db.user.findUnique({
      select: {
        changePassword: true,
      },
      where: {
        id: input.id,
      },
    });
    return changePassword;
  }),
  getUsersClass: userProcedure.query(({ ctx, input }) => {
    const getUsersClass = ctx.db.user.findFirst({
      select: {
        group: true,
        specialization: true,
      },
      where: {
        id: input.id,
      },
    });
    return getUsersClass;
  }),

  getProfilePicture: userProcedure.query(({ ctx, input }) => {
    const profilePicture = ctx.db.user.findUnique({
      select: {
        profilePicture: true,
      },
      where: {
        id: input.id,
      },
    });
    return profilePicture;
  }),
  updateProfilePicture: userProcedure
    .input(z.object({ path: z.string() }))
    .mutation(({ ctx, input }) => {
      const update = ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          profilePicture: input.path,
        },
      });
      return update;
    }),
  updatePassword: userProcedure
    .input(z.object({ password: z.string().min(6) }))
    .mutation(({ ctx, input }) => {
      const update = ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          password: input.password,
          changePassword: false,
        },
      });
      return update;
    }),
  updateUser: userProcedure
    .input(
      z.object({
        fname: z.string(),
        lname: z.string(),
        email: z.string(),
        role: z.nativeEnum(Role),
        specialization: z.nativeEnum(Specialization),
      }),
    )
    .mutation(({ ctx, input }) => {
      const update = ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          lname: input.lname,
          fname: input.fname,
          email: input.email,
          role: input.role,
          specialization: input.specialization,
        },
      });
      return update;
    }),
  isBanned: userProcedure.query(({ ctx, input }) => {
    const isBanned = ctx.db.bannedUsers.findUnique({
      where: {
        userId: input.id,
      },
    });
    return isBanned;
  }),
  banUser: userProcedure
    .input(
      z.object({
        adminId: z.string(),
        reason: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const ban = ctx.db.bannedUsers.create({
        data: {
          userId: input.id,
          bannedBy: input.adminId,
          reason: input.reason,
        },
      });
      return ban;
    }),
  unbanUser: userProcedure.mutation(({ ctx, input }) => {
    const unban = ctx.db.bannedUsers.delete({
      where: {
        userId: input.id,
      },
    });
    return unban;
  }),
  createUser: publicProcedure
    .input(
      z.object({
        fname: z.string(),
        lname: z.string(),
        email: z.string().email(),
        password: z.string(),
        specialization: z.nativeEnum(Specialization),
        group: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.wall.create({
        data: {
          User: {
            create: {
              fname: input.fname,
              lname: input.lname,
              email: input.email,
              password: input.password,
              specialization: input.specialization,
              group: input.group,
            },
          },
        },
      });
    }),
  isFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        followedById: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isFollowing = ctx.db.followers.findFirst({
        where: {
          userId: input.userId,
          followedById: input.followedById,
        },
      });

      if (await isFollowing) return true;

      return false;
    }),
  followUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        followedById: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const follow = ctx.db.followers.create({
        data: {
          userId: input.userId,
          followedById: input.followedById,
        },
      });
      return follow;
    }),
  unfollowUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        followedById: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const unfollow = ctx.db.followers.delete({
        where: {
          userId: input.userId,
          followedById: input.followedById,
        },
      });
      return unfollow;
    }),
  searchUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    if (input !== "") {
      const searchResult = ctx.db.user.findMany({
        select: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          profilePicture: true,
        },
        where: {
          OR: [
            {
              fname: {
                contains: input,
              },
            },
            {
              lname: {
                contains: input,
              },
            },
            {
              email: {
                contains: input,
              },
            },
          ],
        },
      });
      return searchResult;
    }
  }),
});

/*   getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.example.findMany();
  }), */

/* getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }), 
}); */
