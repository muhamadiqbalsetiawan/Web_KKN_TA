import { useState } from 'react';
import { mutate } from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Gagal mengambil data');
  }
  return response.json();
};

const TambahData = () => {
  const [id, setId] = useState('');
  const [nama, setNama] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('nama', nama);
    formData.append('file', file); // Sertakan file yang dipilih

    const apiUrl = '/api/add'; // Ganti dengan URL API Anda

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        mutate('/api/query');
        setId('');
        setNama('');
        console.log('Berhasil menambahkan data');
      } else {
        console.error('Gagal menambahkan data');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div>
      <h1>Form Tambah Data</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="id">Id:</label>
        <input
          type="text" // Ganti type menjadi "text" atau "number" sesuai kebutuhan
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <div>
          <label htmlFor="nama">Nama:</label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>
        <input
          type="file"
          id='file'
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Tambah Data</button>
      </form>
    </div>
  );
};

export default TambahData;
