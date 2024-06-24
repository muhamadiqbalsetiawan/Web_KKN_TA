// pages/api/mahasiswa/filesyarat/handler.js
import condb from '@/lib/connectDatabase';

const handler = async function (req, res) {
  const { nim } = req.body;

  try {
    // Check if the user exists with the provided nim
    const [user] = await condb.promise().query('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);

    if (!user.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the bukti_syarat field in the mahasiswa table with file content
    await condb
      .promise()
      .query('UPDATE mahasiswa SET bukti_syarat = ? WHERE nim = ?', [req.file.buffer, nim]);

    res.status(200).json({ success: true, message: 'Bukti syarat updated successfully' });
  } catch (error) {
    console.error('Error updating bukti_syarat:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export default handler;
