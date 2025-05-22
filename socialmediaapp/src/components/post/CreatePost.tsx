import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import UploadImage from "./image/UploadImage";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Path {
  path: string;
}

interface CreatePost {
  wallId: string;
  refetch: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreatePost({ wallId, refetch }: CreatePost) {
  const [images, setImages] = useState<File[]>([]);
  const title = useRef<HTMLTextAreaElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);

  const { data: sessionData } = useSession({ required: true });
  if (sessionData?.user.userId === undefined) return;
  const isBanned = api.user.isBanned.useQuery({ id: sessionData?.user.userId });

  const createPost = api.post.createPost.useMutation();

  console.log(isBanned.data?.id);


  useEffect(() => {
    if (createPost.isSuccess) {
      refetch((prev: boolean) => !prev);
      toast.success("Příspěvek byl vytvořen.");
    }
  }, [createPost.isSuccess, refetch]);

  async function handleSubmit() {
    if (
      title.current?.value === "" ||
      title.current?.value === undefined ||
      content.current?.value === undefined ||
      sessionData?.user.userId === undefined
    )
      return;

    const paths: Path[] = [];

    if (images !== undefined) {
      //for aby se obrazky uploadovali v sequence (-2 hodiny haha)
      for (const image of images) {
        const formData = new FormData();
        formData.append("myImage", image);
        const { data } = await axios.post("/api/image", formData);
        paths.push({ path: data.fileName });
      }
    }

    createPost.mutate({
      id: sessionData?.user.userId,
      title: title.current?.value,
      content: content.current?.value,
      images: paths,
      wallId: wallId,
    });

    setImages([]);
    title.current.value = "";
    content.current.value = "";
  }

  return (
    <div className="flex w-full flex-col">
      {isBanned.data?.id === undefined ? (
        <div className="flex flex-col border border-gray-400 rounded-md px-4 py-2">
          <h3 className="mb-3 text-xl font-semibold uppercase"></h3>
          <textarea
            className="w-full resize-none overflow-clip break-words my-2 text-3xl font-bold outline-none border border-b-gray-400"
            placeholder="Titulek"
            rows={1}
            ref={title}
            maxLength={128}
          ></textarea>
          <textarea
            className="mb-3 line-clamp-4 resize-none overflow-y-auto overflow-x-hidden px-1 py-2 text-xl outline-none"
            wrap="soft"
            maxLength={1023}
            rows={5}
            cols={20}
            placeholder="Sděl ostatním, co máš na srdci..."
            ref={content}
          ></textarea>
          <UploadImage images={images} setImages={setImages} style={`w-1/2`}></UploadImage>
          <button
            className={`m-auto w-3/4 rounded-md bg-blue-400 py-2 text-sps_background`}
            onClick={() => void handleSubmit()}
            disabled={isBanned.data ? true : false}
          >
            {isBanned.data?.id === null
              ? "Account blocked"
              : "Zveřejnit příspěvek"}
          </button>
          <Toaster />
        </div>
      ) : (
        <div>Account blocked</div>
      )}
    </div>
  );
}

export default CreatePost;
