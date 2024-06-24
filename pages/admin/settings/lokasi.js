import SidebarAdmin from "@/components/sidebarAdmin";
import React from "react";
import { useState } from "react";
import Modal from "@/components/admin/modal";
import useSWR from "swr";
import { useEffect } from "react";
import ReactSelect from "react-select";
import { useRouter } from "next/router";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Head from "next/head";
import ReactPaginate from 'react-paginate';


export default function LokasiKkn() {

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [kelurahan, setKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [idkecamatan, setIdKecamatan] = useState([]);
  const [kota, setKota] = useState("");
  const [idkota, setIdKota] = useState([]);
  const [provinsi, setProvinsi] = useState("");
  const [idprovinsi, setIdProvinsi] = useState([]);
  const [negara, setNegara] = useState("");
  const [idnegara, setIdNegara] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [editingData, setEditingData] = useState(null);

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

  const apiToken = process.env.TOKEN;

  const fetcherWithToken = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    "/api/admin/setting/lokasiQuery",
    fetcher
  );
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (idnegara > 0) {
      fetchProvinsi(idnegara);
    }
  }, [idnegara]);

  useEffect(() => {
    if (idnegara && idprovinsi > 0) {
      fetchKota(idnegara, idprovinsi);
    }
  }, [idnegara, idprovinsi]);

  useEffect(() => {
    if (idnegara && idprovinsi && idkota > 0) {
      fetchKecamatan(idnegara, idprovinsi, idkota);
    }
  }, [idnegara, idprovinsi, idkota]);

  useEffect(() => {
    if (idnegara && idprovinsi && idkota && idkecamatan > 0) {
      fetchKelurahan(idnegara, idprovinsi, idkota, idkecamatan);
    }
  }, [idnegara, idprovinsi, idkota, idkecamatan]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.uinsgd.ac.id/master/negara/?page=1&limit=1000",
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response for country data was not ok");
      }

      const data1 = await response.json();
      setData1(data1);
    } catch (error) {
      console.error("Failed to fetch country data:", error.message);
      throw error;
    }
  };

  const fetchProvinsi = async (idnegara) => {
    try {
      const response = await fetch(
        `https://api.uinsgd.ac.id/master/provinsi/?ids_negara=${idnegara}&status=YA&page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response for province data was not ok");
      }

      const data2 = await response.json();
      setData2(data2);
    } catch (error) {
      console.error("Failed to fetch province data:", error.message);
      throw error;
    }
  };

  const fetchKota = async (idnegara, idprovinsi) => {
    try {
      const response = await fetch(
        `https://api.uinsgd.ac.id/master/kabupaten-kota/?ids_negara=${idnegara}&ids_provinsi=${idprovinsi}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response for province data was not ok");
      }

      const data3 = await response.json();
      setData3(data3);
    } catch (error) {
      console.error("Failed to fetch kabupaten data:", error.message);
      throw error;
    }
  };

  const fetchKecamatan = async (idnegara, idprovinsi, idkota) => {
    try {
      const response = await fetch(
        `https://api.uinsgd.ac.id/master/kecamatan/?ids_negara=${idnegara}&ids_provinsi=${idprovinsi}&ids_kab_kota=${idkota}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response for province data was not ok");
      }

      const data4 = await response.json();
      setData4(data4);
    } catch (error) {
      console.error("Failed to fetch kabupaten data:", error.message);
      throw error;
    }
  };

  const fetchKelurahan = async (idnegara, idprovinsi, idkota, idkecamatan) => {
    try {
      const response = await fetch(
        `https://api.uinsgd.ac.id/master/kelurahan/?ids_negara=${idnegara}&ids_provinsi=${idprovinsi}&ids_kab_kota=${idkota}&ids_kecamatan=${idkecamatan}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response for province data was not ok");
      }

      const data5 = await response.json();
      setData5(data5);
    } catch (error) {
      console.error("Failed to fetch kabupaten data:", error.message);
      throw error;
    }
  };

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
      const { id, kelurahan, kecamatan, kota, provinsi, negara } = item || {};
      const searchText = searchTerm.toLowerCase();
      return (
        (typeof id === "string" && id.toLowerCase().includes(searchText)) ||
        kelurahan?.toLowerCase().includes(searchText) ||
        kecamatan?.toLowerCase().includes(searchText) ||
        kota?.toLowerCase().includes(searchText) ||
        provinsi?.toLowerCase().includes(searchText) ||
        negara?.toLowerCase().includes(searchText)
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


  // Fungsi untuk menangani perubahan nilai negara
  const handleNegara = (country) => {
    let item = parseInt(country);

    // Mengambil objek negara yang dipilih dari data1
    const selectedCountry = data1.data.data.find((c) => c.ids_negara === item);

    // Menetapkan nilai negara yang dipilih ke dalam state dan memperbarui provinsi
    if (selectedCountry) {
      setIdNegara(selectedCountry.ids_negara);
      setNegara(selectedCountry.negara); // Menetapkan nilai ids_negara negara yang dipilih
      setIdProvinsi(0);
      setProvinsi("");
      setIdKota(0);
      setKota("");
      setIdKecamatan(0);
      setKecamatan("");
      setKelurahan("");
    } // Mengambil data terkait berdasarkan nilai negara yang dipilih
  };

  const handleProvinsi = (provinsi) => {
    let item = parseInt(provinsi);

    // Mengambil objek negara yang dipilih dari data1
    const selectedProvinsi = data2.data.data.find(
      (c) => c.ids_provinsi === item
    );

    if (selectedProvinsi) {
      setIdProvinsi(selectedProvinsi.ids_provinsi);
      setProvinsi(selectedProvinsi.provinsi);
      setIdKota(0);
      setKota("");
      setIdKecamatan(0);
      setKecamatan("");
      setKelurahan("");
    }
  };
  const handleKota = (kota) => {
    let item = parseInt(kota);
    // Menetapkan nilai ids_provinsi dari data provinsi yang dipilih
    const selectedKota = data3.data.data.find((c) => c.ids_kab_kota === item);
    if (selectedKota) {
      setIdKota(selectedKota.ids_kab_kota);
      setKota(selectedKota.kab_kota);
      setIdKecamatan(0);
      setKecamatan("");
      setKelurahan("");
    }
  };

  const handleKecamatan = (kecamatan) => {
    let item = parseInt(kecamatan); // Mengatur nilai provinsi yang dipilih
    // Menetapkan nilai ids_provinsi dari data provinsi yang dipilih
    const selectedKecamatan = data4.data.data.find(
      (c) => c.ids_kecamatan === item
    );
    if (selectedKecamatan) {
      setIdKecamatan(selectedKecamatan.ids_kecamatan);
      setKecamatan(selectedKecamatan.kecamatan);
      setKelurahan("");
    }
  };

  const handleKelurahan = (kelurahan) => {
    let item = parseInt(kelurahan); // Mengatur nilai provinsi yang dipilih
    // Menetapkan nilai ids_provinsi dari data provinsi yang dipilih
    const selectedKelurahan = data5.data.data.find(
      (c) => c.ids_kelurahan === item
    );
    if (selectedKelurahan) {
      setKelurahan(selectedKelurahan.kelurahan);
    }
  };

  const handleConfirmAdd = async () => {
    try {
      const response = await fetch("/api/admin/setting/lokasiAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kelurahan: kelurahan,
          kecamatan: kecamatan,
          kota: kota,
          provinsi: provinsi,
          negara: negara,
        }),
      });

      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data added successfully.");

        // Reset form fields
        setKelurahan("");
        setKecamatan("");
        setKota("");
        setProvinsi("");
        setNegara("");

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

  const handleConfirmEdit = async () => {
    try {
      const response = await fetch("/api/admin/setting/lokasiEdit ", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingData),
      });
      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log("Data updated successfully.");
        window.location.reload();
        // Close the edit modal on success
        setShowModal2(false);
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
      const response = await fetch("/api/admin/setting/lokasiDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingData.id }),
      });

      if (response.ok) {
        // Handle successful deletion (e.g., show a success message)
        console.log("Data deleted successfully.");
        window.location.reload();
        setShowModal3(false);
      } else {
        // Handle deletion error
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Render loading state
  if (!tables && !error) {
    return <div>Loading...</div>;
  }
  // if (!data1 && !error1) {
  //   return <div>Loading1...</div>;
  // }
  // Render error state
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }
  // if (error1) {
  //   return <div>Error fetching data: {error.message}</div>;
  // }

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />

        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Daftar Lokasi KKN</h1>
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
                  className='block pt-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  "'
                  placeholder="Search for items"
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
                Tambah Lokasi
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
                    Desa/Kelurahan
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Kecamatan
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Kabupaten/Kota
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Provinsi
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Negara
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
              {currentPageItems.map((item, i) => (
                    <tr key={item.id}>
                      <td scope="col" className="py-2 px-4">
                        {i + 1}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {item.kelurahan || "-"}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {item.kecamatan || "-"}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {item.kota || "-"}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {item.provinsi || "-"}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {item.negara || "-"}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        <div className="space-x-2">
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal2(true);
                              setEditingData(item); //set data table
                            }}
                          >
                            edit
                          </button>
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal3(true);
                              setEditingData(item); // set data to be deleted
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
      <Head>
        <title>Admin | Setting - Lokasi</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      {displayAdmin}

      {/* Tambah kelompok */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="px-6 pb-2 lg:px-8 text-left">
          <h3 className="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Tambah Data Lokasi
          </h3>
          <form className="space-y-4" action="#">
            <div className="">
              <label
                htmlFor="negara"
                className="block text-lg font-medium text-gray-900"
              >
                Negara
              </label>
              <ReactSelect
                placeholder="Pilih Negara"
                id="negara"
                options={
                  data1.data &&
                  data1.data.data.map((country) => ({
                    value: country.ids_negara.toString(),
                    label: country.negara,
                  }))
                }
                onChange={(selectedOption) =>
                  handleNegara(selectedOption.value)
                }
                // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
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
                htmlFor="negara"
                className="block text-lg font-medium text-gray-900"
              >
                Provinsi
              </label>
              <ReactSelect
                id="provinsi"
                placeholder="Pilih Provinsi"
                options={
                  data2.data &&
                  data2.data.data.map((provinsi) => ({
                    value: provinsi.ids_provinsi.toString(),
                    label: provinsi.provinsi,
                  }))
                }
                onChange={(selectedOption) =>
                  handleProvinsi(selectedOption.value)
                }
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
                htmlFor="negara"
                className="block text-lg font-medium text-gray-900"
              >
                Kabupaten
              </label>
              <ReactSelect
                id="kota"
                placeholder="Pilih Kabupaten"
                options={
                  data3.data &&
                  data3.data.data.map((kota) => ({
                    value: kota.ids_kab_kota.toString(),
                    label: kota.kab_kota,
                  }))
                }
                onChange={(selectedOption) => handleKota(selectedOption.value)}
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
                htmlFor="negara"
                className="block text-lg font-medium text-gray-900"
              >
                Kecamatan
              </label>
              <ReactSelect
                id="kecamatan"
                placeholder="Pilih Kecamatan"
                options={
                  data4.data &&
                  data4.data.data.map((kecamatan) => ({
                    value: kecamatan.ids_kecamatan.toString(),
                    label: kecamatan.kecamatan,
                  }))
                }
                onChange={(selectedOption) =>
                  handleKecamatan(selectedOption.value)
                }
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
                htmlFor="negara"
                className="block text-lg font-medium text-gray-900"
              >
                Kelurahan
              </label>
              <ReactSelect
                id="kelurahan"
                placeholder="Pilih Kelurahan"
                options={
                  data5.data &&
                  data5.data.data.map((kelurahan) => ({
                    value: kelurahan.ids_kelurahan.toString(),
                    label: kelurahan.kelurahan,
                  }))
                }
                onChange={(selectedOption) =>
                  handleKelurahan(selectedOption.value)
                }
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
        <div className="px-6 pb-2 text-left">
          <h3 className="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Edit Data Lokasi
          </h3>
          {editingData && (
            <form className="space-y-4">
              <div className="">
                <label
                  for="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Kelurahan
                </label>
                <input
                  type="text"
                  id="name"
                  value={editingData.kelurahan}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      kelurahan: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  for="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Kecamatan
                </label>
                <input
                  type="string"
                  id="nim"
                  value={editingData.kecamatan}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      kecamatan: e.target.value,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  for="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Kabupaten/Kota
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={editingData.kota}
                  onChange={(e) =>
                    setEditingData({ ...editingData, kota: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className="">
                <label
                  for="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Provinsi
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={editingData.provinsi}
                  onChange={(e) =>
                    setEditingData({ ...editingData, provinsi: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>
              <div className="">
                <label
                  for="name"
                  className="block text-lg font-medium text-gray-900"
                >
                  Negara
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={editingData.negara}
                  onChange={(e) =>
                    setEditingData({ ...editingData, negara: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              <div className=" flex justify-center space-x-5">
                <button
                  type="button"
                  onClick={handleConfirmEdit}
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

      {/* Hapus kelompok */}
      <Modal isVisible={showModal3} onClose={() => setShowModal3(false)}>
        <div class="px-6 pb-2 lg:px-8 text-left">
          <h3 class="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
            Hapus Data Lokasi
          </h3>
          {/* {editingData && ( */}
          <div class="space-y-4">
            <p class="text-gray-700">
              Apakah Anda yakin ingin menghapus data lokasi ini?
            </p>
            <div class="flex justify-end space-x-4">
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
