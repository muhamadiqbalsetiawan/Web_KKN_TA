import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query('SELECT * FROM mahasiswa');
    const data = dataRows.map(row => ({ 
      nim: row.nim, 
      name: row.name, 
      gender: row.gender,
      jurusan: row.jurusan, 
      fakultas: row.fakultas, 
      telpon: row.telpon,
      nilai: row.nilai,
      syarat: row.syarat,
      jenis_kkn: row.jenis_kkn
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
