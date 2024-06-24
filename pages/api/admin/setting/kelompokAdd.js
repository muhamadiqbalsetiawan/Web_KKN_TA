import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, lokasi, dosen, ketua, jenis, l, p } = req.body;

    // Validate input
    if (!lokasi) {
      console.log("Validation failed:", { name, lokasi, dosen, ketua, jenis, l, p });
      return res.status(400).json({ success: false, message: "ID and Lokasi fields are required." });
    }

    try {
      // Insert the data into the database
      const [result] = await condb
        .promise()
        .query("INSERT INTO kelompok (name, id_lokasi, id_dosen, id_ketua, jenis_kelompok, l, p) VALUES (?, ?, ?, ?, ?, ?, ?)", [name || null, lokasi, dosen || null, ketua || null, jenis || "SISDAMAS", l , p]);

      console.log("Data added to MySQL:", { name, lokasi, dosen, ketua, jenis, l, p });
      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } catch (error) {
      console.error("Error adding data to MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    console.log("Method Not Allowed:", req.method);
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
