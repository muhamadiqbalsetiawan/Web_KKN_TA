import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { nim } = req.query;

  try {
    // Execute the query to fetch data based on nim
    const [result] = await condb.promise().query('SELECT * FROM dummy WHERE nim = ?', [nim]);

    // Check if the result is empty
    if (result.length === 0) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      // Send the data as a JSON response
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
