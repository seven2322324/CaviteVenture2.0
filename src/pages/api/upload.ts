import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import dbConnect from '../../utils/dbConnect'; // Import your custom dbConnect
import Image from '../../models/Image'; // Assuming you have an Image model for the 'images' collection'

// Extend NextApiRequest to include Multer file field
interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Multer configuration for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Disable Next.js body parsing to allow for `multer` to handle multipart data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert multer to Promise-based middleware
const runMulterMiddleware = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upload.single('avatar')(req as any, res as any, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve(null);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Run the multer middleware to handle file upload
      await runMulterMiddleware(req, res);
      const multerReq = req as MulterRequest;

      if (!multerReq.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('File uploaded:', multerReq.file.originalname);

      // Ensure the file is a valid image using sharp
      try {
        console.log('Processing image...');
        await sharp(multerReq.file.path).metadata();
        console.log('Image processed successfully.');
      } catch (err) {
        console.error('Sharp processing error:', err);
        fs.unlinkSync(multerReq.file.path); // Delete invalid file
        return res.status(400).json({ error: 'Uploaded file is not a valid image' });
      }

      const imagePath = `/uploads/${multerReq.file.filename}`;
      console.log('Saving image to MongoDB:', imagePath);

      // Save image to MongoDB
      try {
        await dbConnect(); // Ensure DB connection
        const insertedImage = await Image.create({ imageUrl: imagePath });
        console.log('Image saved to MongoDB:', insertedImage);
        return res.status(200).json({
          message: 'Image uploaded successfully',
          imageUrl: imagePath,
          imageId: insertedImage._id,
        });
      } catch (err) {
        console.error('Error saving image to MongoDB:', err);
        return res.status(500).json({ error: 'Error saving image to MongoDB' });
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      return res.status(500).json({ error: 'Unexpected error occurred during upload' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
