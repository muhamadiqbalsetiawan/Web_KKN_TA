import useSWR from 'swr';

const YourComponent = () => {
  const token = process.env.TOKEN_SECRET;
  console.log("token", token);
  const fetcher = async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  };

  const { data: negaraData, error: negaraError, isValidating: negaraLoading } = useSWR(
    'https://api.uinsgd.ac.id/master/negara/',
    fetcher
  );

  if (negaraLoading) {
    return <div>Loading...</div>;
  }

  if (negaraError) {
    return <div>Error: {negaraError.message}</div>;
  }

  // Render your component with negaraData

  return (
    <div>
      {/* Render your component with negaraData */}
      {negaraData.map((country) => (
        <div key={country.id}>{country.name}</div>
      ))}
    </div>
  );
};

export default YourComponent;
