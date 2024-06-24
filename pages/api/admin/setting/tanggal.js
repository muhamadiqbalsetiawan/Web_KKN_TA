import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { jenisKKN, tanggalMulai, tanggalBerakhir } = req.body;

      // Lakukan pemeriksaan data
      if (!Array.isArray(jenisKKN) || jenisKKN.length === 0) {
        return res.status(400).json({ success: false, message: "Jenis KKN harus diisi." });
      }

      // Iterasi setiap jenisKKN untuk memasukkan ke dalam database
      for (let i = 0; i < jenisKKN.length; i++) {
        const jenis = jenisKKN[i];
        await condb
          .promise()
          .query("INSERT INTO jenis_kkn (tanggal_mulai, tanggal_berakhir, jenis_kelompok) VALUES (?, ?, ?)", [tanggalMulai, tanggalBerakhir, jenis]);
      }

      res.status(201).json({ success: true, message: "Data berhasil disimpan." });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan saat menyimpan data." });
    }
  } else {
    res.status(405).json({ success: false, message: "Metode yang digunakan tidak diizinkan." });
  }
}
