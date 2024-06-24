// pages/api/admin/dosenList.js
import db from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [data] = await db.promise().query(`
    SELECT
  d.nip,
  d.nama AS dosen_name,
  d.telpon_dosen AS telpon_dosen,
  GROUP_CONCAT(k.name) AS kelompok,
  MAX(k.jenis_kelompok) AS jenis_kelompok
FROM
  dosen d
LEFT JOIN
  kelompok k ON d.nip = k.id_dosen
GROUP BY
  d.nip, d.nama, d.telpon_dosen;

  
    `);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Data Dosen tidak ditemukan' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}
    