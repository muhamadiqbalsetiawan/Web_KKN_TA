export default async function handler(req, res) {
  try {
    // Fetch Bearer token from process.env.TOKEN_SECRET
    const token = process.env.TOKEN_SECRET;

    // Check if the token is available
    if (!token) {
      return res.status(401).json({ error: 'Bearer token is missing or invalid' });
    }

    // Construct the URL with query parameters
    const apiUrl = 'https://api.uinsgd.ac.id/master/negara/';
    const queryParams = new URLSearchParams({ page: req.query.page || 1, limit: req.query.limit || 1000 });
    const urlWithParams = `${apiUrl}?${queryParams.toString()}`;

    // Fetch data from the external API using Bearer token
    const apiResponse = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the request was successful
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return res.status(apiResponse.status).json({ error: errorData.message });
    }

    // Parse and send the data from the external API
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
