import db from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [data] = await db.promise().query(`
    SELECT
      l.*,
      m.nim AS nim,
      k.name AS kelompok
    FROM
      logbook l
    JOIN
      mahasiswa m ON l.mahasiswa_id = m.nim
    JOIN
      kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
    JOIN
      kelompok k ON km.kelompok_id = k.id
    WHERE
      k.id = ?
    ORDER BY
      l.hari
      DESC; 

    `, [id]);

    // Check if dataRows is not empty and has at least one row
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Logbook tidak ditemukan untuk kelompok ini' });
    }

    // Take the first row from dataRows array
    // const data = dataRows[0];

    // // Filter only the relevant fields
    // const cleanedData = {
    //   id: data.id,
    //   tanggal: data.tanggal,
    //   // Add other relevant fields here
    //   nim: data.nim,
    //   kelompok_name: data.kelompok_name,
    //   dosen: data.dosen,
    // };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching logbook data:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
}
