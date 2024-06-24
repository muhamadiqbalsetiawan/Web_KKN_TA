import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query(`
      SELECT
      DATE_FORMAT(tanggal_mulai, '%Y-%m-%d') AS tanggal_mulai,
      DATE_FORMAT(tanggal_berakhir, '%Y-%m-%d') AS tanggal_berakhir,
      jenis_kelompok AS jenis_kelompok
      FROM
      jenis_kkn
    
    `);

    // Mengisi objek data dengan data yang diterima dari database
    const data = dataRows.map(row => ({
      tanggalMulai: row.tanggal_mulai,
      tanggalBerakhir: row.tanggal_berakhir,
      jenis_KKN: row.jenis_kelompok
      // tambahkan properti lain jika ada
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// import condb from "../../../../lib/connectDatabase";

// export default async function handler(req, res) {
//   try {
//     const [dataRows] = await condb.promise().query(`
//       SELECT
//         id,
//         DATE_FORMAT(tanggal_mulai, '%Y-%m-%d') AS tanggal_mulai,
//         DATE_FORMAT(tanggal_berakhir, '%Y-%m-%d') AS tanggal_berakhir,
//         jenis_kelompok
//       FROM
//         tanggal
//     `);

//     // Mengisi objek data dengan data yang diterima dari database
//     const data = [];
//     for (const row of dataRows) {
//       const existingData = data.find(item => item.tanggalMulai === row.tanggal_mulai && item.tanggalBerakhir === row.tanggal_berakhir);
//       if (existingData) {
//         existingData.jenis_KKN.push(row.jenis_kelompok);
//       } else {
//         data.push({
//           id: row.id,
//           tanggalMulai: row.tanggal_mulai,
//           tanggalBerakhir: row.tanggal_berakhir,
//           jenis_KKN: [row.jenis_kelompok]
//         });
//       }
//     }

//     res.status(200).json(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
