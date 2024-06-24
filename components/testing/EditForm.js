import React, { useState } from "react";

export default function EditForm({ data }) {

  const [editedData, setEditedData] = useState(data);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await fetch("/api/mahasiswa/edit ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });
      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data updated successfully.");
      } else {
        // Handle submission error
        console.error("Error updating data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this data?");
  
    if (confirmed) {
      try {
        const response = await fetch("/api/mahasiswa/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mhs_nim: editedData.mhs_nim }),
        });
  
        if (response.ok) {
          // Handle successful deletion (e.g., show a success message)
          console.log("Data deleted successfully.");
          // You can also reset the form or perform other actions as needed.
        } else {
          // Handle deletion error
          console.error("Error deleting data:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };
  
   // Ensure that data is defined before trying to access its properties
   if (!data) {
    return <div>Loading...</div>; // or handle this state accordingly
  }

  return (
      <div>
        <form className="w-1/3 justify-center border-2 flex flex-col gap-4 m-4 p-2">
        <div>
          <label htmlFor="mhs_nim">ID Mahasiswa</label>
          <input
            className="border-2 border-gray-200  p-2"
            type="text"
            id="mhs_nim"
            name="mhs_nim"
            value={editedData.mhs_nim}
            onChange={handleDataChange}
            disabled
          />
        </div>
        <div>
          <label htmlFor="mhs_nama">Nama Mahasiswa</label>
          <input
            className="border-2 border-gray-200  p-2"
            type="text"
            id="mhs_nama"
            name="mhs_nama"
            value={editedData.mhs_nama}
            onChange={handleDataChange}
          />
        </div>
          <button type="button" onClick={handleSubmit} className="bg-black text-white text-sm font-medium p-2 rounded">
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
}