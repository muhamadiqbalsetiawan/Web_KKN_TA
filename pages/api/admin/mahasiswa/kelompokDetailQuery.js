import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [result] = await condb
      .promise()
      .query(
        ` SELECT 
            k.id,
            k.name AS kelompok_name,
            l.kota,
            d.nama AS dosen_name,
            m.name AS ketua_name,
            k.jenis_kelompok AS jenis
        FROM
           kelompok k
        LEFT JOIN lokasi l ON k.id_lokasi = l.id
        LEFT JOIN dosen d ON k.id_dosen = d.nip            
        LEFT JOIN mahasiswa m ON k.id_ketua = m.nim;`,
      );

    if (result.length === 0) {
      res.status(404).json({ error: 'Group not found' });
    } else {
      res.status(200).json(result); // Return the entire result array
    }
  } catch (error) {
    console.error('Error fetching group details from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
