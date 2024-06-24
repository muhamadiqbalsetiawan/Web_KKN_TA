// Import your database connection module (assuming it's named condb)
import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    // Extract data from the request body
    const { pertanyaan, jawaban } = req.body;

    // Validate input
    if (!pertanyaan || !jawaban) {
      return res.status(400).json({ success: false, message: "Pertanyaan and Jawaban fields are required." });
    }

    // Execute the query to insert a new FAQ
    const [result] = await condb.promise().query('INSERT INTO faq (pertanyaan, jawaban) VALUES (?, ?)', [pertanyaan, jawaban]);

    // Fetch the inserted FAQ data
    const [insertedData] = await condb.promise().query('SELECT * FROM faq WHERE faq_id = ?', [result.insertId]);

    // Send the inserted FAQ data as a JSON response
    res.status(200).json({ success: true, faq: insertedData[0] });
  } catch (error) {
    console.error('Error inserting FAQ into MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
