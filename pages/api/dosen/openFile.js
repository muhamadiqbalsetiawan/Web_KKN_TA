import fs from 'fs/promises';
import path from 'path';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { fileName } = req.query;

    // Validate input
    if (!fileName) {
      return res.status(400).json({ error: 'Nama file harus disertakan' });
    }

    try {
      // Path ke direktori 'public/uploads'
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      // Path lengkap ke file
      const filePath = path.join(uploadsDir, fileName);

      // Periksa apakah direktori tempat file ada
      const dirExists = await fs.access(uploadsDir).then(() => true).catch(() => false);

      if (!dirExists) {
        return res.status(404).json({ error: 'Direktori tidak ditemukan' });
      }

      // Periksa apakah file ada
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      if (!fileExists) {
        return res.status(404).json({ error: 'File tidak ditemukan' });
      }

      // Membaca file
      const fileContent = await fs.readFile(filePath);

  // Mengirim file content sebagai respons
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
  res.status(200).end(fileContent);
}  catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Gagal mengambil file', details: error.message });
    }
  } else {
    return res.status(405).end();
  }
};
