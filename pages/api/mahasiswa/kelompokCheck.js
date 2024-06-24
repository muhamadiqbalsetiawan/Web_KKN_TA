import condb from '@/lib/connectDatabase';

export default async function handler(req, res) {
  try {
    const { nim } = req.query;

    // Execute the SQL query
    const [result] = await condb
      .promise()
      .query(`
        SELECT
            m.nim,
            m.name AS mahasiswa_name,
            m.status_syarat,
            k.id AS kelompok_id,
            k.name AS kelompok_name
        FROM
            mahasiswa m
        LEFT JOIN
            kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
        LEFT JOIN
            kelompok k ON km.kelompok_id = k.id
        WHERE
            m.nim = ?;
      `, [nim]);

    // Check if a record is found
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Mahasiswa not found or not assigned to a kelompok' });
    }

    // Send the result as a JSON response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching kelompok information:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
