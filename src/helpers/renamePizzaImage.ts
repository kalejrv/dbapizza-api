import fs from 'node:fs';
import { extname } from 'node:path';
import { Request } from 'express';
import config from '@config/config';

type req = Request;
type File = req["file"];

export const renamePizzaImage = (file: File , pizzaFlavor: string): string => {
  const fileExtension: string = extname(file!.originalname);
  const currentDate: number = Date.now();
  let fileName: string = `${pizzaFlavor}_pizza_${currentDate}${fileExtension}`.toLowerCase();
  
  const regex: RegExp = / /gi;
  fileName = fileName.replace(regex, "_");

  const oldPath: string = file!.path;
  const newPath: string = `${config.uploads.pizzas}/${fileName}`;
  
  fs.renameSync(oldPath, newPath);
  
  return fileName;
};
