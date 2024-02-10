import multer from 'multer';
import { resolve } from 'path';

const storage = multer.diskStorage({
  destination: resolve('tmp'),
  filename: function (req, file, cb) {
    const { user } = req;
    cb(null, user.email + '_' + file.originalname);
  },
});

export const uploadAvatar = multer({ storage });
