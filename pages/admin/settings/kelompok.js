import SidebarAdmin from "@/components/sidebarAdmin";
import React, { useEffect } from "react";
import { useState } from "react";
import Modal from "@/components/admin/modal";
import useSWR from "swr";
import Link from "next/link";
import Select from "react-select";
import { useRouter } from "next/router";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import ReactPaginate from 'react-paginate';


export default function KelompokKkn() {
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    "/api/admin/setting/kelompokQuery",
    fetcher
  );
  const { data: tables2 = [], error2 } = useSWR(
    "/api/admin/setting/AddDosen",
    fetcher
  );
  const { data: tables3 = [], error3 } = useSWR(
    "/api/admin/setting/AddLokasi",
    fetcher
  );
  const { data: tables4 = [], error4 } = useSWR(
    "/api/admin/setting/jenisKKN",
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

  let options = [];
  let optiond = [];
  let optioned = [];

  if (tables3.length > 0) {
    options = tables3.map((table) => ({
      value: table.lokasi_id,
      label: table.lokasi,
    }));
  }

  if (tables2.length > 0) {
    optiond = tables2.map((table) => ({
      value: table.nip,
      label: table.nama,
    }));
  }

  if (tables4.length > 0) {
   optioned = tables4.map((table) => ({
    value: table.jenisKelompok,
    label: table.jenisKelompok,
  }));
}

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "Gray",
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
        id,
        name,
        lokasi_kecamatan,
        lokasi_kota,
        jenis_kelompok,
        dosen_nama,
        ketua_nama,
        dosen_nip,
        lokasi_id,
        mahasiswa_nim,
      } = item;
      const searchText = searchTerm.toLowerCase();
      const toStringIfNumber = (value) =>
        typeof value === "number" ? value.toString() : value;
      return (
        (typeof id === "number" && id.toString().includes(searchText)) ||
        (typeof name === "string" && name.toLowerCase().includes(searchText)) ||
        (typeof lokasi_kecamatan === "string" &&
          lokasi_kecamatan.toLowerCase().includes(searchText)) ||
        (typeof lokasi_kota === "string" &&
          lokasi_kota.toLowerCase().includes(searchText)) ||
        (typeof jenis_kelompok === "string" &&
          jenis_kelompok.toLowerCase().includes(searchText)) ||
        (typeof dosen_nama === "string" &&
          dosen_nama.toLowerCase().includes(searchText)) ||
        (typeof ketua_nama === "string" &&
          ketua_nama.toLowerCase().includes(searchText)) ||
        (typeof dosen_nip === "string" &&
          dosen_nip.toLowerCase().includes(searchText)) ||
        (typeof lokasi_id === "number" &&
          lokasi_id.toString().includes(searchText)) ||
        (typeof mahasiswa_nim === "number" &&
          mahasiswa_nim.toString().includes(searchText))
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

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [dosennip, setdosenNip] = useState("");
  const [lokasiid, setlokasiId] = useState("");
  const [jeniskelompok, setJenisKelompok] = useState("");
  const [mahasiswanim, setmahasiswaNim] = useState("");
  const [jumlahLakiLaki, setJumlahLakiLaki] = useState("");
  const [jumlahPerempuan, setJumlahPerempuan] = useState("");

  const [editingData, setEditingData] = useState(null);
  const handleChangeLokasi = (selectedOption) => {
    setEditingData({ ...editingData, lokasi_id: selectedOption.value });
  };

  const handleChangeDosen = (selectedOption) => {
    setEditingData({
      ...editingData,
      dosen_nip: selectedOption.value,
      dosen_nama: selectedOption.label,
    });
  };

  const handleChangeJenis = (selectedOption) => {
    setEditingData({
      ...editingData,
      jeniskelompok: selectedOption.value,
      jeniskelompok: selectedOption.label,
    });
  };

  const handleChangeBatasLaki = (e) => {
    setEditingData({ ...editingData, batas_laki: e.target.value });
  };

  const handleChangeBatasPerempuan = (e) => {
    setEditingData({ ...editingData, batas_perempuan: e.target.value });
  };

  const editLokasi = editingData
    ? tables3.find((table) => table.lokasi_id === editingData.lokasi_id)
    : null;

  const handleConfirmAdd = async () => {
    try {
      const response = await fetch("/api/admin/setting/kelompokAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          lokasi: lokasiid,
          dosen: dosennip,
          ketua: mahasiswanim,
          jenis: jeniskelompok,
          l: jumlahLakiLaki,
          p: jumlahPerempuan,
        }),
      });

      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data added successfully.");

        // Reset form fields
        setName("");
        setlokasiId("");
        setdosenNip("");
        setmahasiswaNim("");

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
      const response = await fetch("/api/admin/setting/kelompokEdit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingData),
      });

      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data updated successfully.");

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
      const response = await fetch("/api/admin/setting/kelompokDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingData.id }), // Assuming you have an 'id' state htmlFor the Dosen entry
      });

      if (response.ok) {
        // Handle successful deletion (e.g., show a success message)
        console.log("Data deleted successfully.");
        // Optionally, you may want to perform additional actions after successful deletion

        // Refresh the page
        window.location.reload();

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

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />

        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Daftar Kelompok KKN</h1>
          </div>
        </div>

        <div class="absolute ml-32 px-3 md:left-32 md:right-12  md:top-24 pb-5 rounded-xl bg-gray-50 shadow-lg">
          <div className="flex justify-between">
            <div className="static">
              <div className="relative mt-6">
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
                  placeholder="Search htmlFor items"
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
                Tambah Kelompok{" "}
              </button>
            </div>
          </div>

          <div className=" mt-4 bg-white overflow-x-auto">
            <table className=" text-lg text-gray-500 min-w-full">
              <thead className=" text-white uppercase bg-gray-500 text-center">
                <tr className="">
                  <th scope="col" className="py-2 px-4">
                    No
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Nama Kelompok
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Jenis Kelompok
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Dosen Pembimbing
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Ketua Kelompok
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Lokasi (Kecatama/Kota)
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Batas Laki-Laki
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Batas Perempuan
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
              {currentPageItems.map((item, i) => (
                  <tr key={i}>
                    <td scope="col" className="py-2 px-4">
                      {i + 1}
                    </td>
                    <td
                      scope="col"
                      className="py-2 px-4"
                    >{item.name}</td> 
                    <td scope="col" className="py-2 px-4">
                      {item.jenis_kelompok || "-"}
                    </td>
                    <td scope="col" className="py-2 px-4">
                      {item.dosen_nama || "Belum Ditentukan"}
                    </td>
                    <td scope="col" className="py-2 px-4">
                      {item.ketua_nama || "Belum Ditentukan"}
                    </td>
                    <td scope="col" className="py-2 px-4">{`${
                      item.lokasi_kecamatan || "Belum Ditentukan"
                    } / ${item.lokasi_kota || "Belum Ditentukan"}`}</td>
                    <td scope="col" className="py-2 px-4">
                      {item.batas_laki || "-"}
                    </td>
                    <td scope="col" className="py-2 px-4">
                      {item.batas_perempuan || "-"}
                    </td>
                    <td scope="col" className="py-2 px-4">
                      <div className=" flex justify-center items-center">
                        <button
                          className="font-medium text-blue-400  hover:underline"
                          onClick={() => {
                            setShowModal2(true);
                            setEditingData(item); //set data table
                          }}
                        >
                          edit
                        </button>
                        /
                        <button
                          className="font-medium text-blue-400  hover:underline"
                          onClick={() => {
                            setShowModal3(true);
                            setEditingData(item); //set data table
                          }}
                        >
                          delete
                        </button>
                        /
                        <button>
                          <Link
                            href={`/admin/settings/detailKelompok/${item.id}`}
                          >
                            <span className="font-medium text-blue-400 hover:underline">
                              detail
                            </span>
                          </Link>
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
                  pageCount={totalPages}
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
      {displayAdmin}
      {/* Tambah kelompok */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div class="px-6 pb-2 lg:px-8 text-left">
          <h3 class="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Tambah Data Kelompok
          </h3>
          <form className="space-y-2" action="#">
            <div className="flex justify-between space-x-2">
              <div className="w-full">
                <label
                  htmlFor="name"
                  class="block text-lg font-medium text-gray-900"
                >
                  Nama Kelompok
                </label>
                <input
                  type="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full block p-2"
                />
              </div>
            </div>
            <div className="">
              <label htmlFor="name" class="block text-lg font-medium text-gray-900">
                Lokasi Kelompok
              </label>
              <Select
              menuPosition="fixed"
                options={options}
                value={options.find((option) => option.value === lokasiid)}
                onChange={(selectedOption) => setlokasiId(selectedOption.value)}
                className="block w-full p-2"
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
            <div className="">
              <label htmlFor="name" class="block text-lg font-medium text-gray-900">
                Dosen Pembimbing Kelompok
              </label>
              <Select
              menuPosition="fixed"
                options={optiond}
                value={optiond.find((option) => option.value === dosennip)}
                onChange={(selectedOption) => setdosenNip(selectedOption.value)}
                className="block w-full p-2"
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
            <div className="">
              <label htmlFor="name" class="block text-lg font-medium text-gray-900">
                Ketua Kelompok
              </label>
              <input
                type="number"
                id="ketua"
                value={mahasiswanim}
                onChange={(e) => setmahasiswaNim(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div className="">
              <label
                htmlFor="jeniskelompok"
                class="block text-lg font-medium text-gray-900"
              >
                Jenis Kelompok
              </label>
              <Select
              menuPosition="fixed"
                options={optioned}
                value={optioned.find(
                  (option) => option.value === jeniskelompok
                )}
                onChange={(selectedOption) =>
                  setJenisKelompok(selectedOption.value)
                }
                className="block w-full p-2"
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
            
            <div className="flex justify-between space-x-2">
              <div className="w-full">
                <label
                  htmlFor="name"
                  class="block text-lg font-medium text-gray-900"
                >
                  Jumlah Laki-laki
                </label>
                <input
                  type="number"
                  id="laki_laki"
                  required
                  value={jumlahLakiLaki}
                  onChange={(e) => setJumlahLakiLaki(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
              {/* tambahkan input untuk jumlah perempuan */}
              <div className="w-full">
                <label
                  htmlFor="name"
                  class="block text-lg font-medium text-gray-900"
                >
                  Jumlah Perempuan
                </label>
                <input
                  type="number"
                  id="perempuan"
                  required
                  value={jumlahPerempuan}
                  onChange={(e) => setJumlahPerempuan(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
            </div>
            <div className="flex justify-center space-x-5">
              <button
                type="submit"
                onClick={handleConfirmAdd}
                className="w-[1/2]  text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-md text-lg px-5 py-1 text-center"
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

      {/* Edit kelompok */}
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <div class="px-6 pb-2 text-left">
          <h3 class="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Edit Data Kelompok
          </h3>
          {editingData && (
            <form className="space-y-2">
              <div className="">
                <label
                  htmlFor="name"
                  class="block text-lg font-medium text-gray-900"
                >
                  Nama Kelompok
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
              <div className="">
                <label
                  htmlFor="idlokasi"
                  className="block text-lg font-medium text-gray-900"
                >
                  Lokasi Kelompok
                </label>
                <Select
                  id="idlokasi"
                  value={
                    editLokasi
                      ? {
                          value: editLokasi.lokasi_id,
                          label: editLokasi.lokasi,
                        }
                      : null
                  }
                  onChange={handleChangeLokasi}
                  options={options}
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
              <div className="">
                <label
                  htmlFor="nip"
                  className="block text-lg font-medium text-gray-900"
                >
                  NIP Dosen Pembimbing
                </label>
                <Select
                  id="nip"
                  value={{
                    value: editingData.dosen_nip,
                    label: editingData.dosen_nama,
                  }} // Sesuaikan dengan format data Anda
                  onChange={handleChangeDosen}
                  options={optiond}
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
              <div className="">
                <label
                  htmlFor="name"
                  class="block text-lg font-medium text-gray-900"
                >
                  NIM Ketua Kelompok
                </label>
                <input
                  type="number"
                  id="nim"
                  value={editingData.mahasiswa_nim}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      mahasiswa_nim: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
              <div className="">
                <label
                  htmlFor="idlokasi"
                  className="block text-lg font-medium text-gray-900"
                >
                  Lokasi Kelompok
                </label>
                <Select
                  id="jenis"
                  value={
                    editLokasi
                      ? {
                          value: editingData.jenisKelompok,
                          label: editingData.jenisKelompok,
                        }
                      : null
                  }
                  onChange={handleChangeJenis}
                  options={optioned}
                  menuPortalTarget={document.body} // Menentukan target di mana dropdown akan muncul
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }), // Menentukan z-index agar dropdown muncul di atas konten lain
                    menu: provided => ({
                      ...provided,
                      maxHeight: '200px', // Menentukan tinggi maksimum dropdown
                      overflowY: 'scroll', // Menambahkan scroll jika dropdown lebih tinggi dari maksimum
                    }),
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div>
              <div className="flex justify-between space-x-2">
                <div className="w-full">
                  <label
                    htmlFor="batasLaki"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Batas Laki-laki
                  </label>
                  <input
                    type="number"
                    id="batasLaki"
                    value={editingData.batas_laki}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        batas_laki: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="batasPerempuan"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Batas Perempuan
                  </label>
                  <input
                    type="number"
                    id="batasPerempuan"
                    value={editingData.batas_perempuan}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        batas_perempuan: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
              </div>

              <div className=" flex justify-center space-x-5">
                <button
                  type="button"
                  onClick={() => {
                    // Call the handleEdit function with the edited data
                    handleEdit(editingData);
                    setShowModal2(false);
                  }}
                  className="w-[1/2] mt-4 place-self-end text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowModal3(false)}
                  class="w[1/2] mt-4 px-5 py-1 font-medium text-lg  text-center bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Hapus kelompok */}
      <Modal isVisible={showModal3} onClose={() => setShowModal3(false)}>
        <div class="px-6 pb-2 lg:px-8 text-left">
          <h3 class="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Hapus Data Kelompok
          </h3>
          {/* {editingData && ( */}
          <div class="space-y-4">
            <p class="text-gray-700">
              Apakah Anda yakin ingin menghapus data kelompok ini?
            </p>
            <div class="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Hapus
              </button>
              <button
                onClick={() => setShowModal3(false)}
                class="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
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
