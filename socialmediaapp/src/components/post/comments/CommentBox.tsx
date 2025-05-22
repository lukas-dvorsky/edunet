import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import Likes from "../like/Likes";
import { type Data } from "~/utils/types";

function CommentBox({ data }: Data) {
  const [showWriteComment, setShowWriteComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loadedCommentsCount, setLoadedCommentsCount] = useState(3);

  const comments = api.comment.getComments.useQuery({
    parentTag: data.tagId,
    count: loadedCommentsCount,
  });

  const childrenCount = api.comment.getCommentCount.useQuery({
    tag: data.tagId,
  });

  const [value, setValue] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      void comments.refetch().then();
      void childrenCount.refetch().then();
    };

    fetchData();
  }, [value]);

  return (
    <div>
      <div className="flex justify-around py-2">
        <Likes data={data}></Likes>
        {data.nestIndex !== 5 && (
          <>
            <button
              onClick={() => setShowWriteComment((prev: boolean) => !prev)}
            >
              Odpovědět
            </button>
            <button
              className="disabled:text-gray-500"
              onClick={() => setShowComments((prev: boolean) => !prev)}
              disabled={childrenCount.data?.length == 0 ? true : false}
            >
              {showComments ? "Schovat" : "Zobrazit"} odpovědi (
              {childrenCount.data?.length})
            </button>
          </>
        )}
      </div>

      {showWriteComment && (
        <CreateComment
          data={data}
          refetch={setValue}
          setShowComments={setShowComments}
        ></CreateComment>
      )}

      {showComments && (
        <div>
          {!comments.isFetched ? (
            <div> Loading...</div>
          ) : (
            comments.data?.map((comment, key) => {
              return (
                <Comment key={key} data={comment} refetch={setValue}></Comment>
              );
            })
          )}

          {childrenCount?.data?.length !== undefined &&
            childrenCount.data.length > loadedCommentsCount && (
              <button
                className="m-auto w-full"
                onClick={() => setLoadedCommentsCount((prev) => prev + 3)}
              >
                Load More
              </button>
            )}
        </div>
      )}
    </div>
  );
}

export default CommentBox;
