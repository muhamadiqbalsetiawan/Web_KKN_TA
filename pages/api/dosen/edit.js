// import multer from 'multer';
// import db from '../../lib/db';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads/pdf',
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

// export default async (req, res) => {
//   if (req.method === 'POST') {
//     upload.single('file')(req, res, async (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(400).json({ error: 'Gagal mengunggah file', details: err.message });
//       }

//       const { dsn_id, dsn_nama, } = req.body;
//       const filePath = req.file ? req.file.originalname : '';
//       console.log('File Path:', filePath); // Log jalur file untuk debug

//       // Lakukan validasi input
//       if (!dsn_id || !dsn_nama || !filePath) {
//         return res.status(400).json({ error: 'ID, Nama, dan File harus diisi' });
//       }

//       try {
        
//         const [result] = await db
//         .promise()
//         .query("UPDATE dsn SET dsn_nama = ?, file_patch = ? WHERE dsn_id = ?", [dsn_nama, filePath, dsn_id]);

//         if (result.affectedRows > 0) {
//           return res.status(201).json({ message: 'Data berhasil ditambahkan' });
//         } else {
//           return res.status(500).json({ error: 'Gagal menambahkan data' });
//         }
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Gagal menambahkan data', details: error.message });
//       }
//     });
//   } else {
//     return res.status(405).end();
//   }
// };


// import multer from 'multer';
// import db from '../../lib/db';
// import path from 'path';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       let uploadFolder;
//       const ext = path.extname(file.originalname);
      
//       if (ext === '.pdf') {
//         uploadFolder = 'pdf';
//       } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
//         uploadFolder = 'image';
//       } else {
//         return cb(new Error('File type not supported'), null);
//       }

//       cb(null, `./public/uploads/${uploadFolder}`);
//     },
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

// export default async (req, res) => {
//   if (req.method === 'POST') {
//     upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }])(req, res, async (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(400).json({ error: 'Gagal mengunggah file', details: err.message });
//       }

//       const { dsn_id, dsn_nama } = req.body;
//       const pdfFilePath = req.files?.pdfFile ? req.files.pdfFile[0].originalname : '';  
//       const imageFilePath = req.files?.imageFile ? req.files.imageFile[0].originalname : '';
      
//       console.log('PDF File Path:', pdfFilePath);
//       console.log('Image File Path:', imageFilePath);

//       // Lakukan validasi input
//       if (!dsn_id || !dsn_nama || !pdfFilePath || !imageFilePath) {
//         return res.status(400).json({ error: 'ID, Nama, Pdf, dan gambar harus diisi' });
//       }

//       try {
//         const [result] = await db
//           .promise()
//           .query("UPDATE dsn SET dsn_nama = ?, file_patch = ?, image_patch = ? WHERE dsn_id = ?", [dsn_nama, pdfFilePath, imageFilePath, dsn_id]);

//         if (result.affectedRows > 0) {
//           return res.status(201).json({ message: 'Data berhasil diupdate' });
//         } else {
//           return res.status(500).json({ error: 'Gagal mengupdate data' });
//         }
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Gagal mengupdate data', details: error.message });
//       }
//     });
//   } else {
//     return res.status(405).end();
//   }
// };

import multer from 'multer';
import db from '../../../lib/db';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadFolder;

      if (file.mimetype === 'application/pdf') {
        uploadFolder = 'pdf';
      } else if (file.mimetype.startsWith('image/')) {
        uploadFolder = 'image';
      } else {
        return cb(new Error('File type not supported'), null);
      }

      cb(null, `./public/uploads/${uploadFolder}`);
    },
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

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



      // Lakukan validasi input
      if (!dsn_id || !dsn_nama || !pdfFilePath || !imageFilePath) {
        return res.status(400).json({ error: 'ID, Nama, Pdf, dan Gambar harus diisi' });
      }

      try {
        const [result] = await db
          .promise()
          .query("UPDATE dsn SET dsn_nama = ?, file_patch = ?, image_patch = ? WHERE dsn_id = ?", [dsn_nama, pdfFilePath, imageFilePath, dsn_id]);

        if (result.affectedRows > 0) {
          return res.status(201).json({ message: 'Data berhasil diupdate' });
        } else {
          return res.status(500).json({ error: 'Gagal mengupdate data' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Gagal mengupdate data', details: error.message });
      }
    });
  } else {
    return res.status(405).end();
  }
};
