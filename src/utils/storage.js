import multer from "multer";
import path from "path";

const storageConf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "file_storage"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 10);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const storage = multer({ storage: storageConf });
