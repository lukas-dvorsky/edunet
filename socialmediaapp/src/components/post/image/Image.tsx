import React, { useState } from "react";

interface Image {
  src: string;
  styles?: string;
  alt?: string;
}

function Image({ alt = "", src, styles }: Image) {
  const [show, setShow] = useState(false);

  return (
    <>
      <img
        alt={alt}
        src={src}
        className={`hover:cursor-pointer ${styles}`}
        onClick={() => setShow(true)}
      />
      {show && (
        <div
          className="fixed left-1/2 top-1/2 z-30 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-auto bg-black/60"
          onClick={() => setShow(false)}
        >
          <img className="w-5/6 lg:w-1/2" src={src} alt="" />
        </div>
      )}
    </>
  );
}
export default Image;
