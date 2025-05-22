import { type NextApiHandler, type NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};
let fileName: string;

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      fileName = Date.now().toString() + "_" + path.originalFilename;
      return fileName;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  //Zkontroluje zda existuje cesta k obrázkům. Pokud neexistuje, vytvoří nové složky.
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
    await fs.readdir(path.join(process.cwd() + "/public", "/profile_pics"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/profile_pics"));
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  await readFile(req, true);
  res.json({ done: "ok", fileName: fileName });
};

export default handler;
