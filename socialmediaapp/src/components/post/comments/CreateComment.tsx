import { useSession } from "next-auth/react";
import React, { type FormEvent, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { AiOutlineSend } from "react-icons/ai";
import { type Data } from "~/utils/types";
import toast, { Toaster } from "react-hot-toast";

interface CreateComment extends Data {
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateComment({ data, refetch, setShowComments }: CreateComment) {
  const { data: sessionData } = useSession();
  const createComment = api.comment.createComment.useMutation();
  const message = useRef<HTMLInputElement>(null);
  
  if (sessionData?.user.userId === undefined) return;
  const isBanned = api.user.isBanned.useQuery({ id: sessionData?.user.userId });

  useEffect(() => {
    if (createComment.isSuccess) {
      refetch!((prev: boolean) => !prev);
      toast.success("Komentář byl vytvořen.");
    }
  }, [createComment.isSuccess]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    //kontrola textu, zda není input prázdný
    if (
      message.current?.value === undefined ||
      message.current?.value === null ||
      message.current.value.trim() === "" ||
      sessionData?.user.userId === undefined
    ) {
      return;
    }

    createComment.mutate({
      id: sessionData?.user.userId,
      parentTag: data.tagId,
      message: message.current?.value,
      nestIndex: data.nestIndex ? data.nestIndex + 1 : 1, //Pokud parent nemá nestIndex, znamená to, že je to první komentář. Tudíž dostane index 1, jinak vezme index parent a přičte 1.
    });

    message.current.value = ""; //resetne se input

    setShowComments(true); //Ukáže komentáře po odeslání
  }

  return (
    <div>
      {isBanned.data?.id === undefined ? (
        <div className="">
          <form onSubmit={(e) => handleSubmit(e)} className="my-2 flex gap-3">
            <input
              type="text"
              placeholder="Napište odpověď..."
              className="w-full border-b outline-none"
              ref={message}
            />
            <button type="submit" className="ml-auto rounded-sm  p-2 ">
              <AiOutlineSend />
            </button>
          </form>
          <Toaster />
        </div>
      ) : (
        <div>Account Blocked</div>
      )}
    </div>
  );
}

export default CreateComment;
