// pages/api/auth/checkUserExists.js

import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ success: false, message: "Username field is required." });
    }

    try {
      // Check if the user already exists in the database
      const [result] = await condb
        .promise()
        .query("SELECT COUNT(*) as count FROM akun_mahasiswa WHERE username = ?", [username]);

      const userExists = result[0].count > 0;

      res.status(200).json({ success: true, exists: userExists });
    } catch (error) {
      console.error("Error checking user existence in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
