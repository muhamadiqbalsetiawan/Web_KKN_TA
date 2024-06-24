import con from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ekstrak jenis KKN dari parameter query
      const jenisKKN = req.query.jenis_kkn;

      let rows; // Mendefinisikan variabel rows di sini

      // Ambil data dari database berdasarkan jenis KKN
      if (jenisKKN === "Semua") {
        [rows] = await con.promise().query(`
            SELECT m.*, 
                km.kelompok_id,
                k.id AS kelompok_id,
                k.name AS nama_kelompok,
                k.jenis_kelompok,
                jk.jenis_kelompok 
            FROM mahasiswa m
            LEFT JOIN kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
            LEFT JOIN kelompok k ON km.kelompok_id = k.id
            LEFT JOIN jenis_kkn jk ON k.jenis_kelompok = jk.jenis_kelompok;

        `);
      } else {
        [rows] = await con.promise().query(`
        SELECT 
        m.*, 
        km.kelompok_id,
        k.id AS kelompok_id,
        k.name AS nama_kelompok,
        k.jenis_kelompok,
        jk.jenis_kelompok 
    FROM 
        mahasiswa m
    LEFT JOIN 
        kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
    LEFT JOIN 
        kelompok k ON km.kelompok_id = k.id
    LEFT JOIN 
        jenis_kkn jk ON k.jenis_kelompok = jk.jenis_kelompok
    WHERE 
        jk.jenis_kelompok = ?;
    
        `, [jenisKKN]);
      }
    
      if (rows !== undefined && rows !== null) {
        res.status(200).json(rows);
      } else {
        res.status(404).json({ success: false, message: 'Data not found' });
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
