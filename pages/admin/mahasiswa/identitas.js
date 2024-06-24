import SidebarAdmin from "@/components/sidebarAdmin";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import Modal from "@/components/admin/modal";
import useSWR from "swr";
import ErrorModal from "@/components/modalerror";
import Select from "react-select";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Head from "next/head";
import ReactPaginate from "react-paginate";

export default function Identitas() {
  const [deletingNim, setDeletingNim] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [kelompokOptions, setKelompokOptions] = useState([]);
  const [prevJenisKKN, setPrevJenisKKN] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Gunakan currentPage sebagai index halaman, dimulai dari 0
  const [selectedKkn, setSelectedKkn] = useState("Semua"); // State untuk menyimpan jenis KKN yang dipilih

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    selectedKkn
      ? `/api/admin/mahasiswa/identitasQuery?jenis_kkn=${selectedKkn}`
      : null,
    fetcher
  );
  const { data: tables2 = [], error2 } = useSWR(
    "/api/admin/mahasiswa/identitasQueryKelompok",
    fetcher
  );

  const { data: tables3 = [], error3 } = useSWR(
    "/api/admin/mahasiswa/identitasQueryJenis",
    fetcher
  );

  const { data: tables4 = [] } = useSWR(
    "/api/admin/setting/tanggalQuery",
    fetcher
  );

  const optionss = tables4.map((tableItem) => ({
    value: tableItem.jenis_KKN,
    label: tableItem.jenis_KKN,
  }));

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });

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

  //pagination
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
      nim,
      name,
      gender,
      fakultas,
      jurusan,
      telpon,
      nilai,
      syarat,
      jenis_kkn,
    } = item;

    const searchText = searchTerm.toLowerCase();
    const nimString = nim ? String(nim) : "";

    return (
      (typeof name === "string" && name.toLowerCase().includes(searchText)) ||
      (nimString && nimString.includes(searchText)) ||
      (gender &&
        typeof gender === "string" &&
        gender.toLowerCase().includes(searchText)) ||
      (jurusan &&
        typeof jurusan === "string" &&
        jurusan.toLowerCase().includes(searchText)) ||
      (fakultas &&
        typeof fakultas === "string" &&
        fakultas.toLowerCase().includes(searchText)) ||
      (telpon &&
        typeof telpon === "string" &&
        telpon.toLowerCase().includes(searchText)) ||
      (nilai &&
        typeof nilai === "string" &&
        nilai.toLowerCase().includes(searchText)) ||
      (syarat &&
        typeof syarat === "string" &&
        syarat.toLowerCase().includes(searchText)) ||
      (jenis_kkn &&
        typeof jenis_kkn === "string" &&
        jenis_kkn.toLowerCase().includes(searchText))
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

  // endt pagination
  // modal
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [isModalError, setModalError] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    nim: "",
    fakultas: "",
    jurusan: "",
    gender: "", // Set the default value for select
    telpon: "",
  });

  const options = tables2.map((tableItem) => ({
    value: tableItem.kelompok_id,
    label: tableItem.nama_kelompok,
  }));

  // const optioned = [];
  // const jenisKelompokSet = new Set();

  // tables2.forEach((tableItem) => {
  //   const jenisKelompok = tableItem.jenis_kelompok;
  //   if (!jenisKelompokSet.has(jenisKelompok)) {
  //     jenisKelompokSet.add(jenisKelompok);
  //     optioned.push({
  //       value: jenisKelompok,
  //       label: jenisKelompok,
  //     });
  //   }
  // });

  // const handleJenisKKN = (selectedOption) => {
  //   if (selectedOption.value === prevJenisKKN) {
  //     return;
  //   }
  //   // Simpan jenis kelompok yang baru dipilih
  //   setPrevJenisKKN(selectedOption.value);

  //   // Filter tabel kelompok berdasarkan jenis kelompok yang dipilih
  //   const filteredKelompok = tables2.filter(
  //     (tableItem) => tableItem.jenis_kelompok === selectedOption.value
  //   );

  //   // Buat opsi untuk kelompok berdasarkan tabel yang sudah difilter
  //   const options = filteredKelompok.map((tableItem) => ({
  //     value: tableItem.kelompok_id,
  //     label: tableItem.nama_kelompok,
  //   }));

  //   // Atur data editing dengan jenis kelompok yang baru dan reset nilai kelompok_id serta nama_kelompok
  //   setEditingData({
  //     ...editingData,
  //     jenis_kelompok: selectedOption.value,
  //     kelompok_id: null,
  //     nama_kelompok: null,
  //   });

  //   // Set opsi untuk kelompok
  //   setKelompokOptions(options);
  // };

  // // Mengecek apakah editingData tidak null dan memiliki properti jenis_kkn
  // const selectedJenisKKN =
  //   editingData && editingData.jenis_kelompok
  //     ? optioned.find((option) => option.value === editingData.jenis_kelompok)
  //     : null;

  // // Menentukan kelompok yang dipilih berdasarkan nilai kelompok_id dari data yang sedang diedit
  // const selectedKelompok =
  //   editingData && editingData.kelompok_id
  //     ? options.find((option) => option.value === editingData.kelompok_id)
  //     : null;

  // const handleKelompokChange = (selectedOption) => {
  //   setEditingData({
  //     ...editingData,
  //     kelompok_id: selectedOption.value,
  //     nama_kelompok: selectedOption.label,
  //   });
  // };

  const optioned = [];
const jenisKelompokSet = new Set();

tables2.forEach((tableItem) => {
  const jenisKelompok = tableItem.jenis_kelompok;
  if (!jenisKelompokSet.has(jenisKelompok)) {
    jenisKelompokSet.add(jenisKelompok);
    optioned.push({
      value: jenisKelompok,
      label: jenisKelompok,
    });
  }
});


const [editingData, setEditingData] = useState({
  jenis_kelompok: null,
  kelompok_id: null,
  nama_kelompok: null,
});

// useEffect untuk mengisi kelompokOptions berdasarkan jenis_kelompok saat komponen pertama kali di-load
useEffect(() => {
  if (editingData && editingData.jenis_kelompok) {
    const filteredKelompok = tables2.filter(
      (tableItem) => tableItem.jenis_kelompok === editingData.jenis_kelompok
    );

    const options = filteredKelompok.map((tableItem) => ({
      value: tableItem.kelompok_id,
      label: tableItem.nama_kelompok,
    }));

    setKelompokOptions(options);
  }
}, [editingData?.jenis_kelompok]);

const handleJenisKKN = (selectedOption) => {
  if (selectedOption.value !== prevJenisKKN) {
    // Simpan jenis kelompok yang baru dipilih
    setPrevJenisKKN(selectedOption.value);

    // Atur data editing dengan jenis kelompok yang baru dan reset nilai kelompok_id serta nama_kelompok
    setEditingData({
      ...editingData,
      jenis_kelompok: selectedOption.value,
      kelompok_id: null,
      nama_kelompok: null,
    });
  }

  // Filter tabel kelompok berdasarkan jenis kelompok yang dipilih
  const filteredKelompok = tables2.filter(
    (tableItem) => tableItem.jenis_kelompok === selectedOption.value
  );

  // Buat opsi untuk kelompok berdasarkan tabel yang sudah difilter
  const options = filteredKelompok.map((tableItem) => ({
    value: tableItem.kelompok_id,
    label: tableItem.nama_kelompok,
  }));

  // Set opsi untuk kelompok
  setKelompokOptions(options);
};

// Mengecek apakah editingData tidak null dan memiliki properti jenis_kelompok
const selectedJenisKKN =
  editingData && editingData.jenis_kelompok
    ? optioned.find((option) => option.value === editingData.jenis_kelompok)
    : null;

// Menentukan kelompok yang dipilih berdasarkan nilai kelompok_id dari data yang sedang diedit
const selectedKelompok =
  editingData && editingData.kelompok_id
    ? kelompokOptions.find((option) => option.value === editingData.kelompok_id)
    : null;

const handleKelompokChange = (selectedOption) => {
  setEditingData({
    ...editingData,
    kelompok_id: selectedOption.value,
    nama_kelompok: selectedOption.label,
  });
};



  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const addMahasiswa = async (mahasiswaData) => {
    try {
      // Make an API request to add mahasiswa
      // Replace '/api/admin/mahasiswa/add' with your actual API endpoint
      const response = await fetch("/api/admin/mahasiswa/identitasAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nim: mahasiswaData.nim,
          name: mahasiswaData.name,
          fakultas: mahasiswaData.fakultas,
          jurusan: mahasiswaData.jurusan,
          gender: mahasiswaData.gender,
          telpon: mahasiswaData.telpon,
          // Include any other fields you've added in your form
        }),
      });

      if (response.ok) {
        // If the request is successful, you can update the data or refetch it
        mutate("/api/admin/mahasiswa/mahasiswaQuery");
        window.location.reload();
        setShowModal(false);
      } else {
        // Handle error
        console.error("Error adding mahasiswa:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding mahasiswa:", error.message);
    }
  };

  const editMahasiswa = async () => {
    try {
      // Make an API request to edit mahasiswa
      // Replace '/api/admin/mahasiswa/edit' with your actual API endpoint
      const response = await fetch("/api/admin/mahasiswa/identitasEdit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nim: editingData.nim,
          nama: editingData.name,
          jurusan: editingData.jurusan || null,
          fakultas: editingData.fakultas || null,
          telpon: editingData.telpon || null,
          gender: editingData.gender,
          kelompok_id: editingData.kelompok_id || null, // Tambahkan kelompok_id ke body permintaan
        }),
      });

      if (response.ok) {
        // If the request is successful, you can update the data or refetch it
        mutate("/api/admin/mahasiswa/mahasiswaQuery");
        window.location.reload();
        setShowModal2(false);
      } else if (response.status === 403) {
        // Handle kasus di mana kelompok penuh atau mahasiswa memiliki jurusan yang sama
        const responseData = await response.json();
        alert(responseData.message); // Menampilkan pesan dari backend
      } else {
        // Handle error
        console.error("Error editing mahasiswa:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing mahasiswa:", error.message);
    }
  };

  const deleteMahasiswa = async () => {
    try {
      // Make an API request to delete mahasiswa
      // Replace '/api/admin/mahasiswa/delete' with your actual API endpoint
      const response = await fetch("/api/admin/mahasiswa/identitasDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nim: editingData.nim }),
      });

      if (response.ok) {
        // If the request is successful, you can update the data or refetch it
        mutate("/api/admin/mahasiswa/mahasiswaQuery");
        window.location.reload();
        setShowModal3(false);
      } else {
        // Handle error
        console.error("Error deleting mahasiswa:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting mahasiswa:", error.message);
    }
  };

  if (error & error2) {
    return <div>Error loading group details</div>;
  }

  if (!tables & !tables2) {
    return <div>Loading... Data Error</div>;
  }

  const exportToExcel = async () => {
    try {
      const response = await fetch(
        `/api/admin/mahasiswa/exsport?jenis_kkn=${selectedKkn}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        // Mengarahkan pengguna untuk mengunduh file Excel
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `mahasiswa_${selectedKkn}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else if (response.status === 404) {
        const errorData = await response.json();
        setModalError(true);
        // alert(errorData.message); // Menampilkan pesan dari server
        console.error("Error exporting data:", response.statusText);
      } else {
        setModalError(true);
        console.error("Error exporting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error exporting data:", error.message);
    }
  };

  const handleExport = () => {
    exportToExcel();
  };

  // Fungsi untuk menangani ekspor data
  const handleKknChange = (e) => {
    setSelectedKkn(e.target.value);
  };

  const handleCloseErrorModal = () => {
    setModalError(false);
  };

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />
        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Daftar Mahasiswa</h1>
          </div>
        </div>

        <div className="absolute ml-32 px-3 md:left-32 md:right-12 md:top-24 pb-5">
          <div className="rounded-xl bg-gray-50 shadow-lg p-4">
            <div className="mt-3 text-right text-sm block xl:hidden px-4">
              {/* Tombol untuk memilih jenis KKN */}
              <select
                value={selectedKkn}
                onChange={handleKknChange}
                placeholder="Pilih jenis KKN"
                className="rounded-md text-sm"
              >
                <option value="Semua">Semua</option>
                {optionss.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Tombol "Export" */}
              <button
                className="ml-3 px-6 py-2 bg-cyan-600 text-white  rounded-lg font-bold"
                onClick={() => handleExport(selectedKkn)}
              >
                Export
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="static">
                <div className="relative mt-3">
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className='block pt-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  "'
                    placeholder="Search for items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 text-center text-sm xl:block hidden">
                {/* Tombol untuk memilih jenis KKN */}
                <select
                  value={selectedKkn}
                  onChange={handleKknChange}
                  placeholder="Pilih jenis KKN"
                  className="rounded-md text-sm"
                >
                  <option value="Semua">Semua</option>
                  {optionss.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Tombol "Export" */}
                <button
                  className="ml-3 px-6 py-2 bg-inputColor text-white  rounded-lg font-bold"
                  onClick={() => handleExport(selectedKkn)}
                >
                  Export
                </button>
              </div>

              <div className="mt-3 pr-3">
                <button
                  className="bg-teal-600 text-white py-2 px-5 rounded-md font-semibold hover:bg-teal-700"
                  onClick={() => setShowModal(true)}
                >
                  Tambah Mahasiswa
                </button>
              </div>
            </div>

            <div className="relative mt-4 bg-white overflow-x-auto">
              <table className="text-lg text-gray-500 w-full">
                <thead className=" text-white bg-gray-500 text-center">
                  <tr className="">
                    <th scope="col" className="py-2 px-2">
                      NIM
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Nama
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Gender
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Jurusan
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Fakultas
                    </th>
                    <th scope="col" className="py-2 px-2">
                      PTN
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Telpon
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Telpon Wali
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Nilai
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Kelompok
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Jenis KKN{" "}
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentPageItems.map((table, i) => (
                    <tr key={i}>
                      <td scope="col" className="py-1 px-2">
                        {table.nim}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.name}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.gender}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.jurusan}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.fakultas}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.universitas}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.telpon}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.telpon_wali}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.nilai || "Belum"}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.nama_kelompok || "Belum"}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.jenis_kelompok || "Belum"}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        <div className="space-x-1">
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal2(true);
                              setEditingData(table); //set data table
                              setDeletingNim(table.nim); // Mengatur nim untuk penghapusan
                            }}
                          >
                            edit
                          </button>
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal3(true);
                              if (table && table.nim) {
                                setEditingData(table); //set data table
                                setDeletingNim(table.nim); // Mengatur nim untuk penghapusan
                              } else {
                                console.error(
                                  "Nim is null or undefined for deletion"
                                );
                              }
                            }}
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
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages || 0}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex justify-center mt-8"}
                activeClassName={"bg-blue-500 text-white px-3 py-1 rounded-md"}
                previousClassName={
                  "px-3 py-1 rounded-md border border-gray-300 mr-2"
                }
                nextClassName={
                  "px-3 py-1 rounded-md border border-gray-300 ml-2"
                }
                pageClassName={
                  "px-3 py-1 rounded-md border border-gray-300 mr-2 hover:bg-gray-200"
                }
                disabledClassName={"text-gray-400 cursor-not-allowed"}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin | Mahasiswa - Identitas</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <ErrorModal
        isOpen={isModalError}
        onClose={handleCloseErrorModal}
        onRefresh={() => window.location.reload()}
        isMessage={"Data File yang dipilih Masih Kosong"}
        isTitle={"File Kosong"}
      />

      {displayAdmin}

      {/* Tambah Mahasiswa */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div class="px-6 pb-2 lg:px-8 text-left">
          <h3 class="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Tambah Mahasiswa
          </h3>
          <form className="space-y-4" action="#">
            <div className="flex justify-between space-x-2">
              <div className="w-2/3">
                <label
                  for="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Nama
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  for="nim"
                  className="block text-lg font-medium text-gray-900"
                >
                  Nim
                </label>
                <input
                  required
                  type="text"
                  id="nim"
                  value={formValues.nim}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
            </div>

            <div className="flex justify-between space-x-2">
              <div className="w-1/2">
                <label
                  for="fakultas"
                  className="block  text-lg font-medium text-gray-900"
                >
                  Fakultas
                </label>
                <input
                  type="text"
                  id="fakultas"
                  value={formValues.fakultas}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
              <div className="w-1/2">
                <label
                  for="jurusan"
                  className="block text-lg font-medium text-gray-900"
                >
                  Jurusan
                </label>
                <input
                  type="text"
                  id="jurusan"
                  value={formValues.jurusan}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="w-1/4">
                <label
                  for="kelamin"
                  className="block text-lg font-medium text-gray-900"
                >
                  Jenis Kelamin
                </label>
                <select
                  id="kelamin"
                  value={formValues.kelamin}
                  onChange={handleSelectChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="w-1/3">
                <label
                  for="telpon"
                  className="block text-lg font-medium text-gray-900"
                >
                  Telpon
                </label>
                <input
                  type="tel"
                  id="telpon"
                  pattern="[0-9]{10,14}" // Adjust the pattern based on your phone number format
                  title="Please enter a valid phone number"
                  value={formValues.telpon}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-5">
              <button
                type="submit"
                onClick={() => addMahasiswa(formValues)}
                class="w-[1/2]  text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-md text-lg px-5 py-1 text-center"
              >
                Tambah
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w[1/2] font-medium text-lg px-5 py-1 text-center bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Mahasiswa */}
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <div class="px-6 pb-2 text-left">
          <h3 class="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Edit Mahasiswa
          </h3>
          {editingData && (
            <form>
              <div className="flex justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    for="name"
                    class="block text-lg font-medium text-gray-900"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    for="name"
                    className="block text-lg font-medium text-gray-900"
                  >
                    NIM
                  </label>
                  <input
                    type="string"
                    id="nim"
                    value={editingData.nim}
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    for="name"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Fakultas
                  </label>
                  <input
                    type="text"
                    id="fakultas"
                    value={editingData.fakultas}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        fakultas: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    for="name"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Jurusan
                  </label>
                  <input
                    type="text"
                    id="jurusan"
                    value={editingData.jurusan}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        jurusan: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="kelamin"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    id="kelamin"
                    value={editingData.gender}
                    onChange={(e) =>
                      setEditingData({ ...editingData, gender: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  >
                    <option value="L">L</option>
                    <option value="P">P</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label
                    for="name"
                    className="block text-lg font-medium text-gray-900"
                  >
                    No. Telpon
                  </label>
                  <input
                    type="text"
                    id="telpon"
                    value={editingData.telpon}
                    onChange={(e) =>
                      setEditingData({ ...editingData, telpon: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="jeniskkn"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Jenis KKN
                  </label>
                  <Select
                    id="jeniskkn"
                    value={selectedJenisKKN}
                    onChange={handleJenisKKN}
                    options={optioned}
                    className="text-gray-900 text-sm"
                    styles={{
                      input: (base) => ({
                        ...base,
                        "input:focus": {
                          boxShadow: "none",
                        },
                      }),
                    }}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="nama_kelompok"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Kelompok
                  </label>
                  <Select
                    id="nama_kelompok"
                    value={selectedKelompok}
                    onChange={handleKelompokChange}
                    options={kelompokOptions}
                    className="text-gray-900 text-sm"
                    styles={{
                      input: (base) => ({
                        ...base,
                        "input:focus": {
                          boxShadow: "none",
                        },
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-5">
                <button
                  type="button"
                  onClick={editMahasiswa}
                  className="w-[1/2] mt-4 place-self-end text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowModal2(false)}
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
            Hapus Mahasiswa
          </h3>
          {/* {editingData && ( */}
          <div className="space-y-4">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus data mahasiswa ini?
            </p>
            <div class="flex justify-end space-x-4">
              <button
                onClick={deleteMahasiswa}
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
