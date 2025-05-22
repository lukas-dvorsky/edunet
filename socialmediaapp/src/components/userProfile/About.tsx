import { type User } from "@prisma/client";
import React, { useState } from "react";
import FollowButton from "./FollowButton";
import UploadImage from "../post/image/UploadImage";
import { useRouter } from "next/router";
import axios from "axios";
import { api } from "~/utils/api";
interface Props {
  userData: Omit<User, "password">;
  loginUserId: string;
}

function About({ userData, loginUserId }: Props) {
  const router = useRouter();
  const isUsersProfile = loginUserId === router.query.userId ? true : false;
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const update = api.user.updateProfilePicture.useMutation();
  /*   const currentProfilePicture = api.user.getProfilePicture.useQuery({
    id: loginUserId,
  }); */

  async function changeProfilePicture(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // remove after
    if (images[0] !== undefined) {
      const formData = new FormData();
      formData.append("myImage", images[0]);
      const { data } = await axios.post("/api/image", formData);
      const path = data.fileName;

      update.mutate({ id: loginUserId, path: path });

      setTimeout(() => {
        router.reload();
      }, 1000);

      //DELETE FILE

      /*       if (update.isSuccess) {
        console.log("deleting file");
        fs.unlink(`/images/${currentProfilePicture.data?.profilePicture}`);
      } */
    }
  }

  return (
    <div className="w-full">
      <div className="m-auto w-5/6 border border-black">
        <div className="relative flex h-full w-full flex-col items-center gap-5 md:h-40 md:w-40">
          <img
            onClick={() => {
              setShowUploadImage((prev) => !prev);
              console.log(showUploadImage);
            }}
            className="h-40 w-full object-cover"
            src={`/images/${userData.profilePicture}`}
            alt=""
          />
          {isUsersProfile && (
            <UploadImage
              images={images}
              setImages={setImages}
              style={"absolute top-0 w-full h-full opacity-0"}
            ></UploadImage>
          )}
          {images != undefined && images.length > 0 && (
            <form onSubmit={(e) => void changeProfilePicture(e)}>
              <input
                className="cursor-pointer rounded-sm bg-sps_primary p-2 text-white"
                type="submit"
                value="Upload"
              />
            </form>
          )}
        </div>

        <div>
          <span className="text-4xl">{`${userData.fname} ${userData.lname}`}</span>
          <p>Email: {userData.email}</p>
          <p>Obor: {userData.specialization}</p>
          <p>Třída:</p>
        </div>
        <FollowButton
          userId={userData.id}
          followedById={loginUserId}
        ></FollowButton>
      </div>
    </div>
  );
}

export default About;
