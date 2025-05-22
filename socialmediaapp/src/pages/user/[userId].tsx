import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Navbar from "~/components/general/Navbar";
import Wall from "~/components/post/Wall";
import About from "~/components/userProfile/About";

function Profile() {
  const { data: sessionData } = useSession({ required: true });
  const router = useRouter();
  const userId = router.query.userId;
  const user = api.user.getAllUserData.useQuery({
    id: userId as string,
  });

  return (
    <>
      {user.isFetched && (
        <>
          {!user.data || !sessionData?.user.userId ? (
            <div>User doesnt exist</div>
          ) : (
            <div className="mt-32 flex flex-col items-center">
              <Navbar loginUserId={sessionData?.user.userId}></Navbar>
              <About
                userData={user.data}
                loginUserId={sessionData?.user.userId}
              ></About>
              <Wall userId={userId as string}></Wall>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Profile;
