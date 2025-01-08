import condb from "@/lib/connectDatabase";

export default async function handler (req, res) {

    try {
        const [user] = await condb.promise().query('SELECT * FROM antrian');

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ error: 'User not Found in Queue.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err });
    }
}