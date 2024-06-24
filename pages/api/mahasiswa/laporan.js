import condb from "../../../lib/connectDatabase";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "./uploads/pdf/laporan/"; // Tentukan folder upload sesuai dengan kebutuhan
    const ext = path.extname(file.originalname);
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage : storage });    
    export const config = {
      api: {
        bodyParser: false,
      },
    };

export default async function handler(req, res) {
  if (req.method === "POST") {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Gagal mengunggah file', details: err.message });
      }

      const { mahasiswa_id, judul } = req.body;
      const file = req.file;

      // Validate input (adjust the validation based on your actual requirements)
      if (!mahasiswa_id || !judul || !file) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      try {
        // Insert the data into the database
        const [result] = await condb
          .promise()
          .query(
            "INSERT INTO file (id_mahasiswa, judul, laporan) VALUES (?, ?, ?)",
            [mahasiswa_id, judul, file.originalname] // Sesuaikan dengan nama file atau path yang sesuai
          );

        res.status(201).json({ success: true, message: "Data added successfully.", data: result.insertId });
      } catch (error) {
        console.error("Error adding data to MySQL:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    });
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
