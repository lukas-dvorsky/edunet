import { signOut, useSession } from "next-auth/react";
import React, { type FormEvent, useRef } from "react";
import bcrypt from "bcryptjs";

import { api } from "~/utils/api";

function ChangePassword() {
  const { data: sessionData } = useSession({ required: true });
  const maxPswdLength = 6;

  const newPswd = useRef<HTMLInputElement>(null);
  const confirmPswd = useRef<HTMLInputElement>(null);

  const mutation = api.user.updatePassword.useMutation();
  const shouldChangePswd = api.user.getChangePassword.useQuery({
    id: sessionData?.user.userId ? sessionData?.user.userId : "",
  }).data?.changePassword;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!sessionData?.user.userId) return;

    if (newPswd.current?.value !== confirmPswd.current?.value) {
      window.alert("Hesla se neshoduji");
      return;
    }

    if (
      newPswd.current?.value.length !== undefined &&
      newPswd.current?.value.length < maxPswdLength
    ) {
      window.alert(`Heslo musi mit delku minimalne ${maxPswdLength} znaku`);
      return;
    } else {
      if (newPswd.current?.value === undefined) return;
      mutation.mutate({
        id: sessionData?.user.userId,
        password: bcrypt.hashSync(newPswd.current?.value, 10),
      });
      void signOut().then();
    }
  }

  return (
    <div>
      {shouldChangePswd ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="password" placeholder="Nové heslo" ref={newPswd} />
          <input type="password" placeholder="Heslo znovu" ref={confirmPswd} />
          <button type="submit">Zmenit heslo</button>
        </form>
      ) : (
        <div>Heslo nelze zmenit. Kontaktujte spravce.</div>
      )}
    </div>
  );
}

export default ChangePassword;
