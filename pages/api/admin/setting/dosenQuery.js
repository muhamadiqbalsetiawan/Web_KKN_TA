import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query('SELECT * FROM dosen');
    const data = dataRows.map(row => ({ 
      nip: row.nip, 
      nama: row.nama, 
      jurusan_dosen: row.jurusan_dosen, 
      fakultas_dosen: row.fakultas_dosen, 
      telpon_dosen: row.telpon_dosen 
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
