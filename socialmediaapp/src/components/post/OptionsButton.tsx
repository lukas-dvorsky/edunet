import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { SlOptionsVertical } from "react-icons/sl";
import { type Data } from "~/utils/types";
import toast, { Toaster } from "react-hot-toast";
import { Role } from "@prisma/client";

function OptionsButton({ data, refetch }: Data) {
  const deleteByTag = api.comment.deleteByTag.useMutation();

  useEffect(() => {
    if (deleteByTag.isSuccess) {
      refetch!((prev: boolean) => !prev);
      toast.success("Smazání proběhlo úspěšně.");
    }
  }, [deleteByTag.isSuccess, refetch]);

  const [showOptions, setShowOptions] = useState(false);
  const { data: sessionData } = useSession();
  if (!sessionData?.user.userId) return;

  const isUsers = api.post.isUsers.useQuery({
    id: sessionData?.user.userId,
    tagId: data.tagId,
  });

  const isUsersWall = api.wall.isUsersWall.useQuery({
    userId: sessionData?.user.userId,
    wallId: data.wallId!,
  });

  function handleDelete() {
    if (window.confirm("Jsi si jist?")) {
      deleteByTag.mutate({
        tag: data.tagId,
      });
    }
  }
  return (
    <>
      {(isUsers?.data ??
        isUsersWall?.data ??
        sessionData.user.role === Role.Admin) && (
        <div
          className="relative ml-auto"
          onPointerLeave={() => setShowOptions(false)}
        >
          <button onClick={() => setShowOptions((prev) => !prev)}>
            <SlOptionsVertical></SlOptionsVertical>
          </button>
          {showOptions && (
            <ul className="absolute right-1 top-1 rounded-sm border bg-sps_background">
              <li
                className="px-3 py-1 text-red-600 hover:cursor-pointer border border-gray-400"
                onClick={() => handleDelete()}
                onTouchEnd={() => handleDelete()}
              >
                Odstranit
              </li>
            </ul>
          )}
          <Toaster></Toaster>
        </div>
      )}
    </>
  );
}

export default OptionsButton;
