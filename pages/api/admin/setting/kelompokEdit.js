import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id, name, lokasi_id, dosen_nip, mahasiswa_nim, jenis_kelompok, batas_laki, batas_perempuan } = req.body;

    try {
      console.log("Updating data in the database...");
      console.log("Request Body:", req.body);

      // Update the data in the database
      const [result] = await condb
        .promise()
        .query(
          "UPDATE kelompok SET name = ?, id_lokasi = ?, id_dosen = ?, id_ketua = ?, jenis_kelompok = ?, l = ?, p = ? WHERE id = ?",
          [name, lokasi_id, dosen_nip, mahasiswa_nim, jenis_kelompok, batas_laki, batas_perempuan, id]
        );

      console.log("Updated successfully:", result);
      console.log("ID:", id);

      res.status(200).json({ success: true, message: "Data updated successfully." });
    } catch (error) {
      console.error("Error updating data in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    console.log("Method Not Allowed:", req.method);
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
