import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    // Execute the query to fetch all FAQs
    const [result] = await condb.promise().query('SELECT * FROM faq');

    // Send the FAQ data as a JSON response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching FAQs from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
