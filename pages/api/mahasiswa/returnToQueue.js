import processQueue from "@/cron/prosesQueue";
import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    console.log('Menghapus user dari antrian dengan userId:', id); // Tambahkan logging
    // Hapus user dari tabel antrian
    const [result] = await condb.promise().query(`
      DELETE FROM antrian WHERE id = ?
    `, [id]);

    console.log('Hasil query:', result); // Logging hasil query

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User dihapus dari antrian' });
      await processQueue()
    } else {
      res.status(404).json({ error: 'User tidak ditemukan di antrian' });
    }
  } catch (error) {
    console.error('Error:', error); // Tampilkan error jika ada masalah
    res.status(500).json({ error: 'Gagal menghapus user dari antrian' });
  }
}
