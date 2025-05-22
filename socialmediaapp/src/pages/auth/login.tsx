"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import type { FormEvent } from "react";
import CreateForm from "~/components/general/CreateForm";

function LoginPage() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();

      const res = await signIn("login", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <input
          type="text"
          value={data.email}
          placeholder="prijmeni.jmeno@st.spsoa.cz"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          type="password"
          value={data.password}
          placeholder="*****"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Prihlasit se</button>
      </form>
      {/* {<CreateForm></CreateForm>} */}
    </div>
  );
}

export default LoginPage;
