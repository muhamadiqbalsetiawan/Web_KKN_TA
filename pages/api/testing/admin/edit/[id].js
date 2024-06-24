// pages/api/edit/[id].js
import con from "../../../../../lib/db2";

export default async function handler(req, res) {
  const { id } = req.query;
  const { newJenisKKN } = req.body;

  try {
    // Update Jenis KKN in the database
    const [result] = await con.promise().query(
      'UPDATE anggotakkn SET jeniskkn = ? WHERE id_anggotakkn = ?',
      [newJenisKKN, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Jenis KKN updated successfully' });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    console.error('Error updating Jenis KKN:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}