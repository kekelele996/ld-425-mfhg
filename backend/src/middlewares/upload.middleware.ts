import multer from 'multer';
import { uploadConfig } from '../config/upload.config';

export const uploadMiddleware = multer(uploadConfig);
