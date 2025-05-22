import { api } from "~/utils/api";
import CommentBox from "./comments/CommentBox";
import OptionsButton from "./OptionsButton";
import { type Data } from "~/utils/types";
import ImageBox from "./image/ImageBox";
import { useState } from "react";
import Link from "next/link";

function Post({ data, refetch }: Data) {
  const user = api.user.getAllUserData.useQuery({ id: data.userId });
  const date = data.createdAt.toLocaleString();
  const [useClamp, setUseClamp] = useState(true);

  return (
    <>
      {!user.isFetched ? (
        <div>Loading...</div>
      ) : (
        <div className="flex w-full flex-col border border-gray-400 rounded-lg bg-sps_background p-2 pb-0 md:w-1/3 md:rounded-b-xl lg:w-full mb-10">
          <div className="mb-3 flex items-center gap-4">
            <img className="w-12 h-12 object-cover rounded-full" src={`/images/${user.data?.profilePicture}`} alt="" />
            <div>
              <Link
                href={`/user/${data.userId}`}
                className="text-lg font-semibold"
              >{`${user.data?.fname} ${user.data?.lname}`}</Link>
              <p className="text-md italic text-gray-500">{date}</p>
            </div>
            <OptionsButton data={data} refetch={refetch}></OptionsButton>
          </div>
          <p className="mb-2 px-2 text-3xl font-bold">{data.title}</p>
          <p
            onClick={() => setUseClamp(false)}
            className={`${
              useClamp ? "line-clamp-4 hover:cursor-pointer" : "line-clamp-none"
            } break-words p-2 text-xl`}
          >
            {data.content}
          </p>
          {/* FIX LONG TEXT */}
          <ImageBox data={data}></ImageBox>
          <CommentBox data={data}></CommentBox>
        </div>
      )}
    </>
  );
}
export default Post;
