import React from "react";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Navbar from "../../components/navbar";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useState } from "react";
import SuccessModal from "../../components/modalsuccess";
import FailedModal from "../../components/modalfail";
import ErrorModal from "../../components/modalerror";
import { useRouter } from "next/router";

export default function UploadSyarat() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      // alert("Pilih file laporan terlebih dahulu.");
      setModalError(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);

    try {
      const response = await fetch("/api/mahasiswa/uploadSyarat", {
        method: "POST",
        body: formData, // Gunakan formData untuk upload file
      });

      if (response.ok) {
        const data = await response.json();
        // alert(`File ${file.name} berhasil diunggah.`);
        setModalSuccess(true);

        // Tambahkan logika lain yang diperlukan setelah unggah berhasil        
        router.push('/mahasiswa/syaratCompleted');
      } else {
        // alert("Gagal mengunggah file laporan.");
        setModalFail(true);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
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

  return (
    <>
      <Head>
        <title>Upload Syarat</title>
        <meta property="og:title" content="Upload Syarat" key="title" />
      </Head>
      <SuccessModal
        isOpen={isModalSuccess}
        onClose={handleCloseSuccessModal}
        onRefresh={() => window.location.reload()}
        isMessage={"File Syarat Berhasil Diunggah"}
      />
      <FailedModal
        isOpen={isModalFail}
        onClose={handleCloseFailModal}
        onRefresh={() => window.location.reload()}
        isMessage={"File Syarat Gagal Diunggah"}
      />
      <ErrorModal
        isOpen={isModalError}
        onClose={handleCloseErrorModal}
        onRefresh={() => window.location.reload()}
        isMessage={"Pilih File Syarat Terlebih Dahulu"}
      />
      ;<div className="absolute bg-IjoRumput w-full h-72 -z-20"></div>
      <div className="flex flex-row justify-start">
        <div className="md:w-auto h-screen">
          <SidebarMahasiswa />
        </div>
        <div className="h-screen w-screen overflow-auto grow">
          <Navbar />
          <div className="px-6 pb-5 w-auto text-lg font-medium">
            <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
              <h1>Dashboard</h1>
            </div>
            <div className="p-3 md:p-6 bg-iceGray rounded-xl">
              <div className="w-full text-center">
                <h1 className="text-sm md:text-3xl font-semibold pb-1 md:pb-3 mb-3">
                  Upload Surat Pernyataan
                </h1>
              </div>
              <div className="text-justify px-3 text-sm md:text-lg">
                <p className="mb-2">
                  Untuk memenuhi persyaratan pendaftaran KKN UIN Sunan Gunung
                  Djati Bandung Tahun 2023, Peserta wajib mengunggah surat
                  pernyataan terlebih dahulu sebelum memilih lokasi KKN.
                  Keaslian surat pernyataan harus dapat dipertanggungjawabkan
                  oleh peserta di kemudian hari. Apabila ditemukan
                  ketidaksesuaian, konsekuensi ditanggung oleh peserta KKN.
                </p>
                <div className="mb-2">
                  <p>
                    Adapun syarat mengikuti KKN UIN Sunan Gunung Djati Bandung
                    Tahun 2024 adalah sebagai berikut:
                  </p>
                  <ol className="list-decimal pl-8">
                    <li>
                      Telah mengambil dan lulus 75% dari jumlah SKS keseluruhan
                    </li>
                    <li>Telah lunas UKT pada semester berjalan</li>
                  </ol>
                </div>
                <p>
                  Silahkan lampirkan bukti surat pernyataan dari jurusan
                  masing-masing pendaftar. Template Surat Pernyataan dapat
                  diunduh melalui{" "}
                  <Link
                    href={"/download"}
                    className="text-blue-700 hover:text-blue-500 underline"
                  >
                    tautan ini
                  </Link>
                  .
                </p>
                <p>
                  Upload surat pernyataan dengan nama file SP_NIM.pdf contoh:
                  SP_1207050002.pdf
                </p>
                <form
                  className="mt-5 flex flex-row justify-center items-center"
                  onSubmit={handleSubmit}
                >
                  <div class="mb-1 flex items-center text-base">
                    <input
                      type="hidden"
                      id="nim"
                      className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      value={id}
                      readOnly
                    />
                  </div>
                  <input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  ></input>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 px-5 py-1 rounded-sm text-white font-bold"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
