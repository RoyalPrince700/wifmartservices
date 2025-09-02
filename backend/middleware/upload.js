// backend/middleware/upload.js
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage(); // Use memory for Cloudinary

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// Export a configured single upload for profile_image and cac_certificate
// And array upload for portfolio_images
export const profileUpload = upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'cac_certificate', maxCount: 1 },
  { name: 'portfolio_images', maxCount: 15 }
]);

export default upload;