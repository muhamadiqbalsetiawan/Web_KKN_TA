import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

const FailedModal = ({ isOpen, onClose, onRefresh, isMessage }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current.classList.add("opacity-100", "pointer-events-auto");
    } else {
      modalRef.current.classList.remove("opacity-100", "pointer-events-auto");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const closeModal = (e) => {
        if (e.target === modalRef.current) {
          onClose();
        }
      };

      document.addEventListener("mousedown", closeModal);

      return () => {
        document.removeEventListener("mousedown", closeModal);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && onRefresh) {
      const timeoutId = setTimeout(() => {
        onRefresh();
      }, 2000); // close and refresh after 2 seconds

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, onRefresh]);

  return (
    <div
      onClick={onClose}
      ref={modalRef}
      className={`fixed top-0 left-0 w-full h-full bg-black/30 opacity-0 transition-opacity pointer-events-none z-[999] flex items-center justify-center`}
    >
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <div className="w-full">
          <XCircleIcon className="mx-auto w-24 text text-red-600" />
        </div>
        <h2 className="text-xl font-bold  mb-2">File Upload Gagal</h2>
        <p className="text-gray-600 mb-2 text-lg">{isMessage}</p>
      </div>
    </div>
  );
};

export default FailedModal;
