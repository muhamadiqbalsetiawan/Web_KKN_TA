// pages/api/delete.js
import con from "@/lib/connectDatabase";


export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { nim} = req.body;

    try {
      // Delete the data in the database
      const [result] = await con  
        .promise()
        .query("DELETE FROM kelompok_mahasiswa WHERE mahasiswa_id = ?", [nim]);

      if (result.affectedRows === 1) {
        // Data was deleted successfully
        res.status(200).json({ success: true, message: "Data deleted successfully." });
      } else {
        // Data was not found for the given mhs_nim
        res.status(404).json({ success: false, message: "Data not found for the given ID." });
      }
    } catch (error) {
      console.error("Error deleting data in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
