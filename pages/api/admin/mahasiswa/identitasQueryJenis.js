// pages/api/lokasi.js
import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [rows] = await condb.promise().query('SELECT jk.jenis_kelompok AS jenis_kkn FROM jenis_kkn jk');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
