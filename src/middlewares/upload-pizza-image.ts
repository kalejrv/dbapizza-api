import { extname } from 'node:path';
import multer, { diskStorage } from "multer";
import config from '@config/config';
import { MulterError } from '@errors';
import { MYMETYPES } from '@types';

export const uploadPizzaImage = multer({
  storage: diskStorage({
    destination: `${config.uploads.pizzas}`,
    filename(_req, file, callback) {
      const fileNameExtension: string = extname(file.originalname);
      const fileName: string = file.originalname.split(fileNameExtension)[0];
      const currentDate: number = Date.now();

      callback(null, `${fileName}_${currentDate}${fileNameExtension}`.toLowerCase());
    },
  }),
  fileFilter(_req, file, callback) {
    if (!Object.values(MYMETYPES).includes(file.mimetype as MYMETYPES)) {
      return callback(new MulterError("-")); /* "-" it's just because the error is managed in a custom error. */
    };
    
    callback(null, true);
  },
  limits: {
    fieldSize: 3 * 1024 * 1024,
  },
});
