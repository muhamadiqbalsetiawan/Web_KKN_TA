import React, { useState, useEffect } from "react";

const EditForm = ({data}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [editedData, setEditedData] = useState(data);
  const [imageFile, setImageFile] = useState(null);

  const handleDownload = async (file_patch) => {
    try {
      const downloadUrl = `/api/download?file_patch=${encodeURIComponent(file_patch)}`;
      console.log('Download URL:', downloadUrl);
  
      const response = await fetch(downloadUrl);
      console.log('Fetch Response:', response);
  
      if (response.ok) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file_patch;
        document.body.appendChild(link);
  
        link.click();
      } else {
        console.error("Error downloading file:", response.statusText);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };  
 
  const handlePdfFileChange = (e) => {
    const selectedPdfFile = e.target.files[0];
    console.log('Selected File:', selectedPdfFile);
    if (selectedPdfFile) {
      setPdfFile(selectedPdfFile);
    }
  };

  const handleImageFileChange = (e) => {
    const uploadedImageFile = e.target.files[0];
    setImageFile(uploadedImageFile);
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  // ...

const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this data?");

  if (confirmed) {
    try {
      const response = await fetch("/api/dosen/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dsn_id: editedData.dsn_id }), // Mengirim ID Dosen ke API penghapusan
      });

      if (response.ok) {
        console.log("Data deleted successfully.");
      } else {
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
    
      const dsn_id = editedData.dsn_id
      const dsn_nama = editedData.dsn_nama

      const formData = new FormData();
      formData.append('dsn_id', dsn_id);
      formData.append('dsn_nama', dsn_nama);
       // Sertakan file PDF jika ada
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    // Sertakan file gambar jika ada
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
  

      const response = await fetch("/api/dosen/edit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Data updated successfully.");
      } else {
        console.error("Error updating data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setShowConfirmationModal(false);
    }
  };

const handleDeleteFile = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this file ?");
  
  if (confirmed) {
    try {
      const response = await fetch("/api/dosen/deleteFile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dsn_id: editedData.dsn_id }), // Mengirim ID Dosen ke API penghapusan
      });

      if (response.ok) {
        console.log("File deleted successfully.");
        // Update state atau melakukan aksi lain jika diperlukan
      } else {
        console.error("Error deleting file:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
};

const handleOpenFile = async (fileName) => {
  try {
    console.log('Opening file:', fileName);
    // Panggil API untuk mendapatkan path file
    const response = await fetch(`/api/dosen/openFile?fileName=${encodeURIComponent(fileName)}`);
    const { filePath } = await response.json();

    // Buka file di tab baru
    window.open(filePath, '_blank');
  } catch (error) {
    console.error('Error opening file:', error);
  }
};

const handleDeleteImage = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this image?");
  
  if (confirmed) {
    try {
      const response = await fetch("/api/dosen/deleteImage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dsn_id: editedData.dsn_id }), // Mengirim ID Dosen ke API penghapusan
      });

      if (response.ok) {
        console.log("Image deleted successfully.");
        // Update state atau melakukan aksi lain jika diperlukan
      } else {
        console.error("Error deleting image:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
};

  return (
    <div>
      <form 
      // action="/api/dosen/edit" 
      // method="POST" 
      encType="multipart/form-data"
      className="w-1/3 justify-center border-2 flex flex-col gap-4 m-4 p-2"
        >
        <div>
          <label htmlFor="dsn_id">ID Dosen</label>
          <input
            className="border-2 border-gray-200  p-2"
            type="text"
            id="dsn_id"
            name="dsn_id"
            value={editedData.dsn_id}
            onChange={handleDataChange}
            disabled
          />
        </div>
        <div>
          <label htmlFor="dsn_nama">Nama Mahasiswa</label>
          <input
            className="border-2 border-gray-200  p-2"
            type="text"
            id="dsn_nama"
            name="dsn_nama"
            value={editedData.dsn_nama}
            onChange={handleDataChange}
          />
        </div>
        <div>
            {editedData.file_patch ? (
              <div>
                <span>File from Database: {editedData.file_patch}</span><br/>
                <a
                  href="#"
                  onClick={() => handleOpenFile('example.pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open File in New Tab
                </a><br/>

                <span><button onClick={() => handleDownload(editedData.file_patch)}>Download File</button></span><br/>
                <span><button onClick={handleDeleteFile}>Hapus File</button></span>
              </div>
            ) : (
              <div>
                <label htmlFor="file">Pdf File : </label>
                <input
                  type="file"
                  id="file"
                  name="pdfFile"
                  accept="application/pdf"
                  onChange={handlePdfFileChange}
                />
              </div>
            )}
          </div>
          <div>
            {editedData.image_patch ? (
              <div>
                <span>File from Database: {editedData.image_patch}</span><br/>
                <span><button onClick={handleDeleteImage}>Hapus File</button></span>
              </div>
            ) : (
              <div>
                <label htmlFor="file">Image File :</label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
              </div>
            )}
          </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-black text-white text-sm font-medium p-2 rounded"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white text-sm font-medium p-2 rounded"
        >
          Delete
        </button>
      </form>
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to submit the form?</p>
            <button onClick={handleConfirmSubmit}>Yes</button>
            <button onClick={() => setShowConfirmationModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditForm; 