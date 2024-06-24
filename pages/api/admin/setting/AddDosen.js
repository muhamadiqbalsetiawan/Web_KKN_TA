import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query(`SELECT * FROM dosen`);

    if (dataRows.length === 0) {
      res.status(404).json({ error: 'Group not found' });
    } else {
      res.status(200).json(dataRows); // Return the entire result array
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
