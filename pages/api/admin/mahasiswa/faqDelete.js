// Import necessary modules
import condb from '@/lib/connectDatabase';

// API handler function
export default async function handler(req, res) {
  try {
    // Extract the FAQ ID from the request body or query parameters
    const { faq_id } = req.body;

    // Check if FAQ ID is provided
    if (!faq_id) {
      return res.status(400).json({ success: false, message: 'FAQ ID is required for deletion.' });
    }

    // Delete the FAQ with the specified ID
    const [result] = await condb.promise().query('DELETE FROM faq WHERE faq_id = ?', [faq_id]);

    // Check if any rows were affected (indicating successful deletion)
    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'FAQ deleted successfully.' });
    } else {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
