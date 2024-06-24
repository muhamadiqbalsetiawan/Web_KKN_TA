import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { nip, nama, jurusan_dosen, fakultas_dosen, telpon_dosen } = req.body;

    try {
      console.log("Updating data in the database...");
      console.log("Request Body:", req.body);

      // Update the data in the database
      const [result] = await condb
        .promise()
        .query(
          "UPDATE dosen SET nama = ?, jurusan_dosen = ?, fakultas_dosen = ?, telpon_dosen = ? WHERE nip = ?",
          [nama, jurusan_dosen || null, fakultas_dosen || null, telpon_dosen || nul, nip]
        );

      console.log("Updated successfully:", result);
      console.log("NIP:", nip);

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
