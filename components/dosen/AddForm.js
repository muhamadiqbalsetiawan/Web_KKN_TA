import Link from "next/link";
import React, { useState } from "react";
import { mutate } from 'swr';

export default function AddForm() {
  const [dsn_id, setId] = useState('');
  const [dsn_nama, setNama] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handlePdfFileChange = (e) => {
    const uploadedPdfFile = e.target.files[0];
    setPdfFile(uploadedPdfFile);  
  };

  const handleImageFileChange = (e) => {
    const uploadedImageFile = e.target.files[0];
    setImageFile(uploadedImageFile);  
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dsn_id') {
      setId(value);
    } else if (name === 'dsn_nama') {
      setNama(value);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('dsn_id', dsn_id);
      formData.append('dsn_nama', dsn_nama);
      
      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await fetch("/api/dosen/add", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful addition (e.g., show a success message)
        mutate('/api/dosen/query');
        setId('');
        setNama('');
        setPdfFile(null);
        setImageFile(null);
        console.log('Berhasil menambahkan data');
      } else {
        // Handle addition error
        console.error("Error adding data:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div>
      <form
        className="w-1/3 justify-center border-2 flex flex-col gap-4 m-4 p-2"
        onSubmit={handleAddSubmit}
      >
        <div>
          <label htmlFor="dsn_id">ID Mahasiswa</label>
          <input
            className="border-2 border-gray-200 p-2"
            type="text"
            id="dsn_id"
            name="dsn_id"
            value={dsn_id}
            onChange={handleDataChange}
          />
        </div>
        <div>
          <label htmlFor="dsn_nama">Nama Mahasiswa</label>
          <input
            className="border-2 border-gray-200 p-2"
            type="text"
            id="dsn_nama"
            name="dsn_nama"
            value={dsn_nama}
            onChange={handleDataChange}
          />
        </div>

        <div>
          <label htmlFor="pdfFileUpload">Upload PDF</label>
          <input
            type="file"
            id="pdfFile"
            accept="application/pdf"
            onChange={handlePdfFileChange}
          />
        </div>

        <div>
          <label htmlFor="imageFileUpload">Upload Image</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleImageFileChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white text-sm font-medium p-2 rounded"
        >
          Add
        </button>
      </form>
    </div>
  );
}
