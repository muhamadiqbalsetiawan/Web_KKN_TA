import db from "../../../lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const data = await db.promise().query(`
      SELECT
        l.*,
        m.nim AS nim,
        k.name AS kelompok
      FROM
        logbook l
      JOIN
        nim m ON l.mahasiswa_id = m.nim
      JOIN
        mahasiswa_id km ON m.nim = km.mahasiswa_id
      JOIN
        kelompok k ON km.kelompok_id = k.id
      WHERE
        k.id = ?;
    `, [id]);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Logbook tidak ditemukan untuk kelompok ini' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching logbook data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}
