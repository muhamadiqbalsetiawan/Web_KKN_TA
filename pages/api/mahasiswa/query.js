import con from "../../../lib/db";

export default async function handler (req, res) {  
  try {
    await con.ping();
    const [rows] = await con.promise().query('SELECT * FROM mahasiswa')
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}