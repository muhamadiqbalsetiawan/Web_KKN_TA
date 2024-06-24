import React, { useEffect } from "react";
import Navbar from "../../components/navbar";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Head from "next/head";
import { PlusIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useSWR from "swr";
import { useState } from "react";
import SuccessModal from "../../components/modalsuccess";
import FailedModal from "@/components/modalfail";
import ErrorModal from "@/components/modalerror";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "../loading";

export default function LaporanKKN() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [nim, setNim] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [judul, setJudul] = useState("");
  const [file, setFile] = useState(null);

  const mahasiswaId = session?.user?.username;
  let displayLaporan = "";

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    `/api/mahasiswa/logbookData?nim=${mahasiswaId}`,
    fetcher
  );
  const { data: tables2 = [], error2 } = useSWR(
    `/api/mahasiswa/laporanQuery?mahasiswaId=${mahasiswaId}`,
    fetcher
  );
  const { data: tables3 = [], error3 } = useSWR(
    `/api/mahasiswa/kelompokCheck?nim=${mahasiswaId}`,
    fetcher
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal2 = (id) => {
    setIsOpen(true);
    setSelectedItem(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      // alert("Pilih file laporan terlebih dahulu.");
      setModalError(true);
      return;
    }

    const formData = new FormData();
    formData.append("mahasiswa_id", mahasiswaId);
    formData.append("judul", judul);
    formData.append("file", file);
    try {
      const response = await fetch("/api/mahasiswa/laporan", {
        method: "POST",
        body: formData, // Gunakan formData untuk upload file
      });

      if (response.ok) {
        const data = await response.json();
        // alert(`File ${tables[0].fileName} berhasil diunggah.`);
        setModalSuccess(true);
        // Tambahkan logika lain yang diperlukan setelah unggah berhasil
      } else {
        // alert("Gagal mengunggah file laporan.");
        setModalFail(true);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      // alert("Terjadi kesalahan. Silakan coba lagi.");
      setModalError(true);
    }
  };

  const [isModalSuccess, setModalSuccess] = useState(false);
  const [isModalFail, setModalFail] = useState(false);
  const [isModalError, setModalError] = useState(false);

  const handleCloseSuccessModal = () => {
    setModalSuccess(false);
  };

  const handleCloseFailModal = () => {
    setModalFail(false);
  };

  const handleCloseErrorModal = () => {
    setModalError(false);
  };

  const handleDelete = async () => {
    // const confirmed = window.confirm("Are you sure you want to delete this data?");

    // if (confirmed) {
    try {
      const response = await fetch("/api/mahasiswa/laporanDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mahasiswaId }), // Mengirim ID Dosen ke API penghapusan
      });

      if (response.ok) {
        router.reload();
      } else {
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    // }
  };
  const handleView = async (laporan) => {
    try {
      const response = await fetch(
        `/api/view?laporan=${encodeURIComponent(laporan)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memuat file PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };
  if (error || error2) {
    return <div>Error loading group details</div>;
  }

  if (!tables) {
    return <div>Loading... Data Error</div>;
  }

  const role = session?.user?.role;

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "mahasiswa") {
    tables3.map((grup) => {
      if (grup.kelompok_id !== null) {
        displayLaporan = (
          <>
            <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
            <div className="flex flex-row justify-start">
              <div className="h-screen">
                <SidebarMahasiswa />
              </div>
              <div className="overflow-auto h-screen grow">
                <Navbar />
                <div className="px-6 pb-5 w-auto">
                  <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                    <h1>Laporan KKN</h1>
                  </div>
                  <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl">
                    <div className="mt-3 ml-4 md:ml-5 flex flex-row">
                      <div className="box-border mb-3">
                        {tables.length > 0 &&
                          tables.map((items, i) => (
                            <div key={i}>
                              <h1 className="text-lg md:text-3xl font-bold">
                                KKN {items.jenis_kkn}
                              </h1>
                              <h2 className="md:text-xl font-semibold">
                                {items.kelompok}
                              </h2>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="w-full font-medium text-sm md:text-lg px-4 md:px-0">
                      {tables2 && tables2.length > 0 ? (
                        <table className="w-full rounded-xl">
                          <thead>
                            <tr className="bg-IjoRumput">
                              <th className="rounded-tl-lg p-1 lg:p-4">No</th>
                              <th className="px-6 p-2 lg:p-4">judul</th>
                              <th className="px-6 p-3 lg:p-4">file</th>
                              <th className="rounded-tr-lg p-3 lg:p-4">Act</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {tables2.map((item, i) => (
                              <tr key={i} className="border-y border-slate-300">
                                <td className="py-1 px-0 lg:p-3">{i + 1}</td>
                                <td className="py-1 px-1 lg:p-3">
                                  {item.judul}
                                </td>
                                <td className="py-1 px-2 lg:p-3">
                                  {item.laporan}
                                </td>
                                <td className="py -1 px-3 lg:p-3 flex items-center justify-center">
                                  <div
                                    style={{
                                      marginBottom: "10px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <div
                                      className="lg:w-9 bg-red-600 hover:bg-red-700 flex items-center p-2 text-white cursor-pointer rounded-lg"
                                      onClick={() => handleOpenModal2(item.id)}
                                      // Tampilkan dialog konfirmasi saat tombol diklik
                                    >
                                      <TrashIcon
                                        className="w-3 h-3 md:w-5 md:h-5"
                                        style={{ strokeWidth: 2 }}
                                      />
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginBottom: "10px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <div
                                      className="lg:w-9 bg-submitColor hover:bg-submitHoverColor flex items-center p-2 text-white cursor-pointer rounded-lg"
                                      onClick={() => handleView(item.laporan)}
                                      // Tampilkan dialog konfirmasi saat tombol diklik
                                    >
                                      <EyeIcon
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
                      ) : (
                        <form
                          className="max-w-lg mx-auto my-3"
                          onSubmit={handleSubmit}
                        >
                          {tables.length > 0 &&
                            tables.map((items, i) => (
                              <div key={i}>
                                <input
                                  type="hidden"
                                  id="mahasiswa_id"
                                  className="disabled w-full rounded-md text-xs md:text-base"
                                  value={mahasiswaId}
                                />{" "}
                              </div>
                            ))}
                          <div className="my-2">
                            <label htmlFor="laporan">Judul Artikel</label>
                            <input
                              className="block w-full text-gray-900 border border-gray-300 bg-gray-50 rounded-md"
                              id="judul"
                              type="text"
                              value={judul}
                              onChange={(e) => setJudul(e.target.value)}
                            />
                          </div>
                          <div className="my-2 hidden">
                            <label htmlFor="laporan">Link Google Drive</label>
                            <input
                              type="text"
                              className="block w-full text-gray-900 border border-gray-300 bg-gray-50 rounded-md"
                            />
                          </div>
                          <div className="my-2">
                            <label htmlFor="laporan">
                              Laporan Berupa Artikel Pengabdian atau Artikel
                              Penelitian
                            </label>
                            <input
                              className="block w-full text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 rounded-md"
                              id="file"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                            />
                          </div>
                          <div className="text-center mt-5">
                            <button
                              type="submit"
                              className="px-8 py-2 bg-submitColor hover:bg-submitHoverColor text-white font-bold rounded-lg"
                            >
                              Upload
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        displayLaporan = "";
        router.push("/mahasiswa/dashboard");
      }
    });
  } else if (status === "authenticated" && role === "dosen") {
    displayLaporan = "";
    router.push("/dosen/dashboard");
  } else {
    displayLaporan = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Laporan Mahasiswa</title>
        <meta property="og:title" content="Laporan Mahasiswa" key="title" />
      </Head>
      <SuccessModal
        isOpen={isModalSuccess}
        onClose={handleCloseSuccessModal}
        onRefresh={() => window.location.reload()}
        isMessage={"File Laporan Berhasil Diunggah"}
      />
      <FailedModal
        isOpen={isModalFail}
        onClose={handleCloseFailModal}
        onRefresh={() => window.location.reload()}
        isMessage={"File Laporan Gagal Diunggah"}
      />
      <ErrorModal
        isOpen={isModalError}
        onClose={handleCloseErrorModal}
        onRefresh={() => window.location.reload()}
        isMessage={"Pilih File Laporan Terlebih Dahulu"}
        isTitle={"File Upload Kosong"}
      />
      {displayLaporan}
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
    </>
  );
}
