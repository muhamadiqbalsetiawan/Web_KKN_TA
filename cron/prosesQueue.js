

import condb from "@/lib/connectDatabase";

  //row fungsion async
const processQueue = async () => {
  // Cek apakah ada user yang sedang dalam status "Siap"
  const [activeUsers] = await condb.promise().query(`
    SELECT * FROM antrian WHERE status = 'Siap'
  `);

  // Jika tidak ada user yang sedang "Siap", proses user berikutnya dalam antrian
  if (activeUsers.length === 0) {
    const [waitingUsers] = await condb.promise().query(`
      SELECT * FROM antrian WHERE status = 'Dalam Antrian'
      ORDER BY waktuPendaftaran ASC LIMIT 1
    `);

    if (waitingUsers.length > 0) {
      const userId = waitingUsers[0].userId;
      const id = waitingUsers[0].id;

      // Ganti status menjadi "Siap" untuk user berikutnya
      await condb.promise().query('UPDATE antrian SET status = ? WHERE id = ?', ['Siap', id]);

      console.log(`User ${userId} siap untuk memilih kelompok`);
    } else {
      console.log('Tidak ada user dalam antrian.');
    }
  } else {
    console.log('Masih ada user yang sedang memilih kelompok.');
  }
};

export default processQueue;
