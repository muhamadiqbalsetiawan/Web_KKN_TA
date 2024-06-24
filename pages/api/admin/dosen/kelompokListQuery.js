import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [result] = await condb
      .promise()
      .query(
        `SELECT
            k.id AS kelompok_id,
            ketua_telpon.telpon AS telpon,
            ketua.foto AS foto,
            k.name AS kelompok_name,
            k.jenis_kelompok AS jenis_kelompok,
            CONCAT_WS(', ',
              l.kelurahan,
              l.kecamatan
            ) AS lokasi,
            m.name AS ketua_name,
            m.telpon AS ketua_telpon,
            COUNT(km.mahasiswa_id) AS jumlah_mahasiswa
        FROM
            dosen d
        JOIN
            kelompok k ON d.nip = k.id_dosen
        JOIN
            lokasi l ON k.id_lokasi = l.id
        LEFT JOIN
            mahasiswa m ON k.id_ketua = m.nim
        LEFT JOIN
            mahasiswa ketua_telpon ON k.id_ketua = ketua_telpon.nim  
        LEFT JOIN
            mahasiswa ketua ON k.id_ketua = ketua.nim
        LEFT JOIN
            kelompok_mahasiswa km ON k.id = km.kelompok_id
        WHERE
            d.nip = ?
        GROUP BY
            k.id, k.name, l.kota, l.negara, m.name, m.telpon;`,
        [id]
      );

    if (result.length === 0) {
      res.status(404).json({ error: 'No group found for the given parameters' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error fetching group details from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
