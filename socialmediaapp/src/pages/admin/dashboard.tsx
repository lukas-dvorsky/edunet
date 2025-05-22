import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import CreateForm from "~/components/general/CreateForm";
import Navbar from "~/components/general/Navbar";
import SearchInput from "~/components/general/search/SearchInput";

function AdminDashboard() {
  const { data: sessionData } = useSession({ required: true });

  function checkClasses() {
    const currentDate = new Date();
    console.log(currentDate);
  }

  return (
    // Add user DONE
    // Change User (Change Group, ) DONE
    // Vytvorit novou tridu
    // Reset Icon DONE
    // Block Account DONE
    //
    //
    <>
      {sessionData?.user.role !== Role.Admin ||
      sessionData.user.userId === undefined ? (
        <div>Unauthorized</div>
      ) : (
        <div className="mt-28">
          <Navbar loginUserId={sessionData.user.userId}></Navbar>
          <CreateForm></CreateForm>
          <SearchInput
            returnData={true}
            showInput={true}
            showWrongInput={true}
            styles="text-black my-auto text-lg mt-5"
          ></SearchInput>
          <button onClick={() => checkClasses()} className="boder-black p-2">
            Zkontrolovat a vytvorit tridy
          </button>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
