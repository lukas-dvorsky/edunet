import { useEffect, useState } from "react";
import { BsTrashFill } from "react-icons/bs";
import { BsCardImage } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  style?: string;
}

function UploadImage({ images, setImages, style }: Props) {
  const [selectedFile, setSelectedFile] = useState<File[]>();

  function validateImage(fileList: File[]) {
    console.log(fileList);
    for (const file of fileList) {
      //nalezne, kde se nachazi posledni pozice '.' + pricte samostatnou tecku
      const dot = file.name.lastIndexOf(".") + 1;
      //odecte to pocet znaku od puvofniho poctu znaku, vyjde typ souboru.
      const type = file.name.substring(dot, file.name.length).toLowerCase();
      console.log(type);

      if (type == "jpg" || type == "png" || type == "jpeg") {
        //ok
      } else {
        return false;
      }
    }
    return true;
  }
  useEffect(() => {
    setImages(selectedFile!);
  }, [selectedFile]);

  return (
    <div>
      <label>
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          hidden
          multiple
          onChange={({ target }) => {
            if (target.files) {
              const selectedFilesArr: File[] = [];
              Array.from(target.files).forEach((file) => {
                selectedFilesArr.push(file);
              });

              if (!validateImage(selectedFilesArr)) {
                toast.error(
                  "Podporované typy obrázků jsou pouze jpg, jpeg, png.",
                );
                return;
              }

              if (selectedFilesArr.length > 3) {
                //pokud uploadne více, jak 3 obrázky, oznámí to chybu.
                toast.error("Lze nahrát maximálně 3 obrázky.");
                return;
              }

              setSelectedFile(selectedFilesArr);
            }
          }}
        />
        <div className="mb-4 flex justify-center border border-gray-400 rounded-md">
          {images === undefined || images.length === 0 ? (
            <div
              className={`flex items-center justify-center gap-2 border border-b p-2 hover:cursor-pointer ${style}`}
            >
              <p>Nahrát Obrázek</p>
              <BsCardImage></BsCardImage>
            </div>
          ) : (
            <div className="ltr flex items-center justify-center">
              <button
                className="h-20 rounded-s-md bg-red-500 px-1 text-sm text-white"
                onClick={() => {
                  setImages([]);
                }}
              >
                <BsTrashFill></BsTrashFill>
              </button>
              {images?.map((image) => {
                return (
                  <img
                    key={image.name}
                    className="h-20 w-24 object-cover"
                    src={URL.createObjectURL(image)}
                    alt=""
                  />
                );
              })}
            </div>
          )}
        </div>
        <Toaster />
      </label>
    </div>
  );
}

export default UploadImage;
