import db from "../../../lib/connectDatabase";

export default async function handler(req, res) {
  const { nim } = req.query;

  try {
    const data = await db.promise().query(`
    SELECT
    m.*,
    CONCAT_WS(', ',
        l.kelurahan,
        l.kecamatan,
        l.kota,
        l.provinsi
    ) AS lokasi,
    d.nip AS nip,
    d.nama AS dosen,
    k.name AS kelompok,
    k.jenis_kelompok as jenis_kkn
    FROM
        mahasiswa m
    JOIN
        kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
    JOIN
        kelompok k ON km.kelompok_id = k.id
    JOIN
        lokasi l ON k.id_lokasi = l.id
    JOIN
        dosen d ON k.id_dosen = d.nip   
    WHERE
        m.nim = ?;

    `, [nim]);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}