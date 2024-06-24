import condb from '@/lib/connectDatabase';

export default async function handler(req, res) {
  try {
    const [result] = await condb.promise().query(`
    SELECT
        k.id AS kelompok_id,
        k.name AS kelompok_name,
        l.kelurahan AS lokasi_kelurahan,
        l.kecamatan AS lokasi_kecamatan,
        l.kota AS lokasi_kota,
        l.provinsi AS lokasi_provinsi,
        l.negara AS lokasi_negara,
        k.p AS batas_perempuan,
        k.l AS batas_laki,
        k.jenis_kelompok,
        DATE_FORMAT(tanggal_mulai, '%Y-%m-%d') AS tanggal_mulai,
        DATE_FORMAT(tanggal_berakhir, '%Y-%m-%d') AS tanggal_berakhir,
        COUNT(CASE WHEN m.gender = 'L' THEN 1 END) AS male_count,
        COUNT(CASE WHEN m.gender = 'P' THEN 1 END) AS female_count
    FROM
        kelompok k
    JOIN
        lokasi l ON k.id_lokasi = l.id
    LEFT JOIN
        kelompok_mahasiswa km ON k.id = km.kelompok_id
    LEFT JOIN
        mahasiswa m ON km.mahasiswa_id = m.nim
    LEFT JOIN
        jenis_kkn jk ON k.jenis_kelompok = jk.jenis_kelompok
    GROUP BY
        k.id, k.name, l.kecamatan, l.kota, l.negara, k.jenis_kelompok, jk.tanggal_mulai, jk.tanggal_berakhir;
      `);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
