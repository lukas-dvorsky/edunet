import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

interface Props {
  userId: string;
  followedById: string;
}

function FollowButton({ userId, followedById }: Props) {
  const follow = api.user.followUser.useMutation();
  const unfollow = api.user.unfollowUser.useMutation();
  const { data: isFollowing, refetch: isFollowingRefetch } =
    api.user.isFollowing.useQuery({
      userId: userId,
      followedById: followedById,
    });
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      void isFollowingRefetch()
        .then(() => {
          console.log("waht");
          setDisableButton(false);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchData();
  }, [follow.isSuccess, unfollow.isSuccess, isFollowingRefetch]);

  function handleFollow() {
    //nelze sledovat sam sebe
    if (userId === followedById) {
      console.log("cannot follow yourself");
      return;
    }

    setDisableButton(true);

    if (isFollowing) {
      unfollow.mutate({
        userId: userId,
        followedById: followedById,
      });
    } else {
      follow.mutate({
        userId: userId,
        followedById: followedById,
      });
    }
  }

  return (
    <div>
      {userId !== followedById && (
        <button
          className={`${
            disableButton ? "bg-blue-200" : "bg-blue-400"
          } p-2 text-white`}
          onClick={() => handleFollow()}
          disabled={disableButton}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}

export default FollowButton;
