import condb from '@/lib/connectDatabase';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { nim, nama, jurusan, fakultas, telpon, gender, kelompok_id } = req.body;

    // Validate input
    if (!nim || !nama || !gender) {
      console.error('Validation Error: NIM, Name, and Gender fields are required.');
      return res.status(400).json({ success: false, message: 'NIM, Name, and Gender fields are required.' });
    }

    try {
      const connection = await condb.promise();

      // Check if kelompok_id exists
      if (!kelompok_id) {
        // If kelompok_id does not exist, only update the mahasiswa data
        const [result] = await connection.query('UPDATE mahasiswa SET name = ?, jurusan = ?, fakultas = ?, telpon = ?, gender = ? WHERE nim = ?', [
          nama,
          jurusan || null,
          fakultas || null,
          telpon || null,
          gender,
          nim
        ]);

        if (result.affectedRows === 0) {
          console.log('Error updating data in mahasiswa table.');
          return res.status(500).json({ success: false, message: 'Error updating data in mahasiswa table.' });
        }

        // If update successful, send success response
        console.log('Data updated successfully for NIM:', nim);
        return res.status(200).json({ success: true, message: 'Data updated successfully.' });
      }

      // Check if the student with the given nim exists in kelompok_mahasiswa table
      const [existingStudent] = await connection.query('SELECT * FROM kelompok_mahasiswa WHERE mahasiswa_id = ?', [nim]);

      if (existingStudent.length > 0 && existingStudent[0].kelompok_id === kelompok_id) {
        // If the student exists in kelompok_mahasiswa table and is in the same kelompok, update the mahasiswa data only
        const [result] = await connection.query('UPDATE mahasiswa SET name = ?, jurusan = ?, fakultas = ?, telpon = ?, gender = ? WHERE nim = ?', [
          nama,
          jurusan || null,
          fakultas || null,
          telpon || null,
          gender,
          nim
        ]);

        if (result.affectedRows === 0) {
          console.log('Error updating data in mahasiswa table.');
          return res.status(500).json({ success: false, message: 'Error updating data in mahasiswa table.' });
        }

        // If update successful, send success response
        console.log('Data updated successfully for NIM:', nim);
        return res.status(200).json({ success: true, message: 'Data updated successfully.' });
      }

      // If kelompok_id exists and student is not in the same kelompok, update both mahasiswa data and kelompok_mahasiswa
      const [kelompokResult] = await connection.query('SELECT l, p FROM kelompok WHERE id = ?', [kelompok_id]);

      if (kelompokResult.length === 0) {
        console.error('No kelompok found for the given ID:', kelompok_id);
        return res.status(404).json({ success: false, message: 'No kelompok found for the given ID.' });
      }

      const { l, p } = kelompokResult[0];

      // Count the number of male and female students already registered in the kelompok
      const [countResult] = await connection.query(`
        SELECT
          SUM(CASE WHEN m.gender = 'L' THEN 1 ELSE 0 END) AS male_count,
          SUM(CASE WHEN m.gender = 'P' THEN 1 ELSE 0 END) AS female_count
        FROM kelompok_mahasiswa km
        JOIN mahasiswa m ON km.mahasiswa_id = m.nim
        WHERE km.kelompok_id = ?
      `, [kelompok_id]);
      const { male_count, female_count } = countResult[0];

      // Check if the kelompok is full based on gender
      if ((gender === 'L' && male_count >= l) || (gender === 'P' && female_count >= p)) {
        return res.status(403).json({ success: false, message: 'The kelompok is full for the given gender' });
      }

      // Update mahasiswa data
      const [result1] = await connection.query('UPDATE mahasiswa SET name = ?, jurusan = ?, fakultas = ?, telpon = ?, gender = ? WHERE nim = ?', [
        nama,
        jurusan || null,
        fakultas || null,
        telpon || null,
        gender,
        nim
      ]);

      // Update kelompok_mahasiswa
      const [updateResult] = await connection.query('UPDATE kelompok_mahasiswa SET kelompok_id = ? WHERE mahasiswa_id = ?', [kelompok_id, nim]);

      if (updateResult.affectedRows === 0) {
        // If no existing record found, insert the new record into kelompok_mahasiswa
        const [insertResult] = await connection.query('INSERT INTO kelompok_mahasiswa (kelompok_id, mahasiswa_id) VALUES (?, ?)', [kelompok_id, nim]);
        if (insertResult.affectedRows === 0) {
          console.log('Error inserting data into kelompok_mahasiswa table.');
          return res.status(500).json({ success: false, message: 'Error inserting data into kelompok_mahasiswa table.' });
        }
      }

      // If all updates are successful, send success response
      console.log('Data updated successfully for NIM:', nim);
      res.status(200).json({ success: true, message: 'Data updated successfully.' });
    } catch (error) {
      console.error('Error updating data in MySQL:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    console.error('Method Not Allowed: Only PUT requests are allowed.');
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
