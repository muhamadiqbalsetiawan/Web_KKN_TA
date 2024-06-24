import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [result] = await condb
      .promise()
      .query(
        `
        SELECT
            km.kelompok_id,
            COUNT(CASE WHEN m.gender = 'L' THEN 1 END) AS male_count,
            COUNT(CASE WHEN m.gender = 'P' THEN 1 END) AS female_count
        FROM
            kelompok_mahasiswa km
            JOIN mahasiswa m ON km.mahasiswa_id = m.nim
        GROUP BY
            km.kelompok_id;
        `,);

    if (result.length === 0) {
      res.status(404).json({ error: 'Group not found' });
    } else {
      res.status(200).json(result); // Return the entire result array
    }
  } catch (error) {
    console.error('Error fetching group details from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
