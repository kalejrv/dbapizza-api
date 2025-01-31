import fs from 'node:fs';

export const deletePizzaImage = (imagePath: string): void => {
  if (!fs.existsSync(imagePath)) {
    throw new Error("Pizza image doesn't exist.");
  };
  
  fs.unlink(imagePath, (error) => {
    if (error) {
      throw new Error("Error deleting pizza image.");
    };
  });
};
