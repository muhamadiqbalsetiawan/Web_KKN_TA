import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      console.log(`Deleting data for kelompok id: ${id}`);

      // Check if there are any entries in kelompok_mahasiswa referencing the kelompok_id
      const [checkResult] = await condb
        .promise()
        .query("SELECT * FROM kelompok_mahasiswa WHERE kelompok_id = ?", [id]);

      // If there are entries in kelompok_mahasiswa, delete them first
      if (checkResult.length > 0) {
        const [deleteResult] = await condb
          .promise()
          .query("DELETE FROM kelompok_mahasiswa WHERE kelompok_id = ?", [id]);

        console.log("Deleted entries in kelompok_mahasiswa:", deleteResult);
      }

      // Delete the data in the kelompok table
      const [result] = await condb
        .promise()
        .query("DELETE FROM kelompok WHERE id = ?", [id]);

      console.log("Delete query result:", result);

      if (result.affectedRows === 1) {
        // Data was deleted successfully
        console.log("Data deleted successfully.");
        res.status(200).json({ success: true, message: "Data deleted successfully." });
      } else {
        // Data was not found for the given id
        console.log("Data kelompok not found for the given ID.");
        res.status(404).json({ success: false, message: "Data not found for the given ID." });
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
