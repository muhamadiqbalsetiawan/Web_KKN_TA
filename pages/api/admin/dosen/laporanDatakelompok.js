import db from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { nip } = req.query;

  try {
    const [data] = await db.promise().query(`
      SELECT
        MAX(k.id) AS id,
        k.id_ketua,
        k.jenis_kelompok AS jenis,
        GROUP_CONCAT(DISTINCT k.name) AS kelompok,
        d.nip AS nip_dosen,
        d.nama AS nama_dosen,
        CONCAT_WS(', ',
          lo.kelurahan,
          lo.kecamatan
        ) AS lokasi
      FROM
        kelompok k
      JOIN
        dosen d ON k.id_dosen = d.nip
      JOIN
        lokasi lo ON k.id_lokasi = lo.id
      LEFT JOIN
        kelompok_mahasiswa km ON k.id = km.kelompok_id
      WHERE
        d.nip = ?
    `, [nip]);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}
