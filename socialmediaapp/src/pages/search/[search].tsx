import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Navbar from "~/components/general/Navbar";
import SearchInput from "~/components/general/search/SearchInput";

function SearchPage() {
  const { data: sessionData } = useSession({ required: true });
  const [initialSearch, setInitialSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    setInitialSearch(router.query.search as string);
  }, [router.isReady, router.query.search]);

  return (
    <>
      {initialSearch === "" || sessionData?.user.userId === undefined ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-28 flex flex-col items-center">
          <Navbar loginUserId={sessionData?.user.userId}></Navbar>
          <div className="mt-10 flex w-5/6 flex-col items-center text-5xl">
            <SearchInput
              initialSearch={initialSearch}
              showInput={true}
              showWrongInput={true}
            ></SearchInput>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchPage;
