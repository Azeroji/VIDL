import multer from 'multer'
import {v4} from 'uuid'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const randomFilename = `${v4()}-${file.originalname}`;
      cb(null, randomFilename);
    },
  });

const upload = multer({ storage: storage });

export default upload