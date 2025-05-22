import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import SearchInput from "./search/SearchInput";
import { Role } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";

interface Props {
  loginUserId: string;
}

function Navbar({ loginUserId }: Props) {
  const { data: sessionData } = useSession();

  const [showMenu, setShowMenu] = useState(false);

  const profilePicture = api.user.getProfilePicture.useQuery({
    id: loginUserId,
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setShowMenu(false);
    }

    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="h-25 fixed top-0 z-20 mb-2 w-full bg-sps_primary shadow-black md:shadow-xl">
      <div className="flex items-center justify-between p-4">
        {/* profil */}
        <Link className="z-50" href={`/user/${loginUserId}`}>
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={`/images/${profilePicture.data?.profilePicture}`}
          />
        </Link>

        <button
          className="text-4xl text-sps_background md:hidden"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <FiMenu />
        </button>
        <div className="relative hidden w-1/2 justify-center gap-8 text-2xl text-sps_background md:fixed md:flex md:w-full">
          {/* Icons */}
          <Link href="/" className="my-auto">
            Úvod
          </Link>
          <Link href={`/user/${loginUserId}`} className="my-auto">
            Profil
          </Link>
          <Link href={`/class`} className="my-auto">
            Trida
          </Link>
          <div className="">
            <SearchInput
              showInput={false}
              showWrongInput={false}
              styles="text-black my-auto text-lg"
            ></SearchInput>
          </div>
          {sessionData?.user.role === Role.Admin && (
            <Link href={`/admin/dashboard`} className="my-auto">
              Admin
            </Link>
          )}
          <button
            className="absolute right-0 z-50 mr-10 rounded-full bg-white/20 px-10 py-3 text-lg  text-white no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Odhlasit se" : "Sign in"}
          </button>
        </div>
      </div>
      {showMenu && (
        <div className="flex w-full flex-col text-3xl">
          <Link
            href="/"
            className="bg-sps_primary p-3  text-sps_background hover:bg-sps_background hover:text-sps_text active:bg-sps_background active:text-sps_text"
          >
            Úvod
          </Link>
          <Link
            href={`/user/${loginUserId}`}
            className="bg-sps_primary p-3  text-sps_background hover:bg-sps_background hover:text-sps_text active:bg-sps_background active:text-sps_text"
          >
            Profil
          </Link>
          <Link href={`/class`} className="my-auto">
            Trida
          </Link>
          <div className="m-auto my-3 w-5/6">
            <SearchInput
              styles={"text-lg"}
              showInput={false}
              showWrongInput={false}
            ></SearchInput>
          </div>
          {sessionData?.user.role === Role.Admin && (
            <Link
              href="/admin/dashboard"
              className="bg-sps_primary p-3  text-sps_background hover:bg-sps_background hover:text-sps_text active:bg-sps_background active:text-sps_text"
            >
              Admin
            </Link>
          )}
          <button
            className="rounded-full px-10 py-3 text-lg text-white  no-underline transition"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Odhlasit se" : "Sign in"}
          </button>
          <div className="h-2 w-full bg-sps_primary shadow-xl shadow-black"></div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
