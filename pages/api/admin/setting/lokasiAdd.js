import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { kelurahan, kecamatan, kota, provinsi, negara } = req.body;

    // Validate input
    // if (!kelurahan || !kecamatan || !kota || !provinsi) {
    //   return res.status(400).json({ success: false, message: "All fields are required." });
    // }

    try {
      // Insert the data into the database
      const [result] = await condb
        .promise()
        .query("INSERT INTO lokasi (kelurahan, kecamatan, kota, provinsi, negara) VALUES (?, ?, ?, ?, ?)", [kelurahan, kecamatan, kota, provinsi, negara]);

      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } catch (error) {
      console.error("Error adding data to MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
