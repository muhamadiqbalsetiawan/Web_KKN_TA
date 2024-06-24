// Import necessary dependencies
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  try {
    // Retrieve the session to get the user's token
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Extract the username from the session
    const { user } = session;
    const nim = user.username;

    const token = process.env.TOKEN_SKS;

    // Fetch data from the external API using the provided nim and token
    const apiUrl = `https://api.uinsgd.ac.id/salam/v1/index.php/Krs/hasilStudi?nim=${nim}`;
    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch data from external API');
    }

    const data = await apiResponse.json();
    const dataArray = data.data;

    // Return the fetched data
    res.status(200).json(dataArray);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
