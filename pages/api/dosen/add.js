import multer from 'multer';
import db from '../../../lib/db';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder;
    const ext = path.extname(file.originalname);
    
    if (ext === '.pdf') {
      uploadFolder = 'pdf';
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      uploadFolder = 'image';
    } else {
      return cb(new Error('File type not supported'), null);
    }

    cb(null, `./public/uploads/${uploadFolder}`);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === 'POST') {
    upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }])(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Gagal mengunggah file', details: err.message });
      }

      const { dsn_id, dsn_nama } = req.body;
      const pdfFilePath = req.files?.pdfFile ? req.files.pdfFile[0].originalname : '';
      const imageFilePath = req.files?.imageFile ? req.files.imageFile[0].originalname : '';
      
      console.log('PDF File Path:', pdfFilePath);
      console.log('Image File Path:', imageFilePath);

      // Lakukan validasi input
      if (!dsn_id || !dsn_nama) {
        return res.status(400).json({ error: 'ID, Nama, dan File harus diisi' });
      }

      try {
        const insertSql = 'INSERT INTO dsn (dsn_id, dsn_nama, file_patch, image_patch) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().query(insertSql, [dsn_id, dsn_nama, pdfFilePath, imageFilePath]);

        if (result.affectedRows > 0) {
          return res.status(201).json({ message: 'Data berhasil ditambahkan' });
        } else {
          return res.status(500).json({ error: 'Gagal menambahkan data' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Gagal menambahkan data', details: error.message });
      }
    });
  } else {
    return res.status(405).end();
  }
};
