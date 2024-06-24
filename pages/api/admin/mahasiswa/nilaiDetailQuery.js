// pages/api/admin/mahasiswa/nilaiDetailQuery.js
import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [result] = await condb
      .promise()
      .query(
        `
        SELECT mahasiswa.nim, mahasiswa.name, mahasiswa.gender, mahasiswa.jurusan, mahasiswa.fakultas, mahasiswa.universitas, mahasiswa.nilai FROM mahasiswa JOIN kelompok_mahasiswa ON mahasiswa.nim = kelompok_mahasiswa.mahasiswa_id 
        JOIN kelompok ON kelompok_mahasiswa.kelompok_id = kelompok.id 
        WHERE kelompok.id = ?;
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
