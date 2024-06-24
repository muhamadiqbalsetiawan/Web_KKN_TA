import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, roles, status_profil } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Validation failed. Username and Password fields are required.');
      return res.status(400).json({ success: false, message: "Username and Password fields are required." });
    }

    try {
      console.log('Inserting data into the database...');
      // Insert the data into the database
      const [result] = await condb
        .promise()
        .query("INSERT INTO akun_mahasiswa (username, password, roles, status_profil) VALUES (?, ?, ?, ?)", [username, password, roles || null, status_profil || 0]);

      console.log('Data added successfully. ID:', result.insertId);
      res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
    } catch (error) {
      console.error('Error adding data to MySQL:', error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    console.warn('Method Not Allowed.');
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
