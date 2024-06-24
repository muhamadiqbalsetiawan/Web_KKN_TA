import SidebarAdmin from "@/components/sidebarAdmin";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import Modal from "@/components/admin/modal";
import useSWR from "swr";
import { useRouter } from "next/router";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Head from "next/head";
import ReactPaginate from 'react-paginate';


export default function StatusKkn() {

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    "/api/admin/mahasiswa/mahasiswaQuery",
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
  const totalPages = Math.ceil(tables.length / itemsPerPage);

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
    const nimString = nim ? String(nim) : '';

    return (
      (typeof name === "string" && name.toLowerCase().includes(searchText)) ||
      (nimString && 
        nimString.includes(searchText)) ||
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
  
  const filteredItem = currentItem.filter(searchFilter);
  
  // modal
  const [showModal2, setShowModal2] = useState(false);

  const [editingData, setEditingData] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    nim: "",
    fakultas: "",
    jurusan: "",
    gender: "", // Set the default value for select
    telpon: "",
  });

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
          jenis_kkn: editingData.jenis_kkn || null,
        }),
      });

      if (response.ok) {
        // If the request is successful, you can update the data or refetch it
        mutate("/api/admin/mahasiswa/mahasiswaQuery");
        window.location.reload();
        setShowModal2(false);
      } else {
        // Handle error
        console.error("Error editing mahasiswa:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing mahasiswa:", error.message);
    }
  };


  if (error) {
    return <div>Error loading group details</div>;
  }

  if (!tables) {
    return <div>Loading... Data Error</div>;
  }

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />
        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Status Pendaftar KKN</h1>
          </div>
        </div>

        <div className="absolute ml-32 px-3 md:left-32 md:right-12  md:top-24 pb-5 rounded-xl bg-gray-50 shadow-lg">
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
                  className="block pt-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                  placeholder="Search for items"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto mt-4 bg-white ">
            <table className="text-lg text-gray-500 w-full">
              <thead className=" text-white bg-gray-500 text-center">
                <tr className="">
                  <th scope="col" className="py-2 px-2">
                    No
                  </th>
                  <th scope="col" className="py-2 px-2">
                    NIM
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Nama
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Jenis KKN
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Status Jenis KKN
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Kelompok KKN
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Act
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Act
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
              {currentPageItems.map((table, i) => (
                    <tr key={i}>
                      <td scope="col" className="py-1 px-2">
                        {i + 1}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.nim}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.name}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        Null
                      </td>
                      <td scope="col" className="py-1 px-2">
                        Null
                      </td>
                      <td scope="col" className="py-1 px-2">
                        Null
                      </td>
                      <td scope="col" className="py-1 px-2">
                        <div className="space-x-1">
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal2(true);
                              setEditingData(table); //set data table
                            }}
                          >
                            Ubah Status
                          </button>
                        </div>
                      </td>
                      <td scope="col" className="py-1 px-2">
                        <div className="space-x-1">
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal2(true);
                              setEditingData(table); //set data table
                            }}
                          >
                            Ubah Kelompok
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
        <title>Admin | Mahasiswa - Status</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      {displayAdmin}

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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
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
                  <select
                    id="jeniskkn"
                    value={editingData.jenis_kkn}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        jenis_kkn: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  >
                    <option value="">Belum Memilih</option>
                    <option value="SISDAMAS">SISDAMAS</option>
                    <option value="TEMATIK">TEMATIK</option>
                    <option value="Nusantara Moderasi Beragama">
                      Nusantara Moderasi Beragama
                    </option>
                    <option value="Luar Negeri Mandiri">
                      Luar Negeri Mandiri
                    </option>
                    <option value="Nusantara Kolaboratif Mandiri">
                      Nusantara Kolaboratif Mandiri
                    </option>
                    <option value="Terpadu">Terpadu</option>
                  </select>
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
    </>
  );
}
