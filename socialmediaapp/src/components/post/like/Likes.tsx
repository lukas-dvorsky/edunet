import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import type { Data } from "~/utils/types";

function Likes({ data }: Data) {
  const { data: sessionData } = useSession();
  const createLike = api.like.createLike.useMutation();
  const deleteLike = api.like.deleteLike.useMutation();
  /* if (sessionData?.user.userId === undefined) return null; */

  const isLiked = api.like.isLiked.useQuery({
    id: sessionData?.user.userId ?? "1",
    tag: data.tagId,
  });

  const likeCount = api.like.getLikeCount.useQuery({
    tag: data.tagId,
  });

  useEffect(() => {
    const fetchData = () => {
      void likeCount.refetch().then();
      void isLiked.refetch().then();
    };

    fetchData();
  }, [createLike.isSuccess, deleteLike.isSuccess]);

  function changeLike() {
    if (sessionData?.user.userId) {
      try {
        if (isLiked.data?.userId) {
          deleteLike.mutate({
            id: sessionData.user.userId,
            tag: data.tagId,
          });
        } else {
          createLike.mutate({
            id: sessionData.user.userId,
            tag: data.tagId,
          });
        }
      } catch (error) {
        console.error("Error mutating data:", error);
      }
    }
  }

  return (
    <button
      onClick={changeLike}
      className={`${
        isLiked.data?.userId ? "text-blue-600" : ""
      } flex items-center gap-2`}
    >
      {likeCount.data?._count.like}
      {isLiked.data?.userId ? <BiSolidLike /> : <BiLike />}
    </button>
  );
}

export default Likes;
