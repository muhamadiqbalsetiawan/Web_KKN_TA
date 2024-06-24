import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { nim } = req.body;

    // Validate input
    if (!nim) {
      console.error("Validation Error: NIM is required for deletion.");
      return res.status(400).json({ success: false, message: "NIM is required for deletion." });
    }

    try {
      // Begin a database connection
      const connection = await condb.promise();

      // Check if the mahasiswa with the given nim exists in kelompok_mahasiswa table
      const [existingStudent] = await connection.query('SELECT * FROM kelompok_mahasiswa WHERE mahasiswa_id = ?', [nim]);

      if (existingStudent.length > 0) {
        // If the student exists in kelompok_mahasiswa table, delete the entry first
        const [resultKelompok] = await connection.query('DELETE FROM kelompok_mahasiswa WHERE mahasiswa_id = ?', [nim]);

        if (resultKelompok.affectedRows === 0) {
          console.error('No matching data found or no deletion performed in kelompok_mahasiswa table.');
          return res.status(404).json({ success: false, message: 'No matching data found or no deletion performed in kelompok_mahasiswa table.' });
        }
      }

      // Delete the data from the 'mahasiswa' table
      const [resultMahasiswa] = await connection.query("DELETE FROM mahasiswa WHERE nim = ?", [nim]);

      // Check if a record was deleted from 'mahasiswa' table
      if (resultMahasiswa.affectedRows === 0) {
        console.error(`Mahasiswa not found for NIM: ${nim}`);
        return res.status(404).json({ success: false, message: "Mahasiswa not found." });
      }

      console.log(`Mahasiswa deleted successfully for NIM: ${nim}`);
      res.status(200).json({ success: true, message: "Mahasiswa deleted successfully." });
    } catch (error) {
      console.error("Error deleting data from MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    console.error("Method Not Allowed: Only DELETE requests are allowed.");
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
