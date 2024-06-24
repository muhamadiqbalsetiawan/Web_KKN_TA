import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb
      .promise()
      .query("SELECT * FROM akun_mahasiswa_luar");
    const data = dataRows.map((row) => ({
      username: row.username,
      password: row.password,
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
