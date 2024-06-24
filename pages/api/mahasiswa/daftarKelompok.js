import condb from '@/lib/connectDatabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { kelompok_id, mahasiswa_id, gender, jurusan } = req.body;

  if (!kelompok_id || !mahasiswa_id || !gender || !jurusan) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    // Check if the kelompok is full for the given gender
    const [kelompokResult] = await condb.promise().query(`
      SELECT l, p FROM kelompok WHERE id = ?
    `, [kelompok_id]);
    const { l, p } = kelompokResult[0];

    // Count the number of male and female students already registered in the kelompok
    const [countResult] = await condb.promise().query(`
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
      return res.status(403).json({ success: false, message: 'PENUH' });
    }

    // Check if any mahasiswa with the same jurusan are already registered in the kelompok
    // const [checkJurusanResult] = await condb.promise().query(`
    //   SELECT COUNT(*) AS count FROM kelompok_mahasiswa km
    //   JOIN mahasiswa m ON km.mahasiswa_id = m.nim
    //   WHERE km.kelompok_id = ? AND m.jurusan = ?
    // `, [kelompok_id, jurusan]);
    // const { count } = checkJurusanResult[0];

    // if (count > 0) {
    //   return res.status(403).json({ success: false, message: 'JURUSAN_PENUH' });
    // }

    // Insert data into kelompok_mahasiswa table
    const [result] = await condb.promise().query(`
      INSERT INTO kelompok_mahasiswa (kelompok_id, mahasiswa_id)
      VALUES (?, ?)
    `, [kelompok_id, mahasiswa_id]);

    res.status(201).json({ success: true, message: 'Data inserted successfully', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
