import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { nip } = req.body;

    try {
      console.log(`Deleting data for NIP: ${nip}`);

      // Check if the dosen is associated with any kelompok
      const [kelompokResult] = await condb
        .promise()
        .query("SELECT * FROM kelompok WHERE id_dosen = ?", [nip]);

      if (kelompokResult.length > 0) {
        // If the dosen is associated with any kelompok, remove the association first
        await condb
          .promise()
          .query("UPDATE kelompok SET id_dosen = NULL WHERE id_dosen = ?", [nip]);
      }

      // Proceed to delete the dosen from the database
      const [result] = await condb
        .promise()
        .query("DELETE FROM dosen WHERE nip = ?", [nip]);

      console.log("Delete query result:", result);

      if (result.affectedRows === 1) {
        // Data was deleted successfully
        console.log("Data deleted successfully.");
        res.status(200).json({ success: true, message: "Data deleted successfully." });
      } else {
        // Data was not found for the given nip
        console.log("Data not found for the given NIP.");
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
