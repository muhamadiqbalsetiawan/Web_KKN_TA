// lokasiApi.js
import useSWR from 'swr';
import condb from '../../../lib/connectDatabase';

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const getLokasiData = async () => {
  const [rows] = await condb.promise().query('SELECT * FROM lokasi');
  return rows;
};

export const useLokasiData = () => {
  const { data, error } = useSWR('/api/lokasi', fetcher);

  return {
    data,
    isLoading: !data && !error,
    isError: error,
  };
};
