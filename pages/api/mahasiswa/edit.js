import con from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mhs_nim, mhs_nama } = req.body;

    try {
      // Update the data in the database
      const [result] = await con
        .promise()
        .query("UPDATE mahasiswa SET mhs_nama = ? WHERE mhs_nim = ?", [mhs_nama, mhs_nim]);

      res.status(200).json({ success: true, message: "Data updated successfully." });
    } catch (error) {
      console.error("Error updating data in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
