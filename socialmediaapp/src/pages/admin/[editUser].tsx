import { Role, Specialization, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import BlockButton from "~/components/general/BlockButton";
import Navbar from "~/components/general/Navbar";
import { api } from "~/utils/api";

function EditUser() {
  const { data: sessionData } = useSession({ required: true });
  const router = useRouter();
  const userId = router.query.editUser;
  const updateData = api.user.updateUser.useMutation();
  const updateProfilePicture = api.user.updateProfilePicture.useMutation();
  const updatePassword = api.user.updatePassword.useMutation();

  const user = api.user.getAllUserData.useQuery({
    id: userId as string,
  });

  const date = new Date();

  const userData = useRef<User>({
    id: "",
    fname: "",
    lname: "",
    createdAt: date,
    updatedAt: date,
    email: "",
    changePassword: false,
    password: "",
    role: Role.Student,
    profilePicture: "",
    specialization: Specialization.AUTOELEKTROTECHNIKA,
    group: "",
    wallId: "",
  });

  if (user.status === "success") {
    if (user.data !== null) {
      userData.current = user.data;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (userData.current.specialization === null) return;
    if (confirm("Provest upravy?")) {
      updateData.mutate({
        id: userId as string,
        fname: userData.current.fname,
        lname: userData.current.lname,
        email: userData.current.email,
        role: userData.current.role,
        specialization: userData.current.specialization,
      });
    }
  }

  function resetPassword() {}

  function resetProfilePicture() {
    if (
      confirm(
        `Resetovat profilovy obrazek uzivatele ${userData.current.fname} ${userData.current.lname}`,
      )
    ) {
      updateProfilePicture.mutate({
        id: userId as string,
        path: "defaultuser.png",
      });
    }
  }

  return (
    <>
      {sessionData?.user.role !== Role.Admin ||
      sessionData.user.userId === undefined ? (
        <div>Unauthorized</div>
      ) : user.status === "loading" &&
        Object.keys(userData.current).length === 0 ? (
        <div>loading...</div>
      ) : (
        <div className="mt-28">
          <Navbar loginUserId={sessionData?.user.userId}></Navbar>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="m-auto flex w-full flex-col"
          >
            <label htmlFor="idInput">
              ID:
              <input
                id="idInput"
                required
                type="text"
                defaultValue={userData.current.id}
                readOnly
              />
            </label>
            <label htmlFor="wallIdInput">
              Wall:
              <input
                id="wallIdInput"
                required
                type="text"
                defaultValue={userData.current.wallId}
                readOnly
              />
            </label>
            <input
              required
              type="text"
              placeholder="jmeno"
              defaultValue={userData.current.fname}
              onChange={(e) => {
                userData.current.fname = e.target.value;
              }}
            />
            <input
              required
              type="text"
              placeholder="prijmeni"
              defaultValue={userData.current.lname}
              onChange={(e) => {
                userData.current.lname = e.target.value;
              }}
            />
            <input
              required
              type="text"
              placeholder="email"
              defaultValue={userData.current.email}
              onChange={(e) => {
                userData.current.email = e.target.value;
              }}
            />
            <select
              className="w-1/5"
              value={userData.current.role}
              onChange={(e) => {
                userData.current.role = e.target.value as keyof typeof Role;
              }}
            >
              {(Object.keys(Role) as (keyof typeof Role)[]).map((role, key) => {
                return (
                  <option value={role} key={key}>
                    {role}
                  </option>
                );
              })}
            </select>
            <select
              className="w-1/5"
              value={
                userData.current.specialization as keyof typeof Specialization
              }
              onChange={(e) => {
                userData.current.specialization = e.target
                  .value as keyof typeof Specialization;
              }}
            >
              {(
                Object.keys(Specialization) as (keyof typeof Specialization)[]
              ).map((spec, key) => {
                return (
                  <option value={spec} key={key}>
                    {spec}
                  </option>
                );
              })}
            </select>

            <input
              className="w-1/6 rounded-md bg-blue-500 p-2 text-white"
              type="submit"
              value="Upravit"
            />
          </form>
          <button className="rounded-md bg-red-500 p-2 text-white">
            Reset Password
          </button>
          <button
            className="rounded-md bg-red-500 p-2 text-white"
            onDoubleClick={() => resetProfilePicture()}
          >
            Reset Profile Picture
          </button>
          <BlockButton
            userId={userId as string}
            userData={userData.current}
          ></BlockButton>
        </div>
      )}
    </>
  );
}

export default EditUser;
