import SidebarAdmin from "@/components/sidebarAdmin";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import Modal from "@/components/admin/modal";
import useSWR from "swr";
import { useRouter } from "next/router";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Head from "next/head";
import ReactPaginate from 'react-paginate';


export default function IdentitasDosen() {
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    "/api/admin/dosen/kelompokQuery",
    fetcher
  );

  const router = useRouter();
  const [username, setUsername] = useState(null);
  let displayAdmin = "";

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/admin");
    }
    setUsername(username);
  }, [router]);

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });

   
  const [active, setActive] = useState(1);
  const itemsPerPage = 10;
  const totalPages = tables ? Math.ceil(tables.length / itemsPerPage) : 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = Array.isArray(tables)
    ? tables.slice(indexOfFirstItem, indexOfLastItem)
    : [];


    const searchFilter = (item) => {
      const {
        dosen_name,
        nip,
        fakultas_dosen,
        jurusan_dosen,
        kelompok_ids,
        telpon_dosen,
        provinsi,
        jenis_kelompok,
      } = item;
      const searchText = searchTerm.toLowerCase();
  
      return (
        (dosen_name && dosen_name.toLowerCase().includes(searchText)) ||
        (nip && nip.toLowerCase().includes(searchText)) ||
        (fakultas_dosen && fakultas_dosen.toLowerCase().includes(searchText)) ||
        (jurusan_dosen && jurusan_dosen.toLowerCase().includes(searchText)) ||
        (kelompok_ids && kelompok_ids.toLowerCase().includes(searchText)) ||
        (telpon_dosen && telpon_dosen.toLowerCase().includes(searchText)) ||
        (jenis_kelompok && jenis_kelompok.toLowerCase().includes(searchText)) ||
        (provinsi && provinsi.toLowerCase().includes(searchText))
      );
    };

  useEffect(() => {
    const filtered = Array.isArray(tables) ? tables.filter(searchFilter) : [];
    setFilteredItems(filtered);
    setCurrentPage(0); // Reset currentPage ketika searchTerm berubah
  }, [searchTerm, tables]);

  // Mendapatkan data untuk halaman saat ini
  const offset = currentPage * itemsPerPage;
  const currentPageItems = filteredItems.slice(offset, offset + itemsPerPage);

  // Fungsi untuk mengatur halaman saat tombol pagination di-klik
  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };
  
  const filteredItem = currentItem.filter(searchFilter);
  
  // Mendapatkan data untuk halaman saat ini

  // Fungsi untuk memotong data sesuai halaman aktif
  const displayData = () => {
    const filteredData = tables.filter(searchFilter);

    const startIndex = (active - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // modal
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jurusanDosen, setJurusanDosen] = useState("");
  const [fakultasDosen, setFakultasDosen] = useState("");
  const [telponDosen, setTelponDosen] = useState("");

  const handleConfirmAdd = async () => {
    try {
      const response = await fetch("/api/admin/setting/dosenAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nip: nip,
          nama: nama,
          jurusan_dosen: jurusanDosen,
          fakultas_dosen: fakultasDosen,
          telpon_dosen: telponDosen,
        }),
      });

      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data added successfully.");

        // Reset form fields
        setNama("");
        setNip("");
        setJurusanDosen("");
        setFakultasDosen("");
        setTelponDosen("");

        // Refresh the page
        window.location.reload();

        // Close the add modal
        setShowModal(false);
      } else {
        // Handle submission error
        console.error("Error adding data:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch("/api/admin/dosen/identitasEdit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingData),
      });

      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data updated successfully.");
        // Reset the form fields
        setNama("");
        setNip("");
        setJurusanDosen("");
        setFakultasDosen("");
        setTelponDosen("");

        // Refresh the page
        window.location.reload();

        // Close the add modal
        setShowModal(false);
      } else {
        // Handle submission error
        console.error("Error updating data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/admin/setting/dosenDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nip: editingData.nip }), // Assuming you have an 'id' state HTMLfor the Dosen entry
      });

      if (response.ok) {
        // Handle successful deletion (e.g., show a success message)
        window.location.reload();
        console.log("Data deleted successfully.");
        // Optionally, you may want to perform additional actions after successful deletion

        // Close the delete modal or perform any other actions
        setShowModal3(false);
      } else {
        // Handle deletion error
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const [editingData, setEditingData] = useState(null);

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />
        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Daftar Dosen Pembimbing</h1>
          </div>
        </div>

        <div className="absolute ml-32 px-3 md:left-32 md:right-12  md:top-24 pb-5 rounded-xl bg-gray-50 shadow-lg">
          <div className="flex justify-between">
            <div className="static">
              <div className="relative mt-6">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    ariaHidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLineJoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  className='block pt-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  "'
                  placeholder="Search HTMLfor items"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 pr-3">
              <button
                className="bg-inputColor p-2 rounded-md font-semibold hover:bg-inputHoverColor text-white"
                onClick={() => setShowModal(true)}
              >
                Tambah Dosen
              </button>
            </div>
          </div>

          <div className="relative overflow-x-auto mt-4 bg-white ">
            <table className=" text-lg text-gray-500 w-full ">
              <thead className=" text-white bg-gray-500 text-center">
                <tr className="">
                  <th scope="col" className="py-2 px-4">
                    No
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Nama
                  </th>
                  <th scope="col" className="py-2 px-4">
                    NIP
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Fakultas
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Jurusan
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Kelompok
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Jenis Kelompok
                  </th>
                  <th scope="col" className="py-2 px-4">
                    No Telepon
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Lokasi{" "}
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
              {currentPageItems.map((table, i) => (
                    <tr key={i}>
                      <td scope="col" className="py-1 px-4">
                        {i + 1}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.dosen_name}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.nip}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.fakultas_dosen || "-"}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.jurusan_dosen || "-"}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.kelompok_ids || "-"}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.jenis_kelompok || "-"}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.telpon_dosen || "-"}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        {table.provinsi || "-"}
                      </td>
                      <td scope="col" className="py-1 px-4">
                        <div className="space-x-2">
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal2(true);
                              setEditingData(table); //set data table
                            }}
                          >
                            edit
                          </button>
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal3(true);
                              setEditingData(table);
                            }} // set data to be deleted
                          >
                            delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div type="pagination" className="flex justify-center gap-4 mt-2 ">
          <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={totalPages || 0}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination flex justify-center mt-8'}
                  activeClassName={'bg-blue-500 text-white px-3 py-1 rounded-md'}
                  previousClassName={'px-3 py-1 rounded-md border border-gray-300 mr-2'}
                  nextClassName={'px-3 py-1 rounded-md border border-gray-300 ml-2'}
                  pageClassName={'px-3 py-1 rounded-md border border-gray-300 mr-2 hover:bg-gray-200'}
                  disabledClassName={'text-gray-400 cursor-not-allowed'}
                />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Head>
        <title>Admin | Dosen - Identitas</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      {displayAdmin}
      {/* Tambah Dosen */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="px-6 pb-2 lg:px-8 text-left">
          <h3 className="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Tambah Data Dosen
          </h3>
          <form className="space-y-4" action="#">
            <div className="">
              <label
                HTMLfor="nip"
                className="block text-lg font-medium text-gray-900"
              >
                NIP
              </label>
              <input
                type="text"
                id="nip"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div className="">
              <label
                HTMLfor="name"
                className="block text-lg font-medium text-gray-900"
              >
                Nama
              </label>
              <input
                type="text"
                id="name"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div>
              <label
                HTMLfor="nim"
                className="block text-lg font-medium text-gray-900"
              >
                Fakultas
              </label>
              <input
                type="text"
                id="nim"
                value={fakultasDosen}
                onChange={(e) => setFakultasDosen(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div>
              <label
                HTMLfor="nim"
                className="block text-lg font-medium text-gray-900"
              >
                Jurusan
              </label>
              <input
                type="text"
                id="nim"
                value={jurusanDosen}
                onChange={(e) => setJurusanDosen(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div>
              <label
                HTMLfor="nim"
                className="block text-lg font-medium text-gray-900"
              >
                No Telepon
              </label>
              <input
                type="text"
                id="nim"
                value={telponDosen}
                onChange={(e) => setTelponDosen(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>

            <div className="flex justify-center space-x-5">
              <button
                type="submit"
                onClick={handleConfirmAdd}
                className="w-[1/2] text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-md text-lg px-5 py-1 text-center"
              >
                Tambah
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-[1/2] font-medium text-lg px-5 py-1 text-center bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Dosen */}
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <div className="px-6 pb-2 text-left">
          <h3 className="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Edit Data Dosen
          </h3>
          {editingData && (
            <form className="space-y-4">
              <div className="">
                <label
                  HTMLfor="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  value={editingData.dosen_name}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      dosen_name: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  HTMLfor="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  NIP
                </label>
                <input
                  type="string"
                  id="nim"
                  value={editingData.nip}
                  onChange={(e) =>
                    setEditingData({ ...editingData, nip: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  HTMLfor="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Fakultas
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={editingData.fakultas_dosen}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      fakultas_dosen: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  HTMLfor="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Jurusan
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={editingData.jurusan_dosen}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      jurusan_dosen: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  HTMLfor="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  No Telepon
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={editingData.telpon_dosen}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      telpon_dosen: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className=" flex justify-center space-x-5">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-[1/2] mt-4 place-self-end text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowModal3(false)}
                  className="w[1/2] mt-4 px-5 py-1 font-medium text-lg  text-center bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Hapus Mahasiswa */}
      <Modal isVisible={showModal3} onClose={() => setShowModal3(false)}>
        <div className="px-6 pb-2 lg:px-8 text-left">
          <h3 className="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Hapus Data Dosen
          </h3>
          {/* {editingData && ( */}
          <div className="space-y-4">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus data dosen ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Hapus
              </button>
              <button
                onClick={() => setShowModal3(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
          {/* )} */}
        </div>
      </Modal>
    </>
  );
}
