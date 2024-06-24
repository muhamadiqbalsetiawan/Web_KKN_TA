import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [result] = await condb
      .promise()
      .query(
        ` SELECT
        m.nim,
        m.name,
        m.gender,
        m.jurusan,
        m.fakultas,
        m.universitas,
        m.telpon,
        m.foto
    FROM
        kelompok_mahasiswa km
        JOIN mahasiswa m ON km.mahasiswa_id = m.nim
    WHERE
        km.kelompok_id = ?;    
      `,
        [id]
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
