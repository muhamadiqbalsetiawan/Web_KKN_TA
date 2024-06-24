import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { nim, name, gender, jurusan, fakultas, telpon } = req.body;

      // Validate input
      if (!nim || !name) {
        console.error("Validation Error: NIM and Name fields are required.");
        return res.status(400).json({ success: false, message: "NIM and Name fields are required." });
      }

      // Validate nim is a number
      if (isNaN(nim)) {
        console.error("Validation Error: NIM must be a number.");
        return res.status(400).json({ success: false, message: "NIM must be a number." });
      }

      // Insert the data into the database
      const [result] = await condb
        .promise()
        .query("INSERT INTO mahasiswa (nim, name, gender, jurusan, fakultas, telpon) VALUES (?, ?, ?, ?, ?, ?)", [nim, name, gender, jurusan, fakultas, telpon]);

      console.log("Data added successfully. Insert ID:", result.insertId);
      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } else {
      console.error("Method Not Allowed: Only POST requests are allowed.");
      res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
