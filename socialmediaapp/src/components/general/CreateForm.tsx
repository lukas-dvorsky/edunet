import { Specialization } from "@prisma/client";
import React, { type FormEvent, useState } from "react";
import { api } from "~/utils/api";
import bcrypt from "bcryptjs";

function CreateForm() {
  const [data, setData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    specialization: "",
    group: "",
  });

  const mutation = api.user.createUser.useMutation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    mutation.mutate({
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      specialization: data.specialization as Specialization,
      group: data.group,
    });
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          required
          type="text"
          placeholder="jmeno"
          onChange={(e) => setData({ ...data, fname: e.target.value })}
        />
        <input
          required
          type="text"
          placeholder="prijmeni"
          onChange={(e) => setData({ ...data, lname: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="heslo"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="rocnik"
          onChange={(e) => setData({ ...data, group: e.target.value })}
        />
        <select
          onChange={(e) =>
            setData({
              ...data,
              specialization: e.target.value,
            })
          }
        >
          {(Object.keys(Specialization) as (keyof typeof Specialization)[]).map(
            (spec, key) => {
              return (
                <option value={spec} key={key}>
                  {spec}
                </option>
              );
            },
          )}
        </select>
        <button type="submit">Vytvorit uzivatele</button>
      </form>
    </div>
  );
}

export default CreateForm;
