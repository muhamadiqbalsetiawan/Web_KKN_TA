// pages/api/lokasi.js
import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [rows] = await condb.promise().query(`
    SELECT 
    k.id AS kelompok_id, 
    k.name AS nama_kelompok,
    k.jenis_kelompok,
    jk.jenis_kelompok 
FROM 
    kelompok k
JOIN
    jenis_kkn jk ON k.jenis_kelompok = jk.jenis_kelompok;

    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
