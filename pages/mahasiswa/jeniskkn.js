import React, { useState } from "react";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Navbar from "../../components/navbar";
import Link from "next/link";
import Modal from "react-modal";
import Head from "next/head";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { cariKata, namaMk } from "@/lib/listKata";
import { useEffect } from "react";
import Loading from "../loading";
import { useRouter } from "next/router";
import ErrorModal from "@/components/modalerror";
import ReactPaginate from "react-paginate";

export default function PendaftaranKKN() {
  const [selectedMahasiswaGender, setSelectedMahasiswaGender] = useState("");
  const [selectedMahasiswaJurusan, setSelectedMahasiswaJurusan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: Session, status } = useSession();
  const id = Session?.user?.username;
  const role = Session?.user?.role;
  const router = useRouter();

  let displayKelompok = "";

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

  useEffect(() => {
    // Pastikan data telah dimuat dan tidak ada kesalahan
    if (error) {
      console.error("Error fetching data:", error);
    } else if (!tables) {
      console.log("Loading data...");
    } else if (tables.length > 0) {
      // console.log("Data retrieved successfully:", tables);
      // Ambil gender dan jurusan dari data
      const { gender, jurusan } = tables[0];

      // Pastikan gender dan jurusan ada
      if (gender && jurusan) {
        // Setel nilai selectedMahasiswaGender dan selectedMahasiswaJurusan
        setSelectedMahasiswaGender(gender);
        setSelectedMahasiswaJurusan(jurusan);
      } else {
        console.error("Gender or jurusan is missing in the data");
      }
    } else {
      console.error("No data received");
    }
  }, [tables, error]);

  const [kelompok_id, setKelompokId] = useState(null);
  const [jenis_kelompok, setJenisKelompok] = useState(null);
  const [selectedKelompokKKN, setSelectedKelompokKKN] = useState(null);
  const [selectedKelompokIndex, setSelectedKelompokIndex] = useState(null);

  const [selectedJenisKelompok, setSelectedJenisKelompok] = useState("");

  // Function to handle radio button change
  const handleJenisKelompokChange = (jenisKelompok) => {
    setSelectedJenisKelompok(jenisKelompok);
  };

  const uniqueJenisKelompokSet = new Set(
    tables3
      .map((item) => {
        const startDate = new Date(item.tanggal_mulai);
        const endDate = new Date(item.tanggal_berakhir);
        const currentDate = new Date();

        // Periksa apakah tanggal mulai sama dengan hari ini atau lebih awal
        if (startDate <= currentDate) {
          // Tampilkan jenis kelompok jika tanggal berakhir lebih besar dari hari ini
          if (endDate >= currentDate) {
            return item.jenis_kelompok;
          } else {
            // Jika tanggal berakhir sudah lewat, tetap tampilkan jika tanggal berakhir adalah hari ini
            if (endDate.toDateString() === currentDate.toDateString()) {
              return item.jenis_kelompok;
            } else {
              return null;
            }
          }
        } else {
          // Jika tanggal mulai lebih dari hari ini, jangan tampilkan jenis kelompok
          return null;
        }
      })
      .filter((item) => item !== null) // Hapus entri null
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

  const [isModalFail, setModalFail] = useState(false);
  const [isModalFail2, setModalFail2] = useState(false);

  const closeModalFail = () => {
    setModalFail(false);
  };
  const closeModalFail2 = () => {
    setModalFail2(false);
  };

  //pagination
  const [active, setActive] = useState(1);
  const itemsPerPage = 10;
  const filteredItems = tables3.filter(
    (item) =>
      !selectedJenisKelompok || item.jenis_kelompok === selectedJenisKelompok
  );
  // Menghitung jumlah halaman berdasarkan data yang difilter
  const totalPages = selectedJenisKelompok
    ? Math.ceil(filteredItems.length / itemsPerPage)
    : 0;
  // Memperbarui halaman saat jenis_kelompok dipilih
  useEffect(() => {
    setCurrentPage(0); // Kembali ke halaman pertama setelah filter berubah
  }, [selectedJenisKelompok]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  //end pagination

  const handleDaftar = async () => {
    try {
      // Pastikan untuk mengganti 'your_api_endpoint' dengan endpoint API yang sebenarnya
      const apiEndpoint = "/api/mahasiswa/daftarKelompok";

      // Lakukan panggilan API
      const response = await fetch(apiEndpoint, {
        method: "POST", // atau 'PUT' atau 'GET' tergantung pada kebutuhan API Anda
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header tambahan jika diperlukan
        },
        body: JSON.stringify({
          kelompok_id: selectedKelompokKKN, // Anggap selectedKelompokKKN adalah parameter yang diperlukan
          mahasiswa_id: id,
          gender: selectedMahasiswaGender, // Tambahkan gender
          jurusan: selectedMahasiswaJurusan, // Tambahkan jurusan
        }),
      });

      // Periksa apakah respons berhasil (kode status 2xx)
      if (response.ok) {
        console.log("Panggilan API berhasil");
        window.location.reload();
        // Anda dapat menangani respons atau melakukan tindakan tambahan di sini
      } else if (response.status === 403) {
        // Handle kasus di mana kelompok penuh atau mahasiswa memiliki jurusan yang sama
        const responseData = await response.json();
        if (responseData.message === "PENUH") {
          // alert("Jenis Kelamin Penuh")
          setModalFail(true);
        } else if (responseData.message === "JURUSAN_PENUH") {
          // alert("Mahasiswa Jurusan Penuh");
          setModalFail2(true);
        } else {
          alert("Daftar Gagal");
        }
      } else {
        console.error("Panggilan API gagal");
        // Tangani kesalahan atau berikan umpan balik kepada pengguna
      }
    } catch (error) {
      console.error("Error saat melakukan panggilan API", error);
      // Tangani kesalahan atau berikan umpan balik kepada pengguna
    }
  };

  let statusSyarat = true;
  let sudahKKN = false;
  let message = "";
  const lastIndex = tables4[tables4.length - 1];
  const nilaiHuruf = ["A", "B", "C"];
  let statusData = false;
  let gender = "";
  if (tables && tables.length > 0) {
    if (tables[0] && tables[0].gender) {
      gender = tables[0].gender;
    } else {
      console.log("tables[0].gender is not defined.");
    }
  } else {
    console.log("tables is undefined or empty.");
  }

  if (!tables.error) {
    statusData = true;
  } else {
    statusData = false;
  }

  // if (
  //   tables[0]?.universitas !=
  //   "UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG"
  // ) {
  //   statusSyarat = true;
  // } else {
  //   for (const semester of tables4) {
  //     const lulusKKN = semester.detail_mk?.some(
  //       (mk) =>
  //         // namaMk.includes(mk.nama_mk.toLowerCase()) && nilaiHuruf.includes(mk.nilai_huruf)
  //         // /kuliah kerja || kerja || kkm || kkn || field || kerja mahasiswa || nyata mahasiswa || kerjanyata || kerja-nyata/i.test(
  //         //   mk.nama_mk.toLowerCase()
  //         // ) && nilaiHuruf.includes(mk.nilai_huruf.toLowerCase())
  //         cariKata.some((kata) => mk.nama_mk.toLowerCase().includes(kata)) &&
  //         nilaiHuruf.includes(mk.nilai_huruf)
  //     );

  //     if (lulusKKN) {
  //       message = "Anda Sudah Lulus KKN, Selesaikan Skripsi Anda 😝";
  //       sudahKKN = true;
  //       break;
  //     }
  //   }

  //   if (tables4.length < 6) {
  //     message = "Anda Terlalu Muda Untuk Ikut KKN";
  //     // console.log("Anda Masih Muda");
  //   } else if (lastIndex.total_sks < 110) {
  //     message = "Belajar Lagi, SKS Anda Kurang";
  //     // console.log(lastIndex.total_sks);
  //     // console.log("SKS Anda Kurang");
  //   } else {
  //     // console.log(lastIndex.total_sks);
  //     if (sudahKKN === false) {
  //       statusSyarat = true;
  //     }
  //   }
  // }

  const [isReady, setIsReady] = useState("Dalam Antrian");
  const [timer, setTimer] = useState(60 * 1); // 1 menit (60 detik)
  const { data: antrian = [], gagal } = useSWR(
    `/api/mahasiswa/checkStatus?userId=${id}`,
    fetcher
  );
  const menit = timer / 60;

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch(`/api/mahasiswa/checkStatus?userId=${id}`);
      const data = await res.json();
      setIsReady(data[0]?.status);

      if (data[0]?.status === "Siap") {
        startTimer();
      }
    };

    const startTimer = () => {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    checkStatus();
  }, []);

  useEffect(() => {
    if (timer === 0 && isReady) {
      // jika waktu habis, kembalikan user ke antrian
      const returnToQueue = async () => {
        await fetch(`/api/mahasiswa/returnToQueue?id=${antrian[0]?.id}`, {
          method: "DELETE",
        });

        // await fetch(`/api/mahasiswa/processQueue`, {
        //   method: 'POST',
        // });

        router.push("/mahasiswa/pendaftarantest"); // Arahkan user kembali ke halaman antrian
      };
      returnToQueue();
    }
  }, [timer, isReady]);
  console.log(antrian[0]?.id);

  Session;
  if (status === "loading") {
    <Loading />;
  } else if (isReady == "Siap") {
    displayKelompok = (
      <>
        <div className="absolute bg-IjoRumput w-full h-72 -z-20"></div>
        <div className="flex flex-row justify-start">
          <div className="w-auto h-screen">
            <SidebarMahasiswa />
          </div>
          <div className="overflow-y-auto h-screen w-screen md:grow">
            <Navbar />
            <div className="px-6 pb-5 w-auto">
              <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold md:text-5xl text-white">
                <h1>Pilih Kelompok KKN</h1>
                <div className="justify-center flex">
                  <p>
                    Waktu tersisa: {Math.floor(timer / 60)}:{timer % 60}
                  </p>
                </div>
              </div>
              <div className="py-3 md:py-8 px-4 md:px-10 bg-white shadow-lg rounded-xl">
                {tables2 && tables2.length > 0 ? (
                  tables2.map((item2) => (
                    <div key={item2.nim}>
                      <section className="py-2 md:mt-2">
                        {statusSyarat === true &&
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
                                <div className="flex flex-col items-center">
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
                                              className="md:w-5 md:h-5 text-green-600 bg-gray-100 border-gray-900 focus:ring-green-500 focus:ring-2 cursor-pointer"
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <div className="w-full md:w-1/4 flex flex-col justify-center items-baseline md:items-center">
                                      <div className="w-full bg-iconHoverColor mt-5 md:mt-0 px-4 py-2 md:px-10 md:py-4 rounded-lg text-center md:text-right text-white">
                                        <h1 className="text-base md:text-xl font-medium">
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
                                                  <th className="bg-IjoRumput text-white rounded-tl-lg p-2 md:p-4">
                                                    No
                                                  </th>
                                                  <th className="bg-IjoRumput text-white p-2 md:p-4">
                                                    Act
                                                  </th>
                                                  <th className="bg-IjoRumput text-white py-3 px-7">
                                                    Kelompok
                                                  </th>
                                                  <th className="bg-IjoRumput text-white p-3 px-10">
                                                    Desa
                                                  </th>
                                                  <th className="bg-IjoRumput text-white p-3 px-6">
                                                    Kecamatan
                                                  </th>
                                                  <th className="bg-IjoRumput text-white p-3 px-6">
                                                    Kab/Kota
                                                  </th>
                                                  <th className="bg-IjoRumput text-white p-3 px-6">
                                                    Provinsi
                                                  </th>
                                                  <th className="bg-IjoRumput text-white p-3 px-6">
                                                    Negara
                                                  </th>
                                                  <th className="bg-IjoRumput text-white py-3 px-12 md:py-4  rounded-tr-lg">
                                                    Peserta
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody className="text-center">
                                                {currentItem
                                                  .filter(
                                                    (item5) =>
                                                      item5.jenis_kelompok ===
                                                      selectedJenisKelompok
                                                  )
                                                  .map((item5, i) => (
                                                    <tr key={i}>
                                                      <td className="border-y py-1 md:p-3 border-slate-300">
                                                        {i + 1}
                                                      </td>
                                                      <td className="border-y py-1 md:p-3 border-slate-300">
                                                        {gender === "L" &&
                                                        item5.male_count >=
                                                          item5.batas_laki ? (
                                                          "Penuh"
                                                        ) : gender === "P" &&
                                                          item5.female_count >=
                                                            item5.batas_perempuan ? (
                                                          "Penuh"
                                                        ) : (
                                                          <input
                                                            id={
                                                              item5.kelompok_id
                                                            }
                                                            type="radio"
                                                            value={
                                                              item5.kelompok_id
                                                            }
                                                            name="kelompokKKN"
                                                            className="md:w-5 md:h-5 text-green-600 bg-gray-100 border-gray-900 focus:ring-green-500 focus:ring-2 cursor-pointer"
                                                            onChange={() => {
                                                              setSelectedKelompokKKN(
                                                                item5.kelompok_id
                                                              );
                                                              setJenisKelompok(
                                                                item5.jenis_kelompok
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        {item5.kelompok_name}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        {item5.lokasi_kelurahan}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        {item5.lokasi_kecamatan}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        {item5.lokasi_kota}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        {item5.lokasi_provinsi}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        {item5.lokasi_negara}
                                                      </td>
                                                      <td className="border-y mx-2 py-1 md:p-3 border-slate-300">
                                                        👩🏻{item5.female_count}
                                                        {item5.p} | 👨🏻
                                                        {item5.male_count}
                                                        {item5.l}
                                                      </td>
                                                    </tr>
                                                  ))}
                                              </tbody>
                                            </table>
                                          </div>
                                          <div
                                            type="pagination"
                                            className="flex justify-center gap-4 mt-2 "
                                          >
                                            <ReactPaginate
                                              previousLabel={"<"}
                                              nextLabel={">"}
                                              breakLabel={"..."}
                                              breakClassName={"break-me"}
                                              pageCount={totalPages || 0}
                                              marginPagesDisplayed={1}
                                              pageRangeDisplayed={3}
                                              onPageChange={handlePageClick}
                                              containerClassName={
                                                "pagination flex justify-center mt-8"
                                              }
                                              activeClassName={
                                                "bg-green-500 text-white px-3 py-1 rounded-md"
                                              }
                                              previousClassName={
                                                "px-3 py-1 rounded-md border border-gray-300 mr-2"
                                              }
                                              nextClassName={
                                                "px-3 py-1 rounded-md border border-gray-300 ml-2"
                                              }
                                              pageClassName={
                                                "px-3 py-1 rounded-md border border-gray-300 mr-2 hover:bg-gray-200"
                                              }
                                              disabledClassName={
                                                "text-gray-400 cursor-not-allowed"
                                              }
                                            />
                                          </div>
                                          <div className="flex md:flex-row justify-center md:justify-end">
                                            {/* {renderPagination()} */}
                                          </div>
                                          <div className="w-full text-center">
                                            <button
                                              type="submit"
                                              className="px-10 py-2 rounded-md bg-submitColor hover:bg-submitHoverColor text-white font-semibold text-lg mt-5"
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
                        {statusSyarat === true &&
                          item2.kelompok_id !== null && (
                            <div className="border-t border-gray-100">
                              <dl className="divide-y divide-gray-100 text-center py-4">
                                <Link
                                  href={"/mahasiswa/kelompok"}
                                  className="px-5 py-2 bg-[#899e81]  rounded-md text-white hover:bg-iconHoverColor"
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
      </>
    );
  } else {
    displayKelompok = (
      <div>
        <div className="absolute bg-IjoRumput w-full h-72 -z-20"></div>
        <div className="flex flex-row justify-start">
          <div className="overflow-y-auto h-screen w-screen md:grow">
            <Navbar />
            <div className="px-6 pb-5 w-auto">
              <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white flex justify-center">
                <h1>Pilih Kelompok KKN</h1>
              </div>
              <div className="py-3 md:py-8 px-4 md:px-10 bg-white shadow-lg rounded-xl">
                {/* Modal */}
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">
                      Anda Sedang Dalam Antrian, Silahkan menunggu dalam {menit}{" "}
                      menit
                    </h2>
                    <p className="text-center mb-4">
                      Mohon menunggu giliran Anda untuk memilih kelompok.
                    </p>
                    <div className="flex justify-center">
                      <button
                        className="w-1/6 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-primaryColor-dark "
                        onClick={() =>
                          router.push("/mahasiswa/pendaftarantest")
                        }
                      >
                        Oke
                      </button>
                    </div>
                  </div>
                </div>
                {/* End of Modal */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

      {displayKelompok}

      <ErrorModal
        isOpen={isModalFail}
        onClose={closeModalFail}
        isMessage={"Kuota Pendaftar dengan Jenis Kelamin Tersebut Sudah Penuh"}
        isTitle={"Kuota Pendaftar Penuh"}
      />
      <ErrorModal
        isOpen={isModalFail2}
        onClose={closeModalFail2}
        isMessage={"Kuota Pendaftar dengan Jurusan Tersebut Sudah Penuh"}
        isTitle={"Kuota Pendaftar Penuh"}
      />

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
              className="px-4 py-2 bg-cancelColor hover:bg-cancelColorHover rounded-md m-2 text-white"
            >
              Batal
            </button>
            <button
              onClick={() => {
                // Tambahkan logika pendaftaran atau tindakan lain di sini
                handleDaftar();
                // Tutup modal dan lakukan tindakan sesuai kebutuhan
                closeConfirmationModal();
              }}
              className="px-4 py-2 bg-submitColor hover:bg-submitHoverColor text-white rounded-md m-2"
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
