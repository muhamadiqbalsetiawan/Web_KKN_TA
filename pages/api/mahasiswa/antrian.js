import condb from '@/lib/connectDatabase';
import processQueue from '@/cron/prosesQueue'; // Import processQueue

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, status, waktuPendaftaran } = req.body;

    // Insert data ke database
    await condb.promise().query('INSERT INTO antrian (userId, status, waktuPendaftaran) VALUES (?, ?, ?)', [userId, status, waktuPendaftaran]);

    // Jalankan proses antrian setelah pendaftaran
    await processQueue();

    res.status(200).json({ message: 'Pendaftaran berhasil dan antrian diproses' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
