import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const { nim } = req.query;

    if (!nim) {
      return res.status(400).json({ error: 'Missing required parameter: nim' });
    }

    const [dataRows] = await condb.promise().query(
      'SELECT * FROM mahasiswa WHERE nim = ?',
      [nim]
    );

    if (dataRows.length === 0) {
      return res.status(404).json({ error: 'Data not found' });
    }

    const data = dataRows.map(row => ({ 
      nim: row.nim, 
      name: row.name, 
      gender: row.gender,
      jurusan: row.jurusan, 
      fakultas: row.fakultas, 
      telpon: row.telpon,
      universitas: row.universitas,
      telpon_wali: row.telpon_wali,
      nilai: row.nilai,
      status_syarat: row.status_syarat,
      // status_syarat: row.status_syarat,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
