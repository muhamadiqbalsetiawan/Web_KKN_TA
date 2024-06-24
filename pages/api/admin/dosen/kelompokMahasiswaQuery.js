import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [result] = await condb
      .promise()
      .query(
        `SELECT
            m.nim,
            m.name AS mahasiswa_name,
            m.telpon AS mahasiswa_telpon,
            m.jurusan AS mahasiswa_jurusan,
            m.fakultas AS mahasiswa_fakultas,
            m.nilai AS mahasiswa_nilai,
            k.name AS kelompok_name,
            k.jenis_kelompok,
            l.kota,
            l.negara
        FROM
            kelompok k
        JOIN
            kelompok_mahasiswa km ON k.id = km.kelompok_id
        JOIN
            mahasiswa m ON km.mahasiswa_id = m.nim
        JOIN
            dosen d ON k.id_dosen = d.nip
        LEFT JOIN
            lokasi l ON k.id_lokasi = l.id
        WHERE
            k.id IN (SELECT id FROM kelompok WHERE id_dosen = ?) AND
            d.nip = ?;
    `,
        [id, id]
      );

    if (result.length === 0) {
      res.status(404).json({ error: 'No mahasiswa found for the given parameters' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error fetching mahasiswa details from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
