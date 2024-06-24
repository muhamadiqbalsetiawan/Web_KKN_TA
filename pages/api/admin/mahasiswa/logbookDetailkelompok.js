// api/kelompok/[id]/detailDosen.js
import db from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [data] = await db.promise().query(`
      SELECT
        d.*,
        k.jenis_kelompok AS jenis,
        k.name AS kelompok,
        CONCAT_WS(', ',
        l.kelurahan,
        l.kecamatan,
        l.kota,
        l.provinsi
      ) AS lokasi
      FROM
        dosen d
      JOIN
        kelompok k ON d.nip = k.id_dosen
      JOIN
        lokasi l ON k.id_lokasi = l.id
      WHERE
        k.id = ?;
    `, [id]);

    // Check if dataRows is not empty and has at least one row
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Detail dosen tidak ditemukan untuk kelompok ini' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching dosen data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}
