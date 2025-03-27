import fs from 'node:fs';
import { extname } from 'node:path';
import { Request } from 'express';

type req = Request;
type File = req["file"];

export const renamePizzaImage = (file: File , pizzaFlavor: string): string => {
  const fileExtension: string = extname(file!.originalname);
  const fileName: string = `${pizzaFlavor}_pizza_${Date.now()}${fileExtension}`.toLowerCase();
  
  const oldPath: string = file!.path;
  const newPath: string = `uploads/pizzas/${fileName.replace(" ", "_")}`;
  
  fs.renameSync(oldPath, newPath);

  return fileName;
};
