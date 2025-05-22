import Link from "next/link";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

function PswdPopup() {
  const [show, setShow] = useState(true);

  return (
    <>
      {show ? (
        <div className="left-1/2 z-30 flex w-full items-center justify-between bg-green-400 p-2 pr-4 text-sps_background shadow-lg md:absolute md:top-2 md:max-w-xl md:-translate-x-1/2 md:transform md:rounded-lg md:text-lg">
          <Link
            href={"/auth/changePassword"}
            className="justify-center rounded-md border-2 bg-transparent p-2 text-sm font-semibold  md:p-2 md:text-lg"
          >
            Změnit
          </Link>
          <p className="text-xs md:text-lg">
            Po prvním přihlášení je doporučeno si změnit heslo.
          </p>
          <button onClick={() => setShow(false)}>
            <RxCross2 />
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default PswdPopup;
