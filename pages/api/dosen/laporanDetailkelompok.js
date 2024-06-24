import db from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [data] = await db.promise().query(`
    SELECT
      f.*,
      m.nim AS nim,
      m.name AS nama,
      k.name AS kelompok
    FROM
      file f
    JOIN
      mahasiswa m ON f.id_mahasiswa = m.nim
    JOIN
      kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
    JOIN
      kelompok k ON km.kelompok_id = k.id
    WHERE
      k.id = ?;

    `, [id]);

    // Check if dataRows is not empty and has at least one row
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Logbook tidak ditemukan untuk kelompok ini' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching logbook data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}
