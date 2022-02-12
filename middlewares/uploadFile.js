const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const storage = new GridFsStorage({
  url: process.env.mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (error, buffer) => {
        if (error) {
          return reject(err);
        }
        const filename =
          buffer.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'userImage',
        };
        resolve(fileInfo);
      });
    });
  },
});

//Multer file upload
const multerStorage = multer({ storage });

function uploadFile(req, res, next) {
  const upload = multerStorage.single('profile-pic');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json(err.message);
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json(err.message);
    }

    // Everything went fine.
    next();
  });
}

module.exports = { uploadFile, multerStorage };
