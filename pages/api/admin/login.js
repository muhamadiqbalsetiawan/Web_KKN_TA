import condb from "@/lib/connectDatabase";
import { useSession } from "next-auth/react";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const query = `SELECT * FROM superadmin WHERE username = ? AND password = ?`;
    condb.query(query, [username, password], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // Authentication successful
        res
          .status(200)
          .json({
            success: true,
            message: "Authenticated successfully",
            data: results[0],
          });
      } else {
        // Authentication failed
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
