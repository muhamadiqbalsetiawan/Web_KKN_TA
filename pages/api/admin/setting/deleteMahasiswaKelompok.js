import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { nim } = req.body;

    try {
      console.log(`Deleting data for kelompok id: ${nim}`);

      // Delete the data in the database
      const [result] = await condb
        .promise()
        .query("DELETE FROM kelompok_mahasiswa WHERE mahasiswa_id = ?", [nim]);

      console.log("Delete query result:", result);

      if (result.affectedRows === 1) {
        // Data was deleted successfully
        console.log("Data deleted successfully.");
        res.status(200).json({ success: true, message: "Data deleted successfully." });
      } else {
        // Data was not found for the given nip
        console.log("Data kelompok not found for the given ID.");
        res.status(404).json({ success: false, message: "Data not found for the given NIP." });
      }
    } catch (error) {
      console.error("Error deleting data in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    console.log("Method Not Allowed:", req.method);
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}