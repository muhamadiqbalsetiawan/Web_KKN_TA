import condb from '../../../lib/connectDatabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mahasiswaId = req.query.mahasiswaId;

    try {
      const [result] = await condb.promise().query(
        "SELECT bukti_syarat, status_syarat FROM mahasiswa WHERE nim = ?", 
        [mahasiswaId]);

      if (result !== undefined && result !== null) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ success: false, message: 'Logbook not found' });
      }
    } catch (error) {
      console.error('Error checking data in file table:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
