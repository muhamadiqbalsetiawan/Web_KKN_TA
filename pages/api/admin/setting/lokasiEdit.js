import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id, kelurahan, kecamatan, kota, provinsi, negara } = req.body;

    try {
      // Update the data in the database
      const [result] = await condb
        .promise()
        .query(
          "UPDATE lokasi SET kelurahan = ?, kecamatan = ?, kota = ?, provinsi = ?, negara=? WHERE id = ?",
          [kelurahan, kecamatan, kota, provinsi, negara, id]
        );

      res.status(200).json({ success: true, message: "Data updated successfully." });
    } catch (error) {
      console.error("Error updating data in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}