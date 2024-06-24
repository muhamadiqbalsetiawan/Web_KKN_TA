import condb from '@/lib/connectDatabase';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { jenis_kelompok, tanggal_mulai, tanggal_berakhir } = req.body;
    try {
      const [result] = await condb
        .promise()
        .query(
          "UPDATE jenis_kkn SET jenis_kelompok = ?, tanggal_mulai = ?, tanggal_berakhir = ? WHERE jenis_kelompok = ?",
          [jenis_kelompok || null, tanggal_mulai || null, tanggal_berakhir || null, jenis_kelompok]
        );
      res.status(200).json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating data in MySQL:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  } else {
    console.error('Method Not Allowed: Only PUT requests are allowed.');
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}