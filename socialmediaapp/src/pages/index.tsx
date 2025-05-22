import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect } from "react";

import { api } from "~/utils/api";
import CreateForm from "~/components/general/CreateForm";
import PswdPopup from "~/components/general/PswdPopup";
import Navbar from "~/components/general/Navbar";
import Wall from "~/components/post/Wall";

export default function Home() {
  const GROUP_NAME_FOR_MAIN_PAGE = "OFFICIAL";

  const { data: sessionData } = useSession({ required: true });

  const shouldChangePswd = api.user.getChangePassword.useQuery({
    id: sessionData?.user.userId ? sessionData?.user.userId : "",
  }).data?.changePassword;

  const wallId = api.wall.getWallId.useQuery({
    groupName: GROUP_NAME_FOR_MAIN_PAGE,
  });
  const createOfficialWall = api.wall.createWall.useMutation();

  //pokud neexistuje zed s nazvem OFFICIAL, vytvori se
  if (wallId.isFetched && !wallId.data?.wallId && createOfficialWall.isIdle) {
    console.log("creating new group");
    createOfficialWall.mutate({
      groupName: GROUP_NAME_FOR_MAIN_PAGE,
    });
  }

  useEffect(() => {
    if (createOfficialWall.isSuccess) {
      console.log("create successful, refetching wall");
      void wallId.refetch().then();
    }
  }, [createOfficialWall.isSuccess, wallId]);

  return (
    <>
      {!sessionData?.user.userId ? (
        <></>
      ) : (
        <>
          <Head>
            <title>SPŠaOA social</title>
            <meta name="description" content="Školní sociální síť" />
            <link rel="icon" href="/logo.png" />
          </Head>
          <div className="mt-28 bg-sps_background text-sps_text">
            {shouldChangePswd! && <PswdPopup />}
            <main className=" flex flex-col items-center">
              <Navbar loginUserId={sessionData?.user.userId} />
              <Wall groupName={GROUP_NAME_FOR_MAIN_PAGE}></Wall>
              <div className="flex flex-col items-center gap-2">
                {/* <CreateForm /> */}
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
}
