import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = upload.single('file');

export default function (req, res, next) {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle multer-specific errors
      return res.status(400).json({ error: 'File upload error' });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Continue to the next middleware or route handler
    return next();
  });
}
