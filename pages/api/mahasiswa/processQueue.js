import processQueue from "@/cron/prosesQueue";

export default async function handler(req, res) {
  try {
    await processQueue();
    res.status(200).json({ message: 'Antrian berhasil diproses' });
  } catch (error) {
    console.error('Error saat memproses antrian:', error);
    res.status(500).json({ error: 'Gagal memproses antrian' });
  }
}
