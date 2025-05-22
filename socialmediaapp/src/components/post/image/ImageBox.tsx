import React from "react";
import { api } from "~/utils/api";
import type { Data } from "~/utils/types";
import Image from "./Image";

function ImageBox({ data }: Data) {
  const images = api.post.getImages.useQuery({
    postId: data.id,
  });

  //Podle poctu se meni layout containeru
  const numberOfImages = images.data?.length;
  return (
    <>
      {(numberOfImages === 1 && (
        <div className="h-96">
          <p></p>
          <Image
            src={"/images/" + images.data![0]!.path}
            styles="h-full w-full rounded-md object-cover"
          ></Image>
        </div>
      )) ||
        (numberOfImages! > 1 && (
          <div
            className={`grid h-96 grid-cols-2 gap-2 ${
              numberOfImages === 3 ? `grid-rows-2` : `grid-rows-1`
            }`}
          >
            {images.data?.map((image, key) => {
              return (
                <Image
                  key={key}
                  src={"/images/" + image.path}
                  styles={`h-full w-full rounded-md object-cover  ${
                    numberOfImages === 3 &&
                    `first:row-span-2 last:col-start-2 last:row-start-2`
                  }`}
                ></Image>
              );
            })}
          </div>
        ))}
    </>
  );
}

export default ImageBox;
