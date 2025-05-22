import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { api } from "~/utils/api";

interface Props {
  userId: string;
  userData: User;
}

function BlockButton({ userId, userData }: Props) {
  const { data: sessionData } = useSession({ required: true });
  const reason = useRef<string>("");
  const ban = api.user.banUser.useMutation();
  const unban = api.user.unbanUser.useMutation();
  const isBanned = api.user.isBanned.useQuery({ id: userId });

  function handleBan() {
    if (isBanned.data) {
      if (
        confirm(`Odblokovat uzivatele ${userData.fname} ${userData.lname}?`)
      ) {
        unban.mutate({ id: userId});
      }
    } else {
      if (
        confirm(
          `Zablokovat uzivatele ${userData.fname} ${userData.lname} z duvodu ${reason.current}?`,
        )
      ) {
        ban.mutate({
          id: userId,
          adminId: sessionData?.user.userId!,
          reason: reason.current,
        });
      }
    }
  }

  return (
    <form onSubmit={() => handleBan()}>
      {!isBanned.data && (
        <textarea
          onChange={(e) => (reason.current = e.target.value)}
        ></textarea>
      )}
      <input
        type="submit"
        className="rounded-md bg-red-500 p-2 text-white"
        value={isBanned.data === null ? "Block" : "Unblock"}
      />
      {isBanned.data && (
        <div>
          <p>Duvod blokace: {isBanned.data?.reason}</p>
        </div>
      )}
    </form>
  );
}

export default BlockButton;
