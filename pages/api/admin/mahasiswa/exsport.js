import excel from 'exceljs';
import con from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ekstrak jenis KKN dari parameter query
      const jenisKKN = req.query.jenis_kkn;

      let rows; // Mendefinisikan variabel rows di sini

      // Memodifikasi kueri untuk menggabungkan tabel dan mengambil data berdasarkan 'jenis_kkn'
      if (jenisKKN === "Semua") {
        [rows] = await con.promise().query(`
          SELECT m.nim, m.name, m.gender, m.jurusan, m.fakultas, m.telpon, m.nilai, m.syarat, k.name AS jenis_kkn
          FROM mahasiswa m
          LEFT JOIN kelompok_mahasiswa km ON m.nim = km.mahasiswa_id
          LEFT JOIN kelompok k ON km.kelompok_id = k.id
        `);
      } else {
        [rows] = await con.promise().query(`
          SELECT m.nim, m.name, m.gender, m.jurusan, m.fakultas, m.telpon, m.nilai, m.syarat, k.name AS jenis_kkn
          FROM mahasiswa m
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

      // Jika tidak ada data yang ditemukan, kirimkan respons ke frontend
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: "Data tidak ditemukan." });
      }

      // Buat workbook dan worksheet baru
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Mahasiswa');

      // Tentukan kolom-kolom
      worksheet.columns = [
        { header: 'NIM', key: 'nim', width: 15 },
        { header: 'Nama', key: 'name', width: 25 },
        { header: 'Jenis Kelamin', key: 'gender', width: 15 },
        { header: 'Jurusan', key: 'jurusan', width: 30 },
        { header: 'Fakultas', key: 'fakultas', width: 20 },
        { header: 'Telpon', key: 'telpon', width: 15 },
        { header: 'Nilai', key: 'nilai', width: 15 },
        { header: 'Syarat', key: 'syarat', width: 15 },
        { header: 'Jenis KKN', key: 'jenis_kkn', width: 20 },
      ];

      // Tambahkan baris data
      rows.forEach(row => {
        worksheet.addRow(row);
      });

      // Atur lebar kolom secara otomatis sesuai konten
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = (maxLength + 2) < 10 ? 10 : (maxLength + 2);
      });

      // Atur header respon
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="mahasiswa_${jenisKKN}.xlsx"`);

      // Serialize workbook ke dalam buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Kirim buffer sebagai respons
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
