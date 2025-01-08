// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Error</h2>
        <p className="my-4">{message}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Modal;
