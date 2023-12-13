// eslint-disable-next-line import/no-import-module-exports
import multer from 'multer';

const storage = multer.diskStorage({
  filename(req, file, cb) {
    const newFileName = `${req.user.id}_${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

export default upload;
