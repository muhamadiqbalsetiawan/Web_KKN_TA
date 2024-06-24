import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, role, image } = req.body;
    try {
      const query = `INSERT INTO akun_mahasiswa_luar (username, password, role, image) VALUES (?, ?, ?, ?)`;
      const [result] = await condb
        .promise()
        .query( query, [username, password, role, image]);

      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } catch (error) {
      console.error("Error adding data to MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
