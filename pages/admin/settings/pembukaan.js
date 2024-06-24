import SidebarAdmin from "@/components/sidebarAdmin";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import { TrashIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import ErrorModal from "@/components/modalerror";
import { Dialog, Transition } from "@headlessui/react";
import SuccessModal from "@/components/modalsuccess";
import Modal from "@/components/admin/modal";
import { mutate } from "swr";

export default function AjuanSurat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleCloseErrModal = () => {
    setIsModal(false);
  };
  const handleOpenModal = (id) => {
    setIsOpen(true);
    setSelectedItem(id);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleCloseSuccessModal = () => {
    setIsModalSuccess(false);
  };

  const [jenisKKNs, setJenisKKNs] = useState([""]);

  const addInputField = () => {
    setJenisKKNs([...jenisKKNs, ""]); // Menambahkan string kosong ke dalam array jenisKKNs
  };

  const handleChange = (index, value) => {
    const updatedJenisKKNs = [...jenisKKNs];
    updatedJenisKKNs[index] = value; // Memperbarui nilai jenis KKN pada indeks tertentu
    setJenisKKNs(updatedJenisKKNs);
  };

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [] } = useSWR(
    "/api/admin/setting/tanggalQuery",
    fetcher
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/admin/setting/deleteTanggal", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Mengirim ID Dosen ke API penghapusan
      });

      if (response.ok) {
        router.reload();
      } else {
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah perilaku default formulir
    try {
      // Pemeriksaan apakah ada input jenis KKN yang kosong
      if (jenisKKNs.some((jenisKKN) => jenisKKN.trim() === "")) {
        setError("Semua jenis KKN harus diisi");
        return;
      }

      const response = await fetch("/api/admin/setting/tanggal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jenisKKN: jenisKKNs,
          tanggalMulai,
          tanggalBerakhir,
        }), // Mengirim jenisKKNs sebagai array
      });

      if (response.ok) {
        setIsModalSuccess(true);
        window.location.reload();
      } else {
        setIsModal(true);
        console.error("Gagal menyimpan data:", response.statusText);
      }
    } catch (error) {
      setIsModal(true);
      console.error("Terjadi kesalahan:", error);
    }
  };

  const editTanggal = async () => {
    try {
      // Make an API request to edit mahasiswa
      // Replace '/api/admin/mahasiswa/edit' with your actual API endpoint
      const response = await fetch("/api/admin/setting/editTanggal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jenis_kelompok: editingData.jenis_KKN,
          tanggal_mulai: editingData.tanggalMulai,
          tanggal_berakhir: editingData.tanggalBerakhir,
        }),
      });

      if (response.ok) {
        // If the request is successful, you can update the data or refetch it
        mutate("/api/admin/setting/tanggalQuery");
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

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />
        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Pembukaan Jenis KKN</h1>
          </div>
        </div>
        <div className="absolute ml-32 px-3 md:left-32 md:right-12  md:top-24 pb-5 rounded-xl bg-gray-50 shadow-lg">
          <form className="mt-2 p-5 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold pb-5">Tambah data Jenis KKN</h2>
            <div className="flex justify-center items-center font-medium w-full space-x-5">
              {jenisKKNs.map((jenisKKN, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={jenisKKN}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="Jenis KKN"
                    className="rounded-md"
                  />
                </div>
              ))}
              {/* <button type="button" onClick={addInputField}>Tambah Jenis KKN</button> */}
              <div>
                <label className="text-center m-3" htmlFor="mulai">
                  Tanggal Mulai :
                </label>
                <input
                  id="mulai"
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="rounded-md"
                />
              </div>
              <div>
                <label className="text-center m-3" htmlFor="end">
                  Tanggal Berakhir :
                </label>
                <input
                  id="end"
                  type="date"
                  value={tanggalBerakhir}
                  onChange={(e) => setTanggalBerakhir(e.target.value)}
                  className="rounded-md"
                />
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-submitColor hover:bg-submitHoverColor px-7 py-2 text-white font-bold text-lg rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
          <div className="relative mt-4 overflow-x-auto">
            <table className=" text-lg text-gray-900 w-full font-medium">
              <thead className=" text-white bg-gray-500 text-left">
                <tr className="">
                  <th scope="col" className="py-2 px-2">
                    No
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Jenis KKN
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Tanggal Dimulai
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Tanggal Berakhir
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Act
                  </th>
                </tr>
              </thead>
              <tbody className="text-left bg-white">
                {tables.map((table, i) => (
                  <tr key={i}>
                    <td scope="col" className="py-1 px-2">
                      {i + 1}
                    </td>
                    <td scope="col" className="py-1 px-2">
                      {table.jenis_KKN || "Belum Ditentukan"}
                    </td>
                    <td scope="col" className="py-1 px-2">
                      {table.tanggalMulai || "Belum Ditentukan"}
                    </td>
                    <td scope="col" className="py-1 px-2">
                      {table.tanggalBerakhir || "Belum Ditentukan"}
                    </td>
                    <td scope="col" className="py-1 px-2">
                      <div className="space-x-2 flex justify-start">
                        <div>
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => {
                              setShowModal2(true);
                              setEditingData(table); //set data table
                            }}
                          >
                            edit
                          </button>
                        </div>
                        <div
                          className="lg:w-9 bg-red-600 hover:bg-red-700 flex items-center p-2 text-white cursor-pointer rounded-lg"
                          onClick={() => handleOpenModal(table.id)}
                        >
                          <TrashIcon
                            className="w-3 h-3 md:w-5 md:h-5"
                            style={{ strokeWidth: 2 }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Admin | Pembukaan Jenis KKN</title>
      </Head>
      <ErrorModal
        isOpen={isModal}
        isTitle={"Gagal Tambah Data"}
        isMessage={"Data Gagal Ditambahkan"}
        onClose={handleCloseErrModal}
        onRefresh={() => window.location.reload()}
      />
      <SuccessModal
        isOpen={isModalSuccess}
        isMessage={"Data Berhasil Ditambahkan"}
        onClose={handleCloseSuccessModal}
        onRefresh={() => window.location.reload()}
      />
      {displayAdmin}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Apakah anda yakin ingin menghapus Laporan Ini?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Anda tidak dapat mengembalikan laporan yang sudah dihapus.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(selectedItem)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
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
                    htmlFor="jenisKKN"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Jenis KKN
                  </label>
                  <input
                    type="text"
                    id="jenisKKN"
                    value={editingData.jenis_KKN}
                    readOnly
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        jenis_KKN: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="startDate"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={editingData.tanggalMulai}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        tanggalMulai: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="endDate"
                    className="block text-lg font-medium text-gray-900"
                  >
                    Tanggal Berakhir
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={editingData.tanggalBerakhir}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        tanggalBerakhir: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-5">
                <button
                  type="button"
                  onClick={editTanggal}
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
