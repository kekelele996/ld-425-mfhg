import { diskStorage } from 'multer';

export const uploadConfig = {
  storage: diskStorage({
    destination: 'uploads',
    filename: (_req, file, callback) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
      callback(null, `${Date.now()}-${safeName}`);
    }
  })
};
