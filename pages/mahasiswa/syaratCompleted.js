import React from "react";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Navbar from "../../components/navbar";
import Link from "next/link";
import Head from "next/head";

export default function SyaratCompleted() {
  return (
    <>
      <Head>
        <title>Syarat Diupload</title>
        <meta property="og:title" content="Syarat Diupload" key="title" />
      </Head>
      <div className="absolute bg-IjoRumput w-full h-72 -z-20"></div>
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
              <div className="text-center px-3 text-sm md:text-lg">
                <p className="mb-2">
                  Terimakasih, anda sudah mengupload surat pernyataan{" "}
                </p>
                <p className="mb-2">
                  Mohon cek laman ini secara berkala, jika form upload surat
                  pernyataan muncul kembali, itu artinya surat pernyataan yang
                  telah anda kirim sebelumnya telah ditolak
                </p>
                <p>
                  Silahkan untuk melanjutkan pendaftaran melalui{" "}
                  <Link
                    href={"/mahasiswa/pendaftaran"}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    tautan ini
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
