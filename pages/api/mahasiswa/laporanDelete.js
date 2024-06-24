import db from "../../../lib/connectDatabase";
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { mahasiswaId } = req.body;

    try {
      // Get file_patch from the database
      const selectSql = 'SELECT laporan FROM file WHERE id_mahasiswa = ?';
      const [result] = await db.promise().query(selectSql, [mahasiswaId]);

      if (result.length > 0) {
        const laporan = result[0].laporan;

        // Log path file yang akan dihapus
        console.log('File Path to be deleted:', laporan);

        // Delete file from the system if laporan exists
        if (laporan) {
          const filePath = path.join(process.cwd(), 'uploads', 'pdf', 'laporan', laporan);

          // Log path lengkap ke file yang akan dihapus
          console.log('Full File Path to be deleted:', filePath);

          // Pastikan file ada sebelum dihapus
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('File deleted successfully.');

            // Setelah menghapus file, hapus juga catatan dari database
            const deleteSql = 'DELETE FROM file WHERE id_mahasiswa = ?';
            await db.promise().query(deleteSql, [mahasiswaId]);

            res.status(200).json({ success: true, message: 'File and database record deleted successfully.' });
          } else {
            console.error('File not found:', filePath);
            res.status(404).json({ success: false, message: 'File not found.' });
          }
        } else {
          res.status(404).json({ success: false, message: 'No file found for the specified mahasiswaId.' });
        }
      } else {
        res.status(404).json({ success: false, message: 'No data found for the specified mahasiswaId.' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
