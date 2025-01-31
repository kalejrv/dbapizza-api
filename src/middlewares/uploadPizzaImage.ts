import { extname } from 'node:path';
import multer, { diskStorage } from "multer";

enum MYMETYPES {
  jpg = "image/jpg",
  jpeg = "image/jpeg",
  png = "image/png",
};

export const uploadPizzaImage = multer({
  storage: diskStorage({
    destination: "uploads/pizzas",
    filename(_req, file, callback) {
      const fileExtension: string = extname(file.originalname);
      const fileName: string = file.originalname.split(fileExtension)[0];

      callback(null, `${fileName}_${Date.now()}${fileExtension}`.toLowerCase());
    },
  }),
  fileFilter(_req, file, callback) {
    const allowedMymetypes: string = Object.values(MYMETYPES).join().split("image/").join(" ").trim();
    if (!Object.values(MYMETYPES).includes(file!.mimetype as MYMETYPES)) {
      callback(new Error(`Only allowed images with format: ${allowedMymetypes}.`));
    };

    callback(null, true);
  },
  limits: {
    fieldSize: 3 * 1024 * 1024,
  },
});
