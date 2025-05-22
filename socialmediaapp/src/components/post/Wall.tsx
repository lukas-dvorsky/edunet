import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Post from "./Post";
import CreatePost from "./CreatePost";

const PAGES_TO_LOAD = 10;

interface WallProps {
  userId?: string;
  groupName?: string;
}

function Wall({ userId, groupName }: WallProps) {
  //Program rozhodne podle ceho bude vytvaret query
  let query: WallProps;
  userId ? (query = { userId: userId }) : (query = { groupName: groupName });

  //pocet nactenych postu
  const [postCount, setPostCount] = useState(PAGES_TO_LOAD);

  //setState pro rerender komponentu
  const [value, setValue] = useState(false);

  //Vytovri se query
  const wallId = api.wall.getWallId.useQuery(query);

  //fetch posts
  const posts = api.post.getRecentPosts.useQuery({
    wallId: wallId.data?.wallId ?? "1",
    count: postCount,
  });

  const wallPostCount = api.post.getPostCount.useQuery({
    wallId: wallId.data?.wallId ?? "1",
  });

  useEffect(() => {
    const fetchData = () => {
      void posts.refetch().then();
    };
    fetchData();
  }, [value]);

  function handleLoadMorePosts() {
    setPostCount((prev) => prev + PAGES_TO_LOAD);
  }

  return (
    <>
      {!posts.isFetched && !wallId.isFetched ? (
        <div>Loading...</div>
      ) : (
        <div className="flex w-full flex-col items-center gap-10 md:w-1/2 lg:w-1/3">
          {wallId.data && (
            <CreatePost
              wallId={wallId.data?.wallId}
              refetch={setValue}
            ></CreatePost>
          )}
          {posts.data?.map((post, key) => {
            return <Post key={key} data={post} refetch={setValue}></Post>;
          })}
          {wallPostCount.data?.length !== undefined &&
            wallPostCount.data?.length > postCount && (
              <button onClick={() => handleLoadMorePosts()}>
                Load More Posts
              </button>
            )}
        </div>
      )}
    </>
  );
}

export default Wall;
