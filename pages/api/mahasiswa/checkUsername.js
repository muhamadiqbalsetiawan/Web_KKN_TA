import condb from '@/lib/connectDatabase';

export default async function handler(req, res) {
    console.log("Received request to check username:", req.query.username);

    // Pastikan request adalah method GET
    if (req.method === 'GET') {
        const { username } = req.query;

        // Lakukan query ke database untuk memeriksa keberadaan username dalam tabel mahasiswa
        try {
            const query = `SELECT * FROM mahasiswa WHERE nim = ?`;
            const [result] = await condb.promise().query(query, [username]);

            // Jika ada baris yang ditemukan, kirim respons bahwa username ditemukan
            if (result.length > 0) {
                console.log("Username found in database.");
                result.exist = true; 
                res.status(200).json(result.exist);
            } else {
                // Jika tidak ada baris yang ditemukan, kirim respons bahwa username tidak ditemukan
                console.log("Username not found in database.");
                result.exist = false; 
                res.status(200).json(result.exist);
            }
        } catch (error) {
            console.error("Error executing query:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        // Jika bukan method GET, kirim respons dengan status 405 (Method Not Allowed)
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
