import condb from '../../../lib/connectDatabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mahasiswaId = req.query.mahasiswaId;

    try {
      // Gunakan connection.query langsung tanpa menggunakan promise()
      const [result] = await condb.promise().query("SELECT l.* FROM logbook l WHERE mahasiswa_id = ?  ORDER BY l.hari DESC", [mahasiswaId]);

      // Log tambahan setelah query berhasil dieksekusi
      
      if (result !== undefined && result !== null) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ success: false, message: 'Logbook not found' });
      }
      // if (!result || result.length === 0) {
      //   return res.status(404).json({ message: 'Logbook tidak ditemukan untuk kelompok ini' });
      // }
  
      // res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching logbook data:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
