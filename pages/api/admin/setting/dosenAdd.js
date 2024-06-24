import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { nip, nama, jurusan_dosen, fakultas_dosen, telpon_dosen } = req.body;

    // Validate input
    if (!nip || !nama ) {
      return res.status(400).json({ success: false, message: "NIP and Name fields are required." });
    }

    try {
      // Insert the data into the database
      const [result] = await condb
        .promise()
        .query("INSERT INTO dosen (nip, nama, jurusan_dosen, fakultas_dosen, telpon_dosen) VALUES (?, ?, ?, ?, ?)", [nip, nama, jurusan_dosen || null, fakultas_dosen || null, telpon_dosen || null]);

      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } catch (error) {
      console.error("Error adding data to MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
