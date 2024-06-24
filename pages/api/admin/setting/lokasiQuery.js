// pages/api/lokasi.js
import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query('SELECT * FROM lokasi');
    const data = dataRows.map(row => ({ 
      id: row.id, 
      kelurahan: row.kelurahan, 
      kecamatan: row.kecamatan, 
      kota: row.kota, 
      provinsi: row.provinsi,
      negara: row.negara
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
