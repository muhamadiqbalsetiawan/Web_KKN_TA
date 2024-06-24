import React, { useState } from "react";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Navbar from "../../components/navbar";
import Link from "next/link";

import Modal from "react-modal";
import Head from "next/head";
import useSWR from "swr";
import { useSession } from "next-auth/react";

export default function PendaftaranKKN() {
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    `/api/mahasiswa/profilQuery?nim=${id}`,
    fetcher
  );
  const { data: tables2 = [], error2 } = useSWR(
    `/api/mahasiswa/kelompokCheck?nim=${id}`,
    fetcher
  );
  const { data: tables3 = [], error3 } = useSWR(
    `/api/mahasiswa/daftarKelompokQuery`,
    fetcher
  );
  const { data: tables4 = [], error4 } = useSWR(
    `/api/mahasiswa/fetchSks`,
    fetcher
  );

  const [kelompok_id, setKelompokId] = useState(null);
  const [jenis_kelompok, setJenisKelompok] = useState(null);
  const [selectedKelompokKKN, setSelectedKelompokKKN] = useState(null);
  const [selectedKelompokIndex, setSelectedKelompokIndex] = useState(null);

  const [selectedJenisKelompok, setSelectedJenisKelompok] = useState("");

  // Function to handle radio button change
  const handleJenisKelompokChange = (jenisKelompok) => {
    setSelectedJenisKelompok(jenisKelompok);
  };

  // Create a Set to store unique jenis_kelompok values
  const uniqueJenisKelompokSet = new Set(
    tables3.map((item) => item.jenis_kelompok)
  );

  // State untuk modal konfirmasi
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);

  // Fungsi untuk membuka modal konfirmasi
  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const openErrorModal = () => {
    setErrorModalOpen(true);
  };

  // Fungsi untuk menutup modal konfirmasi
  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  // Fungsi untuk menangani submit form dan membuka modal konfirmasi
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Memastikan jenis KKN dan kelompok KKN dipilih
    if (selectedKelompokKKN !== null) {
      openConfirmationModal();
      setSelectedKelompokIndex(selectedKelompokKKN);
    } else {
      // Tampilkan pesan kesalahan jika jenis KKN atau kelompok KKN belum dipilih
      openErrorModal();
    }
  };

  const handleDaftar = async () => {
    try {
      // Make sure to replace 'your_api_endpoint' with the actual API endpoint
      const apiEndpoint = "/api/mahasiswa/daftarKelompok";

      // Make the API call
      const response = await fetch(apiEndpoint, {
        method: "POST", // or 'PUT' or 'GET' depending on your API requirements
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if required
        },
        body: JSON.stringify({
          kelompok_id: selectedKelompokKKN, // Assuming selectedKelompokKKN is the required parameter
          mahasiswa_id: id,
        }),
      });

      // Check if the response is successful (status code 2xx)
      if (response.ok) {
        console.log("API call successful");
        // You can handle the response or perform any additional actions here
      } else {
        console.error("API call failed");
        // Handle errors or provide feedback to the user
      }
    } catch (error) {
      console.error("Error while making API call", error);
      // Handle errors or provide feedback to the user
    }
  };

  const [statusSyarat, setStatusSyarat] = useState(false)

  if (tables4.length < 6) {
    console.log("Anda Masih Muda")
  } else if (tables4[6].total_sks < 110){
    console.log("SKS Anda Kurang")
  } else {
    console.log(tables4[6].total_sks);
    setStatusSyarat(true)
  }

  return (
    <>
      {/* {tables4 && (
        <div className="mt-5">
          <h1 className="text-lg font-bold">Fetched Data</h1>
          Display the fetched data here
          <pre>{JSON.stringify(tables4, null, 2)}</pre>
          {tables4[6].total_sks}
        </div>
      )} */}
      <Head>
        <title>Pendaftaran KKN</title>
        <meta property="og:title" content="Pendaftaran KKN" key="title" />
      </Head>
      <div className="absolute bg-IjoRumput w-full h-72 -z-20"></div>
      <div className="flex flex-row justify-start">
        <div className="w-auto h-screen">
          <SidebarMahasiswa />
        </div>
        <div className="overflow-y-auto h-screen w-screen md:grow">
          <Navbar />
          <div className="px-6 pb-5 w-auto">
            <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
              <h1>Pendaftaran KKN</h1>
            </div>
            <div className="py-3 md:py-8 px-4 md:px-10 bg-iceGray rounded-xl">
              {tables && tables.length > 0 ? (
                tables.map((item) => (
                  <div key={item.nim}>
                    <h1 className="text-base md:text-3xl font-semibold pb-1">
                      Data Pendaftar
                    </h1>
                    <div className="mt-2 text-sm md:text-lg px-3 md:px-7">
                      <dl>
                        <div className="px-0 md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Nama Pendaftar
                          </dt>
                          <dd className="leading-6 text-gray-700 font-medium col-span-2">
                            {item.name}
                          </dd>
                        </div>
                        <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Jenis Kelamin
                          </dt>
                          <dd className="leading-6 text-gray-700 font-medium col-span-2">
                            {item.gender === "L"
                              ? "LAKI - LAKI"
                              : item.gender === "P"
                              ? "PEREMPUAN"
                              : "-"}
                          </dd>
                        </div>
                        <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Program Studi
                          </dt>
                          <dd className="leading-6 text-gray-700 font-medium col-span-2">
                            {item.jurusan}
                          </dd>
                        </div>
                        <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Fakultas
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 font-medium col-span-2">
                            {item.fakultas}
                          </dd>
                        </div>
                        <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Status
                          </dt>
                          {item.status_syarat === null ||
                          item.status_syarat === "" ? (
                            <dd className="mt-1 leading-6 font-bold text-red-600 col-span-2">
                              Belum Memenuhi Syarat
                            </dd>
                          ) : item.status_syarat === "diterima" ? (
                            <dd className="mt-1 leading-6 font-bold text-green-600 col-span-2">
                              Memenuhi Syarat
                            </dd>
                          ) : item.status_jenis === "ditolak" ? (
                            <dd className="mt-1 leading-6 font-bold text-red-600 col-span-2">
                              Ditolak
                            </dd>
                          ) : (
                            item.status_jenis === "diterima" && (
                              <dd className="mt-1 leading-6 font-bold text-green-600 col-span-2">
                                Diterima
                              </dd>
                            )
                          )}
                        </div>
                      </dl>
                      <div className="w-full text-center">
                        {item.status_syarat === null ||
                        item.status_syarat === "" ? (
                          <div className="w-full text-center mt-10 md:mt-20 md:mb-9">
                            <Link
                              href={"/mahasiswa/uploadSyarat"}
                              className="px-10 py-2 bg-IjoRumput hover:bg-IjoRumput/80 text-xl text-white font-bold"
                            >
                              Upload Persyaratan
                            </Link>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h1 className="text-base md:text-3xl font-semibold pb-1">
                    Data Pendaftar
                  </h1>
                  <div className="mt-2 text-sm md:text-lg px-3 md:px-7">
                    <dl>
                      <div className="px-0 md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-6">
                        <dt className="font-semibold leading-6 text-gray-900">
                          Nama Pendaftar
                        </dt>
                        <dd className="leading-6 text-gray-700 font-medium col-span-2">
                          -
                        </dd>
                      </div>
                      <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-6 px-0">
                        <dt className="font-semibold leading-6 text-gray-900">
                          Jenis Kelamin
                        </dt>
                        <dd className="leading-6 text-gray-700 font-medium col-span-2">
                          -
                        </dd>
                      </div>
                      <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-6 px-0">
                        <dt className="font-semibold leading-6 text-gray-900">
                          Program Studi
                        </dt>
                        <dd className="leading-6 text-gray-700 font-medium col-span-2">
                          -
                        </dd>
                      </div>
                      <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-6 px-0">
                        <dt className="font-semibold leading-6 text-gray-900">
                          Fakultas
                        </dt>
                        <dd className="mt-1 leading-6 text-gray-700 font-medium col-span-2">
                          -
                        </dd>
                      </div>
                      <div className="md:px-4 md:py-2 grid grid-cols-3 md:grid-cols-6 px-0">
                        <dt className="font-semibold leading-6 text-gray-900">
                          Status
                        </dt>
                        <dd className="mt-1 leading-6 font-bold text-green-600 col-span-2">
                          -
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {tables2 && tables2.length > 0 ? (
                tables2.map((item2) => (
                  <div key={item2.nim}>
                    <section className="py-2 md:mt-2">
                      {item2.status_syarat === "diterima" &&
                        item2.kelompok_id === null && (
                          <div key={item2.nim}>
                            <form
                              method="post"
                              action="submitDaftar"
                              onSubmit={handleFormSubmit}
                            >
                              <input
                                id="id_mahasiswa"
                                className="hidden"
                                defaultValue={id}
                              />
                              <h1 className="text-base md:text-3xl font-semibold py-2">
                                Pilih Jenis Kelompok
                              </h1>
                              <div className="flex flex-col items-center border-y border-gray-200">
                                <div className="w-full flex flex-col md:flex-row items-center justify-between">
                                  <div className="w-full">
                                    {[...uniqueJenisKelompokSet].map(
                                      (jenisKelompok, i) => (
                                        <div
                                          key={i}
                                          className="w-full grid grid-cols-8 md:grid-cols-6 items-center"
                                        >
                                          <label
                                            htmlFor={jenisKelompok}
                                            className="py-1 md:py-4 ml-2 md:ml-10 text-sm md:text-lg font-medium text-gray-900 cursor-pointer col-span-7 md:col-span-5"
                                          >
                                            <span className="mr-1 md:mr-3">
                                              {i + 1} . {jenisKelompok}
                                            </span>
                                          </label>
                                          <input
                                            id={jenisKelompok}
                                            type="radio"
                                            value={jenisKelompok}
                                            name="jenisKelompok"
                                            checked={
                                              selectedJenisKelompok ===
                                              jenisKelompok
                                            }
                                            onChange={() =>
                                              handleJenisKelompokChange(
                                                jenisKelompok
                                              )
                                            }
                                            className="md:w-5 md:h-5 text-blue-600 bg-gray-100 border-gray-900 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                  <div className="w-full md:w-1/4 flex flex-col justify-center items-baseline md:items-center">
                                    <div className="w-full bg-IjoRumput mt-5 md:mt-0 px-4 py-2 md:px-10 md:py-4 rounded-lg text-center md:text-right text-white">
                                      <h1 className="text-base md:text-xl font-base">
                                        Jumlah Kelompok
                                      </h1>
                                      <h2 className="text-3xl md:text-5xl font-semibold">
                                        {
                                          tables3.filter(
                                            (item) =>
                                              item.jenis_kelompok ===
                                              selectedJenisKelompok
                                          ).length
                                        }
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full mt-4 md:mt-5">
                                  <h1 className="text-base md:text-3xl font-semibold pb-1 mb-2">
                                    Pilih Kelompok
                                  </h1>
                                  <div>
                                    <div className="flex flex-col md:flex-row px-1 md:px-4 text-sm md:text-lg">
                                      <div className="w-full">
                                        <div className="overflow-x-auto">
                                          <table className="min-w-full rounded-xl">
                                            <thead>
                                              <tr>
                                                <th className="bg-IjoRumput rounded-tl-lg p-2 md:p-4">
                                                  No
                                                </th>
                                                <th className="bg-IjoRumput p-2 md:p-4">
                                                  Act
                                                </th>
                                                <th className="bg-IjoRumput py-3 px-7">
                                                  Kelompok
                                                </th>
                                                <th className="bg-IjoRumput p-3 px-10">
                                                  Desa
                                                </th>
                                                <th className="bg-IjoRumput p-3 px-6">
                                                  Kecamatan
                                                </th>
                                                <th className="bg-IjoRumput p-3 px-6">
                                                  Kab/Kota
                                                </th>
                                                <th className="bg-IjoRumput p-3 px-6">
                                                  Negara
                                                </th>
                                                <th className="bg-IjoRumput p-3 md:p-4 rounded-tr-lg">
                                                  Peserta
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody className="text-center">
                                              {tables3
                                                .filter(
                                                  (item5) =>
                                                    item5.jenis_kelompok ===
                                                    selectedJenisKelompok
                                                )
                                                .map((item5, i) => (
                                                  <tr key={i}>
                                                    <td className="border-y py-1 md:p-3 border-slate-300">
                                                      {/* {indexOfFirstKelompok + i + 1} */}
                                                      {item5.kelompok_id}
                                                    </td>
                                                    <td className="border-y py-1 md:p-3 border-slate-300">
                                                      <input
                                                        id={item5.kelompok_id}
                                                        type="radio"
                                                        value={
                                                          item5.kelompok_id
                                                        }
                                                        name="kelompokKKN"
                                                        className="md:w-5 md:h-5 text-blue-600 bg-gray-100 border-gray-900 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                                        onChange={() => {
                                                          setSelectedKelompokKKN(
                                                            item5.kelompok_id
                                                          );
                                                          setJenisKelompok(
                                                            item5.jenis_kelompok
                                                          );
                                                        }}
                                                      />
                                                    </td>
                                                    <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                      {item5.kelompok_name}
                                                    </td>
                                                    <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                      {item5.lokasi_Kelurahan}
                                                    </td>
                                                    <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                      {item5.lokasi_Kecamatan}
                                                    </td>
                                                    <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                      {item5.lokasi_kota}
                                                    </td>
                                                    <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                      {item5.lokasi_Provinsi}
                                                    </td>
                                                    <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                      P{item5.female_count}/L
                                                      {item5.male_count}
                                                    </td>
                                                  </tr>
                                                ))}
                                            </tbody>
                                          </table>
                                        </div>
                                        <div className="flex md:flex-row justify-center md:justify-end">
                                          {/* {renderPagination()} */}
                                        </div>
                                        <div className="w-full text-center">
                                          <button
                                            type="submit"
                                            className="px-10 py-2 rounded-md bg-green-700 hover:bg-green-800 text-white font-semibold text-lg mt-5"
                                          >
                                            Daftar
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        )}
                      {item2.status_syarat === "diterima" &&
                        item2.kelompok_id !== null && (
                          <div className="border-t border-gray-100">
                            <dl className="divide-y divide-gray-100 text-center py-4">
                              <Link
                                href={"/mahasiswa/kelompok"}
                                className="px-5 py-2 bg-IjoRumput rounded-md text-white hover:bg-IjoRumput/80"
                              >
                                Lihat Detail Kelompok
                              </Link>
                            </dl>
                          </div>
                        )}
                    </section>
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={closeConfirmationModal}
        contentLabel="Konfirmasi Pendaftaran"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "50%",
            height: "50%",
            margin: "auto",
          },
        }}
      >
        <div className="h-full text-center justify-center flex flex-col text-sm md:text-lg font-medium">
          <div className="md:p-6">
            <p className="text-base md:text-xl font-medium">
              Apakah Anda yakin ingin mendaftar Jenis KKN:{" "}
              <span className="font-bold">{selectedJenisKelompok} </span>
              dan Kelompok KKN:{" "}
              <span className="font-bold">{selectedKelompokKKN}</span> ?
            </p>
          </div>
          <div>
            <button
              onClick={closeConfirmationModal}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md m-2"
            >
              Batal
            </button>
            <button
              onClick={() => {
                // Tambahkan logika pendaftaran atau tindakan lain di sini
                handleDaftar();
                // Tutup modal dan lakukan tindakan sesuai kebutuhan
                closeConfirmationModal();
                window.location.reload();
              }}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md m-2"
            >
              Ya, Saya Yakin
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Error */}
      <Modal
        isOpen={isErrorModalOpen}
        onRequestClose={closeErrorModal}
        contentLabel="Error Pendaftaran"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "50%",
            height: "50%",
            margin: "auto",
          },
        }}
      >
        <div className="h-full text-center justify-center flex flex-col text-sm md:text-lg font-medium">
          <div className="md:p-6">
            <p className="text-base md:text-xl font-medium">
              Anda Harus Memilih Jenis KKN dan Kelompok Terlebih Dahulu!!
            </p>
          </div>
          <div>
            <button
              onClick={closeErrorModal}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-md m-2 text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
