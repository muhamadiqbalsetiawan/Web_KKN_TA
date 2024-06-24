import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query(`
      SELECT
      jenis_kelompok AS jeniskelompok
      FROM
        jenis_kkn
    `);

    const data = dataRows.map(row => ({
      id: row.id,
      jenisKelompok: row.jeniskelompok,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
