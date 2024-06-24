import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, nama } = req.body;

    // Validate input
    if (!username || !password || !nama) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
      // Insert the data into the database
      const [result] = await condb
        .promise()
        .query("INSERT INTO admin (username, password, nama) VALUES (?, ?, ?)", [username, password, nama]);

      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } catch (error) {
      console.error("Error adding data to MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
