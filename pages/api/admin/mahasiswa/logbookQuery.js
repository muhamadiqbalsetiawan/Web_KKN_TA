import db from "@/lib/connectDatabase"; 

export default async function handler(req, res) {
  try {
    // Ambil data logbook dari database
    const [logbookData] = await db.promise()
      .query(`
      SELECT 
      k.id, 
      k.name AS kelompok, 
      k.jenis_kelompok AS jenis,
      jk.jenis_kelompok AS jenis_jk,
      dosen.nama AS dosen, 
      CONCAT(lokasi.kelurahan, ", ", lokasi.kecamatan, ", ", lokasi.kota, ", ", lokasi.provinsi) AS lokasi 
      FROM kelompok k
      JOIN 
      dosen ON k.id_dosen = dosen.nip 
      JOIN 
      lokasi ON k.id_lokasi = lokasi.id 
      LEFT JOIN 
      jenis_kkn jk ON k.jenis_kelompok = jk.jenis_kelompok
      `);

    res.status(200).json(logbookData);
  } catch (error) {
    console.error('Error fetching logbook data:', error);
    res.status(500).json({ error: 'Error fetching logbook data', details: error.message });
  }
}