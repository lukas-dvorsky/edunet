import { useSession } from "next-auth/react";
import React from "react";
import Navbar from "~/components/general/Navbar";
import Wall from "~/components/post/Wall";
import { api } from "~/utils/api";

function ClassId() {
  const { data: sessionData } = useSession({ required: true });
  const startYear = api.user.getUsersClass.useQuery({
    id: sessionData?.user.userId as string,
  });

  //check intruder

  return (
    <div className="mt-28">
      {sessionData?.user.userId === undefined ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="my-5 text-4xl font-semibold">
            {startYear.data?.group} {startYear.data?.specialization}
          </h1>
          {/* if null, zamestnanci */}
          <Navbar loginUserId={sessionData?.user.userId}></Navbar>
          <Wall
            groupName={`${startYear.data?.group}${startYear.data?.specialization}`}
          ></Wall>
        </div>
      )}
    </div>
  );
}
export default ClassId;
