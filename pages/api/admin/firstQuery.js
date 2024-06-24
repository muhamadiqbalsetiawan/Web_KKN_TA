import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [result] = await condb.promise().query(`
    SELECT
      (SELECT COUNT(*) FROM mahasiswa) AS mahasiswa_count,
      (SELECT COUNT(*) FROM dosen) AS dosen_count,
      (SELECT COUNT(*) FROM mahasiswa WHERE gender = 'L') AS male_mahasiswa_count,
      (SELECT COUNT(*) FROM mahasiswa WHERE gender = 'P') AS female_mahasiswa_count;
    `);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data from MySQL:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
