import React, { use, useState } from "react";
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

  let displayPendaftaran = "";

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
    `/api/mahasiswa/dataAntrian`,
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

  let statusSyarat = false;
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

  if (
    tables[0]?.universitas !=
    "UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG"
  ) {
    statusSyarat = true;
  } else {
    for (const semester of tables4) {
      const lulusKKN = semester.detail_mk?.some(
        (mk) =>
          // namaMk.includes(mk.nama_mk.toLowerCase()) && nilaiHuruf.includes(mk.nilai_huruf)
          // /kuliah kerja || kerja || kkm || kkn || field || kerja mahasiswa || nyata mahasiswa || kerjanyata || kerja-nyata/i.test(
          //   mk.nama_mk.toLowerCase()
          // ) && nilaiHuruf.includes(mk.nilai_huruf.toLowerCase())
          cariKata.some((kata) => mk.nama_mk.toLowerCase().includes(kata)) &&
          nilaiHuruf.includes(mk.nilai_huruf)
      );

      if (lulusKKN) {
        message = "Anda Sudah Lulus KKN, Selesaikan Skripsi Anda 😝";
        sudahKKN = true;
        break;
      }
    }

    if (tables4.length < 6) {
      message = "Anda Terlalu Muda Untuk Ikut KKN";
      // console.log("Anda Masih Muda");
    } else if (lastIndex.total_sks < 110) {
      message = "Belajar Lagi, SKS Anda Kurang";
      // console.log(lastIndex.total_sks);
      // console.log("SKS Anda Kurang");
    } else {
      // console.log(lastIndex.total_sks);
      if (sudahKKN === false) {
        if (tables3.userId === id) {
          statusSyarat = false;  
        } else {
          statusSyarat = true;
        }
      }
    }
  }


  const setStatus = useState(null);

  const handleAntrian = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/mahasiswa/antrian", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        status: "Dalam Antrian",
        waktuPendaftaran: new Date().toISOString(),
      }),
    });

    const data = await res.json();
    if (res.status === 200){
      router.push ('/mahasiswa/jeniskkn')
    } else {
      alert(data.error);
    }
  };

  

  // Session
  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "mahasiswa") {
    if (statusData === true) {
      displayPendaftaran = (
        <>
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
                <div className="py-3 md:py-8 px-4 md:px-10 bg-white shadow-lg rounded-xl">
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
                              {statusSyarat ? (
                                <dd className="mt-1 leading-6 font-bold text-green-600 col-span-2">
                                  {tables2[0]?.kelompok_id != null ? (
                                    <span>Terdaftar</span>
                                  ) : (
                                    <span>Memenuhi Syarat</span>
                                  )}
                                </dd>
                              ) : (
                                <dd className="mt-1 leading-6 font-bold text-red-600 col-span-2">
                                  {sudahKKN ? (
                                    <span>{message}</span>
                                  ) : (
                                    <span>
                                      Belum Memenuhi Syarat | {message}
                                    </span>
                                  )}
                                </dd>
                              )}
                            </div>
                          </dl>
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
                      <div key={item2.userId}>
                        <section className="py-2 md:mt-2">
                          {statusSyarat === true &&
                            item2.id == null && (
                              <div key={item2.id}>
                                <form
                                  
                                  onSubmit={handleAntrian}
                                >
                                  <input
                                    id="id_mahasiswa"
                                    className="hidden"
                                    defaultValue={id}
                                  />

                                  <div className="flex justify-center mt-5">
                                    <button
                                      type="submit"
                                      className="px-7 py-1 bg-green-700 text-white rounded-md font-semibold"
                                    >
                                      Daftar
                                    </button>
                                  </div>
                                </form>
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
      displayPendaftaran = "";
      router.push("/mahasiswa/editProf");
    }
  } else if (status === "authenticated" && role === "dosen") {
    displayPendaftaran = "";
    router.push("/dosen/dashboard");
  } else {
    displayPendaftaran = "";
    router.push("/login");
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

      {displayPendaftaran}
    </>
  );
}
