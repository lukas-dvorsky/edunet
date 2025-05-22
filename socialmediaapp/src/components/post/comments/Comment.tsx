import { api } from "~/utils/api";
import CommentBox from "./CommentBox";
import OptionsButton from "../OptionsButton";
import { type Data } from "~/utils/types";

function Comment({ data, refetch }: Data) {
  const user = api.user.getAllUserData.useQuery({ id: data.userId }).data;

  return (
    <>
      <div className="ml-5 flex flex-col border-t py-2">
        <div className="mb-3 flex gap-4">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={`/images/${user?.profilePicture}`}
          />
          <div>
            <a href={`/user/${user?.id}`} className="text-lg font-semibold">
              {`${user?.fname} ${user?.lname}`}
            </a>
            <p>{data.message}</p>
          </div>
          <OptionsButton data={data} refetch={refetch}></OptionsButton>
        </div>
        <CommentBox data={data}></CommentBox>
      </div>
    </>
  );
}

export default Comment;
