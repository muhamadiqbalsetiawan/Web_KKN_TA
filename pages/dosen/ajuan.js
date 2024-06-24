import Head from "next/head";
import React from "react";
import SidebarDosen from "../../components/sidebarDosen";
import Navbar from "../../components/navbar";
import Loading from "../loading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Ajuan() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;
  const role = Session?.user?.role;
  let displayData = "";

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "dosen") {
    displayData = (
      <>
        <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
        <div className="flex flex-row justify-start">
          <div className="md:w-auto h-screen">
            <SidebarDosen />
          </div>
          <div className="h-screen w-screen overflow-auto grow">
            <Navbar />
            <div className="px-6 pb-5 w-auto">
              <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                <h1>Ajuan Surat</h1>
              </div>
              <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl w-full">
                <div className="w-full font-medium text-sm md:text-lg px-4 md:px-0">
                  <form className="max-w-lg mx-auto my-3">
                    <div className="my-2">
                      <label htmlFor="ajuan">Hari/Tanggal</label>
                      <input
                        className="block w-full text-gray-900 border border-gray-300 bg-gray-50 rounded-sm"
                        id="tanggal"
                        type="text"
                      />
                    </div>
                    <div className="my-2">
                      <label htmlFor="ajuan">Perihal</label>
                      <input
                        className="block w-full text-gray-900 border border-gray-300 bg-gray-50 rounded-sm"
                        id="perihal"
                        type="text"
                      />
                    </div>
                    <div className="my-2">
                      <label htmlFor="ajuan">Lokasi</label>
                      <input
                        className="block w-full text-gray-900 border border-gray-300 bg-gray-50 rounded-sm"
                        id="lokasi"
                        type="text"
                      />
                    </div>

                    <div className="text-center mt-5">
                      <button
                        type="submit"
                        className="px-8 py-2 bg-green-600 hover:bg-green-800 text-white font-bold rounded-lg"
                      >
                        Upload
                      </button>
                    </div>
                  </form>

                  <form className="flex justify-center items-center mt-9 ">
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        <label htmlFor="ajuan">
                          Balasan Surat Ajuan Kegiatan
                        </label>
                      </div>
                      <div className="text-md">
                        <button className="text-blue-400 hover:underline">
                          Download File
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (status === "authenticated" && role === "mahasiswa") {
    displayData = "";
    router.push("/mahasiswa/dashboard");
  } else {
    displayData = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Surat Ajuan</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>
      {displayData}
    </>
  );
}
