
```
socialmediaapp
├─ .eslintrc.cjs
├─ .gitignore
├─ netlify.toml
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.cjs
├─ prettier.config.mjs
├─ prisma
│  └─ schema.prisma
├─ public
│  ├─ images
│  │  ├─ 1705260142964_HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face.jpg
│  │  ├─ 1705260255526_Screenshot_20240114_202330_Gallery.jpg
│  │  ├─ 1705307160223_The_Two_Faces_of_Squidward_174-ezgif.com-webp-to-jpg-converter.jpg
│  │  ├─ 1705476311660_d48c2de0debd3bef102256f979862bbd.jpg
│  │  ├─ 1705476311669_friends-cast-2-db7f3ff83cf946a0be8c88417c081607.jpg
│  │  ├─ 1705476311677_sisters-6053044_640.jpg
│  │  └─ defaultuser.png
│  ├─ logo.png
│  └─ profile_pics
├─ src
│  ├─ components
│  │  ├─ general
│  │  │  ├─ BlockButton.tsx
│  │  │  ├─ CreateForm.tsx
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ PswdPopup.tsx
│  │  │  └─ search
│  │  │     ├─ SearchInput.tsx
│  │  │     └─ SearchResults.tsx
│  │  ├─ post
│  │  │  ├─ comments
│  │  │  │  ├─ Comment.tsx
│  │  │  │  ├─ CommentBox.tsx
│  │  │  │  └─ CreateComment.tsx
│  │  │  ├─ CreatePost.tsx
│  │  │  ├─ image
│  │  │  │  ├─ Image.tsx
│  │  │  │  ├─ ImageBox.tsx
│  │  │  │  └─ UploadImage.tsx
│  │  │  ├─ like
│  │  │  │  └─ Likes.tsx
│  │  │  ├─ OptionsButton.tsx
│  │  │  ├─ Post.tsx
│  │  │  └─ Wall.tsx
│  │  └─ userProfile
│  │     ├─ About.tsx
│  │     └─ FollowButton.tsx
│  ├─ env.mjs
│  ├─ pages
│  │  ├─ admin
│  │  │  ├─ dashboard.tsx
│  │  │  └─ [editUser].tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ [...nextauth].ts
│  │  │  ├─ image.ts
│  │  │  └─ trpc
│  │  │     └─ [trpc].ts
│  │  ├─ auth
│  │  │  ├─ ChangePassword.tsx
│  │  │  └─ login.tsx
│  │  ├─ class.tsx
│  │  ├─ index.tsx
│  │  ├─ search
│  │  │  └─ [search].tsx
│  │  ├─ types
│  │  │  └─ next-auth.d.ts
│  │  ├─ user
│  │  │  └─ [userId].tsx
│  │  └─ _app.tsx
│  ├─ server
│  │  ├─ api
│  │  │  ├─ root.ts
│  │  │  ├─ routers
│  │  │  │  ├─ commentRouter.ts
│  │  │  │  ├─ likeRouter.ts
│  │  │  │  ├─ postRouter.ts
│  │  │  │  ├─ userRouter.ts
│  │  │  │  └─ wallRouter.ts
│  │  │  └─ trpc.ts
│  │  ├─ auth.ts
│  │  ├─ common
│  │  │  └─ get-server-auth-session.ts
│  │  └─ db.ts
│  ├─ styles
│  │  └─ globals.css
│  └─ utils
│     ├─ api.ts
│     ├─ jwtHelper.ts
│     └─ types.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ vercel.json

```